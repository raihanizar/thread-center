import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userid");

  // if search params is empty respond with error
  if (!userId) {
    return NextResponse.json({ message: "Search parameter is not provided." }, { status: 400 });
  }

  // filter by user
  if (userId) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
      if (bookmarks.length === 0) {
        return NextResponse.json({ message: "No bookmark saved by this user." }, { status: 404 });
      } else {
        return NextResponse.json({ data: bookmarks, message: "Get bookmarks successful" }, { status: 200 });
      }
    } catch (error) {
      console.error(error)
      return NextResponse.json({ message: "An error occurred while fetching bookmarks." }, { status: 500 });
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
