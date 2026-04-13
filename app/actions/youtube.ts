"use server";

import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

function extractVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function submitVideo(videoUrl: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const videoId = extractVideoId(videoUrl);
    if (!videoId) throw new Error("Invalid YouTube URL");

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) throw new Error("User not found");
    if (!user.youtubeChannelId) throw new Error("Your YouTube Channel ID is not configured. Please contact an admin.");

    // 1. Fetch video details from YouTube
    const response = await youtube.videos.list({
      part: ["snippet"],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) throw new Error("Video not found on YouTube");

    const platformChannelId = video.snippet?.channelId;
    const publishedAt = video.snippet?.publishedAt;

    // 2. Verify channel
    if (platformChannelId !== user.youtubeChannelId) {
      throw new Error(`Channel mismatch. Expected: ${user.youtubeChannelId}, Found: ${platformChannelId}`);
    }

    // 3. Verify date (Published today?)
    const publishedDate = new Date(publishedAt!).toDateString();
    const today = new Date().toDateString();

    if (publishedDate !== today) {
      throw new Error("This video was not published today. Only daily uploads are counted.");
    }

    // 4. Record submission and update performance in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Check if video already submitted
      const existing = await tx.videoSubmission.findUnique({
        where: { videoId },
      });
      if (existing) throw new Error("This video has already been submitted.");

      await tx.videoSubmission.create({
        data: {
          youtubeUrl: videoUrl,
          videoId,
          userId: user.id,
          status: "APPROVED",
        },
      });

      const performanceDate = new Date();
      performanceDate.setHours(0, 0, 0, 0);

      const performance = await tx.dailyPerformance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: performanceDate,
          },
        },
        update: {
          videosUploaded: { increment: 1 },
        },
        create: {
          userId: user.id,
          date: performanceDate,
          videosRequired: user.dailyVideoTarget,
          videosUploaded: 1,
        },
      });

      // Recalculate earnings based on updated performance
      const dailyBaseRate = user.monthlySalary / user.workingDaysPerMonth;
      const currentUploads = performance.videosUploaded + (performance.id ? 1 : 0); 
      // Note: upsert returns the record BEFORE the update if it existed? 
      // Actually Prisma upsert returns the NEWLY created/updated object.
      // So performance.videosUploaded should be the new count.
      
      const uploadedCount = performance.videosUploaded;
      const earnings = dailyBaseRate * (Math.min(uploadedCount, user.dailyVideoTarget) / user.dailyVideoTarget);

      const updatedPerformance = await tx.dailyPerformance.update({
        where: { id: performance.id },
        data: { amountEarned: earnings },
      });

      return { success: true, earnedToday: earnings, uploadedToday: uploadedCount };
    });

    revalidatePath("/dashboard/employee");
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
