"use client";

import React from "react";
import { IconCode } from "@tabler/icons-react";
import IDELayout from "@/components/ide/IDELayout";

const CodeContainer = ({ activeFile }: { activeFile: any }) => {
  return (
    <div className="h-full w-full">
      {activeFile ? (
        <IDELayout />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <IconCode size={72} />
          <p className="text-white/30">Pick a File to start Editing..</p>
        </div>
      )}
    </div>
  );
};

export default CodeContainer;
