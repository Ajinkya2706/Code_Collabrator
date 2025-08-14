import { IFile } from "@/types/types";
import axios from "axios";

interface SaveFilePayload {
  name: string;
  content: string;
  language: string;
}

export const createFile = async (roomId: string, name: string, language: string) => {
  try {
    const { status, data } = await axios.post(`/api/rooms/${roomId}/files`, {
      name,
      language,
    });
    return { status, data };
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const updateFile = async (fileId: string, updates: { name?: string; content?: string; language?: string }) => {
  try {
    const { status, data } = await axios.patch(`/api/files/${fileId}`, updates);
    return { status, data };
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

export const saveFile = async (
  { name, content, language }: SaveFilePayload,
  roomId: string
) => {
  try {
    const { status, data } = await axios.post(`/api/rooms/${roomId}/files`, {
      name,
      content,
      language,
    });

    return { status, data };
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};

export const fetchFiles = async (roomId: string) => {
  try {
    const { status, data } = await axios.get(`/api/rooms/${roomId}/files`);
    return { data, status };
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// delete file
export const deleteFile = async (fileId: string) => {
  try {
    const { status, data } = await axios.delete(`/api/files/${fileId}`);
    return { status, data };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// fetch file
export const fetchFile = async (fileId: string) => {
  try {
    const { status, data } = await axios.get(`/api/files/${fileId}`);
    return { status, data };
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

// updateFileContent
export const updateFileContent = async (fileId: string, content: string) => {
  try {
    const { status, data } = await axios.patch(`/api/files/${fileId}`, {
      content,
    });
    return { status, data };
  } catch (error) {
    console.error("Error updating file content:", error);
    throw error;
  }
};
