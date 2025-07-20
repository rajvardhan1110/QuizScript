import axios from "axios";

export async function toggleTestPhase(testId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token missing. Please log in.");
  }

  const response = await axios.patch("http://localhost:3000/finalTest", {
    testId
  }, {
    headers: { token }
  });

  return response.data;
}
