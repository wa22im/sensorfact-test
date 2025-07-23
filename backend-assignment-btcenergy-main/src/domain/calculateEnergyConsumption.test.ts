import { calculateEnergyConsumption } from './calculateEnergyConsumption';
import type { BlockchainBlock } from '../data/blockchain/models/blockchainModels';

describe('calculateEnergyConsumptionByBlock', () => {
  beforeEach(() => {
    process.env.ENERGY_PER_BYTE_KWH = '4.56';
  });

  afterEach(() => {
    delete process.env.ENERGY_PER_BYTE_KWH;
  });

  it('should calculate energy consumption correctly for a block with transactions', () => {
    const mockBlockData: BlockchainBlock = {
      hash: 'test-block-hash',
      height: 700000,
      time: 1640995200,
      main_chain: true,
      n_tx: 2,
      size: 1000,
      weight: 4000,
      fee: 50000,
      tx: [
        { hash: 'tx1', size: 250 },
        { hash: 'tx2', size: 750 },
      ],
    };

    const result = calculateEnergyConsumption(mockBlockData);

    expect(result.blockHash).toBe('test-block-hash');
    expect(result.blockHeight).toBe(700000);
    expect(result.totalTransactions).toBe(2);

    expect(result.transactions[0]).toEqual({
      hash: 'tx1',
      sizeInBytes: 250,
      energyConsumptionKwh: 1140.0,
    });

    expect(result.transactions[1]).toEqual({
      hash: 'tx2',
      sizeInBytes: 750,
      energyConsumptionKwh: 3420.0,
    });

    expect(result.totalEnergyConsumptionKwh).toBe(4560.0);
  });
});
