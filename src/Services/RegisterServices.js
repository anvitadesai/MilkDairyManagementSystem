import Configuration from "../Configuration/Configuration";
import RegisterAxiosService from "./RegisterAxiosService";

const RegisterAxios = new RegisterAxiosService();

export default class RegisterServices {
  // Register function that interacts with the backend
  async Register(data) {
    console.log("Registering with data:", data); // Debug log for data

    try {
      // Making the POST request to the backend with necessary headers
      const response = await RegisterAxios.post(
        Configuration.Register, // Endpoint URL from Configuration
        data,
        {
          headers: { "Content-Type": "application/json" }, // Specify Content-Type
        }
      );

      console.log("Register service response:", response); // Debug log for response

      // Safely return response data (ensure response exists)
      return response?.data || response;
    } catch (error) {
      // Log the error based on the availability of response or error message
      console.error(
        "Registration Error:",
        error.response ? error.response.data : error.message
      );

      // Optionally handle custom error messages, or just propagate the error
      throw error; // Re-throw error to be handled in the UI layer
    }
  }
}
