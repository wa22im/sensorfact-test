import { blockChainService } from "../data/blockchainService";
import { getMidnightUTCTimestamp, formatDateString } from "../utils/dateUtils";
import type {
  EnergyConsumptionHistory,
  BlockEnergyReport,
} from "../domain/energyModels";
import type {
  BlockchainBlock,
  BlocksDayResponse,
} from "../data/blockchainModels";
import { calculateEnergyConsumption } from "../domain/calculateEnergyConsumption";

type GetBlocksForDayFn = (timestamp: number) => Promise<BlocksDayResponse>;
type CalculateEnergyFn = (blockData: BlockchainBlock) => BlockEnergyReport;
type GetBlockFn = (blockHash: string) => Promise<BlockchainBlock>;

export const makeCreateCalculateDailyConsumptionPerDays = (
  getBlocksForDayFn: GetBlocksForDayFn,
  getBlockFn: GetBlockFn,
  calculateBlockConsumptionFn: CalculateEnergyFn,
) => {
  return async (days?: number): Promise<EnergyConsumptionHistory> => {
    if (!days || days <= 0) {
      throw new Error("Number of days must be positive");
    }

    try {
      const dayIndices = Array.from({ length: days }, (_, i) => i);

      const dailyConsumptionPromises = dayIndices.map(async (i) => {
        const timestamp = getMidnightUTCTimestamp(i);
        const date = formatDateString(i);

        const blocks = await getBlocksForDayFn(timestamp);

        // Limit to first 10 blocks per day for performance optimization
        const blocksToProcess = blocks.slice(0, 10);

        const blockEnergyPromises = blocksToProcess.map(async (block) => {
          const blockData = await getBlockFn(block.hash);
          return calculateBlockConsumptionFn(blockData)
            .totalEnergyConsumptionKwh;
        });

        const blockEnergies = await Promise.all(blockEnergyPromises);
        const totalEnergy = blockEnergies.reduce((sum, kwh) => sum + kwh, 0);

        return {
          date,
          totalEnergyConsumptionKwh: parseFloat(totalEnergy.toFixed(2)),
        };
      });

      const dailyConsumption = await Promise.all(dailyConsumptionPromises);

      return {
        days,
        dailyConsumption: dailyConsumption,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to calculate daily consumption: ${errorMessage}`);
    }
  };
};

export const calculateDailyConsumptionPerDays =
  makeCreateCalculateDailyConsumptionPerDays(
    blockChainService.getBlocksForDay,
    blockChainService.getBlock,
    calculateEnergyConsumption,
  );
