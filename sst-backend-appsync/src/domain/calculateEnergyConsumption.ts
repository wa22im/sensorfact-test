import { EnvVarNames } from "../../globals";
import type { BlockchainBlock } from "../data/blockchainModels";
import type { TransactionEnergy, BlockEnergyReport } from "./energyModels";

export const calculateEnergyConsumption = (
  blockData: BlockchainBlock,
): BlockEnergyReport => {
  const energyPerByteKwh = parseFloat(
    process.env[EnvVarNames.ENERGY_PER_BYTE_KWH] || "4.56",
  );

  const transactions: TransactionEnergy[] = [];
  let totalEnergy = 0;

  for (let i = 0; i < blockData.tx.length; i++) {
    const tx = blockData.tx[i];
    if (!tx) continue;

    const energyConsumption = parseFloat(
      (tx.size * energyPerByteKwh).toFixed(2),
    );

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
