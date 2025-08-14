"use client";
import React from "react";
import { Toaster } from "sonner";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default GlobalProvider;
