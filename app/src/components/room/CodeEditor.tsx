"use client";

import Editor from "@monaco-editor/react";
import React from "react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
}) => {
  return (
    <Editor
      height="calc(100vh)"
      language={language}
      value={code}
      onChange={(value) => onChange(value || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
