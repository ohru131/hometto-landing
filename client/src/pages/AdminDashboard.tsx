import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Heart, Loader2, School, Sparkles, Trophy, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#A78BFA", "#FB923C"];

export default function AdminDashboard() {
  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = trpc.user.getAllUsers.useQuery();
  
  // Fetch all praises
  const { data: allPraises, isLoading: praisesLoading } = trpc.praise.getReceived.useQuery({ limit: 1000 });
  
  // Fetch all cooperations
  const { data: allCooperations, isLoading: coopsLoading } = trpc.cooperation.getUserCooperations.useQuery({ limit: 1000 });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!allUsers || !allPraises) return null;

    const totalUsers = allUsers.length;
    const totalPraises = allPraises.length;
    const totalTokens = allUsers.reduce((sum, user) => sum + (user.tokenBalance || 0), 0);
    const avgTokensPerUser = totalUsers > 0 ? Math.round(totalTokens / totalUsers) : 0;

    // Praise type distribution
    const praiseTypes: Record<string, number> = {};
    allPraises.forEach(praise => {
      praiseTypes[praise.stampType] = (praiseTypes[praise.stampType] || 0) + 1;
    });

    const praiseTypeData = Object.entries(praiseTypes).map(([type, count]) => ({
      name: type === "help" ? "てつだい" :
            type === "idea" ? "アイデア" :
            type === "kind" ? "やさしさ" : "がんばり",
      value: count,
    }));

    // Top users by token balance
    const topUsers = [...allUsers]
      .sort((a, b) => (b.tokenBalance || 0) - (a.tokenBalance || 0))
      .slice(0, 10)
      .map(user => ({
        name: user.displayName || user.name || `User${user.id}`,
        tokens: user.tokenBalance || 0,
      }));

    return {
      totalUsers,
      totalPraises,
      totalTokens,
      avgTokensPerUser,
      praiseTypeData,
      topUsers,
    };
  }, [allUsers, allPraises]);

  if (usersLoading || praisesLoading || coopsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">データがありません</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                もどる
              </Button>
            </Link>
            <h1 className="font-heading font-bold text-2xl text-slate-800 flex items-center gap-2">
              <School className="h-6 w-6 text-primary" />
              管理者ダッシュボード
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/class-management">
              <Button variant="outline" size="sm">
                <School className="mr-2 h-4 w-4" />
                学校・クラス管理
              </Button>
            </Link>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-bold">管理者</p>
              <p className="font-heading font-bold text-sm">学校管理者</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-bold mb-1">総ユーザー数</p>
                  <p className="text-4xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-bold mb-1">総ほめトークン数</p>
                  <p className="text-4xl font-bold">{stats.totalPraises}</p>
                </div>
                <Heart className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-bold mb-1">総トークン保有数</p>
                  <p className="text-4xl font-bold">{stats.totalTokens}</p>
                </div>
                <Trophy className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-bold mb-1">平均トークン数</p>
                  <p className="text-4xl font-bold">{stats.avgTokensPerUser}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Praise Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                ほめトークンの種類別分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.praiseTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.praiseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                トークン保有ランキング（Top 10）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topUsers} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="tokens" fill="#4D96FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6 space-y-3 text-sm text-slate-700">
            <p className="font-bold text-lg flex items-center gap-2 text-purple-800">
              <TrendingUp className="w-5 h-5" />
              インサイト
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>活発な交流:</strong> 1人あたり平均{stats.avgTokensPerUser}トークンを保有しており、クラス内での相互承認が活発に行われています。
              </li>
              <li>
                <strong>多様な評価:</strong> {stats.praiseTypeData.length}種類のほめトークンがバランスよく使われており、多様な良い行動が評価されています。
              </li>
              <li>
                <strong>継続的な成長:</strong> 総ほめトークン数{stats.totalPraises}件は、子どもたちが日々成長し続けている証です。
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
