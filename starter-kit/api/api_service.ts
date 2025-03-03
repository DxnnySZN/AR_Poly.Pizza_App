import axios from "axios";

const API_KEY = "966924c2c62545e9927898c1deb77d6b";

// creates an axios instance for the Poly Pizza API
const api_client = axios.create({
  baseURL: "https://api.poly.pizza/v1.1", // base URL for the API
  headers: {
    "x-auth-token": API_KEY, // includes the API key in the request headers
  },
});

/**
 * Search for models using a keyword and optional filters.
 * @param keyword - The search term (e.g., "cat" or "tree").
 * @param filters - Optional filters (e.g., category, license, animated).
 * @returns A list of search results or an empty array if an error occurs.
 */
export const searchModels = async (keyword: string, filters = {}) => {
  try {
    const response = await api_client.get(`/search/${encodeURIComponent(keyword)}`, {
      params: filters, // passes filters as query parameters
    });
    return response.data.results; // returns the list of models
  } catch (error) {
    console.error("Error searching models:", error);
    return []; // returns an empty array if there's an error
  }
};

/**
 * Fetch details of a specific model by its ID.
 * @param id - The ID of the model (e.g., "52s3JpUSjmX").
 * @returns The model details or null if an error occurs.
 */
export const getModelById = async (id: string) => {
  try {
    const response = await api_client.get(`/model/${id}`);
    return response.data; // returns the model details
  } catch (error) {
    console.error("Error fetching model:", error);
    return null; // returns null if there's an error
  }
};

/**
 * Fetch all models belonging to a specific user.
 * @param username - The username of the creator (e.g., "dook").
 * @param filters - Optional filters (e.g., limit, page).
 * @returns A list of models or an empty array if an error occurs.
 */
export const getModelsByUser = async (username: string, filters = {}) => {
  try {
    const response = await api_client.get(`/user/${username}`, {
      params: filters, // passes filters as query parameters
    });
    return response.data.models; // returns the list of models
  } catch (error) {
    console.error("Error fetching user models:", error);
    return []; // returns an empty array if there's an error
  }
};