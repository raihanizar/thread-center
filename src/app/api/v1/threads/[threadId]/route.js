import { NextResponse } from "next/server"
import prisma from "@/utils/prisma";

export async function GET(req, {params}){
  const threadId = params.threadId
  try {
    const thread = await prisma.thread.findFirst({
      where: {
        threadId: threadId
      }
    })
    if (!thread) {
      return NextResponse.json({ message: "Thread not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Get thread successful", data: thread }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "An error occurred while fetching threads." }, { status: 500 });
  }
}