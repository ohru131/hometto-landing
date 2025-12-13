import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  
  // Hometto specific fields
  displayName: varchar("displayName", { length: 100 }), // ニックネーム
  avatarColor: varchar("avatarColor", { length: 20 }).default("blue"), // アバターの色
  avatarAccessory: varchar("avatarAccessory", { length: 50 }).default("none"), // アバターのアクセサリー
  tokenBalance: int("tokenBalance").default(0).notNull(), // 所持トークン数
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * ほめトークン送信記録
 */
export const praises = mysqlTable("praises", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(), // 送信者
  toUserId: int("toUserId").notNull(), // 受信者
  message: text("message"), // コメント
  stampType: varchar("stampType", { length: 50 }).notNull(), // スタンプの種類
  tokenAmount: int("tokenAmount").default(1).notNull(), // 送信トークン数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Praise = typeof praises.$inferSelect;
export type InsertPraise = typeof praises.$inferInsert;

/**
 * 協力NFT記録
 */
export const cooperations = mysqlTable("cooperations", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(), // 協力活動のタイトル
  description: text("description"), // 説明
  requiredApprovals: int("requiredApprovals").default(4).notNull(), // 必要な承認数
  currentApprovals: int("currentApprovals").default(0).notNull(), // 現在の承認数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Cooperation = typeof cooperations.$inferSelect;
export type InsertCooperation = typeof cooperations.$inferInsert;

/**
 * 協力参加者（多対多の関係）
 */
export const cooperationParticipants = mysqlTable("cooperation_participants", {
  id: int("id").autoincrement().primaryKey(),
  cooperationId: int("cooperationId").notNull(),
  userId: int("userId").notNull(),
  approved: int("approved").default(0).notNull(), // 0: 未承認, 1: 承認済み
  approvedAt: timestamp("approvedAt"),
});

export type CooperationParticipant = typeof cooperationParticipants.$inferSelect;
export type InsertCooperationParticipant = typeof cooperationParticipants.$inferInsert;

/**
 * アバターアイテムのアンロック記録
 */
export const unlockedItems = mysqlTable("unlocked_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemId: varchar("itemId", { length: 50 }).notNull(), // アイテムID (例: "glasses", "crown")
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UnlockedItem = typeof unlockedItems.$inferSelect;
export type InsertUnlockedItem = typeof unlockedItems.$inferInsert;