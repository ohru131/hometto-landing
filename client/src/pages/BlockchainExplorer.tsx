import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Copy, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BlockchainExplorer() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  // Fetch all praises with blockchain data
  const { data: allPraises, isLoading: praisesLoading } = trpc.praise.getAll.useQuery({ limit: 1000 });
  
  // Fetch all cooperations with blockchain data
  const { data: allCooperations, isLoading: cooperationsLoading } = trpc.cooperation.getAll.useQuery();

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    toast.success("コピーしました");
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const openSymbolExplorer = (hash: string) => {
    // Symbol testnet explorer URL
    const explorerUrl = `https://testnet.symbol.fyi/transaction/${hash}`;
    window.open(explorerUrl, "_blank");
  };

  const praisesWithTx = allPraises?.filter(p => p.blockchainTxHash) || [];
  const cooperationsWithTx = allCooperations?.filter(c => c.blockchainTxHash) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ブロックチェーン記録
          </h1>
          <p className="text-slate-600">
            ほめトークンと協力NFTがSymbolテストネットに記録された履歴を確認できます
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ほめトークン記録</p>
                  <p className="text-2xl font-bold">{praisesWithTx.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">協力NFT記録</p>
                  <p className="text-2xl font-bold">{cooperationsWithTx.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">総トランザクション</p>
                  <p className="text-2xl font-bold">{praisesWithTx.length + cooperationsWithTx.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="praises" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="praises">
              ほめトークン ({praisesWithTx.length})
            </TabsTrigger>
            <TabsTrigger value="cooperations">
              協力NFT ({cooperationsWithTx.length})
            </TabsTrigger>
          </TabsList>

          {/* Praises Tab */}
          <TabsContent value="praises" className="space-y-4">
            {praisesLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  読み込み中...
                </CardContent>
              </Card>
            ) : praisesWithTx.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  ブロックチェーンに記録されたほめトークンはまだありません
                </CardContent>
              </Card>
            ) : (
              praisesWithTx.map((praise) => (
                <Card key={praise.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {praise.stampType}
                        </CardTitle>
                        <CardDescription>
                          {praise.message || "メッセージなし"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {praise.tokenAmount} トークン
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Transaction Hash */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">トランザクションハッシュ</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-slate-600 truncate flex-1">
                          {praise.blockchainTxHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(praise.blockchainTxHash!)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedHash === praise.blockchainTxHash ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSymbolExplorer(praise.blockchainTxHash!)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        ブロックチェーンに記録済み
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Cooperations Tab */}
          <TabsContent value="cooperations" className="space-y-4">
            {cooperationsLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  読み込み中...
                </CardContent>
              </Card>
            ) : cooperationsWithTx.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  ブロックチェーンに記録された協力NFTはまだありません
                </CardContent>
              </Card>
            ) : (
              cooperationsWithTx.map((coop) => (
                <Card key={coop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {coop.title}
                        </CardTitle>
                        <CardDescription>
                          {coop.description || "説明なし"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {coop.currentApprovals}/{coop.requiredApprovals} 承認
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Transaction Hash */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">トランザクションハッシュ</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-slate-600 truncate flex-1">
                          {coop.blockchainTxHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(coop.blockchainTxHash!)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedHash === coop.blockchainTxHash ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSymbolExplorer(coop.blockchainTxHash!)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        ブロックチェーンに記録済み
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Symbol テストネットについて</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <p>
              このアプリケーションはSymbolのテストネットを使用しています。
              すべてのトランザクションはSymbol公式エクスプローラーで確認できます。
            </p>
            <p>
              トランザクションハッシュをクリックすると、Symbol Explorerで詳細を確認できます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
