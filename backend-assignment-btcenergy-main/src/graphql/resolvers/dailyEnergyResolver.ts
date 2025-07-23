import { calculateDailyConsumptionPerDays } from '../../services/calculateDailyConsumption';
import { EnergyConsumptionHistoryTC } from '../schema/blockEnergyTypes';

export const dailyEnergyConsumptionResolver = {
  type: EnergyConsumptionHistoryTC,
  args: {
    days: 'Int!',
  },
  description: 'Get total energy consumption per day in the last x number of days',
  resolve: async (_parent: unknown, args: { days: number }, _context: unknown) => {
    try {
      const energyHistory = await calculateDailyConsumptionPerDays(args.days);
      return energyHistory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get daily energy consumption: ${errorMessage}`);
    }
  },
};
