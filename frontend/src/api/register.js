import axios from "axios";

export async function register(testId) {
  const token = localStorage.getItem("usertoken");

  if (!token) {
    throw new Error("Authentication token missing. Please log in.");
  }

  const response = await axios.post("http://localhost:3000/register", {
    testId
  }, {
    headers: { token }
  });

  return response.data;
}
