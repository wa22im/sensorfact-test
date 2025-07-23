import type { InfraConfig } from "../config";
import type { StackContext } from "sst/constructs";
import { AppSyncApi, Function } from "sst/constructs";
import { EnvVarNames } from "../../globals";

export type AppSyncStack = ReturnType<typeof makeAppSyncStack>;

export function makeAppSyncStack(config: InfraConfig) {
  return function AppSyncStack({ stack }: StackContext) {
    const blockEnergyResolver = new Function(stack, "BlockEnergyResolver", {
      handler: "src/resolvers/blockEnergyResolver.handler",
      timeout: "90 seconds",
      memorySize: 512,
      environment: {
        [EnvVarNames.BLOCKCHAIN_API_BASE_URL]: config.blockChainUrl,
        [EnvVarNames.ENERGY_PER_BYTE_KWH]: config.energyPerByteKwh ,
      },
    });

    const dailyEnergyResolver = new Function(stack, "DailyEnergyResolver", {
      handler: "src/resolvers/dailyEnergyResolver.handler",
      timeout: "300 seconds",
      memorySize: 1024,
      environment: {
        [EnvVarNames.BLOCKCHAIN_API_BASE_URL]: config.blockChainUrl,
        [EnvVarNames.ENERGY_PER_BYTE_KWH]: config.energyPerByteKwh ,
      },
    });

    const api = new AppSyncApi(stack, "BitcoinEnergyApi", {
      schema: "src/schema.graphql",
      dataSources: {
        blockEnergyLambda: {
          type: "function",
          function: blockEnergyResolver,
        },
        dailyEnergyLambda: {
          type: "function",
          function: dailyEnergyResolver,
        },
      },
      resolvers: {
        "Query blockEnergyConsumption": "blockEnergyLambda",
        "Query dailyEnergyConsumption": "dailyEnergyLambda",
      },
    });

    stack.addOutputs({
      GraphQLApiUrl: api.url,
    });

    return { api, blockEnergyResolver, dailyEnergyResolver };
  };
}
