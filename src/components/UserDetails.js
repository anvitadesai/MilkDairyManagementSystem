import React, { Component } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import UserCrudServices from "../Services/UserCrudServices";
import "./UserDetails.scss";

export default class UserDetails extends Component {
  state = {
    readRecordData: [],  // Initialize as an empty array or object
  };
  constructor(props) {
    super(props);
    this.service = new UserCrudServices();
    this.state = {
      UserId: "",
      UserName: "",
      Email: "",
      Password: "",
      confirmPassword: "",
      DataRecord: [],
      UpdateFlag: false,
      openDialog: props.openDialogByDefault || false, // Open dialog by default for register route
      showPassword: false,
      errors: { UserName: "", Email: "", Password: "", confirmPassword: "" },
      hasChanges: false,
    };
  }


  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const response = await this.service.ReadUser(); // API call to fetch users
      console.log("API Response:", response);

      // Map the response to include `userId` as `id`
      const formattedData = (response.readUserData || []).map((record) => ({
        id: record.userId, // Map userId to id
        userName: record.userName,
        email: record.email,
      }));

      this.setState({ readRecordData: formattedData, isLoading: false });
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.setState({ isLoading: false });
    }
  }



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

  ReadUser = async () => {
    try {
      const response = await this.service.ReadUser(); // API call to fetch users
      const formattedData = (response.readUserData || []).map((record) => ({
        id: record.userId, // Map userId to id
        userName: record.userName,
        email: record.email,
      }));

      this.setState({ readRecordData: formattedData });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };


  validateField = (name, value) => {
    let error = "";
    if (name === "UserName") {
      if (!value) error = "Username is required.";
      else if (value.length < 2) error = "Username must be at least 2 characters.";
    }
    if (name === "Email") {
      if (!value) error = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email address.";
    }
    if (name === "Password") {
      if (!value) error = "Password is required.";
      else if (value.length < 6) error = "Password must be at least 6 characters.";
      else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])/.test(value)) {
        error = "Password must contain 1 uppercase, 1 number, 1 special character.";
      }
    }
    if (name === "confirmPassword") {
      if (!value) error = "Confirm Password is required.";
      else if (value !== this.state.Password) error = "Passwords do not match.";
    }
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

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleClick = async () => {
    const {
      UserName,
      Email,
      Password,
      confirmPassword,
      UpdateFlag,
      UserId,
      errors,
      hasChanges,
    } = this.state;
  
    // Prevent update if no changes were made
    if (UpdateFlag && !hasChanges) {
      this.showErrorAlert("No changes have been made.");
      return;
    }
  
    // Validate fields before submitting
    const newErrors = {
      UserName: this.validateField("UserName", UserName),
      Email: this.validateField("Email", Email),
      ...(UpdateFlag ? {} : { Password: this.validateField("Password", Password) }),
      ...(UpdateFlag ? {} : { confirmPassword: this.validateField("confirmPassword", confirmPassword) }),
    };
    this.setState({ errors: newErrors });
  
    // If there are validation errors, stop submission
    if (Object.values(newErrors).some((error) => error)) return;
  
    // Construct data payload
    const data = {
      userName: UserName,
      email: Email,
      ...(UpdateFlag
        ? { userId: Number(UserId) } // Update case: Send userId only
        : { password: Password, confirmPassword }), // Create case: Include confirmPassword
    };
  
    console.log("Submitting data:", data);
  
    try {
      if (!UpdateFlag) {
        // Create new user
        await this.service.CreateUser(data);
        this.showSuccessAlert("User created successfully!");
      } else {
        // Update existing user
        await this.service.UpdateUser(data);
        this.showSuccessAlert("User updated successfully!");
      }
      // Refresh the user list
      this.ReadUser();
    } catch (error) {
      console.error("Error saving record:", error.response?.data || error.message);
      this.showErrorAlert(
        error.response?.data?.message || "Failed to save the user. Please try again."
      );
    }
  
    // Reset the form and state
    this.setState({
      UpdateFlag: false,
      UserName: "",
      Email: "",
      Password: "",
      confirmPassword: "",
      openDialog: false,
      errors: { UserName: "", Email: "", Password: "", confirmPassword: "" },
      hasChanges: false,
    });
  };
  

  handleEdit = (data) => {
    this.setState({
      UserName: data.userName,
      Email: data.email,
      UserId: data.id,
      UpdateFlag: true,
      openDialog: true,
      initialValues: {
        UserName: data.userName,
        Email: data.email,
      },
      hasChanges: false,
    });
  };

  handleDelete = async (data) => {
    try {
      await this.service.DeleteUser({ UserId: Number(data.id) });
      this.showSuccessAlert("User deleted successfully!");
      this.ReadUser();
    } catch (error) {
      console.error("Error deleting record:", error);
      this.showErrorAlert("Failed to delete the user. Please try again.");
    }
  };

  toggleDialog = () => {
    this.setState((prevState) => ({
      openDialog: !prevState.openDialog,
      UpdateFlag: false,
      UserName: "",
      Email: "",
      Password: "",
      confirmPassword: "",
      errors: { UserName: "", Email: "", Password: "", confirmPassword: "" },
    }));
  };

  render() {
    const {
      UserName,
      Email,
      Password,
      confirmPassword,
      openDialog,
      showPassword,
      errors,
      UpdateFlag,
      readRecordData,  // Assuming this is the fetched data state
      isLoading,  // New state to track if the data is still loading
    } = this.state;

    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "userName", headerName: "Username", width: 130 },
      { field: "email", headerName: "Email", width: 180 },
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
          <h1 style={{ textAlign: "center", margin: "5px 0" }}>User Details</h1>
          <div className="ActionBar">
            <Button variant="contained" onClick={this.toggleDialog}>
              <AddIcon />
            </Button>
          </div>
          <Dialog open={openDialog} onClose={this.toggleDialog}>
            <DialogTitle>{UpdateFlag ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Username"
                name="UserName"
                size="small"
                value={UserName}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.UserName}
                helperText={errors.UserName}
              />
              <TextField
                fullWidth
                label="Email"
                name="Email"
                size="small"
                value={Email}
                onChange={this.handleChange}
                margin="dense"
                error={!!errors.Email}
                helperText={errors.Email}
              />

              {!UpdateFlag && (
                <TextField
                  fullWidth
                  label="Password"
                  name="Password"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  value={Password}
                  onChange={this.handleChange}
                  margin="dense"
                  error={!!errors.Password}
                  helperText={errors.Password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={this.togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {!UpdateFlag && (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  size="small"
                  type="password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  margin="dense"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              )}

            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleDialog}>Cancel</Button>
              <Button onClick={this.handleClick}>
                {UpdateFlag ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Loading state */}
          {isLoading ? (
            <div>Loading...</div>  // Display a loading message if the data is still being fetched
          ) : (
            <Paper style={{ height: 400, width: "100%", marginTop: 10 }}>
              <DataGrid
                rows={readRecordData}
                columns={columns}
                pageSize={10}
                checkboxSelection // Enable checkboxes for row selection
              />
            </Paper>

          )}
        </div>
      </div>
    );
  }

}
