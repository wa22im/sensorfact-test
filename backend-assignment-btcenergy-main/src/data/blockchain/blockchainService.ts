import {
  BlockchainBlock,
  BlockchainBlockSchema,
  BlocksDayResponseSchema,
  BlocksDayResponse,
} from './models/blockchainModels';
import { ZodError } from 'zod';

const blockCache = new Map<string, BlockchainBlock>();
const dayCache = new Map<number, BlocksDayResponse>();

const getBlock = async (blockHash: string): Promise<BlockchainBlock> => {
  const baseUrl = process.env.BLOCKCHAIN_API_BASE_URL || 'https://blockchain.info';
  const timeout = 90000;

  try {
    if (!blockHash || blockHash.trim() === '') {
      throw new Error('Block hash is required');
    }

    if (blockCache.has(blockHash)) {
      return blockCache.get(blockHash)!;
    }

    const url = `${baseUrl}/rawblock/${blockHash}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Block not found: ${blockHash}`);
      }
      throw new Error(`Blockchain API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    const blockData = BlockchainBlockSchema.parse(rawData);

    blockCache.set(blockHash, blockData);

    return blockData;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Blockchain API request timed out');
    }

    if (error instanceof ZodError) {
      throw new Error('Invalid block data received from blockchain API');
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch block data: ${errorMessage}`);
  }
};

const getBlocksForDay = async (timestamp: number): Promise<BlocksDayResponse> => {
  const baseUrl = process.env.BLOCKCHAIN_API_BASE_URL || 'https://blockchain.info';
  const timeout = 90000;

  try {
    if (dayCache.has(timestamp)) {
      return dayCache.get(timestamp)!;
    }

    const url = `${baseUrl}/blocks/${timestamp}?format=json`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No blocks found for timestamp: ${timestamp}`);
      }
      throw new Error(`Blockchain API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    const validatedBlocks = BlocksDayResponseSchema.parse(rawData);
    dayCache.set(timestamp, validatedBlocks);
    return validatedBlocks;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Blockchain API request timed out');
    }

    if (error instanceof ZodError) {
      throw new Error('Invalid blocks data received from blockchain API');
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch blocks for day: ${errorMessage}`);
  }
};

export const blockChainService = {
  getBlock,
  getBlocksForDay,
};
