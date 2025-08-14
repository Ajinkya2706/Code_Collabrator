import React from "react";
import { SocketProvider } from "@/providers/SocketProvider";

const roomLayout = ({ children }: { children: React.ReactNode }) => {
  return <SocketProvider> {children}</SocketProvider>;
};

export default roomLayout;
