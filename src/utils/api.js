import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://dobeedo-backend.onrender.com/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCall = async (method, url, options = {}) => {
  const { data, params = {} } = options;

  const config = {
    method: method.toLowerCase(),
    url,
    data,
    params,
  };

  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response?.data || null,
      message: error.response?.data?.error || error.message,
      status: error.response?.status || null,
    };
  }
};
