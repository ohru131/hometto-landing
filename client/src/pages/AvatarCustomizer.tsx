import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Glasses, Palette, Shirt, Smile, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock Assets
const ASSETS = {
  colors: [
    { id: "blue", value: "bg-blue-400", label: "ブルー" },
    { id: "pink", value: "bg-pink-400", label: "ピンク" },
    { id: "green", value: "bg-green-400", label: "グリーン" },
    { id: "yellow", value: "bg-yellow-400", label: "イエロー" },
    { id: "purple", value: "bg-purple-400", label: "パープル" },
  ],
  accessories: [
    { id: "none", icon: null, label: "なし", cost: 0 },
    { id: "glasses", icon: Glasses, label: "めがね", cost: 10 },
    { id: "crown", icon: Crown, label: "かんむり", cost: 50 },
    { id: "star", icon: Star, label: "スター", cost: 30 },
  ],
  expressions: [
    { id: "smile", label: "にっこり" },
    { id: "laugh", label: "わらう" },
    { id: "cool", label: "クール" },
  ]
};

export default function AvatarCustomizer() {
  const [color, setColor] = useState(ASSETS.colors[0]);
  const [accessory, setAccessory] = useState(ASSETS.accessories[0]);
  const [expression, setExpression] = useState(ASSETS.expressions[0]);
  const [tokens, setTokens] = useState(120);
  const [unlocked, setUnlocked] = useState(["none"]);

  const handleUnlock = (item: typeof ASSETS.accessories[0]) => {
    if (tokens >= item.cost && !unlocked.includes(item.id)) {
      setTokens(prev => prev - item.cost);
      setUnlocked(prev => [...prev, item.id]);
      setAccessory(item);
    } else if (unlocked.includes(item.id)) {
      setAccessory(item);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans selection:bg-primary/20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/demo">
            <Button variant="ghost" className="rounded-full hover:bg-muted text-muted-foreground">
              <ArrowLeft className="mr-2 h-6 w-6" />
              もどる
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-200">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-heading font-bold text-yellow-700">{tokens} トークン</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 mb-2">
            アバターきせかえ
          </h1>
          <p className="text-slate-500">
            あつめたトークンで、自分だけのアバターをつくろう！
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-white rounded-full shadow-2xl animate-pulse" />
              
              {/* Avatar Body */}
              <motion.div
                layout
                className={`absolute inset-4 rounded-full ${color.value} shadow-inner flex items-center justify-center transition-colors duration-500`}
              >
                {/* Face */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Eyes */}
                  <div className="flex gap-8 mb-4">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-slate-800 rounded-full" />
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-slate-800 rounded-full" />
                  </div>
                  {/* Mouth */}
                  <div className="absolute mt-8 w-12 h-6 border-b-4 border-slate-800 rounded-full" />
                  
                  {/* Accessory */}
                  <AnimatePresence mode="wait">
                    {accessory.id !== "none" && accessory.icon && (
                      <motion.div
                        key={accessory.id}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute -top-8 text-white drop-shadow-lg"
                      >
                        <accessory.icon className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            {/* Colors */}
            <Card className="p-6 rounded-3xl border-2 border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                いろをえらぶ
              </h3>
              <div className="flex gap-3 flex-wrap">
                {ASSETS.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c)}
                    className={`w-12 h-12 rounded-full ${c.value} border-4 transition-transform hover:scale-110 ${color.id === c.id ? "border-slate-800 scale-110" : "border-transparent"}`}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </Card>

            {/* Accessories */}
            <Card className="p-6 rounded-3xl border-2 border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-secondary" />
                アイテム（トークンをつかう）
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ASSETS.accessories.map((item) => {
                  const isUnlocked = unlocked.includes(item.id);
                  const canAfford = tokens >= item.cost;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleUnlock(item)}
                      disabled={!isUnlocked && !canAfford}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                        accessory.id === item.id
                          ? "border-secondary bg-secondary/5"
                          : "border-slate-100 hover:border-secondary/30"
                      } ${!isUnlocked && !canAfford ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon ? <item.icon className="w-5 h-5 text-slate-600" /> : <span className="w-5 h-5 block" />}
                        <span className="font-bold text-sm text-slate-700">{item.label}</span>
                      </div>
                      {isUnlocked ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-yellow-600" />
                          {item.cost}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Button className="w-full h-14 rounded-2xl text-lg font-heading font-bold btn-bouncy bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 w-5 h-5" />
              これでけってい！
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
