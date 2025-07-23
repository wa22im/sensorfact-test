import { z } from 'zod';

export const TransactionEnergySchema = z.object({
  hash: z.string(),
  sizeInBytes: z.number(),
  energyConsumptionKwh: z.number(),
});

export const BlockEnergyReportSchema = z.object({
  blockHash: z.string(),
  blockHeight: z.number(),
  totalTransactions: z.number(),
  transactions: z.array(TransactionEnergySchema),
  totalEnergyConsumptionKwh: z.number(),
});

export const DailyEnergyConsumptionSchema = z.object({
  date: z.string(),
  totalEnergyConsumptionKwh: z.number(),
});

export const EnergyConsumptionHistorySchema = z.object({
  days: z.number(),
  dailyConsumption: z.array(DailyEnergyConsumptionSchema),
});

export type TransactionEnergy = z.infer<typeof TransactionEnergySchema>;
export type BlockEnergyReport = z.infer<typeof BlockEnergyReportSchema>;
export type DailyEnergyConsumption = z.infer<typeof DailyEnergyConsumptionSchema>;
export type EnergyConsumptionHistory = z.infer<typeof EnergyConsumptionHistorySchema>;
