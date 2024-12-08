// LoginAxiosService.js
import axios from 'axios';

export default class LoginAxiosService {
  async post(url, data, headers = {}) {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token
      const authHeaders = token
        ? { ...headers, Authorization: `Bearer ${token}` }
        : headers;
  
      console.log("Sending POST request to URL:", url);
      console.log("Request Data:", data);
  
      return await axios.post(url, data, { headers: authHeaders });
    } catch (error) {
      console.error("Axios POST Error:", error);
      throw error;
    }
  }
  
}
