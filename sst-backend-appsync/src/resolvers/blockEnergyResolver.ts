import type { AppSyncResolverHandler } from "aws-lambda";
import { calculateConsumptionPerBlock } from "../services/calculateConsumption";

type BlockEnergyArgs = {
  blockHash: string;
};

export const handler: AppSyncResolverHandler<BlockEnergyArgs, any> = async (
  event,
) => {
  try {
    const { blockHash } = event.arguments;

    const energyReport = await calculateConsumptionPerBlock(blockHash);
    return energyReport;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to get block energy consumption: ${errorMessage}`);
  }
};
