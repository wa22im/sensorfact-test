import { z } from 'zod';

export const BlockchainTransactionSchema = z.object({
  hash: z.string(),
  size: z.number(),
  time: z.number().optional(),
  tx_index: z.number().optional(),
  version: z.number().optional(),
  lock_time: z.number().optional(),
  inputs: z.array(z.any()).optional(),
  out: z.array(z.any()).optional(),
});

export const BlockchainBlockSchema = z.object({
  hash: z.string(),
  height: z.number(),
  time: z.number(),
  main_chain: z.boolean(),
  tx: z.array(BlockchainTransactionSchema),
  n_tx: z.number(),
  size: z.number(),
  weight: z.number(),
  fee: z.number(),
  prev_block: z.string().optional(),
  next_block: z.array(z.string()).optional(),
  merkle_root: z.string().optional(),
  nonce: z.number().optional(),
  bits: z.number().optional(),
  difficulty: z.number().optional(),
});

export const BlockSummarySchema = z.object({
  height: z.number(),
  hash: z.string(),
  time: z.number(),
  block_index: z.number().optional(),
});

export const BlocksDayResponseSchema = z.array(BlockSummarySchema);

export type BlockchainTransaction = z.infer<typeof BlockchainTransactionSchema>;
export type BlockchainBlock = z.infer<typeof BlockchainBlockSchema>;
export type BlockSummary = z.infer<typeof BlockSummarySchema>;
export type BlocksDayResponse = z.infer<typeof BlocksDayResponseSchema>;
