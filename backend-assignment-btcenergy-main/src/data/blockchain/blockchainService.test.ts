import { blockChainService } from './blockchainService';

// Mock fetch globally
global.fetch = jest.fn();

describe('blockChainService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BLOCKCHAIN_API_BASE_URL = 'https://blockchain.info';
  });

  afterEach(() => {
    delete process.env.BLOCKCHAIN_API_BASE_URL;
  });

  describe('getBlock', () => {
    it('should fetch and return block data successfully', async () => {
      const mockBlockData = {
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

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBlockData),
      });

      const result = await blockChainService.getBlock('test-block-hash');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://blockchain.info/rawblock/test-block-hash',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })
      );

      expect(result).toEqual(mockBlockData);
    });
  });

  describe('getBlocksForDay', () => {
    it('should fetch and return blocks for a day successfully', async () => {
      const mockBlocksData = [
        { hash: 'block1', height: 700000, time: 1640995200 },
        { hash: 'block2', height: 700001, time: 1640995800 },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBlocksData),
      });

      const timestamp = 1640995200000;
      const result = await blockChainService.getBlocksForDay(timestamp);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://blockchain.info/blocks/1640995200000?format=json',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })
      );

      expect(result).toEqual(mockBlocksData);
    });
  });
});
