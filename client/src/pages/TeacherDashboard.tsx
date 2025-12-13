import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Calendar, Heart, Lightbulb, Sparkles, Trophy, Users } from "lucide-react";
import { Link } from "wouter";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data for Class Stats
const CLASS_STATS = [
  { name: "てつだった", count: 45, color: "#ec4899" }, // pink-500
  { name: "アイデア", count: 32, color: "#eab308" }, // yellow-500
  { name: "やさしい", count: 28, color: "#3b82f6" }, // blue-500
  { name: "がんばった", count: 38, color: "#f97316" }, // orange-500
];

const STUDENT_ACTIVITY = [
  { name: "ゆうと", sent: 12, received: 15 },
  { name: "さくら", sent: 18, received: 20 },
  { name: "れん", sent: 8, received: 12 },
  { name: "ひな", sent: 15, received: 18 },
  { name: "はると", sent: 10, received: 10 },
  { name: "ゆい", sent: 22, received: 25 },
  { name: "そうた", sent: 14, received: 16 },
  { name: "あおい", sent: 20, received: 22 },
];

export default function TeacherDashboard() {
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
              2026年6月15日 (月)
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
                <p className="text-sm text-muted-foreground font-bold">今週のほめトークン</p>
                <p className="text-2xl font-heading font-bold">143 <span className="text-sm font-normal text-slate-400">件</span></p>
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
                <p className="text-2xl font-heading font-bold">96 <span className="text-sm font-normal text-slate-400">%</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">発行された協力NFT</p>
                <p className="text-2xl font-heading font-bold">12 <span className="text-sm font-normal text-slate-400">枚</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">クラスの雰囲気スコア</p>
                <p className="text-2xl font-heading font-bold">A+ <span className="text-sm font-normal text-slate-400">上昇中</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Distribution */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-500" />
                トークンの種類内訳
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLASS_STATS}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {CLASS_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Student Activity */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-500" />
                児童ごとの活動状況（送った数 / もらった数）
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STUDENT_ACTIVITY}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" name="送った" fill="#4D96FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="received" name="もらった" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>最近の活動タイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10:15", user: "ゆい", action: "さくらさんに「てつだってくれた」を送りました", icon: Heart, color: "text-pink-500 bg-pink-100" },
                { time: "10:12", user: "あおい", action: "そうたさんに「ナイスアイデア」を送りました", icon: Lightbulb, color: "text-yellow-500 bg-yellow-100" },
                { time: "09:45", user: "班活動", action: "1班が「理科実験成功」の協力NFTを発行しました", icon: Trophy, color: "text-green-500 bg-green-100" },
                { time: "09:30", user: "ゆうと", action: "れんさんに「がんばった」を送りました", icon: Sparkles, color: "text-orange-500 bg-orange-100" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b last:border-0">
                  <div className="text-sm text-slate-400 font-mono w-12">{item.time}</div>
                  <div className={`p-2 rounded-full ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-700">{item.user}</span>
                    <span className="text-slate-600 ml-2">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
