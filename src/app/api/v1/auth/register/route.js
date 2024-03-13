import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

export async function POST(req) {
  const { firstName, lastName, username, email, password } = await req.json();
  console.log({ firstName, lastName, username, email, password });
  /**
   * TODO
   * - Input Validation
   */

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
      { data: createUser, message: "Register successful" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "email already exist" },
      { status: 401 }
    );
  }
}
