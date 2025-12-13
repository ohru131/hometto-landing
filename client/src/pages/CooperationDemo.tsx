import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Link as LinkIcon, Loader2, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const AVATAR_COLORS = ["bg-blue-400", "bg-pink-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-red-400"];

export default function CooperationDemo() {
  const [selectedCoopId, setSelectedCoopId] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Fetch current user
  const { data: currentUser } = trpc.user.getProfile.useQuery();
  
  // Fetch all cooperation NFTs
  const { data: allCoops, refetch: refetchCoops } = trpc.cooperation.getAll.useQuery();
  
  // Fetch specific cooperation details
  const { data: coopDetails } = trpc.cooperation.getById.useQuery(
    { id: selectedCoopId! },
    { enabled: !!selectedCoopId }
  );

  // Create cooperation mutation
  const createCoopMutation = trpc.cooperation.create.useMutation({
    onSuccess: (data) => {
      setSelectedCoopId(data.id);
      toast.success("協力NFTを作成しました！");
      refetchCoops();
    },
    onError: (error) => {
      toast.error("エラーが発生しました: " + error.message);
    },
  });

  // Approve cooperation mutation
  const approveMutation = trpc.cooperation.approve.useMutation({
    onSuccess: () => {
      toast.success("承認しました！");
      refetchCoops();
    },
    onError: (error) => {
      toast.error("エラーが発生しました: " + error.message);
    },
  });

  // Check if all members approved
  useEffect(() => {
    if (coopDetails && coopDetails.requiredApprovals === coopDetails.currentApprovals) {
      setIsComplete(true);
      setTimeout(() => {
        toast.success("🎉 協力NFTが発行されました！");
      }, 500);
    }
  }, [coopDetails]);

  const handleCreateNew = () => {
    createCoopMutation.mutate({
      title: "理科実験 成功記念",
      description: "みんなで協力して実験を成功させました",
      requiredApprovals: 4,
    });
  };

  const handleApprove = () => {
    if (!selectedCoopId || !currentUser) return;
    approveMutation.mutate({ cooperationId: selectedCoopId });
  };

  const hasApproved = coopDetails?.participants.some(p => p.userId === currentUser?.id && p.approved);
  const allApproved = coopDetails && coopDetails.currentApprovals >= coopDetails.requiredApprovals;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/demo">
            <Button variant="ghost" className="rounded-full hover:bg-muted text-muted-foreground">
              <ArrowLeft className="mr-2 h-6 w-6" />
              もどる
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
            <LinkIcon className="h-6 w-6" />
            協力チェーン
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-800">
            みんなで <span className="text-primary">協力NFT</span> をつくろう！
          </h1>
          <p className="text-xl text-slate-500">
            メンバー全員が「承認（しょうにん）」すると、ブロックチェーンに記録されるよ。
          </p>
        </div>

        {!selectedCoopId ? (
          /* Create New Cooperation */
          <div className="text-center space-y-8">
            <Card className="p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">新しい協力NFTを作成</h2>
              <p className="text-slate-500 mb-6">
                みんなで協力したことを、ブロックチェーンに記録しましょう！
              </p>
              <Button
                size="lg"
                onClick={handleCreateNew}
                disabled={createCoopMutation.isPending}
                className="w-full"
              >
                {createCoopMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    作成中...
                  </>
                ) : (
                  "作成する"
                )}
              </Button>
            </Card>

            {/* Existing Cooperations */}
            {allCoops && allCoops.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">過去の協力NFT</h3>
                <div className="grid gap-4">
                  {allCoops.map((coop: any) => (
                    <Card
                      key={coop.id}
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedCoopId(coop.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{coop.title}</h4>
                          <p className="text-sm text-muted-foreground">{coop.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            {coop.currentApprovals} / {coop.requiredApprovals}
                          </p>
                          <p className="text-xs text-muted-foreground">承認済み</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Cooperation Approval View */
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: NFT Preview */}
            <div className="relative">
              <motion.div
                animate={allApproved ? { scale: 1.05, rotate: [0, -1, 1, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Card className={`border-4 ${allApproved ? "border-primary shadow-[0_0_30px_rgba(77,150,255,0.3)]" : "border-slate-200"} rounded-3xl overflow-hidden bg-white transition-all duration-500`}>
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-8 text-center relative">
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20"
                      >
                        <div className="text-center">
                          <Check className="w-24 h-24 text-green-500 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold text-slate-800">発行完了！</h3>
                          <p className="text-slate-500">ブロックチェーンに記録されました</p>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative">
                      <Users className="w-16 h-16 text-primary" />
                      {allApproved && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-md"
                        >
                          <Shield className="w-6 h-6" />
                        </motion.div>
                      )}
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">{coopDetails?.title}</h2>
                    <p className="text-slate-500 font-bold">{new Date(coopDetails?.createdAt || Date.now()).toLocaleDateString('ja-JP')}</p>
                    
                    {/* Signatures */}
                    <div className="flex gap-2 mt-6 justify-center flex-wrap">
                      {coopDetails?.participants.map((p, index) => (
                        <div
                          key={p.id}
                          className={`w-10 h-10 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${p.approved ? "opacity-100 scale-100" : "opacity-30 scale-90 grayscale"}`}
                          title={p.approved ? "承認済み" : "未承認"}
                        >
                          {(p.user?.displayName || p.user?.name || "U")[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right: Member List */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2">メンバーの承認状況</h3>
                <p className="text-slate-500">
                  {coopDetails?.currentApprovals} / {coopDetails?.requiredApprovals} 人が承認しました
                </p>
              </div>

              <div className="space-y-3">
                {coopDetails?.participants.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-4 ${p.approved ? "bg-green-50 border-green-200" : "bg-white"} transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold`}>
                            {(p.user?.displayName || p.user?.name || "U")[0]}
                          </div>
                          <div>
                            <p className="font-heading font-bold">{p.user?.displayName || p.user?.name || `ユーザー${p.userId}`}</p>
                            <p className="text-sm text-slate-500">
                              {p.approved ? `承認済み (${new Date(p.approvedAt!).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })})` : "未承認"}
                            </p>
                          </div>
                        </div>
                        {p.approved && (
                          <Check className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {!allApproved && (
                <Button
                  size="lg"
                  onClick={handleApprove}
                  disabled={hasApproved || approveMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {approveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      承認中...
                    </>
                  ) : hasApproved ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      承認済み
                    </>
                  ) : (
                    "承認する"
                  )}
                </Button>
              )}

              {allApproved && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <div className="text-center space-y-2">
                    <Shield className="w-12 h-12 text-green-600 mx-auto" />
                    <h4 className="font-bold text-green-900">NFT発行完了！</h4>
                    <p className="text-sm text-green-700">
                      この協力の記録は、永久にブロックチェーンに保存されます。
                    </p>
                  </div>
                </Card>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCoopId(null);
                  setIsComplete(false);
                }}
                className="w-full"
              >
                一覧に戻る
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
