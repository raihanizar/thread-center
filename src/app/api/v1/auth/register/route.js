import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

export async function POST(req) {
  const { username, email, password } = await req.json();
  console.log({ username, email, password });
  /**
   * TODO
   * - Input Validation
   */
  // Check if email is already registered
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // If user already exists, return error message
  if (existingUser) {
    return NextResponse.json(
      { message: "Email is already registered." },
      { status: 400 }
    );
  }

  try {
    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user to database
    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Register successful" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 401 });
  }
}
