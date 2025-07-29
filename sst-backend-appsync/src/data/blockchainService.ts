import { EnvVarNames } from "../../globals";
import type { BlockchainBlock, BlocksDayResponse } from "./blockchainModels";
import {
  BlockchainBlockSchema,
  BlocksDayResponseSchema,
} from "./blockchainModels";
import { ZodError } from "zod";
import { LRUCache } from "lru-cache";

const blockCache = new LRUCache<string, BlockchainBlock>({
  max: 500,
  ttl: 1000 * 60 * 10, 
  allowStale: false,

});

const dayCache = new LRUCache<number, BlocksDayResponse>({
  max: 100,
  ttl: 1000 * 60 * 10, 
  allowStale: false,
});

const getBlock = async (blockHash: string): Promise<BlockchainBlock> => {
  const baseUrl =
    process.env[EnvVarNames.BLOCKCHAIN_API_BASE_URL] || "https://blockchain.info";
  const timeout = 90000;

  try {
    if (!blockHash || blockHash.trim() === "") {
      throw new Error("Block hash is required");
    }

    const cachedBlock = blockCache.get(blockHash);
    if (cachedBlock) {
      return cachedBlock;
    }

    const url = `${baseUrl}/rawblock/${blockHash}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Block not found: ${blockHash}`);
      }
      throw new Error(
        `Blockchain API error: ${response.status} ${response.statusText}`,
      );
    }

    const rawData = await response.json();
    const blockData = BlockchainBlockSchema.parse(rawData);

    blockCache.set(blockHash, blockData);

    return blockData;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Blockchain API request timed out");
    }

    if (error instanceof ZodError) {
      throw new Error("Invalid block data received from blockchain API");
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch block data: ${errorMessage}`);
  }
};

const getBlocksForDay = async (
  timestamp: number,
): Promise<BlocksDayResponse> => {
  const baseUrl =
    process.env[EnvVarNames.BLOCKCHAIN_API_BASE_URL] || "https://blockchain.info";
  const timeout = 90000;

  try {
    const cachedDay = dayCache.get(timestamp);
    if (cachedDay) {
      return cachedDay;
    }

    const url = `${baseUrl}/blocks/${timestamp}?format=json`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No blocks found for timestamp: ${timestamp}`);
      }
      throw new Error(
        `Blockchain API error: ${response.status} ${response.statusText}`,
      );
    }

    const rawData = await response.json();

    const validatedBlocks = BlocksDayResponseSchema.parse(rawData);
    dayCache.set(timestamp, validatedBlocks);
    return validatedBlocks;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Blockchain API request timed out");
    }

    if (error instanceof ZodError) {
      throw new Error("Invalid blocks data received from blockchain API");
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch blocks for day: ${errorMessage}`);
  }
};

export const blockChainService = {
  getBlock,
  getBlocksForDay,
};
