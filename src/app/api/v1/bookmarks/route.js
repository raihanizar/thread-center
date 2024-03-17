import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

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
