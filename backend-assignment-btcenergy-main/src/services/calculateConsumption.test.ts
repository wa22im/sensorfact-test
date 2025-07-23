import { makeCreateCalculateConsumptionPerBlock } from './calculateConsumption';
import type { BlockchainBlock } from '../data/blockchain/models/blockchainModels';
import type { BlockEnergyReport } from '../domain/models/energyModels';

describe('calculateConsumptionPerBlock', () => {
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

  const mockEnergyReport: BlockEnergyReport = {
    blockHash: 'test-block-hash',
    blockHeight: 700000,
    totalTransactions: 2,
    transactions: [
      { hash: 'tx1', sizeInBytes: 250, energyConsumptionKwh: 1140.0 },
      { hash: 'tx2', sizeInBytes: 750, energyConsumptionKwh: 3420.0 },
    ],
    totalEnergyConsumptionKwh: 4560.0,
  };

  it('should calculate consumption per block successfully', async () => {
    const mockGetBlock = jest.fn().mockResolvedValue(mockBlockData);
    const mockCalculateEnergy = jest.fn().mockReturnValue(mockEnergyReport);

    const calculateConsumptionPerBlock = makeCreateCalculateConsumptionPerBlock(
      mockGetBlock,
      mockCalculateEnergy
    );

    const result = await calculateConsumptionPerBlock('test-block-hash');

    expect(mockGetBlock).toHaveBeenCalledWith('test-block-hash');
    expect(mockCalculateEnergy).toHaveBeenCalledWith(mockBlockData);
    expect(result).toEqual(mockEnergyReport);
  });
});
