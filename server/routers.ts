import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Profile Management
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        displayName: z.string().optional(),
        avatarColor: z.string().optional(),
        avatarAccessory: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
    
    getAllUsers: publicProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),

  // Praise (ほめトークン)
  praise: router({
    send: protectedProcedure
      .input(z.object({
        toUserId: z.number(),
        message: z.string().optional(),
        stampType: z.string(),
        tokenAmount: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // トークンを送信
        await db.createPraise({
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          message: input.message,
          stampType: input.stampType,
          tokenAmount: input.tokenAmount,
        });
        
        // 受信者のトークン残高を増やす
        await db.updateUserTokenBalance(input.toUserId, input.tokenAmount);
        
        return { success: true };
      }),
    
    getReceived: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getPraisesByUserId(ctx.user.id, input.limit);
      }),
    
    getSent: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getPraisesSentByUser(ctx.user.id, input.limit);
      }),
    
    getAll: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getAllPraises(input.limit);
      }),
  }),

  // Cooperation (協力NFT)
  cooperation: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        participantIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        // 協力記録を作成
        const cooperationId = await db.createCooperation({
          title: input.title,
          description: input.description,
        });
        
        // 参加者を追加（作成者は自動承認）
        for (const userId of input.participantIds) {
          await db.addCooperationParticipant({
            cooperationId,
            userId,
            approved: userId === ctx.user.id ? 1 : 0,
            approvedAt: userId === ctx.user.id ? new Date() : undefined,
          });
        }
        
        return { cooperationId, success: true };
      }),
    
    approve: protectedProcedure
      .input(z.object({
        cooperationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.approveCooperationParticipant(input.cooperationId, ctx.user.id);
        
        // 全員が承認したかチェック
        const participants = await db.getCooperationParticipants(input.cooperationId);
        const allApproved = participants.every(p => p.approved === 1);
        
        // 全員承認済みなら、全員にトークンを付与
        if (allApproved) {
          for (const participant of participants) {
            await db.updateUserTokenBalance(participant.userId, 5); // 協力NFTは5トークン
          }
        }
        
        return { success: true, allApproved };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const cooperation = await db.getCooperationById(input.id);
        if (!cooperation) return null;
        
        const participants = await db.getCooperationParticipants(input.id);
        return { ...cooperation, participants };
      }),
    
    getUserCooperations: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserCooperations(ctx.user.id, input.limit);
      }),
  }),

  // Avatar Items (アバターアイテム)
  avatar: router({
    unlockItem: protectedProcedure
      .input(z.object({
        itemId: z.string(),
        cost: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // トークン残高をチェック
        if (ctx.user.tokenBalance < input.cost) {
          throw new Error("トークンが不足しています");
        }
        
        // すでにアンロック済みかチェック
        const isUnlocked = await db.isItemUnlocked(ctx.user.id, input.itemId);
        if (isUnlocked) {
          throw new Error("このアイテムは既にアンロック済みです");
        }
        
        // トークンを消費
        await db.updateUserTokenBalance(ctx.user.id, -input.cost);
        
        // アイテムをアンロック
        await db.unlockItem({
          userId: ctx.user.id,
          itemId: input.itemId,
        });
        
        return { success: true };
      }),
    
    getUnlockedItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserUnlockedItems(ctx.user.id);
    }),
  }),

  // Statistics (統計データ)
  stats: router({
    getOverview: publicProcedure.query(async () => {
      const allPraises = await db.getAllPraises(1000);
      const allUsers = await db.getAllUsers();
      
      return {
        totalUsers: allUsers.length,
        totalPraises: allPraises.length,
        totalTokens: allUsers.reduce((sum, u) => sum + (u.tokenBalance || 0), 0),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
