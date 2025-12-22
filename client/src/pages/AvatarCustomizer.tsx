import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Glasses, Loader2, Palette, Shirt, Smile, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

// Assets
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

  // Fetch current user
  const { data: currentUser, isLoading: userLoading, refetch: refetchUser } = trpc.user.getProfile.useQuery();
  
  // Fetch unlocked items
  const { data: unlockedItems, isLoading: itemsLoading, refetch: refetchItems } = trpc.avatar.getUnlockedItems.useQuery();
  
  // Unlock item mutation
  const unlockMutation = trpc.avatar.unlockItem.useMutation({
    onSuccess: () => {
      toast.success("アイテムをアンロックしました！");
      refetchUser();
      refetchItems();
    },
    onError: (error) => {
      toast.error("エラーが発生しました: " + error.message);
    },
  });

  // Set initial color from user profile
  useEffect(() => {
    if (currentUser?.avatarColor) {
      const userColor = ASSETS.colors.find(c => c.id === currentUser.avatarColor);
      if (userColor) setColor(userColor);
    }
  }, [currentUser]);

  const handleUnlock = (item: typeof ASSETS.accessories[0]) => {
    if (item.id === "none") {
      setAccessory(item);
      return;
    }

    const isUnlocked = unlockedItems?.some(ui => ui.itemId === item.id);
    
    if (isUnlocked) {
      setAccessory(item);
    } else {
      unlockMutation.mutate({
        itemId: item.id,
      });
      setAccessory(item);
    }
  };

  if (userLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <Button onClick={() => window.location.href = "/api/auth/login"}>
            ログイン
          </Button>
        </Card>
      </div>
    );
  }

  const unlocked = ["none", ...(unlockedItems?.map(ui => ui.itemId) || [])];

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
            <span className="font-heading font-bold text-yellow-700">{currentUser.tokenBalance || 0} トークン</span>
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
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2"
                      >
                        {accessory.icon && <accessory.icon className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Colors */}
            <Card className="p-6">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                いろ
              </h3>
              <div className="flex gap-3 flex-wrap">
                {ASSETS.colors.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setColor(c)}
                    className={`w-14 h-14 rounded-full ${c.value} border-4 ${color.id === c.id ? "border-slate-800 shadow-lg" : "border-white shadow"} transition-all`}
                  />
                ))}
              </div>
            </Card>

            {/* Accessories */}
            <Card className="p-6">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                アクセサリー
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ASSETS.accessories.map((item) => {
                  const isUnlocked = unlocked.includes(item.id);
                  const canAfford = (currentUser.tokenBalance || 0) >= item.cost;
                  const isActive = accessory.id === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUnlock(item)}
                      disabled={!isUnlocked && !canAfford}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-lg"
                          : isUnlocked
                          ? "bg-white border-slate-200 hover:border-primary"
                          : canAfford
                          ? "bg-slate-50 border-slate-200 hover:border-yellow-400"
                          : "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {item.icon ? (
                          <item.icon className={`w-8 h-8 ${isActive ? "text-white" : "text-slate-600"}`} />
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                        <p className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-700"}`}>
                          {item.label}
                        </p>
                        {!isUnlocked && item.cost > 0 && (
                          <div className={`flex items-center gap-1 text-xs ${canAfford ? "text-yellow-600" : "text-slate-400"}`}>
                            <Star className="w-3 h-3" />
                            {item.cost}
                          </div>
                        )}
                        {isUnlocked && item.id !== "none" && (
                          <Check className={`w-4 h-4 ${isActive ? "text-white" : "text-green-600"}`} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Expressions */}
            <Card className="p-6">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Smile className="h-5 w-5 text-primary" />
                かお
              </h3>
              <div className="flex gap-3">
                {ASSETS.expressions.map((expr) => (
                  <motion.button
                    key={expr.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpression(expr)}
                    className={`px-6 py-3 rounded-full font-bold transition-all ${
                      expression.id === expr.id
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-slate-700 border-2 border-slate-200 hover:border-primary"
                    }`}
                  >
                    {expr.label}
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>ヒント:</strong> ほめトークンを送ったり、もらったりすると、トークンが増えるよ！
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
