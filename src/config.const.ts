export const ENV_FILE_PATH = ".env";

export const MF_FILE_NAME = "remoteEntry.js";

export const DEFAULT_PATHS = {
  ENTRY_PATH: "src/index.ts",
  OUTPUT_PATH: "build",
  HTML_PATH: "public/index.html",
  DEV_STATIC_PATH: "public",
  COPY_STATIC_FROM_PATH: "public/assets",
  COPY_STATIC_TO_PATH: "assets",
} as const;

export const ENV_PATHS = [
  "ENTRY_PATH",
  "OUTPUT_PATH",
  "HTML_PATH",
  "DEV_STATIC_PATH",
  "COPY_STATIC_FROM_PATH",
  "COPY_STATIC_TO_PATH",
] as const;

export const MODE = {
  PROD: "production",
  DEV: "development",
} as const;

export const COMMON_DEPENDENCIES = ["react", "react-dom", "react-router-dom"] as const;
