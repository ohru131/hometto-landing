import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Lightbulb, Sparkles, Star, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock Data for Classmates
const CLASSMATES = [
  { id: 1, name: "ゆうと", color: "bg-blue-400" },
  { id: 2, name: "さくら", color: "bg-pink-400" },
  { id: 3, name: "れん", color: "bg-green-400" },
  { id: 4, name: "ひな", color: "bg-yellow-400" },
  { id: 5, name: "はると", color: "bg-purple-400" },
  { id: 6, name: "ゆい", color: "bg-red-400" },
  { id: 7, name: "そうた", color: "bg-indigo-400" },
  { id: 8, name: "あおい", color: "bg-teal-400" },
];

// Mock Data for Praise Stamps
const STAMPS = [
  { id: "help", label: "てつだってくれた", icon: Heart, color: "text-pink-500", bg: "bg-pink-100" },
  { id: "idea", label: "ナイスアイデア", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "kind", label: "やさしいね", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "try", label: "がんばった", icon: Trophy, color: "text-orange-500", bg: "bg-orange-100" },
];

export default function Demo() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setSelectedStudent(null);
      setSelectedStamp(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Header for Tablet */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="bg-primary/10 py-2 text-center text-xs font-bold text-primary">
          <span className="mr-4">ほかのデモもためしてみよう：</span>
          <Link href="/cooperation-demo" className="underline hover:text-primary/80 mr-4">協力チェーン</Link>
          <Link href="/teacher-dashboard" className="underline hover:text-primary/80 mr-4">先生用画面</Link>
          <Link href="/parent-dashboard" className="underline hover:text-primary/80 mr-4">保護者用画面</Link>
          <Link href="/avatar-customizer" className="underline hover:text-primary/80">アバター</Link>
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
              <p className="font-heading font-bold text-lg">みなと</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center text-white font-heading font-bold text-xl">
              み
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
                {CLASSMATES.map((student) => (
                  <motion.button
                    key={student.id}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStudent(student.id)}
                    className="group relative aspect-square bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border-4 border-transparent hover:border-primary/20 flex flex-col items-center justify-center gap-4 p-4"
                  >
                    <div className={`w-24 h-24 rounded-full ${student.color} flex items-center justify-center text-white text-4xl font-heading font-bold shadow-inner`}>
                      {student.name[0]}
                    </div>
                    <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {student.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Select Stamp & Send */
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white relative">
                {/* Back Button inside Card */}
                <div className="absolute top-6 left-6 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { setSelectedStudent(null); setSelectedStamp(null); }}
                    className="rounded-full hover:bg-muted w-12 h-12"
                  >
                    <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                  </Button>
                </div>

                <div className="p-8 md:p-12 space-y-8 text-center">
                  <div className="space-y-2">
                    <div className={`w-32 h-32 mx-auto rounded-full ${CLASSMATES.find(s => s.id === selectedStudent)?.color} flex items-center justify-center text-white text-5xl font-heading font-bold shadow-lg mb-4`}>
                      {CLASSMATES.find(s => s.id === selectedStudent)?.name[0]}
                    </div>
                    <h2 className="text-3xl font-heading font-bold">
                      <span className="text-primary">{CLASSMATES.find(s => s.id === selectedStudent)?.name}</span> さんに
                    </h2>
                    <p className="text-xl text-muted-foreground">どんな きもちを おくる？</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {STAMPS.map((stamp) => (
                      <button
                        key={stamp.id}
                        onClick={() => setSelectedStamp(stamp.id)}
                        className={`p-4 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-3 ${
                          selectedStamp === stamp.id
                            ? "border-primary bg-primary/5 scale-105 shadow-md"
                            : "border-transparent bg-muted/30 hover:bg-muted/50 hover:scale-105"
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full ${stamp.bg} flex items-center justify-center`}>
                          <stamp.icon className={`w-8 h-8 ${stamp.color}`} />
                        </div>
                        <span className="font-bold text-lg text-foreground">{stamp.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      size="lg"
                      disabled={!selectedStamp || isSent}
                      onClick={handleSend}
                      className={`w-full h-20 text-2xl rounded-full font-heading font-bold shadow-xl transition-all duration-300 ${
                        selectedStamp 
                          ? "bg-secondary hover:bg-secondary/90 hover:scale-105 hover:shadow-secondary/30 text-white btn-bouncy" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {isSent ? (
                        <span className="flex items-center gap-3">
                          <Check className="w-8 h-8" /> おくりました！
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <Star className="w-6 h-6 fill-current" /> トークンをおくる
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {isSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-64 h-64 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(250,204,21,0.5)] mb-8 animate-bounce">
                  <Star className="w-32 h-32 text-white fill-white" />
                </div>
                <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-secondary drop-shadow-lg">
                  すごい！
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-4">
                  ほめトークンが とどいたよ！
                </p>
              </motion.div>
              
              {/* Confetti Particles (Simplified with CSS/Motion) */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1, 
                    scale: Math.random() * 0.5 + 0.5 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 1000, 
                    y: (Math.random() - 0.5) * 1000, 
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute w-6 h-6 rounded-full ${
                    ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400"][Math.floor(Math.random() * 5)]
                  }`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
