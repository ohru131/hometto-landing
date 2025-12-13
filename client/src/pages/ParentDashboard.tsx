import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ChevronRight, Heart, Lightbulb, MessageCircle, Sparkles, Star, Trophy, User } from "lucide-react";
import { Link } from "wouter";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data for Growth Chart
const GROWTH_DATA = [
  { month: "4月", score: 12 },
  { month: "5月", score: 18 },
  { month: "6月", score: 25 },
  { month: "7月", score: 32 },
  { month: "8月", score: 30 },
  { month: "9月", score: 45 },
];

export default function ParentDashboard() {
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
              <p className="font-heading font-bold text-sm">みなとのママ</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
              M
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
                み
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-heading font-bold">みなと</h2>
                <p className="text-blue-100 text-sm">2年3組 | 出席番号 12番</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-100 mb-1">今のレベル</p>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">Lv.12</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Heart className="w-5 h-5 mx-auto mb-1 text-pink-300" />
                <p className="text-xs text-blue-100">もらった</p>
                <p className="text-lg font-bold">45</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                <p className="text-xs text-blue-100">送った</p>
                <p className="text-lg font-bold">32</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-green-300" />
                <p className="text-xs text-blue-100">協力NFT</p>
                <p className="text-lg font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Highlight */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            今日のハイライト
          </h3>
          <Card className="border-l-4 border-l-secondary shadow-sm">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="p-3 bg-secondary/10 rounded-full text-secondary shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800">ナイスアイデア！</h4>
                  <span className="text-xs text-slate-400">14:30</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  あおいさんから「図工の時間、色の使い方がすごいって褒めてくれた！」というメッセージ付きでトークンが届きました。
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs rounded-full border-secondary/30 text-secondary hover:bg-secondary/5">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    コメントする
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs rounded-full text-slate-400">
                    詳細を見る
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-700">
              成長のきろく（トークン獲得数）
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D96FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4D96FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4D96FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent History List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700">最近の活動</h3>
            <Button variant="link" size="sm" className="text-primary h-auto p-0">
              すべて見る <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { date: "昨日", title: "てつだってくれた", from: "ゆうと", icon: Heart, color: "text-pink-500 bg-pink-100" },
              { date: "6/12", title: "協力NFT発行", from: "理科実験グループ", icon: Trophy, color: "text-green-500 bg-green-100" },
              { date: "6/10", title: "がんばった", from: "先生", icon: Sparkles, color: "text-orange-500 bg-orange-100" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3 border border-slate-100">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-slate-800 truncate">{item.title}</p>
                    <span className="text-xs text-slate-400 shrink-0">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">From: {item.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
