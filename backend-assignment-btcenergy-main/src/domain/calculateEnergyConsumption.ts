import type { BlockchainBlock } from '../data/blockchain/models/blockchainModels';
import type { TransactionEnergy, BlockEnergyReport } from './models/energyModels';

export const calculateEnergyConsumption = (blockData: BlockchainBlock): BlockEnergyReport => {
  const energyPerByteKwh = parseFloat(process.env.ENERGY_PER_BYTE_KWH || '4.56');

  const transactions: TransactionEnergy[] = [];
  let totalEnergy = 0;

  for (let i = 0; i < blockData.tx.length; i++) {
    const tx = blockData.tx[i];
    const energyConsumption = parseFloat((tx.size * energyPerByteKwh).toFixed(2));

    transactions.push({
      hash: tx.hash,
      sizeInBytes: tx.size,
      energyConsumptionKwh: energyConsumption,
    });

    totalEnergy += energyConsumption;
  }

  return {
    blockHash: blockData.hash,
    blockHeight: blockData.height,
    totalTransactions: blockData.n_tx,
    transactions,
    totalEnergyConsumptionKwh: parseFloat(totalEnergy.toFixed(2)),
  };
};
