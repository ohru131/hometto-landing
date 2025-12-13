import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, Link as LinkIcon, Loader2, Shield } from "lucide-react";
import { Link } from "wouter";

export default function BlockchainInfo() {
  const { data: allPraises, isLoading: praisesLoading } = trpc.praise.getAll.useQuery({ limit: 100 });
  const { data: allCooperations, isLoading: coopsLoading } = trpc.cooperation.getUserCooperations.useQuery({ limit: 100 });

  const isLoading = praisesLoading || coopsLoading;

  // Simulate blockchain transactions
  const transactions = [
    ...(allPraises || []).map(praise => ({
      id: `praise-${praise.id}`,
      type: "ほめトークン" as const,
      timestamp: new Date(praise.createdAt),
      status: "confirmed" as const,
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      from: `User${praise.fromUserId}`,
      to: `User${praise.toUserId}`,
      amount: praise.tokenAmount,
    })),
    ...(allCooperations || []).map(coop => ({
      id: `coop-${coop.cooperation.id}`,
      type: "協力NFT" as const,
      timestamp: new Date(coop.cooperation.createdAt),
      status: coop.cooperation.currentApprovals >= coop.cooperation.requiredApprovals ? ("confirmed" as const) : ("pending" as const),
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      from: "Multiple",
      to: "NFT Minted",
      amount: 0,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                トップへ戻る
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              ブロックチェーン記録
            </h1>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8 max-w-6xl">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ブロックチェーン</CardTitle>
              <CardDescription>使用している技術</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Symbol</p>
                  <p className="text-sm text-slate-500">高速・低コスト</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">総トランザクション数</CardTitle>
              <CardDescription>記録された取引</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{transactions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ネットワーク状態</CardTitle>
              <CardDescription>現在の状況</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p className="font-bold text-green-600">稼働中</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Blockchain */}
        <Card>
          <CardHeader>
            <CardTitle>なぜブロックチェーン？</CardTitle>
            <CardDescription>Homettoがブロックチェーンを使う理由</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">改ざんできない記録</p>
                  <p className="text-sm text-slate-600">
                    誰が・いつ・誰を評価したかが明確に残り、後から書き換えることができません
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">透明性の確保</p>
                  <p className="text-sm text-slate-600">
                    先生や学校が恣意的に評価を操作することを防ぎます
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ポータビリティ</p>
                  <p className="text-sm text-slate-600">
                    将来的に、成長記録を他の学校や進学先に持ち運べます
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">低コスト運用</p>
                  <p className="text-sm text-slate-600">
                    Symbolブロックチェーンは手数料が安く、教育現場に最適です
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>トランザクション履歴</CardTitle>
            <CardDescription>
              ブロックチェーンに記録された取引の一覧（最新100件）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "ほめトークン" ? "bg-pink-100" : "bg-blue-100"
                      }`}>
                        {tx.type === "ほめトークン" ? (
                          <LinkIcon className="h-5 w-5 text-pink-500" />
                        ) : (
                          <Shield className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{tx.type}</p>
                          <Badge variant={tx.status === "confirmed" ? "default" : "secondary"}>
                            {tx.status === "confirmed" ? "確認済み" : "保留中"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                          {tx.from} → {tx.to}
                          {tx.amount > 0 && ` (${tx.amount} トークン)`}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {tx.hash.substring(0, 20)}...{tx.hash.substring(tx.hash.length - 10)}
                        </p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tx.timestamp.toLocaleString('ja-JP')}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="hidden md:flex">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">
                  まだトランザクションがありません
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Future Plans */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle>今後の展開</CardTitle>
            <CardDescription>Symbolブロックチェーン連携の将来計画</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-bold">実際のSymbolネットワークへの接続</p>
                <p className="text-sm text-slate-600">
                  現在はデモ環境ですが、将来的にSymbolのメインネットまたはテストネットに接続します
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-bold">NFT発行機能の実装</p>
                <p className="text-sm text-slate-600">
                  協力NFTを実際のNFTとして発行し、ウォレットで管理できるようにします
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-bold">成長記録の持ち運び</p>
                <p className="text-sm text-slate-600">
                  卒業後も成長記録をブロックチェーン上に保持し、進学先や就職先で活用できます
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
