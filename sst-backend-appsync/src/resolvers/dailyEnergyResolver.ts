import type { AppSyncResolverHandler } from "aws-lambda";
import { calculateDailyConsumptionPerDays } from "../services/calculateDailyConsumption";

type DailyEnergyArgs = {
  days: number;
};

export const handler: AppSyncResolverHandler<DailyEnergyArgs, any> = async (
  event,
) => {
  try {
    const { days } = event.arguments;

    const energyHistory = await calculateDailyConsumptionPerDays(days);

    return energyHistory;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to get daily energy consumption: ${errorMessage}`);
  }
};
