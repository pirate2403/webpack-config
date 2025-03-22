import webpack from "webpack";
import fs from "fs";
import { MfPluginParams, MfSharedConfig } from "./config.types";
import path from "path";
import { COMMON_DEPENDENCIES, MF_FILE_NAME } from "./config.const";

export function createWebpackMfPluginBase(
  dirName: string,
  params: MfPluginParams
) {
  const {
    remotes = {},
    filename = MF_FILE_NAME,
    shared = [],
    ...restParams
  } = params;
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(dirName, "package.json"), "utf-8")
  );

  const dependencies = packageJson.dependencies ?? {};

  return new webpack.container.ModuleFederationPlugin({
    shared: [...COMMON_DEPENDENCIES, ...shared].reduce<
      Record<string, MfSharedConfig>
    >((acc, dep) => {
      if (dependencies[dep]) {
        acc[dep] = {
          singleton: true,
          eager: true,
          requiredVersion: dependencies[dep],
        };
      }
      return acc;
    }, {}),
    remotes: Object.keys(remotes).reduce<Record<string, string>>(
      (acc, name) => ({
        ...acc,
        [name]: `${name}@${remotes[name]}/${MF_FILE_NAME}`,
      }),
      {}
    ),
    name: process.env.MF_NAME,
    filename,
    ...restParams,
  });
}
