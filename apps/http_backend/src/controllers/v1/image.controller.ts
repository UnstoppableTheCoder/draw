import type { NextFunction, Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

import { s3 } from "../../lib/s3";

export const presignUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { files } = req.body;

    const presignedUrls = await Promise.all(
      files.map(async (file: { name: string; type: string; size: number }) => {
        const key = `uploads/${randomUUID()}-${file.name}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          ContentType: file.type,
        });

        const uploadUrl = await getSignedUrl(s3, command, {
          expiresIn: 60,
        });

        return {
          key,
          uploadUrl,
          publicUrl: `${process.env.CLOUDFRONT_URL}/${key}`,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      uploads: presignedUrls,
    });
  } catch (error) {
    next(error);
  }
};
