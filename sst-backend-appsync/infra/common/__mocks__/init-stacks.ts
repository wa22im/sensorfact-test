import { App } from "sst/constructs/App.js";
import type { EnvName, InfraConfig } from "../../config";
import { getInfraConfig } from "../../config";
import { initProject } from "sst/project.js";
import { makeStacks } from "../../stacks";

export const initStacks = async (env: EnvName = "test") => {
  const config = getInfraConfig(env);
  const app = await initApp(config);

  return makeStacks(app, config);
};

const initApp = async ({ envName, awsRegion, serviceName }: InfraConfig) => {
  await initProject({
    stage: envName,
    region: awsRegion,
  });

  return new App({
    name: serviceName,
    mode: "deploy",
    stage: envName,
    region: awsRegion,
  });
};
