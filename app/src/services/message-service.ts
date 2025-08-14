import axios from "axios";

export const getMessages = async (roomId: string) => {
  try {
    const response = await axios.get(`/api/messages/${roomId}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    // Return empty array instead of throwing error
    return { data: [], status: error.response?.status || 500 };
  }
};

// create message
export const createMessage = async (roomId: string, message: string) => {
  try {
    const response = await axios.post(`/api/messages/${roomId}`, {
      message,
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error("Error creating message:", error);
    throw error;
  }
};
