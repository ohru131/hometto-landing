import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  praises, 
  InsertPraise,
  cooperations,
  cooperationParticipants,
  InsertCooperation,
  InsertCooperationParticipant,
  unlockedItems,
  InsertUnlockedItem
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "displayName", "avatarColor", "avatarAccessory"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.tokenBalance !== undefined) {
      values.tokenBalance = user.tokenBalance;
      updateSet.tokenBalance = user.tokenBalance;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { displayName?: string; avatarColor?: string; avatarAccessory?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function updateUserTokenBalance(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    tokenBalance: sql`${users.tokenBalance} + ${amount}`
  }).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users);
}

// ===== Praise (ほめトークン) =====

export async function createPraise(data: InsertPraise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(praises).values(data);
}

export async function getPraisesByUserId(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(praises)
    .where(eq(praises.toUserId, userId))
    .orderBy(desc(praises.createdAt))
    .limit(limit);
}

export async function getPraisesSentByUser(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(praises)
    .where(eq(praises.fromUserId, userId))
    .orderBy(desc(praises.createdAt))
    .limit(limit);
}

export async function getAllPraises(limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(praises)
    .orderBy(desc(praises.createdAt))
    .limit(limit);
}

// ===== Cooperation (協力NFT) =====

export async function createCooperation(data: InsertCooperation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cooperations).values(data);
  return result[0].insertId;
}

export async function addCooperationParticipant(data: InsertCooperationParticipant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cooperationParticipants).values(data);
}

export async function approveCooperationParticipant(cooperationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cooperationParticipants)
    .set({ approved: 1, approvedAt: new Date() })
    .where(and(
      eq(cooperationParticipants.cooperationId, cooperationId),
      eq(cooperationParticipants.userId, userId)
    ));
}

export async function getCooperationById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(cooperations).where(eq(cooperations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCooperationParticipants(cooperationId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    id: cooperationParticipants.id,
    cooperationId: cooperationParticipants.cooperationId,
    userId: cooperationParticipants.userId,
    approved: cooperationParticipants.approved,
    approvedAt: cooperationParticipants.approvedAt,
    user: users,
  })
    .from(cooperationParticipants)
    .leftJoin(users, eq(cooperationParticipants.userId, users.id))
    .where(eq(cooperationParticipants.cooperationId, cooperationId));
  
  return result;
}

export async function getUserCooperations(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    cooperation: cooperations,
    participant: cooperationParticipants
  })
    .from(cooperationParticipants)
    .innerJoin(cooperations, eq(cooperationParticipants.cooperationId, cooperations.id))
    .where(eq(cooperationParticipants.userId, userId))
    .orderBy(desc(cooperations.createdAt))
    .limit(limit);

  return result;
}

export async function getAllCooperations(limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cooperations)
    .orderBy(desc(cooperations.createdAt))
    .limit(limit);
}

export async function incrementCooperationApprovals(cooperationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cooperations)
    .set({ currentApprovals: sql`${cooperations.currentApprovals} + 1` })
    .where(eq(cooperations.id, cooperationId));
}

// ===== Unlocked Items (アバターアイテム) =====

export async function unlockItem(data: InsertUnlockedItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(unlockedItems).values(data);
}

export async function getUserUnlockedItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(unlockedItems)
    .where(eq(unlockedItems.userId, userId));
}

export async function isItemUnlocked(userId: number, itemId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select().from(unlockedItems)
    .where(and(
      eq(unlockedItems.userId, userId),
      eq(unlockedItems.itemId, itemId)
    ))
    .limit(1);

  return result.length > 0;
}
