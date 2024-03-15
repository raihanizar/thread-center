import prisma from "@/utils/prisma";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req) {
  // add threads
  const formData = await req.formData();

  const id = nanoid();

  const thread = formData.get("threadId");
  const category = formData.get("category");
  const userId = formData.get("userId");

  const threadId = thread.split("/").pop();

  console.log({ thread, category, userId, threadId });

  try {
    // Fetch tweet data from the provided URL
    const response = await fetch(
      `https://react-tweet.vercel.app/api/tweet/${threadId}`
    );
    const tweetData = await response.json();
    console.log(tweetData);

    // Extract the required fields from the tweet data
    const url = thread;
    const authorId = tweetData.data.user.id_str;
    const content = tweetData.data.text;
    const like_count = tweetData.data.favorite_count;
    const created_at = new Date(tweetData.data.created_at);

    console.log({ url, authorId, content, like_count });

    // Check if a thread with the same tweetId already exists
    const existingThread = await prisma.thread.findFirst({
      where: {
        threadId: threadId,
      },
    });

    if (existingThread) {
      console.error(`A thread with tweetId ${threadId} already exists.`);
      return NextResponse.json(
        {
          errorMessage: `Can't create thread. Thread with id ${threadId} already exists.`,
        },
        {
          status: 404, // Set the HTTP status code to 404 Not Found for duplicate data
        }
      );
    }

    const createThread = await prisma.thread.create({
      data: {
        id,
        threadId,
        category,
        userId,
        url,
        authorId,
        content,
        like_count,
        thread_date: created_at,
      },
    });

    return NextResponse.json(
      {
        data: createThread,
        message: "Create thread successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        errorMessage: "An error occurred while creating the thread.",
      },
      {
        status: 500,
      }
    );
  }
}
