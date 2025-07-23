import type { SSTConfig } from "sst";
import { getInfraConfig } from "./infra/config";
import { makeStacks } from "./infra/stacks";

export default {
  config({ stage }) {
    const { serviceName, awsRegion, envName } = getInfraConfig(stage);

    return {
      name: serviceName,
      region: awsRegion,
      stage: envName,
    };
  },
  stacks(app) {
    const config = getInfraConfig(app.stage);

    app.setDefaultFunctionProps({
      runtime: "nodejs20.x",
    });

    makeStacks(app, config);
  },
} satisfies SSTConfig;
