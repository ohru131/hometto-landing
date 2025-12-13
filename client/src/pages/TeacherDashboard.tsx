import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Calendar, Heart, Lightbulb, Loader2, Sparkles, Trophy, Users } from "lucide-react";
import { Link } from "wouter";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

const STAMP_COLORS: Record<string, string> = {
  help: "#ec4899", // pink-500
  idea: "#eab308", // yellow-500
  kind: "#3b82f6", // blue-500
  try: "#f97316", // orange-500
};

const STAMP_LABELS: Record<string, string> = {
  help: "てつだった",
  idea: "アイデア",
  kind: "やさしい",
  try: "がんばった",
};

export default function TeacherDashboard() {
  // Fetch all praises
  const { data: allPraises, isLoading: praisesLoading } = trpc.praise.getAll.useQuery({ limit: 1000 });
  
  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = trpc.user.getAllUsers.useQuery();
  
  // Fetch stats
  const { data: stats, isLoading: statsLoading } = trpc.stats.getOverview.useQuery();

  // Calculate stamp distribution
  const stampStats = useMemo(() => {
    if (!allPraises) return [];
    
    const counts: Record<string, number> = {};
    allPraises.forEach(praise => {
      counts[praise.stampType] = (counts[praise.stampType] || 0) + 1;
    });
    
    return Object.entries(counts).map(([type, count]) => ({
      name: STAMP_LABELS[type] || type,
      count,
      color: STAMP_COLORS[type] || "#888888",
    }));
  }, [allPraises]);

  // Calculate student activity
  const studentActivity = useMemo(() => {
    if (!allUsers || !allPraises) return [];
    
    return allUsers.map(user => {
      const sent = allPraises.filter(p => p.fromUserId === user.id).length;
      const received = allPraises.filter(p => p.toUserId === user.id).length;
      
      return {
        name: user.displayName || user.name || `ユーザー${user.id}`,
        sent,
        received,
      };
    }).sort((a, b) => (b.sent + b.received) - (a.sent + a.received));
  }, [allUsers, allPraises]);

  // Calculate participation rate
  const participationRate = useMemo(() => {
    if (!allUsers || !allPraises) return 0;
    
    const activeUsers = new Set([
      ...allPraises.map(p => p.fromUserId),
      ...allPraises.map(p => p.toUserId),
    ]);
    
    return Math.round((activeUsers.size / allUsers.length) * 100);
  }, [allUsers, allPraises]);

  if (praisesLoading || usersLoading || statsLoading) {
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
              <Users className="h-5 w-5 text-primary" />
              2年3組 学級経営ダッシュボード
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              T
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-full text-pink-600">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">総ほめトークン</p>
                <p className="text-2xl font-heading font-bold">{stats?.totalPraises || 0} <span className="text-sm font-normal text-slate-400">件</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">参加率</p>
                <p className="text-2xl font-heading font-bold">{participationRate} <span className="text-sm font-normal text-slate-400">%</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">総トークン数</p>
                <p className="text-2xl font-heading font-bold">{stats?.totalTokens || 0} <span className="text-sm font-normal text-slate-400">枚</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">クラス人数</p>
                <p className="text-2xl font-heading font-bold">{stats?.totalUsers || 0} <span className="text-sm font-normal text-slate-400">人</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stamp Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                ほめトークンの種類別分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stampStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stampStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stampStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  データがありません
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Activity Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                児童別活動状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentActivity.slice(0, 8)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#3b82f6" name="送信" />
                    <Bar dataKey="received" fill="#ec4899" name="受信" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  データがありません
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              全児童一覧
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-bold text-sm text-slate-600">名前</th>
                    <th className="text-center py-3 px-4 font-bold text-sm text-slate-600">送信数</th>
                    <th className="text-center py-3 px-4 font-bold text-sm text-slate-600">受信数</th>
                    <th className="text-center py-3 px-4 font-bold text-sm text-slate-600">保有トークン</th>
                    <th className="text-center py-3 px-4 font-bold text-sm text-slate-600">活動度</th>
                  </tr>
                </thead>
                <tbody>
                  {studentActivity.map((student, index) => {
                    const total = student.sent + student.received;
                    const activityLevel = total > 30 ? "高" : total > 15 ? "中" : "低";
                    const activityColor = total > 30 ? "text-green-600 bg-green-100" : total > 15 ? "text-blue-600 bg-blue-100" : "text-slate-600 bg-slate-100";
                    const user = allUsers?.find(u => (u.displayName || u.name) === student.name);
                    
                    return (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold">{student.name}</td>
                        <td className="text-center py-3 px-4">{student.sent}</td>
                        <td className="text-center py-3 px-4">{student.received}</td>
                        <td className="text-center py-3 px-4 font-bold text-primary">{user?.tokenBalance || 0}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${activityColor}`}>
                            {activityLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="h-5 w-5" />
              学級経営のヒント
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800">
            <p>✨ <strong>活動度が「低」の児童</strong>には、個別に声をかけて参加を促しましょう。</p>
            <p>💡 <strong>受信数が少ない児童</strong>の良い行動を、クラス全体で共有してみましょう。</p>
            <p>🎯 <strong>送信数が多い児童</strong>は、クラスのムードメーカーとして活躍しています。</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
