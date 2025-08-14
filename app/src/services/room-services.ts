import axios from "axios";

export const getRooms = async (userId: string) => {
  try {
    const res = await axios.get(`/api/rooms`);
    return { status: res.status, data: res.data };
  } catch (error) {
    console.log("Error fetching rooms:", error);
  }
};

export const createRoom = async () => {
  try {
    const res = await axios.post(`/api/rooms`, {});
    return { status: res.status, data: res.data };
  } catch (error) {
    console.log("Error creating room:", error);
  }
};

// delete room
export const deleteRoom = async (roomId: string) => {
  try {
    const res = await axios.delete(`/api/rooms`, {
      data: { roomId },
    });
    return { status: res.status, data: res.data };
  } catch (error) {
    console.log("Error deleting room:", error);
  }
};
