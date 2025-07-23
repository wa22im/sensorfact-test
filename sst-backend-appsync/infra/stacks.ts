import type { App } from "sst/constructs";
import type { InfraConfig } from "./config";

import { makeAppSyncStack } from "./app/appsync-stack";

export function makeStacks(app: App, config: InfraConfig) {
  const AppSyncStack = makeAppSyncStack(config);

  app.stack(AppSyncStack, {
    stackName: `${app.name}-appsync`,
  });

  return { AppSyncStack };
}
