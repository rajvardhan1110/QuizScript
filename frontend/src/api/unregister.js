import axios from "axios";

export async function unregister(testId) {
  const token = localStorage.getItem("usertoken");

  if (!token) {
    throw new Error("Authentication token missing. Please log in.");
  }

  const response = await axios.post("http://localhost:3000/unregister", {
    testId
  }, {
    headers: { token }
  });

  return response.data;
}
