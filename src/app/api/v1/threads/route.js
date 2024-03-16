import prisma from "@/utils/prisma";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import fetch from "node-fetch";


export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const userId = searchParams.get("userid");
  
  // if search params is empty respond with error
  if (!query && !category && !userId) {
    return NextResponse.json({ message: "Search parameter is not provided." }, { status: 400 });
  }
  
  // filter by query text
  if (query) {
    try {
      const threads = await prisma.thread.findMany({
        where: {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      if (threads.length === 0) {
        return NextResponse.json({ message: "Thread not found." }, { status: 404 });
      } else {
        return NextResponse.json({ data: threads, message: "Get threads successful" }, { status: 200 });
      }
    } catch {
      return NextResponse.json({ message: "An error occurred while fetching threads." }, { status: 500 });
    }
  }

  // filter by category
  if (category) {
    try {
      const threads = await prisma.thread.findMany({
        where: {
          category: category,
        },
      });
      if (threads.length === 0) {
        return NextResponse.json({ message: "Thread not found." }, { status: 404 });
      } else {
        return NextResponse.json({ data: threads, message: "Get threads successful" }, { status: 200 });
      }
    } catch (error) {
      console.error(error)
      return NextResponse.json({ message: "An error occurred while fetching threads." }, { status: 500 });
    }
  }

  // filter by user
  if (userId) {
    try {
      const threads = await prisma.thread.findMany({
        where: {
          userId: userId,
        },
      });
      if (threads.length === 0) {
        return NextResponse.json({ message: "Thread not found." }, { status: 404 });
      } else {
        return NextResponse.json({ data: threads, message: "Get threads successful" }, { status: 200 });
      }
    } catch (error) {
      console.error(error)
      return NextResponse.json({ message: "An error occurred while fetching threads." }, { status: 500 });
    }
  }
}


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
      `${process.env.BASE_URL}/getTweet/${threadId}`
    );
    const tweetData = await response.json();
    console.log(tweetData);

    // Extract the required fields from the tweet data
    const url = thread;
    const authorId = tweetData.tweet.user.id_str;
    const content = tweetData.tweet.text;
    const like_count = tweetData.tweet.favorite_count;
    const created_at = new Date(tweetData.tweet.created_at);

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
