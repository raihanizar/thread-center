import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(request) {
  const jwtSecret = process.env.JWT_SECRET;
  const encodedJwtSecret = new TextEncoder().encode(jwtSecret);
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jose.jwtVerify(token, encodedJwtSecret);
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// mencoba cari cara supaya ga reload terus menurus di events/form tapi belum nemu caranya
export const config = { matcher: ["/dashboard/:path*"] };
