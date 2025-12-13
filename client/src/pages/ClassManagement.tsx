import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Loader2, Plus, School, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClassManagement() {
  const { data: schools, isLoading: schoolsLoading, refetch: refetchSchools } = trpc.school.getAll.useQuery();
  const { data: allUsers } = trpc.user.getAllUsers.useQuery();
  
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const { data: classes, refetch: refetchClasses } = trpc.class.getBySchool.useQuery(
    { schoolId: selectedSchoolId! },
    { enabled: selectedSchoolId !== null }
  );

  // School creation
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolDialogOpen, setSchoolDialogOpen] = useState(false);
  const createSchoolMutation = trpc.school.create.useMutation();

  // Class creation
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const createClassMutation = trpc.class.create.useMutation();

  // User assignment
  const [assignUserId, setAssignUserId] = useState("");
  const [assignClassId, setAssignClassId] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const assignUserMutation = trpc.role.assignToClass.useMutation();

  const handleCreateSchool = async () => {
    if (!schoolName.trim()) {
      toast.error("学校名を入力してください");
      return;
    }

    try {
      await createSchoolMutation.mutateAsync({
        name: schoolName,
        address: schoolAddress || undefined,
      });
      toast.success("学校を作成しました");
      setSchoolName("");
      setSchoolAddress("");
      setSchoolDialogOpen(false);
      refetchSchools();
    } catch (error) {
      toast.error("学校の作成に失敗しました");
      console.error(error);
    }
  };

  const handleCreateClass = async () => {
    if (!className.trim() || !selectedSchoolId) {
      toast.error("クラス名と学校を選択してください");
      return;
    }

    try {
      await createClassMutation.mutateAsync({
        schoolId: selectedSchoolId,
        name: className,
        grade: classGrade ? parseInt(classGrade) : undefined,
      });
      toast.success("クラスを作成しました");
      setClassName("");
      setClassGrade("");
      setClassDialogOpen(false);
      refetchClasses();
    } catch (error) {
      toast.error("クラスの作成に失敗しました");
      console.error(error);
    }
  };

  const handleAssignUser = async () => {
    if (!assignUserId || !assignClassId) {
      toast.error("ユーザーとクラスを選択してください");
      return;
    }

    try {
      await assignUserMutation.mutateAsync({
        userId: parseInt(assignUserId),
        classId: parseInt(assignClassId),
      });
      toast.success("ユーザーをクラスに割り当てました");
      setAssignUserId("");
      setAssignClassId("");
      setAssignDialogOpen(false);
    } catch (error) {
      toast.error("ユーザーの割り当てに失敗しました");
      console.error(error);
    }
  };

  if (schoolsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                管理者ダッシュボードへ
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              学校・クラス管理
            </h1>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8 max-w-6xl">
        {/* Schools Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-purple-500" />
                  学校一覧
                </CardTitle>
                <CardDescription>登録されている学校</CardDescription>
              </div>
              <Dialog open={schoolDialogOpen} onOpenChange={setSchoolDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    学校を追加
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新しい学校を作成</DialogTitle>
                    <DialogDescription>
                      学校の情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="school-name">学校名</Label>
                      <Input
                        id="school-name"
                        placeholder="例: 〇〇小学校"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school-address">住所（任意）</Label>
                      <Input
                        id="school-address"
                        placeholder="例: 東京都〇〇区..."
                        value={schoolAddress}
                        onChange={(e) => setSchoolAddress(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCreateSchool}
                      className="w-full"
                      disabled={createSchoolMutation.isPending}
                    >
                      作成
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {schools && schools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((school) => (
                  <Card
                    key={school.id}
                    className={`cursor-pointer transition-all ${
                      selectedSchoolId === school.id
                        ? "border-purple-500 border-2 shadow-md"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedSchoolId(school.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <School className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{school.name}</p>
                          {school.address && (
                            <p className="text-sm text-slate-500">{school.address}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                まだ学校が登録されていません
              </p>
            )}
          </CardContent>
        </Card>

        {/* Classes Section */}
        {selectedSchoolId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    クラス一覧
                  </CardTitle>
                  <CardDescription>
                    {schools?.find((s) => s.id === selectedSchoolId)?.name}のクラス
                  </CardDescription>
                </div>
                <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      クラスを追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新しいクラスを作成</DialogTitle>
                      <DialogDescription>
                        クラスの情報を入力してください
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="class-name">クラス名</Label>
                        <Input
                          id="class-name"
                          placeholder="例: 2年3組"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class-grade">学年（任意）</Label>
                        <Input
                          id="class-grade"
                          type="number"
                          placeholder="例: 2"
                          value={classGrade}
                          onChange={(e) => setClassGrade(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleCreateClass}
                        className="w-full"
                        disabled={createClassMutation.isPending}
                      >
                        作成
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {classes && classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map((cls) => (
                    <Card key={cls.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-bold">{cls.name}</p>
                            {cls.grade && (
                              <p className="text-sm text-slate-500">{cls.grade}年生</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">
                  まだクラスが登録されていません
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* User Assignment Section */}
        {classes && classes.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ユーザー割り当て</CardTitle>
                  <CardDescription>
                    生徒や先生をクラスに割り当てます
                  </CardDescription>
                </div>
                <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      ユーザーを割り当て
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ユーザーをクラスに割り当て</DialogTitle>
                      <DialogDescription>
                        ユーザーとクラスを選択してください
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>ユーザー</Label>
                        <Select value={assignUserId} onValueChange={setAssignUserId}>
                          <SelectTrigger>
                            <SelectValue placeholder="ユーザーを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {allUsers?.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.displayName || user.name || `User${user.id}`} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>クラス</Label>
                        <Select value={assignClassId} onValueChange={setAssignClassId}>
                          <SelectTrigger>
                            <SelectValue placeholder="クラスを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id.toString()}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleAssignUser}
                        className="w-full"
                        disabled={assignUserMutation.isPending}
                      >
                        割り当て
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
}
