import { type EnvName } from "../../config";
import { getStack } from "sst/constructs";
import { Template } from "aws-cdk-lib/assertions";
import { initStacks } from "./init-stacks";
import type { Stack as CDKStack } from "aws-cdk-lib/core";
export const makeTemplate = async (
  env: EnvName,
  stack: "AppSyncStack",
): Promise<Template> => {
  const stacks = await initStacks(env);

  return Template.fromStack(getStack(stacks[stack]) as unknown as CDKStack);
};
