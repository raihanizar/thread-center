import { NextResponse } from "next/server";
import { getTweet } from "react-tweet/api";

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const tweet = await getTweet(id);
    return NextResponse.json({ tweet });
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
