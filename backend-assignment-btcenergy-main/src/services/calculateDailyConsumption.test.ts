import { makeCreateCalculateDailyConsumptionPerDays } from './calculateDailyConsumption';
import type { BlockEnergyReport } from '../domain/models/energyModels';
import type { BlockchainBlock } from '../data/blockchain/models/blockchainModels';

describe('calculateDailyConsumptionPerDays', () => {
  it('should calculate daily energy consumption with parallel processing', async () => {
    const mockBlocks = [
      { hash: 'block1', height: 700000, time: 1640995200 },
      { hash: 'block2', height: 700001, time: 1640995800 },
    ];

    const mockBlockData: BlockchainBlock = {
      hash: 'block1',
      height: 700000,
      time: 1640995200,
      main_chain: true,
      n_tx: 100,
      size: 1000,
      weight: 4000,
      fee: 50000,
      tx: [],
    };

    const mockBlockEnergyReport: BlockEnergyReport = {
      blockHash: 'block1',
      blockHeight: 700000,
      totalTransactions: 100,
      transactions: [],
      totalEnergyConsumptionKwh: 4560.0,
    };

    const mockGetBlocksForDay = jest.fn().mockResolvedValue(mockBlocks);
    const mockGetBlock = jest.fn().mockResolvedValue(mockBlockData);
    const mockCalculateBlockConsumption = jest.fn().mockReturnValue(mockBlockEnergyReport);

    const createCalculateDailyConsumptionPerDays = makeCreateCalculateDailyConsumptionPerDays(
      mockGetBlocksForDay,
      mockGetBlock,
      mockCalculateBlockConsumption
    );

    const result = await createCalculateDailyConsumptionPerDays(1);

    expect(mockGetBlocksForDay).toHaveBeenCalledWith(expect.any(Number));
    expect(mockGetBlock).toHaveBeenCalledWith('block1');
    expect(mockGetBlock).toHaveBeenCalledWith('block2');
    expect(mockCalculateBlockConsumption).toHaveBeenCalledWith(mockBlockData);
    expect(result).toEqual({
      days: 1,
      dailyConsumption: [
        {
          date: expect.any(String),
          totalEnergyConsumptionKwh: 9120.0,
        },
      ],
    });
  });
});
