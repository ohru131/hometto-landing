import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade } from 'symbol-sdk/symbol';
import { KeyPair } from 'symbol-sdk/symbol';

// Symbolテストネットの設定
const NETWORK = 'testnet';
const NODE_URL = 'https://sym-test-03.opening-line.jp:3001';

/**
 * Symbol Facadeのインスタンスを取得
 */
export function getSymbolFacade(): SymbolFacade {
  return new SymbolFacade(NETWORK);
}

/**
 * 新しいアカウントを生成
 */
export function generateNewAccount() {
  const privateKey = PrivateKey.random();
  const keyPair = new KeyPair(privateKey);
  const facade = getSymbolFacade();
  const address = facade.network.publicKeyToAddress(keyPair.publicKey);
  
  return {
    privateKey: privateKey.toString(),
    publicKey: keyPair.publicKey.toString(),
    address: address.toString(),
  };
}

/**
 * 秘密鍵からアカウント情報を取得
 */
export function getAccountFromPrivateKey(privateKeyHex: string) {
  const privateKey = new PrivateKey(privateKeyHex);
  const keyPair = new KeyPair(privateKey);
  const facade = getSymbolFacade();
  const address = facade.network.publicKeyToAddress(keyPair.publicKey);
  
  return {
    privateKey: privateKey.toString(),
    publicKey: keyPair.publicKey.toString(),
    address: address.toString(),
  };
}

/**
 * トークン送信トランザクションを作成してブロックチェーンに記録
 * @param senderPrivateKey 送信者の秘密鍵
 * @param recipientAddress 受信者のアドレス
 * @param message メッセージ（トークンの種類など）
 */
export async function recordTokenTransaction(
  senderPrivateKey: string,
  recipientAddress: string,
  message: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const facade = getSymbolFacade();
    const privateKey = new PrivateKey(senderPrivateKey);
    const keyPair = new KeyPair(privateKey);
    
    // デッドラインを計算（現在時刻 + 2時間）
    const deadline = BigInt(Date.now()) + BigInt(2 * 60 * 60 * 1000);
    
    // トランザクションを作成
    const transaction = facade.transactionFactory.create({
      type: 'transfer_transaction_v1',
      signerPublicKey: keyPair.publicKey.toString(),
      fee: BigInt(1000000), // 0.001 XYM
      deadline,
      recipientAddress,
      message: new Uint8Array(Buffer.from(message, 'utf8')),
    });
    
    // トランザクションに署名
    const signature = facade.signTransaction(keyPair, transaction);
    const jsonPayload = facade.transactionFactory.static.attachSignature(transaction, signature);
    
    // トランザクションをノードに送信
    const response = await fetch(`${NODE_URL}/transactions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Transaction failed:', errorText);
      throw new Error(`Transaction failed: ${response.status}`);
    }
    
    return {
      success: true,
      hash: facade.hashTransaction(transaction).toString(),
    };
  } catch (error: any) {
    console.error('Failed to record token transaction:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * ネットワークの状態を取得
 */
export async function getNetworkInfo(): Promise<{
  connected: boolean;
  height?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${NODE_URL}/chain/info`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch network info');
    }
    
    const data = await response.json();
    
    return {
      connected: true,
      height: data.height,
    };
  } catch (error: any) {
    console.error('Failed to get network info:', error);
    return {
      connected: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * トランザクション履歴を取得
 * @param address アドレス
 */
export async function getTransactionHistory(address: string): Promise<Array<{
  hash: string;
  type: number;
  height: string;
  timestamp: string;
  message?: string;
}>> {
  try {
    const response = await fetch(
      `${NODE_URL}/transactions/confirmed?address=${address}&pageSize=10&order=desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch transaction history');
    }
    
    const data = await response.json();
    
    return data.data.map((tx: any) => ({
      hash: tx.meta.hash,
      type: tx.transaction.type,
      height: tx.meta.height,
      timestamp: tx.meta.timestamp,
      message: tx.transaction.message ? Buffer.from(tx.transaction.message, 'hex').toString('utf8') : undefined,
    }));
  } catch (error) {
    console.error('Failed to get transaction history:', error);
    return [];
  }
}

/**
 * アカウントの残高を取得
 * @param address アドレス
 */
export async function getAccountBalance(address: string): Promise<{
  success: boolean;
  balance?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${NODE_URL}/accounts/${address}`);
    
    if (!response.ok) {
      throw new Error('Account not found or network error');
    }
    
    const data = await response.json();
    const mosaics = data.account.mosaics || [];
    
    // XYMモザイク（ネイティブ通貨）の残高を取得
    const xymMosaic = mosaics.find((m: any) => m.id === '6BED913FA20223F8');
    const balance = xymMosaic ? (BigInt(xymMosaic.amount) / BigInt(1000000)).toString() : '0';
    
    return {
      success: true,
      balance: `${balance} XYM`,
    };
  } catch (error: any) {
    console.error('Failed to get account balance:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}
