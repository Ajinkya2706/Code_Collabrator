// NextAuth-based authentication service
import { signIn, signOut } from "next-auth/react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (formData: RegisterFormData) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (error: any) {
    return { status: 500, data: { message: error.message } };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      // Handle specific error messages
      let errorMessage = "Login failed. Please try again.";
      
      if (result.error === "CredentialsSignin") {
        errorMessage = "Invalid email or password.";
      } else if (result.error.includes("Email and password are required")) {
        errorMessage = "Email and password are required.";
      } else if (result.error.includes("Invalid email or password")) {
        errorMessage = "Invalid email or password.";
      } else {
        errorMessage = result.error;
      }
      
      return { status: 401, data: { message: errorMessage } };
    }
    
    if (result?.ok) {
      return { status: 200, data: { message: "Login successful" } };
    }
    
    return { status: 500, data: { message: "Login failed. Please try again." } };
  } catch (error: any) {
    console.error("Login error:", error);
    return { status: 500, data: { message: error.message || "Login failed. Please try again." } };
  }
};

export const logoutUser = async () => {
  await signOut({ redirect: false });
};

// Legacy functions for backward compatibility - these are now no-ops
export const getToken = () => {
  return null; // NextAuth handles tokens internally
};

export const setToken = (token: string) => {
  // NextAuth handles tokens internally
};

export const getUser = () => {
  // This will be replaced by useSession in components
  return null;
};

export const setUser = (user: any) => {
  // NextAuth handles user state internally
};
