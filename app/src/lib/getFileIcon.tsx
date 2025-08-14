import React from "react";
import {
  IconFile,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandPython,
  IconBrandHtml5,
  IconBrandCss3,
  IconMarkdown,
  IconJson,
  IconFileCode,
  IconFileText,
  IconFileSpreadsheet,
  IconBrandReact,
  IconBrandSass,
  IconBrandPhp,
  // IconBrandJava,
  // IconBrandRuby,
  IconLetterC,
  // IconCSharp,
  IconBrandGolang,
  IconBrandRust,
  IconBrandSwift,
  IconBrandKotlin,
  // IconBrandDart,
  IconLetterH,
  IconAssembly,
  // IconBrandHaskell,
  // IconBrandElixir,
  // IconBrandClojure,
  IconLetterF,
  // IconBrandScala,
  IconFileDatabase,
  // IconBrandYaml,
  IconBrandGraphql,
  IconSettings,
  IconTerminal2,
  IconBrandWindows,
  IconBrandPowershell,
  IconBrandDocker,
  IconLock,
  IconFileTypography,
  IconLetterR,
  // IconBrandLua,
  IconFileInfo,
} from "@tabler/icons-react";
import { getLanguageNameFromFileName } from "./getLanguageName";

const fileIcons = {
  default: IconFile,
  // Web Development
  javascript: IconBrandJavascript,
  typescript: IconBrandTypescript,
  jsx: IconBrandReact,
  html: IconBrandHtml5,
  css: IconBrandCss3,
  sass: IconBrandSass,
  less: IconBrandSass,

  // Backend/Server-side
  python: IconBrandPython,
  // java: IconBrandJava,
  php: IconBrandPhp,
  // ruby: IconBrandRuby,
  // csharp: IconCSharp,
  go: IconBrandGolang,
  rust: IconBrandRust,
  swift: IconBrandSwift,
  kotlin: IconBrandKotlin,
  // dart: IconBrandDart,

  // System Programming
  c: IconLetterC,
  cpp: IconLetterC,
  assembly: IconAssembly,

  // Functional Programming
  // haskell: IconBrandHaskell,
  // elixir: IconBrandElixir,
  // clojure: IconBrandClojure,
  // fsharp: IconLetterF,
  // scala: IconBrandScala,

  // Data/Markup
  markdown: IconMarkdown,
  json: IconJson,
  xml: IconFileCode,
  // yaml: IconBrandYaml,
  csv: IconFileSpreadsheet,
  sql: IconFileDatabase,
  graphql: IconBrandGraphql,
  toml: IconSettings,

  // Shell/Scripting
  bash: IconTerminal2,
  powershell: IconBrandPowershell,
  batch: IconBrandWindows,
  perl: IconFileCode,
  // lua: IconBrandLua,
  r: IconLetterR,

  // Configuration
  dockerfile: IconBrandDocker,
  lock: IconLock,
  env: IconFileInfo,
  ini: IconSettings,

  // Other
  text: IconFileText,
  unknown: IconFile,
};

const colorMap: Record<string, string> = {
  // Web Development
  javascript: "#f7df1e", // Yellow
  typescript: "#3178c6", // Blue
  jsx: "#61dafb", // React blue
  html: "#e34c26", // Orange
  css: "#264de4", // Blue
  sass: "#cc6699", // Pink
  less: "#1d365d", // Dark blue

  // Backend/Server-side
  python: "#3572A5", // Blue-gray
  java: "#b07219", // Brown
  php: "#4F5D95", // Purple
  ruby: "#CC342D", // Red
  csharp: "#178600", // Green
  go: "#00ADD8", // Light blue
  rust: "#DEA584", // Orange-brown
  swift: "#F05138", // Orange
  kotlin: "#A97BFF", // Purple
  dart: "#00B4AB", // Teal

  // System Programming
  c: "#555555", // Dark gray
  cpp: "#f34b7d", // Pink
  assembly: "#6E4C13", // Brown

  // Functional Programming
  haskell: "#5e5086", // Purple
  elixir: "#6e4a7e", // Purple
  clojure: "#db5855", // Red
  fsharp: "#378BBA", // Blue
  scala: "#c22d40", // Red

  // Data/Markup
  markdown: "#6e7781", // Gray
  json: "#cbcb41", // Yellowish
  xml: "#d4843e", // Brown-orange
  yaml: "#cb171e", // Red
  csv: "#43a047", // Green
  sql: "#e38c00", // Orange
  graphql: "#e10098", // Pink
  toml: "#9c4221", // Brown

  // Shell/Scripting
  bash: "#4eaa25", // Green
  powershell: "#012456", // Dark blue
  batch: "#C1F12E", // Yellow-green
  perl: "#0298c3", // Blue
  lua: "#000080", // Navy
  r: "#198CE7", // Blue

  // Configuration
  dockerfile: "#0db7ed", // Blue
  lock: "#7A0000", // Dark red
  env: "#ECD53F", // Yellow
  ini: "#6d8086", // Gray-blue

  // Other
  text: "#607d8b", // Blue-gray
  default: "#9e9e9e", // Gray
  unknown: "#9e9e9e", // Gray
};

type FileIconKey = keyof typeof fileIcons;

export const getFileIcon = (fileName: string, size: number = 20) => {
  const language = getLanguageNameFromFileName(fileName);

  // Cast language to FileIconKey or use 'unknown' if it doesn't exist in fileIcons
  const iconKey = (
    Object.keys(fileIcons).includes(language) ? language : "unknown"
  ) as FileIconKey;

  const IconComponent = fileIcons[iconKey];
  const color = colorMap[language] || colorMap.default;

  return <IconComponent size={size} color={color} />;
};
