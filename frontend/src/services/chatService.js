import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

export const getMessages = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

// REST API — required by the assessment
export const sendMessageApi = async (username, message) => {
  const response = await axios.post(API_URL, {
    username,
    message,
  });

  return response.data;
};