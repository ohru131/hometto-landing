import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { requestNotificationPermission } from "@/lib/notifications";
import { ArrowLeft, Bell, BellOff, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [praiseNotif, setPraiseNotif] = useState(true);
  const [cooperationNotif, setCooperationNotif] = useState(true);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedPraise = localStorage.getItem("notif_praise");
    const savedCoop = localStorage.getItem("notif_cooperation");
    
    if (savedPraise !== null) setPraiseNotif(savedPraise === "true");
    if (savedCoop !== null) setCooperationNotif(savedCoop === "true");
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission("granted");
      toast.success("通知を有効にしました！");
    } else {
      toast.error("通知の許可が得られませんでした");
    }
  };

  const handleTogglePraise = (checked: boolean) => {
    setPraiseNotif(checked);
    localStorage.setItem("notif_praise", String(checked));
  };

  const handleToggleCooperation = (checked: boolean) => {
    setCooperationNotif(checked);
    localStorage.setItem("notif_cooperation", String(checked));
  };

  return (
    <div className="min-h-screen bg-amber-50/50 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              もどる
            </Button>
          </Link>
          <h1 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            通知設定
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        {/* Permission Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {permission === "granted" ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5 text-slate-400" />
              )}
              通知の状態
            </CardTitle>
          </CardHeader>
          <CardContent>
            {permission === "granted" ? (
              <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg">
                <Check className="h-5 w-5" />
                <p className="font-bold">通知が有効です</p>
              </div>
            ) : permission === "denied" ? (
              <div className="text-red-700 bg-red-50 p-4 rounded-lg">
                <p className="font-bold mb-2">通知がブロックされています</p>
                <p className="text-sm">ブラウザの設定から通知を許可してください。</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-600">
                  大切なお知らせを受け取るために、通知を有効にしてください。
                </p>
                <Button onClick={handleRequestPermission} className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  通知を有効にする
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Types */}
        {permission === "granted" && (
          <Card>
            <CardHeader>
              <CardTitle>通知の種類</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Praise Notifications */}
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">ほめトークン</h3>
                  <p className="text-sm text-slate-600">
                    誰かがあなたをほめた時に通知します
                  </p>
                </div>
                <Switch
                  checked={praiseNotif}
                  onCheckedChange={handleTogglePraise}
                />
              </div>

              {/* Cooperation Notifications */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">協力NFT</h3>
                  <p className="text-sm text-slate-600">
                    協力NFTの承認状況を通知します
                  </p>
                </div>
                <Switch
                  checked={cooperationNotif}
                  onCheckedChange={handleToggleCooperation}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-sm text-blue-800">
            <p className="font-bold mb-2">💡 通知について</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>通知はブラウザが開いている時のみ表示されます</li>
              <li>通知音はデバイスの設定に従います</li>
              <li>いつでもオン・オフを切り替えられます</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
