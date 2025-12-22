import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as symbolBlockchain from "./symbolBlockchain";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie('session', { ...cookieOptions, maxAge: -1 });
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

  // Role Management
  role: router({
    updateUserRole: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["student", "teacher", "admin"]),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserRole(input.userId, input.role);
        return { success: true };
      }),
    
    assignToClass: protectedProcedure
      .input(z.object({
        userId: z.number(),
        classId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.assignUserToClass(input.userId, input.classId);
        return { success: true };
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
        // 送信者のSymbolアカウントを取得または作成
        let senderAccount = await db.getUserSymbolAccount(ctx.user.id);
        if (!senderAccount || !senderAccount.symbolPrivateKey) {
          // Symbolアカウントが存在しない場合は新規作成
          const newAccount = symbolBlockchain.generateNewAccount();
          await db.updateUserSymbolAccount(ctx.user.id, {
            symbolPrivateKey: newAccount.privateKey,
            symbolPublicKey: newAccount.publicKey,
            symbolAddress: newAccount.address,
          });
          senderAccount = {
            symbolPrivateKey: newAccount.privateKey,
            symbolPublicKey: newAccount.publicKey,
            symbolAddress: newAccount.address,
          };
        }

        // 受信者のSymbolアカウントを取得または作成
        let recipientAccount = await db.getUserSymbolAccount(input.toUserId);
        if (!recipientAccount || !recipientAccount.symbolAddress) {
          const newAccount = symbolBlockchain.generateNewAccount();
          await db.updateUserSymbolAccount(input.toUserId, {
            symbolPrivateKey: newAccount.privateKey,
            symbolPublicKey: newAccount.publicKey,
            symbolAddress: newAccount.address,
          });
          recipientAccount = {
            symbolPrivateKey: newAccount.privateKey,
            symbolPublicKey: newAccount.publicKey,
            symbolAddress: newAccount.address,
          };
        }

        // データベースにほめトークンを記録
        const praiseId = await db.createPraise({
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          message: input.message,
          stampType: input.stampType,
          tokenAmount: input.tokenAmount,
        });
        
        // 受信者のトークン残高を増やす
        await db.updateUserTokenBalance(input.toUserId, input.tokenAmount);

        // Symbolブロックチェーンにトランザクションを記録
        try {
          const txMessage = `Hometto Praise: ${input.stampType} (${input.tokenAmount} tokens) - ${input.message || 'No message'}`;
          const txResult = await symbolBlockchain.recordTokenTransaction(
            senderAccount.symbolPrivateKey!,
            recipientAccount.symbolAddress!,
            txMessage
          );

          if (txResult.success && txResult.hash) {
            // トランザクションハッシュをデータベースに保存
            await db.updatePraiseBlockchainTxHash(praiseId, txResult.hash);
          }
        } catch (error) {
          console.error('Failed to record on blockchain:', error);
          // ブロックチェーン記録に失敗してもデータベース記録は成功しているので続行
        }
        
        return { success: true, praiseId };
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
        requiredApprovals: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // 協力記録を作成
        const cooperationId = await db.createCooperation({
          title: input.title,
          description: input.description,
          requiredApprovals: input.requiredApprovals,
          currentApprovals: 0,
        });
        
        // 作成者を参加者として追加（未承認）
        await db.addCooperationParticipant({
          cooperationId,
          userId: ctx.user.id,
          approved: 0,
        });
        
        return { id: cooperationId, success: true };
      }),
    
    approve: protectedProcedure
      .input(z.object({
        cooperationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.approveCooperationParticipant(input.cooperationId, ctx.user.id);
        
        // 協力レコードを取得
        const cooperation = await db.getCooperationById(input.cooperationId);
        if (!cooperation) {
          throw new Error("Cooperation record not found");
        }
        
        // currentApprovalsを更新
        await db.incrementCooperationApprovals(input.cooperationId);
        
        // 全員承認済みかチェック
        const allApproved = cooperation.currentApprovals + 1 >= cooperation.requiredApprovals;
        
        // 全員承認済みなら、全員にトークンを付与
        if (allApproved) {
          const participants = await db.getCooperationParticipants(input.cooperationId);
          
          // 各参加者にトークンを付与
          for (const participant of participants) {
            await db.updateUserTokenBalance(participant.userId, 5);
          }

          // Symbolブロックチェーンに協力NFTを記録
          try {
            const senderParticipant = participants[0];
            if (!senderParticipant) {
              throw new Error('Sender not found');
            }

            const senderAccount = await db.getUserSymbolAccount(senderParticipant.userId);
            if (!senderAccount || !senderAccount.symbolPrivateKey) {
              throw new Error('Sender Symbol account not found');
            }

            const recipientParticipant = participants.length > 1 ? participants[1] : participants[0];
            const recipientAccount = await db.getUserSymbolAccount(recipientParticipant.userId);
            if (!recipientAccount || !recipientAccount.symbolAddress) {
              throw new Error('Recipient Symbol account not found');
            }

            const txMessage = `Hometto Cooperation NFT: ${cooperation.title} - Completed by ${participants.length} members`;
            const txResult = await symbolBlockchain.recordTokenTransaction(
              senderAccount.symbolPrivateKey,
              recipientAccount.symbolAddress,
              txMessage
            );

            if (txResult.success && txResult.hash) {
              await db.updateCooperationBlockchainTxHash(input.cooperationId, txResult.hash);
            }
          } catch (error) {
            console.error('Failed to record cooperation NFT on blockchain:', error);
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
    
    getAll: publicProcedure
      .query(async () => {
        return await db.getAllCooperations();
      }),
  }),

  // Avatar Items (アバターアイテム)
  avatar: router({
    unlockItem: protectedProcedure
      .input(z.object({
        itemId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.unlockItem({
          userId: ctx.user.id,
          itemId: input.itemId,
        });
        return { success: true };
      }),
    
    getUnlockedItems: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserUnlockedItems(ctx.user.id);
      }),
  }),

  // Schools and Classes
  school: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllSchools();
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        address: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const schoolId = await db.createSchool({
          name: input.name,
          address: input.address,
        });
        return { id: schoolId, success: true };
      }),
  }),

  class: router({
    getBySchool: publicProcedure
      .input(z.object({ schoolId: z.number() }))
      .query(async ({ input }) => {
        return await db.getClassesBySchool(input.schoolId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        schoolId: z.number(),
        name: z.string(),
        grade: z.number().optional(),
        teacherId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const classId = await db.createClass({
          schoolId: input.schoolId,
          name: input.name,
          grade: input.grade,
          teacherId: input.teacherId,
        });
        return { id: classId, success: true };
      }),
    }),

  stats: router({
    getOverview: publicProcedure.query(async () => {
      const allUsers = await db.getAllUsers();
      const allPraises = await db.getAllPraises();
      const allCooperations = await db.getAllCooperations();
      
      return {
        totalUsers: allUsers?.length || 0,
        totalPraises: allPraises?.length || 0,
        totalCooperations: allCooperations?.length || 0,
        averagePraisesPerUser: allUsers && allUsers.length > 0 
          ? (allPraises?.length || 0) / allUsers.length 
          : 0,
      };
    }),
  }),
});
export type AppRouter = typeof appRouter;
const COOKIE_NAME = 'session';
