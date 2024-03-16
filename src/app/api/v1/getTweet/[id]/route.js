import { NextResponse } from "next/server"
import { getTweet } from 'react-tweet/api'

export async function GET(req, {params}){
  const id = params.id
  const tweet = await getTweet(id)
  return NextResponse.json({ tweet })
}