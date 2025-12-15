# Symbol SDK v3 調査結果

## 基本情報
- **パッケージ名**: `symbol-sdk`
- **バージョン**: v3.2.3以上
- **公式ドキュメント**: https://docs.symboltest.net/sdk/javascript/index.html
- **npm**: https://www.npmjs.com/package/symbol-sdk

## インストール方法
```bash
npm install symbol-sdk
```

## 基本的な使い方

### 1. Facadeの作成
Symbol SDKでは、ネットワークとのやり取りに「Facade」を使用します。

```javascript
import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade, descriptors, models } from 'symbol-sdk/symbol';

const facade = new SymbolFacade('testnet');
```

### 2. トランザクションの作成
JavaScriptオブジェクト構文でトランザクションを記述します。

```javascript
const transaction = facade.transactionFactory.create({
    type: 'transfer_transaction_v1',
    signerPublicKey: '87DA603E7BE5656C45692D5FC7F6D0EF8F24BB7A5C10ED5FDA8C5CFBC49FCBC8',
    fee: 1000000n,
    deadline: 41998024783n,
    recipientAddress: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
    mosaics: [
        { mosaicId: 0x7CDF3B117A3C40CCn, amount: 1000000n }
    ]
});
```

### 3. トランザクションの署名
```javascript
const privateKey = new PrivateKey('EDB671EB741BD676969D8A035271D1EE5E75DF33278083D877F23615EB839FEC');
const signature = facade.signTransaction(new facade.static.KeyPair(privateKey), transaction);
const jsonPayload = facade.transactionFactory.static.attachSignature(transaction, signature);
```

### 4. トランザクションの送信
Symbol: PUT `/transactions`にjsonPayloadを送信

## Typed Descriptor（型付きトランザクション）
より型安全なトランザクション作成方法：

```javascript
const typedDescriptor = new descriptors.TransferTransactionV1Descriptor(
    new Address('TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I'),
    [
        new descriptors.UnresolvedMosaicDescriptor(
            new models.UnresolvedMosaicId(0x7CDF3B117A3C40CCn), 
            new models.Amount(1000000n)
        )
    ],
    'hello symbol'
);

const transaction = facade.createTransactionFromTypedDescriptor(
    typedDescriptor,
    new PublicKey('87DA603E7BE5656C45692D5FC7F6D0EF8F24BB7A5C10ED5FDA8C5CFBC49FCBC8'),
    100,
    60 * 60
);
```

## TypeScript設定
tsconfig.jsonに以下の設定が必要：

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "Node16",
        "moduleResolution": "Node16"
    }
}
```

## Homettoへの適用方針

### 実装する機能
1. **アカウント生成**: 新しいSymbolアカウントの作成
2. **トークン送信記録**: ほめトークン送信をブロックチェーンに記録
3. **NFT発行**: 協力NFTをブロックチェーンに記録
4. **トランザクション履歴**: ブロックチェーン上の履歴を取得・表示

### テストネット設定
- **ネットワーク**: testnet
- **ノードURL**: https://sym-test-03.opening-line.jp:3001
- **エンドポイント**: PUT `/transactions`

### 実装ステップ
1. symbol-sdkのインストール
2. SymbolFacadeを使用したヘルパー関数の作成
3. BlockchainInfo.tsxへの統合
4. Demo.tsxとCooperationDemo.tsxへのブロックチェーン記録機能追加
