import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ChevronRight, Heart, Lightbulb, Loader2, MessageCircle, Sparkles, Star, Trophy, User } from "lucide-react";
import { Link } from "wouter";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export default function ParentDashboard() {
  // Fetch current user (child)
  const { data: currentUser, isLoading: userLoading } = trpc.user.getProfile.useQuery();
  
  // Fetch all praises received by the child
  const { data: receivedPraises, isLoading: receivedLoading } = trpc.praise.getReceived.useQuery({ limit: 100 });
  
  // Fetch all praises sent by the child
  const { data: sentPraises, isLoading: sentLoading } = trpc.praise.getSent.useQuery({ limit: 100 });
  
  // Fetch cooperations
  const { data: cooperations, isLoading: coopLoading } = trpc.cooperation.getUserCooperations.useQuery({ limit: 10 });

  // Calculate growth data (monthly)
  const growthData = useMemo(() => {
    if (!receivedPraises) return [];
    
    const monthlyData: Record<string, number> = {};
    receivedPraises.forEach(praise => {
      const month = new Date(praise.createdAt).toLocaleDateString('ja-JP', { month: 'long' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    return Object.entries(monthlyData).map(([month, score]) => ({ month, score }));
  }, [receivedPraises]);

  // Recent praises (last 5)
  const recentPraises = useMemo(() => {
    if (!receivedPraises) return [];
    return receivedPraises.slice(0, 5);
  }, [receivedPraises]);

  if (userLoading || receivedLoading || sentLoading || coopLoading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <Button onClick={() => window.location.href = "/api/auth/login"}>
            ログイン
          </Button>
        </Card>
      </div>
    );
  }

  const level = Math.floor((currentUser.tokenBalance || 0) / 10) + 1;

  return (
    <div className="min-h-screen bg-amber-50/50 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                デモ一覧へ
              </Button>
            </Link>
            <h1 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-secondary" />
              保護者用アプリ
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-bold">保護者</p>
              <p className="font-heading font-bold text-sm">{currentUser.displayName || currentUser.name}の保護者</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
              P
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6 max-w-md mx-auto md:max-w-4xl">
        {/* Child Profile Card */}
        <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-white/20 shadow-inner flex items-center justify-center text-primary text-2xl font-heading font-bold">
                {(currentUser.displayName || currentUser.name || "U")[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-heading font-bold">{currentUser.displayName || currentUser.name}</h2>
                <p className="text-blue-100 text-sm">2年3組</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-100 mb-1">今のレベル</p>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">Lv.{level}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Heart className="w-5 h-5 mx-auto mb-1 text-pink-300" />
                <p className="text-xs text-blue-100">もらった</p>
                <p className="text-lg font-bold">{receivedPraises?.length || 0}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                <p className="text-xs text-blue-100">送った</p>
                <p className="text-lg font-bold">{sentPraises?.length || 0}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-orange-300" />
                <p className="text-xs text-blue-100">トークン</p>
                <p className="text-lg font-bold">{currentUser.tokenBalance || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-5 w-5 text-primary" />
              成長の記録
            </CardTitle>
          </CardHeader>
          <CardContent>
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4D96FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4D96FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#4D96FF" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                まだデータがありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Praises */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MessageCircle className="h-5 w-5 text-primary" />
              最近もらったほめトークン
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPraises.length > 0 ? (
              recentPraises.map((praise) => {
                const Icon = praise.stampType === "help" ? Heart : 
                            praise.stampType === "idea" ? Lightbulb :
                            praise.stampType === "kind" ? Sparkles : Trophy;
                const color = praise.stampType === "help" ? "text-pink-500 bg-pink-50" :
                             praise.stampType === "idea" ? "text-yellow-500 bg-yellow-50" :
                             praise.stampType === "kind" ? "text-blue-500 bg-blue-50" : "text-orange-500 bg-orange-50";
                
                return (
                  <div key={praise.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{praise.message || "ほめトークン"}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(praise.createdAt).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">まだほめトークンをもらっていません</p>
            )}
          </CardContent>
        </Card>

        {/* Cooperation NFTs */}
        {cooperations && cooperations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Trophy className="h-5 w-5 text-primary" />
                協力NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cooperations.map((item: any) => (
                <div key={item.cooperation.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.cooperation.title}</p>
                    <p className="text-xs text-slate-500">{item.cooperation.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600 font-bold">
                      {item.cooperation.currentApprovals}/{item.cooperation.requiredApprovals}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6 space-y-3 text-sm text-amber-900">
            <p className="font-bold text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              保護者の方へ
            </p>
            <p>✨ お子さまは、クラスメイトから<strong>{receivedPraises?.length || 0}回</strong>ほめられています。</p>
            <p>🤝 自分からも<strong>{sentPraises?.length || 0}回</strong>お友達をほめています。</p>
            <p>💡 学校での成長を、ぜひご家庭でも褒めてあげてください。</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
