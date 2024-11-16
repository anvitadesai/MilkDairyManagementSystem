import Configuration from "../Configuration/Configuration";
import UserAxiosServices from "./UserAxiosServices";

// Create an instance of UserAxiosServices
const userAxiosServices = new UserAxiosServices();

export default class UserCrudServices {
  // Create User
  async CreateUser(data) {
    try {
      console.log("Creating user with data:", data); // Log data being sent
      const response = await userAxiosServices.post(Configuration.CreateUser, data);
      console.log("API response:", response); // Log response
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to create user.');
      }
    } catch (error) {
      console.error("Create Record Error:", error);
      throw error; // Rethrow error for higher-level handling
    }
  }
  
  // Read User
  async ReadUser() {
    try {
      const response = await userAxiosServices.get(Configuration.ReadUser);
      if (response.status === 200) {
        return response.data; // Return the data if successful
      } else {
        throw new Error('Failed to fetch users.');
      }
    } catch (error) {
      console.error("Read Record Error:", error);
      throw error; // Rethrow error for higher-level handling
    }
  }

  // Update User
  async UpdateUser(data) {
    try {
      const response = await userAxiosServices.put(Configuration.UpdateUser, data);
      if (response.status === 200) {
        return response.data; // Return data if successful
      } else {
        throw new Error('Failed to update user.');
      }
    } catch (error) {
      console.error("Update Record Error:", error);
      throw error;
    }
  }

  // Delete User
  async DeleteUser(data) {
    try {
      const response = await userAxiosServices.delete(Configuration.DeleteUser, { data });
      if (response.status === 200) {
        return response.data; // Return data if successful
      } else {
        throw new Error('Failed to delete user.');
      }
    } catch (error) {
      console.error("Delete Record Error:", error);
      throw error;
    }
  }
}
