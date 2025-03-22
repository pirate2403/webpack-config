import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

export interface WebpackConfig extends Configuration, DevServerConfiguration {}

export interface WebpackOverridesConfig extends Partial<WebpackConfig> {}

export interface CreateConfigParams {
  dirName?: string;
  overrides?: WebpackOverridesConfig;
  envPath?: string;
}

export type WebpackMode = "production" | "development";

export interface WebpackPaths {
  ENTRY_PATH: string;
  OUTPUT_PATH: string;
  HTML_PATH: string;
  DEV_STATIC_PATH: string;
  COPY_STATIC_FROM_PATH: string;
  COPY_STATIC_TO_PATH: string;
}

export interface MfSharedConfig {
  eager?: boolean;
  requiredVersion?: string;
  singleton?: boolean;
}

export interface MfPluginParams {
  filename?: string;
  exposes?: Record<string, string>;
  remotes?: Record<string, string>;
  shared?: Record<string, MfSharedConfig>;
}
