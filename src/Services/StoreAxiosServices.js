import axios from 'axios';

export default class StoreAxiosServices {
  // Post request with headers
  async post(url, data, headers = {}) {
    try {
      const response = await axios.post(url, data, { headers });
      return response;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  // Get request with headers, `isRequired` flag for optional config
  get(url, headers = {}, isRequired = false) {
    const config = isRequired ? { headers } : {};
    return axios.get(url, config)
      .then(response => response)
      .catch(error => {
        console.error('Error in GET request:', error);
        throw error;
      });
  }

  // Put request with headers, `isRequired` flag for optional config
  put(url, data, headers = {}, isRequired = false) {
    const config = isRequired ? { headers } : {};
    return axios.put(url, data, config)
      .then(response => response)
      .catch(error => {
        console.error('Error in PUT request:', error);
        throw error;
      });
  }

  // Delete request with config
  delete(url, config = {}) {
    return axios.delete(url, config)
      .then(response => response)
      .catch(error => {
        console.error('Error in DELETE request:', error);
        throw error;
      });
  }
}
