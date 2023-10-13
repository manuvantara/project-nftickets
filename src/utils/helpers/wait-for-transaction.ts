import { TransactionWithMeta, Umi } from '@metaplex-foundation/umi';

export async function waitForTransaction(umi: Umi, signature: Uint8Array) {
  let transaction: TransactionWithMeta | null = null;
  while (!transaction) {
    try {
      transaction = await umi.rpc.getTransaction(signature);
    } catch (error) {
      console.error('Error retrieving transaction:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return transaction;
}
