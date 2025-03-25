// imports axios for making HTTP requests to the API
import axios from "axios";

const API_KEY = "966924c2c62545e9927898c1deb77d6b";

// creates an axios instance for the Poly Pizza API
const api_client = axios.create({
  baseURL: "https://api.poly.pizza/v1.1", // base URL for all API requests
  headers: {
    "x-auth-token": API_KEY, // authenticates each request with the API key
  },
});

/**
 * searches for models by keyword only
 * @param keyword - search term (e.g. "duck", "pizza", "house")
 * @returns list of matching models or empty array if error occurs
 */
export const searchModels = async (keyword: string) => {
  try {
    // sends GET request to the /search/ endpoint with URL-encoded keyword to safely fetch matching models
    const response = await api_client.get(`/search/${encodeURIComponent(keyword)}`);
    
    return response.data.results; // returns the list of models
  } catch (error) {
    console.error("Error searching models:", error);
    return []; // returns empty array if search fails
  }
};