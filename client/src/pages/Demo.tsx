import { trpc } from "@/lib/trpc";
import { showPraiseNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Lightbulb, Sparkles, Trophy, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

// Mock Data for Praise Stamps
const STAMPS = [
  { id: "help", label: "てつだってくれた", icon: Heart, color: "text-pink-500", bg: "bg-pink-100" },
  { id: "idea", label: "ナイスアイデア", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "kind", label: "やさしいね", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "try", label: "がんばった", icon: Trophy, color: "text-orange-500", bg: "bg-orange-100" },
];

const AVATAR_COLORS = ["bg-blue-400", "bg-pink-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-red-400", "bg-indigo-400", "bg-teal-400"];

export default function Demo() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = trpc.user.getProfile.useQuery();
  
  // Fetch all users (classmates)
  const { data: allUsers, isLoading: usersLoading, refetch: refetchUsers } = trpc.user.getAllUsers.useQuery();
  
  // Send praise mutation
  const sendPraiseMutation = trpc.praise.send.useMutation({
    onSuccess: () => {
      setIsSent(true);
      toast.success("ほめトークンを送ったよ！");
      
      // 受信者側での通知（デモ用）
      if (localStorage.getItem("notif_praise") !== "false") {
        setTimeout(() => {
          const stamp = STAMPS.find(s => s.id === selectedStamp);
          showPraiseNotification(
            currentUser?.displayName || currentUser?.name || "あなた",
            stamp?.label || "",
            selectedStamp || "help"
          );
        }, 1000);
      }
      
      setTimeout(() => {
        setIsSent(false);
        setSelectedStudent(null);
        setSelectedStamp(null);
      }, 3000);
      refetchUsers(); // Refresh user data to show updated token balance
    },
    onError: (error) => {
      toast.error("エラーが発生しました: " + error.message);
    },
  });

  const handleSend = () => {
    if (!selectedStudent || !selectedStamp || !currentUser) return;
    
    const stamp = STAMPS.find(s => s.id === selectedStamp);
    sendPraiseMutation.mutate({
      toUserId: selectedStudent,
      stampType: selectedStamp,
      message: stamp?.label,
      tokenAmount: 1,
    });
  };

  const classmates = allUsers?.filter(u => u.id !== currentUser?.id) || [];
  const selectedStudentData = allUsers?.find(u => u.id === selectedStudent);

  if (userLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <p className="text-muted-foreground mb-6">ほめトークンを送るにはログインしてください</p>
          <Button onClick={() => window.location.href = "/api/auth/login"}>
            ログイン
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Header for Tablet */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="bg-primary/10 py-2 text-center text-xs font-bold text-primary">
          <span className="mr-4">ほかのデモもためしてみよう：</span>
          <Link href="/cooperation-demo" className="underline hover:text-primary/80 mr-4">協力チェーン</Link>
          <Link href="/teacher-dashboard" className="underline hover:text-primary/80 mr-4">先生用画面</Link>
          <Link href="/parent-dashboard" className="underline hover:text-primary/80 mr-4">保護者用画面</Link>
          <Link href="/avatar-customizer" className="underline hover:text-primary/80 mr-4">アバター</Link>
          <Link href="/notification-settings" className="underline hover:text-primary/80 mr-4">通知設定</Link>
          <Link href="/admin-dashboard" className="underline hover:text-primary/80">管理者</Link>
        </div>
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="rounded-full hover:bg-muted text-muted-foreground">
              <ArrowLeft className="mr-2 h-6 w-6" />
              もどる
            </Button>
          </Link>
          <div className="flex items-center gap-3 bg-secondary/10 px-6 py-2 rounded-full">
            <Users className="h-6 w-6 text-secondary" />
            <span className="text-xl font-heading font-bold text-secondary-foreground">2年3組</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground font-bold">じぶん</p>
              <p className="font-heading font-bold text-lg">{currentUser.displayName || currentUser.name || "ユーザー"}</p>
              <p className="text-xs text-muted-foreground">トークン: {currentUser.tokenBalance || 0}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${currentUser.avatarColor ? `bg-${currentUser.avatarColor}` : 'bg-primary'} border-4 border-white shadow-md flex items-center justify-center text-white font-heading font-bold text-xl`}>
              {(currentUser.displayName || currentUser.name || "U")[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {!selectedStudent ? (
            /* Step 1: Select Classmate */
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  だれに <span className="text-secondary">ほめトークン</span> をおくる？
                </h2>
                <p className="text-xl text-muted-foreground">おともだちを タップしてね</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {classmates.map((student, index) => (
                  <motion.button
                    key={student.id}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStudent(student.id)}
                    className="group"
                  >
                    <Card className="p-6 text-center space-y-3 hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-secondary">
                      <div className={`w-20 h-20 mx-auto rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} border-4 border-white shadow-lg flex items-center justify-center text-white font-heading font-bold text-3xl`}>
                        {(student.displayName || student.name || "U")[0]}
                      </div>
                      <p className="font-heading font-bold text-xl">{student.displayName || student.name || `ユーザー${student.id}`}</p>
                      <p className="text-xs text-muted-foreground">トークン: {student.tokenBalance || 0}</p>
                    </Card>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : !selectedStamp ? (
            /* Step 2: Select Stamp */
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  <span className="text-secondary">{selectedStudentData?.displayName || selectedStudentData?.name}</span> さんに
                </h2>
                <p className="text-xl text-muted-foreground">どんなことをほめる？</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {STAMPS.map((stamp) => {
                  const Icon = stamp.icon;
                  return (
                    <motion.button
                      key={stamp.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedStamp(stamp.id)}
                      className="group"
                    >
                      <Card className={`p-8 ${stamp.bg} border-4 border-transparent group-hover:border-primary transition-all`}>
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <Icon className={`w-12 h-12 ${stamp.color}`} />
                          </div>
                          <p className="font-heading font-bold text-2xl text-foreground">{stamp.label}</p>
                        </div>
                      </Card>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-full px-8"
                >
                  もどる
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Step 3: Confirm and Send */
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-xl mx-auto"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  これでいい？
                </h2>
                
                <Card className="p-8 space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full ${currentUser.avatarColor ? `bg-${currentUser.avatarColor}` : 'bg-primary'} border-4 border-white shadow-md flex items-center justify-center text-white font-heading font-bold text-2xl`}>
                        {(currentUser.displayName || currentUser.name || "U")[0]}
                      </div>
                      <p className="mt-2 font-bold text-sm">{currentUser.displayName || currentUser.name}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Heart className="w-12 h-12 text-secondary animate-pulse" />
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full ${AVATAR_COLORS[classmates.findIndex(c => c.id === selectedStudent) % AVATAR_COLORS.length]} border-4 border-white shadow-md flex items-center justify-center text-white font-heading font-bold text-2xl`}>
                        {(selectedStudentData?.displayName || selectedStudentData?.name || "U")[0]}
                      </div>
                      <p className="mt-2 font-bold text-sm">{selectedStudentData?.displayName || selectedStudentData?.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {(() => {
                      const stamp = STAMPS.find(s => s.id === selectedStamp);
                      const Icon = stamp?.icon || Heart;
                      return (
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${stamp?.bg}`}>
                          <Icon className={`w-8 h-8 ${stamp?.color}`} />
                          <span className="font-heading font-bold text-xl">{stamp?.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </Card>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedStamp(null)}
                  className="rounded-full px-8"
                  disabled={sendPraiseMutation.isPending}
                >
                  もどる
                </Button>
                <Button
                  size="lg"
                  onClick={handleSend}
                  className="rounded-full px-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-bold text-xl"
                  disabled={sendPraiseMutation.isPending}
                >
                  {sendPraiseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    "おくる！"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {isSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary/20 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white rounded-3xl p-12 shadow-2xl text-center space-y-6"
              >
                <div className="w-32 h-32 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                  <Check className="w-20 h-20 text-secondary" />
                </div>
                <h3 className="text-4xl font-heading font-bold text-secondary">おくったよ！</h3>
                <p className="text-xl text-muted-foreground">
                  {selectedStudentData?.displayName || selectedStudentData?.name}さん、よろこんでくれるかな？
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
