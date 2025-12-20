import { drizzle } from "drizzle-orm/mysql2";
import { users, schools, classes, cooperations, cooperationParticipants } from "../drizzle/schema";
import { ENV } from "./_core/env";

/**
 * デモユーザーとサンプルデータを生成するシードスクリプト
 */
async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return;
  }

  const db = drizzle(process.env.DATABASE_URL);

  try {
    console.log("🌱 Seeding database with demo data...");

    // 学校を作成
    const schoolResult = await db.insert(schools).values({
      name: "Hometto Demo School",
      address: "Tokyo, Japan",
    });
    const schoolId = schoolResult[0].insertId;
    console.log(`✓ Created school: ${schoolId}`);

    // クラスを作成
    const classResult = await db.insert(classes).values({
      schoolId,
      name: "2年3組",
      grade: 2,
    });
    const classId = classResult[0].insertId;
    console.log(`✓ Created class: ${classId}`);

    // デモユーザーを作成
    const demoUsers = [
      {
        openId: "demo-user-1",
        name: "太郎",
        email: "taro@hometto.demo",
        displayName: "太郎",
        avatarColor: "blue",
        role: "student" as const,
        schoolId,
        classId,
      },
      {
        openId: "demo-user-2",
        name: "花子",
        email: "hanako@hometto.demo",
        displayName: "花子",
        avatarColor: "pink",
        role: "student" as const,
        schoolId,
        classId,
      },
      {
        openId: "demo-user-3",
        name: "次郎",
        email: "jiro@hometto.demo",
        displayName: "次郎",
        avatarColor: "green",
        role: "student" as const,
        schoolId,
        classId,
      },
      {
        openId: "demo-user-4",
        name: "美咲",
        email: "misaki@hometto.demo",
        displayName: "美咲",
        avatarColor: "purple",
        role: "student" as const,
        schoolId,
        classId,
      },
      {
        openId: "demo-user-5",
        name: "健太",
        email: "kenta@hometto.demo",
        displayName: "健太",
        avatarColor: "orange",
        role: "student" as const,
        schoolId,
        classId,
      },
      {
        openId: "demo-teacher-1",
        name: "山田先生",
        email: "yamada@hometto.demo",
        displayName: "山田先生",
        avatarColor: "red",
        role: "teacher" as const,
        schoolId,
        classId,
      },
    ];

    const userIds: number[] = [];
    for (const userData of demoUsers) {
      const result = await db.insert(users).values({
        ...userData,
        tokenBalance: 10,
        lastSignedIn: new Date(),
      }).onDuplicateKeyUpdate({
        set: {
          lastSignedIn: new Date(),
        },
      });
      userIds.push(result[0].insertId);
      console.log(`✓ Created user: ${userData.displayName}`);
    }

    // サンプル協力NFTを作成
    const cooperationResult = await db.insert(cooperations).values({
      title: "クラス掃除プロジェクト",
      description: "教室の大掃除を協力して完成させよう！",
      requiredApprovals: 3,
      currentApprovals: 0,
    });
    const cooperationId = cooperationResult[0].insertId;
    console.log(`✓ Created cooperation: ${cooperationId}`);

    // 協力参加者を追加
    for (let i = 0; i < 3; i++) {
      await db.insert(cooperationParticipants).values({
        cooperationId,
        userId: userIds[i],
        approved: 0,
      });
    }
    console.log(`✓ Added 3 participants to cooperation`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Demo Users:");
    demoUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.displayName} (${user.role})`);
    });
    console.log("\n🎓 School: Hometto Demo School");
    console.log("📚 Class: 2年3組");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
