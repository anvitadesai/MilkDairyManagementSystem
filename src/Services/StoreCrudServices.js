import Configuration from "../Configuration/Configuration";
import StoreAxiosServices from "./StoreAxiosServices";

const storeAxiosServices = new StoreAxiosServices();

export default class StoreCrudServices {
  // Create store
  async CreateStore(data) {
    try {
      console.log("Creating store with data:", data); // Log data being sent
      const response = await storeAxiosServices.post(Configuration.CreateStore, data);
      console.log("API response:", response); // Log response
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to create store.');
      }
    } catch (error) {
      console.error("Create store Error:", error);
      throw error; // Rethrow error for higher-level handling
    }
  }
  
  // Read Store
  async ReadStore() {
    try {
      const response = await storeAxiosServices.get(Configuration.ReadStore);
      if (response.status === 200) {
        return response.data; // Return the data if successful
      } else {
        throw new Error('Failed to fetch stores.');
      }
    } catch (error) {
      console.error("Read store Error:", error);
      throw error; // Rethrow error for higher-level handling
    }
  }

  // Update Store
  async UpdateStore(data) {
    try {
      const response = await storeAxiosServices.put(Configuration.UpdateStore, data);
      if (response.status === 200) {
        return response.data; // Return data if successful
      } else {
        throw new Error('Failed to update store.');
      }
    } catch (error) {
      console.error("Update store Error:", error);
      throw error;
    }
  }

  // Delete Store
  async DeleteStore(data) {
    try {
      const response = await storeAxiosServices.delete(Configuration.DeleteStore, { data });
      if (response.status === 200) {
        return response.data; // Return data if successful
      } else {
        throw new Error('Failed to delete store.');
      }
    } catch (error) {
      console.error("Delete store Error:", error);
      throw error;
    }
  }
}
