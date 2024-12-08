import axios from "axios";

export default class RegisterAxiosService {
  async post(url, data, headers = {}) {
    try {
      console.log("Sending POST request to URL:", url);
      console.log("Request Data:", data);

      const response = await axios.post(url, data, { headers });
      return response;
    } catch (error) {
      console.error("Axios POST Error:", error);
      throw error; // Re-throw the error for higher-level handling
    }
  }
}
