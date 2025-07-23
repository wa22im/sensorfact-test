import { SchemaComposer } from 'graphql-compose';

export const schemaComposer = new SchemaComposer();

export const TransactionEnergyTC = schemaComposer.createObjectTC({
  name: 'TransactionEnergy',
  fields: {
    hash: 'String!',
    sizeInBytes: 'Int!',
    energyConsumptionKwh: 'Float!',
  },
});

export const BlockEnergyReportTC = schemaComposer.createObjectTC({
  name: 'BlockEnergyReport',
  fields: {
    blockHash: 'String!',
    blockHeight: 'Int!',
    totalTransactions: 'Int!',
    totalEnergyConsumptionKwh: 'Float!',
    transactions: [TransactionEnergyTC],
  },
});

export const DailyEnergyConsumptionTC = schemaComposer.createObjectTC({
  name: 'DailyEnergyConsumption',
  fields: {
    date: 'String!',
    totalEnergyConsumptionKwh: 'Float!',
  },
});

export const EnergyConsumptionHistoryTC = schemaComposer.createObjectTC({
  name: 'EnergyConsumptionHistory',
  fields: {
    days: 'Int!',
    dailyConsumption: [DailyEnergyConsumptionTC],
  },
});
