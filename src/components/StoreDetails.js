import React, { Component } from "react";
import {
  TextField,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import StoreCrudServices from "../Services/StoreCrudServices";
import "./UserStoreDetails.scss";

export default class StoreDetails extends Component {
  state = {
    readStoreData: [],
    StoreId: "",
    StoreName: "",
    GSTNo: "",
    Address: "",
    ContactNo: "",
    UpdateFlag: false,
    openDialog: false,
    errors: { StoreName: "", Address: "", GSTNo: "", ContactNo: "" },
    hasChanges: false,
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.service = new StoreCrudServices();
  }

  async componentDidMount() {
    await this.ReadStore();
  }

  ReadStore = async () => {
    try {
      this.setState({ isLoading: true });
      const response = await this.service.ReadStore();
      const formattedData = (response.readStoreData || []).map((record) => ({
        id: record.storeId,
        storeName: record.storeName,
        address: record.address,
        contactno: record.contactNo,
        gstno: record.gstNo,
      }));
      this.setState({ readStoreData: formattedData, isLoading: false });
    } catch (error) {
      console.error("Error fetching store data:", error);
      this.setState({ isLoading: false });
    }
  };

  validateGSTNumber = (gstNo) => {
    const { readStoreData, StoreId, UpdateFlag } = this.state;

    // Exclude current store ID if updating
    const existingGstNumbers = readStoreData
      .filter((record) => !UpdateFlag || record.id !== Number(StoreId))
      .map((record) => record.gstno.toLowerCase());

    return existingGstNumbers.includes(gstNo.toLowerCase())
      ? "GST Number must be unique."
      : "";
  };

  validateField = (name, value) => {
    let error = "";

    if (name === "StoreName") {
      if (!value) error = "Store Name is required.";
      else if (value.length < 2) error = "Store Name must be at least 2 characters.";
    }

    if (name === "GSTNo") {
      if (!value) error = "GST Number is required.";
      else error = this.validateGSTNumber(value);
    }

    if (name === "ContactNo" && !value) error = "Contact Number is required.";
    if (name === "Address" && !value) error = "Address is required.";

    return error;
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    const error = this.validateField(name, value);
    this.setState((prevState) => ({
      [name]: value,
      errors: { ...prevState.errors, [name]: error },
      hasChanges: true,
    }));
  };

  handleClick = async () => {
    const { StoreId, StoreName, Address, ContactNo, GSTNo, UpdateFlag, errors } = this.state;

    // Validate form fields
    const newErrors = {
      StoreName: this.validateField("StoreName", StoreName),
      Address: this.validateField("Address", Address),
      ContactNo: this.validateField("ContactNo", ContactNo),
      GSTNo: this.validateField("GSTNo", GSTNo),
    };
    this.setState({ errors: newErrors });
    if (Object.values(newErrors).some((error) => error)) return;

    const data = {
      storeName: StoreName,
      address: Address,
      contactno: ContactNo,
      gstno: GSTNo,
      ...(UpdateFlag ? { storeId: Number(StoreId) } : {}),
    };

    try {
      if (!UpdateFlag) {
        await this.service.CreateStore(data);
        this.showSuccessAlert("Store created successfully!");
      } else {
        await this.service.UpdateStore(data);
        this.showSuccessAlert("Store updated successfully!");
      }
      await this.ReadStore();
    } catch (error) {
      console.error("Error saving record:", error);
      this.showErrorAlert("Failed to save the store. Please try again.");
    }

    this.setState({
      UpdateFlag: false,
      StoreId: "",
      StoreName: "",
      GSTNo: "",
      Address: "",
      ContactNo: "",
      openDialog: false,
      errors: { StoreName: "", Address: "", GSTNo: "", ContactNo: "" },
      hasChanges: false,
    });
  };

  handleEdit = (data) => {
    this.setState({
      StoreId: data.id,
      StoreName: data.storeName,
      Address: data.address,
      ContactNo: data.contactno,
      GSTNo: data.gstno,
      UpdateFlag: true,
      openDialog: true,
      hasChanges: false,
    });
  };

  handleDelete = async (data) => {
    try {
      await this.service.DeleteStore({ StoreId: Number(data.id) });
      this.showSuccessAlert("Store deleted successfully!");
      await this.ReadStore();
    } catch (error) {
      console.error("Error deleting record:", error);
      this.showErrorAlert("Failed to delete the store. Please try again.");
    }
  };

  toggleDialog = () => {
    this.setState((prevState) => ({
      openDialog: !prevState.openDialog,
      UpdateFlag: false,
      StoreId: "",
      StoreName: "",
      Address: "",
      ContactNo: "",
      GSTNo: "",
      errors: { StoreName: "", Address: "", GSTNo: "", ContactNo: "" },
    }));
  };

  showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonText: "Okay",
    });
  };

  showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonText: "Okay",
    });
  };

  confirmDelete = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.handleDelete(data);
      }
    });
  };

  render() {
    const {
      StoreName,
      Address,
      ContactNo,
      GSTNo,
      openDialog,
      errors,
      UpdateFlag,
      readStoreData,
      isLoading,
    } = this.state;

    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "storeName", headerName: "Store Name", width: 180 },
      { field: "address", headerName: "Address", width: 150 },
      { field: "contactno", headerName: "Contact No", width: 130 },
      { field: "gstno", headerName: "GST No", width: 200 },
      {
        field: "edit",
        headerName: "Edit",
        width: 100,
        renderCell: (params) => (
          <Button variant="outlined" onClick={() => this.handleEdit(params.row)}>
            <EditIcon />
          </Button>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => (
          <Button
            variant="outlined"
            color="error"
            onClick={() => this.confirmDelete(params.row)}
          >
            <DeleteIcon />
          </Button>
        ),
      },
    ];

    return (
      <div className="MainContainer">
        <div className="SubContainer">
          <h1 style={{ textAlign: "center", margin: "5px 0" }}>Store Details</h1>
          <div className="ActionBar">
            <Button variant="contained" onClick={this.toggleDialog}>
              <AddIcon />
            </Button>
          </div>
          <Dialog open={openDialog} onClose={this.toggleDialog}>
            <DialogTitle>{UpdateFlag ? "Edit Store" : "Add Store"}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Store Name"
                name="StoreName"
                size="small"
                value={StoreName}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.StoreName}
                helperText={errors.StoreName}
              />
              <TextField
                fullWidth
                label="Address"
                name="Address"
                size="small"
                value={Address}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.Address}
                helperText={errors.Address}
              />
              <TextField
                fullWidth
                label="Contact No"
                name="ContactNo"
                size="small"
                value={ContactNo}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.ContactNo}
                helperText={errors.ContactNo}
              />
              <TextField
                fullWidth
                label="GST No"
                name="GSTNo"
                size="small"
                value={GSTNo}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.GSTNo}
                helperText={errors.GSTNo}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleDialog}>Cancel</Button>
              <Button onClick={this.handleClick}>
                {UpdateFlag ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </Dialog>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Paper style={{ height: 400, width: "100%", marginTop: 10 }}>
              <DataGrid
                rows={readStoreData}
                columns={columns}
                pageSize={10}
                checkboxSelection
              />
            </Paper>
          )}
        </div>
      </div>
    );
  }
}
