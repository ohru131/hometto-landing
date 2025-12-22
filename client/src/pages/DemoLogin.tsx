import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn, Users } from "lucide-react";

interface DemoUser {
  openId: string;
  displayName: string;
  role: "student" | "teacher" | "admin";
  avatarColor: string;
  description: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    openId: "demo-user-1",
    displayName: "太郎",
    role: "student",
    avatarColor: "blue",
    description: "活発な学生。ほめトークンをたくさん送ります",
  },
  {
    openId: "demo-user-2",
    displayName: "花子",
    role: "student",
    avatarColor: "pink",
    description: "協力的な学生。協力NFTに参加します",
  },
  {
    openId: "demo-user-3",
    displayName: "次郎",
    role: "student",
    avatarColor: "green",
    description: "真面目な学生。バランスの取れた活動をします",
  },
  {
    openId: "demo-user-4",
    displayName: "美咲",
    role: "student",
    avatarColor: "purple",
    description: "創造的な学生。新しいアイデアを提案します",
  },
  {
    openId: "demo-user-5",
    displayName: "健太",
    role: "student",
    avatarColor: "orange",
    description: "スポーツが得意な学生。体育の時間が好きです",
  },
  {
    openId: "demo-teacher-1",
    displayName: "山田先生",
    role: "teacher",
    avatarColor: "red",
    description: "クラスの担任の先生。生徒の活動を見守ります",
  },
];

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (user: DemoUser) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to authenticate
      // For now, we'll simulate a login by storing the user info
      localStorage.setItem("demoUser", JSON.stringify(user));
      toast.success(`${user.displayName}としてログインしました`);
      
      // Redirect based on role
      setTimeout(() => {
        if (user.role === "teacher") {
          setLocation("/teacher-dashboard");
        } else if (user.role === "admin") {
          setLocation("/admin-dashboard");
        } else {
          setLocation("/demo");
        }
      }, 500);
    } catch (error) {
      toast.error("ログインに失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvatarBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-200",
      pink: "bg-pink-200",
      green: "bg-green-200",
      purple: "bg-purple-200",
      orange: "bg-orange-200",
      red: "bg-red-200",
    };
    return colorMap[color] || "bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">
              デモユーザーを選択
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Homettoのデモンストレーション用のユーザーアカウントを選択してください。
            異なるユーザー視点でアプリケーションを体験できます。
          </p>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DEMO_USERS.map((user) => (
            <Card
              key={user.openId}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedUser?.openId === user.openId
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <CardHeader className="text-center pb-3">
                {/* Avatar */}
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full ${getAvatarBgColor(
                    user.avatarColor
                  )} flex items-center justify-center`}
                >
                  <span className="text-3xl font-bold text-white">
                    {user.displayName.charAt(0)}
                  </span>
                </div>

                {/* Name and Role */}
                <CardTitle className="text-2xl">{user.displayName}</CardTitle>
                <div className="mt-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <CardDescription className="text-center text-sm">
                  {user.description}
                </CardDescription>

                {/* Login Button */}
                <Button
                  onClick={() => handleDemoLogin(user)}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  このユーザーでログイン
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">デモユーザーについて</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <p>
              • <strong>生徒（5名）</strong>：太郎、花子、次郎、美咲、健太
              - ほめトークンを送受信したり、協力NFTに参加したりできます
            </p>
            <p>
              • <strong>先生（1名）</strong>：山田先生
              - クラスの活動状況を確認できるダッシュボードにアクセスできます
            </p>
            <p>
              • ユーザーを切り替えることで、異なる視点からアプリケーションを体験できます
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
