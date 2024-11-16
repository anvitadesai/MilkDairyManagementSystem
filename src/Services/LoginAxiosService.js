// LoginAxiosService.js
import axios from 'axios';

export default class LoginAxiosService {
  async post(url, data, headers = {}) {
    try {
      console.log("Sending POST request to URL:", url);
      console.log("Request Data:", data);
      return await axios.post(url, data, { headers });
    } catch (error) {
      console.error("Axios POST Error:", error);
      throw error;
    }
  }
}
