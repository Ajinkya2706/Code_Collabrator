export const getLanguageNameFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    // Web Development
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "jsx":
      return "jsx";
    case "html":
    case "htm":
      return "html";
    case "css":
      return "css";
    case "scss":
    case "sass":
      return "sass";
    case "less":
      return "less";

    // Backend/Server-side
    case "py":
    case "pyw":
    case "pyc":
      return "python";
    case "java":
    case "class":
      return "java";
    case "php":
      return "php";
    case "rb":
    case "erb":
      return "ruby";
    case "cs":
      return "csharp";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "swift":
      return "swift";
    case "kt":
    case "kts":
      return "kotlin";
    case "dart":
      return "dart";

    // System Programming
    case "c":
      return "c";
    case "cpp":
    case "cc":
    case "cxx":
    case "h":
    case "hpp":
      return "cpp";
    case "asm":
      return "assembly";

    // Functional Programming
    case "hs":
      return "haskell";
    case "ex":
    case "exs":
      return "elixir";
    case "clj":
      return "clojure";
    case "fs":
    case "fsx":
      return "fsharp";
    case "scala":
      return "scala";

    // Data/Markup
    case "md":
    case "markdown":
      return "markdown";
    case "json":
      return "json";
    case "xml":
      return "xml";
    case "yaml":
    case "yml":
      return "yaml";
    case "csv":
      return "csv";
    case "sql":
      return "sql";
    case "graphql":
    case "gql":
      return "graphql";
    case "toml":
      return "toml";

    // Shell/Scripting
    case "sh":
    case "bash":
      return "bash";
    case "ps1":
      return "powershell";
    case "bat":
    case "cmd":
      return "batch";
    case "pl":
    case "pm":
      return "perl";
    case "lua":
      return "lua";
    case "r":
      return "r";

    // Configuration
    case "dockerfile":
      return "dockerfile";
    case "lock":
      return "lock";
    case "env":
      return "env";
    case "ini":
      return "ini";

    // Other
    case "txt":
      return "text";
    default:
      return "unknown";
  }
};