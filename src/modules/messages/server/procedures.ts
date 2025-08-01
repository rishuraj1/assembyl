import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          Project: {
            userId: ctx.auth.userId,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          Fragment: true,
        },
      });

      return messages;
    }),
    getOneFragment: protectedProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, { message: "Fragment ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const fragment = await prisma.fragment.findUnique({
        where: {
          id: input.fragmentId,
        },
      });
      if (!fragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found.",
        });
      }
      return fragment;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "value cannot be empty" })
          .max(10000, { message: "value is too long." }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });
      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found or you do not have access to it.",
        });
      }

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong.",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message:
              "You have run out of credits. Please upgrade your plan to continue using the service.",
          });
        }
      }

      const createdMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return createdMessage;
    }),
  updateCode: protectedProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, { message: "Fragment ID is required" }),
        updatedCode: z.string().min(1, { message: "Code cannot be empty" }),
        fileName: z.string().min(1, { message: "File name is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { fileName, fragmentId, updatedCode } = input;
      const fragment = await prisma.fragment.findUnique({
        where: {
          id: fragmentId,
        },
      });

      if (!fragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found.",
        });
      }

      const updatedFiles = {
        ...(fragment.files as Record<string, string>),
        [fileName]: updatedCode,
      };

      await prisma.fragment.update({
        where: {
          id: fragmentId,
        },
        data: {
          files: updatedFiles,
        },
      });
      await inngest.send({
        name: "code-agent/reload",
        data: {
          fragmentId,
        },
      });
      return {
        fragmentId,
        updatedFiles,
      };
    }),
});
