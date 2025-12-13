import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const { data: currentUser } = trpc.user.getProfile.useQuery();
  const updateRoleMutation = trpc.role.updateUserRole.useMutation();

  const handleRoleSelect = async (role: "student" | "teacher" | "admin") => {
    if (!currentUser) return;

    try {
      await updateRoleMutation.mutateAsync({
        userId: currentUser.id,
        role,
      });

      toast.success(`ロールを「${getRoleLabel(role)}」に設定しました`);

      // ロールに応じたダッシュボードへリダイレクト
      switch (role) {
        case "student":
          setLocation("/demo");
          break;
        case "teacher":
          setLocation("/teacher-dashboard");
          break;
        case "admin":
          setLocation("/admin-dashboard");
          break;
      }
    } catch (error) {
      toast.error("ロールの設定に失敗しました");
      console.error(error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "生徒";
      case "teacher":
        return "先生";
      case "admin":
        return "管理者";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Homettoへようこそ！
          </h1>
          <p className="text-slate-600 text-lg">
            あなたの役割を選択してください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 生徒 */}
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                <GraduationCap className="w-10 h-10 text-primary group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl">生徒</CardTitle>
              <CardDescription className="text-base">
                友達をほめたり、協力したりする
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 mb-4">
                <li>✓ ほめトークンを送る</li>
                <li>✓ 協力NFTを作る</li>
                <li>✓ アバターをカスタマイズ</li>
              </ul>
              <Button
                onClick={() => handleRoleSelect("student")}
                className="w-full"
                disabled={updateRoleMutation.isPending}
              >
                生徒として始める
              </Button>
            </CardContent>
          </Card>

          {/* 先生 */}
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-500 group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all">
                <Users className="w-10 h-10 text-green-500 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl">先生</CardTitle>
              <CardDescription className="text-base">
                クラスの成長を見守る
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 mb-4">
                <li>✓ 学級経営ダッシュボード</li>
                <li>✓ 生徒の活動を可視化</li>
                <li>✓ データをエクスポート</li>
              </ul>
              <Button
                onClick={() => handleRoleSelect("teacher")}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={updateRoleMutation.isPending}
              >
                先生として始める
              </Button>
            </CardContent>
          </Card>

          {/* 管理者 */}
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all">
                <Shield className="w-10 h-10 text-purple-500 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl">管理者</CardTitle>
              <CardDescription className="text-base">
                学校全体を管理する
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 mb-4">
                <li>✓ 学校・クラスの作成</li>
                <li>✓ ユーザー管理</li>
                <li>✓ 全体統計の閲覧</li>
              </ul>
              <Button
                onClick={() => handleRoleSelect("admin")}
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={updateRoleMutation.isPending}
              >
                管理者として始める
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>※ ロールはあとから変更できます</p>
        </div>
      </div>
    </div>
  );
}
