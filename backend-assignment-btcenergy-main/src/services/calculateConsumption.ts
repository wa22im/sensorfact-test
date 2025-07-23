import { blockChainService } from '../data/blockchain/blockchainService';
import { calculateEnergyConsumption } from '../domain/calculateEnergyConsumption';
import type { BlockEnergyReport } from '../domain/models/energyModels';
import type { BlockchainBlock } from '../data/blockchain/models/blockchainModels';

type GetBlockFn = (blockHash: string) => Promise<BlockchainBlock>;
type CalculateEnergyFn = (blockData: BlockchainBlock) => BlockEnergyReport;

export const makeCreateCalculateConsumptionPerBlock = (
  getBlockFn: GetBlockFn,
  calculateEnergyFn: CalculateEnergyFn
) => {
  return async (blockHash: string): Promise<BlockEnergyReport> => {
    try {
      if (!blockHash || blockHash.trim() === '') {
        throw new Error('Block hash is required');
      }

      const blockData = await getBlockFn(blockHash);
      const energyReport = calculateEnergyFn(blockData);

      return energyReport;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to calculate consumption for block ${blockHash}: ${errorMessage}`);
    }
  };
};

export const calculateConsumptionPerBlock = makeCreateCalculateConsumptionPerBlock(
  blockChainService.getBlock,
  calculateEnergyConsumption
);
