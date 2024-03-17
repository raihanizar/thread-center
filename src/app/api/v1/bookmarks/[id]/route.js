import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;

  try {
    // find bookmarks based in ID
    const bookmarks = await prisma.bookmark.findFirst({
      where: {
        id,
      },
    });

    // find all bookmarks
    // const bookmarks = await prisma.bookmark.findMany();

    // if user is not found
    if (!bookmarks) {
      return NextResponse.json(
        { errorMessage: "Can't get bookmark. Bookmark not found" },
        { status: 404 }
      );
    }

    // if user found
    return NextResponse.json(
      { message: "Get bookmarks successful", data: bookmarks },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = params.id;
  console.log(id);

  try {
    // Check a bookmark based on ID
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    // If id bookmark not found
    if (!bookmark) {
      return NextResponse.json(
        { errorMessage: "Can't unbookmark. Bookmark not found." },
        { status: 404 }
      );
    }
    // if found, delete
    const existingBookmark = await prisma.bookmark.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Unbookmark successful" },
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