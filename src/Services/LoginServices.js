// LoginServices.js
import Configuration from "../Configuration/Configuration";
import LoginAxiosService from "./LoginAxiosService";

const Loginaxios = new LoginAxiosService();

export default class LoginServices {
  async Login(data) {
    console.log("Logging in with data:", data);
    try {
      const response = await Loginaxios.post(Configuration.Login, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Login service response:", response);
      return response;
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async Logout() {
    console.log("Logging out - URL:", Configuration.Logout);
    try {
      const response = await Loginaxios.post(Configuration.Logout, {}, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Logout service response:", response);
      return response;
    } catch (error) {
      console.error("Logout Error:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}
