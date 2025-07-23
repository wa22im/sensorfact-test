import { calculateConsumptionPerBlock } from '../../services/calculateConsumption';
import { BlockEnergyReportTC } from '../schema/blockEnergyTypes';

export const blockEnergyConsumptionResolver = {
  type: BlockEnergyReportTC,
  args: {
    blockHash: 'String!',
  },
  description: 'Get energy consumption per transaction for a specific block',
  resolve: async (_parent: unknown, args: { blockHash: string }, _context: unknown) => {
    try {
      const energyReport = await calculateConsumptionPerBlock(args.blockHash);
      return energyReport;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get block energy consumption: ${errorMessage}`);
    }
  },
};
