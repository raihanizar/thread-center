import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userid");
  const threadId = searchParams.get("threadid");

  // if search params is empty respond with error
  if (!userId && !threadId) {
    return NextResponse.json(
      { message: "Search parameter is not provided." },
      { status: 400 }
    );
  }

  // filter by both
  if (userId && threadId) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: userId,
          threadId: threadId,
        },
      });
      if (bookmarks.length === 0) {
        return NextResponse.json(
          { message: "Bookmark not found." },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { data: bookmarks, message: "Get bookmarks successful" },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred while fetching bookmarks." },
        { status: 500 }
      );
    }
  }

  // filter by user
  if (userId) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
        include: {
          thread: {
            select: {
              threadId: true,
            },
          }, // add include related thread data for bookmark dashboard
        },
      });
      if (bookmarks.length === 0) {
        return NextResponse.json(
          { message: "No bookmark saved by this user." },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { data: bookmarks, message: "Get bookmarks successful" },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred while fetching bookmarks." },
        { status: 500 }
      );
    }
  }

  // filter by thread
  if (threadId) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          threadId: threadId,
        },
      });
      if (bookmarks.length === 0) {
        return NextResponse.json(
          { message: "This thread has not been bookmarked." },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { data: bookmarks, message: "Get bookmarks successful" },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred while fetching bookmarks." },
        { status: 500 }
      );
    }
  }
}

export async function POST(req) {
  const { userId, threadId } = await req.json();

  //   const {user, thread} = await prisma.user.findUnique({
  //     where: { user: userId, thread: threadId },
  //   });

  //   const thread = await prisma.thread.findUnique({
  //     where: { id: threadId },
  //   });

  if (!userId || !threadId) {
    return NextResponse.json(
      { errorMessage: "Can't create bookmark. User or thread not found." },
      { status: 401 }
    );
  }

  try {
    // Check if the thread belongs to the user trying to bookmark it
    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      select: {
        userId: true,
      },
    });

    // return an error indicating that the user cannot bookmark their own thread
    if (!thread || thread.userId === userId) {
      return NextResponse.json(
        { message: "You cannot bookmark your own thread." },
        { status: 400 }
      );
    }
    // Check if there is already a bookmark for the given userId and threadId
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        threadId: threadId,
      },
    });

    // If a bookmark with the same userId and threadId exists, return an error
    if (existingBookmark) {
      return NextResponse.json(
        { errorMessage: "Bookmark already exists for this user and thread." },
        { status: 400 }
      );
    }
    const bookmark = await prisma.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        thread: { connect: { id: threadId } },
      },
    });

    return NextResponse.json(
      { message: "Create bookmark successful", data: bookmark },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      {
        errorMessage: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
