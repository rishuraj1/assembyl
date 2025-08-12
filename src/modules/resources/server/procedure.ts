import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const resourcesRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const key = `uploads/${Date.now()}_${input.fileName}`;

      const url = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          ContentType: input.fileType,
        }),
        { expiresIn: 60 }
      );

      return { url, key };
    }),
});
