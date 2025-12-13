import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Link as LinkIcon, Plus, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock Members
const MEMBERS = [
  { id: 1, name: "ゆうと", color: "bg-blue-400", approved: false },
  { id: 2, name: "さくら", color: "bg-pink-400", approved: false },
  { id: 3, name: "れん", color: "bg-green-400", approved: false },
  { id: 4, name: "ひな", color: "bg-yellow-400", approved: false },
];

export default function CooperationDemo() {
  const [members, setMembers] = useState(MEMBERS);
  const [isComplete, setIsComplete] = useState(false);

  const handleApprove = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, approved: true } : m));
  };

  const allApproved = members.every(m => m.approved);

  const handleIssueNFT = () => {
    setIsComplete(true);
  };

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
                  <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">理科実験 成功記念</h2>
                  <p className="text-slate-500 font-bold">2026.06.15</p>
                  
                  {/* Signatures */}
                  <div className="flex gap-2 mt-6 justify-center flex-wrap">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${m.approved ? "opacity-100 scale-100" : "opacity-30 scale-90 grayscale"}`}
                      >
                        {m.name[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right: Approval Process */}
          <div className="space-y-6">
            <Card className="p-6 rounded-3xl border-2 border-slate-100 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                メンバーの承認
              </h3>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-white font-bold`}>
                        {member.name[0]}
                      </div>
                      <span className="font-bold text-slate-700">{member.name}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(member.id)}
                      disabled={member.approved || isComplete}
                      className={`rounded-full font-bold ${member.approved ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white border-2 border-slate-200 text-slate-400 hover:border-primary hover:text-primary"}`}
                    >
                      {member.approved ? "承認済み" : "承認する"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              size="lg"
              disabled={!allApproved || isComplete}
              onClick={handleIssueNFT}
              className={`w-full h-16 text-xl rounded-2xl font-heading font-bold shadow-xl transition-all duration-300 ${
                allApproved && !isComplete
                  ? "bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30 text-white btn-bouncy animate-pulse"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isComplete ? "発行しました！" : "NFTを発行する"}
            </Button>
            
            {!allApproved && (
              <p className="text-center text-sm text-slate-400">
                全員が承認ボタンを押すと、発行できるようになります。
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
