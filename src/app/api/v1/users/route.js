import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

export async function PATCH(req) {
  const { email, newPassword } = await req.json();
  console.log({ email, newPassword });

  // Find the user by email
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // If user is not found, return error
  if (!existingUser) {
    return NextResponse.json(
      { message: "Email is not registered." },
      { status: 404 }
    );
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error resetting password" },
      { status: 500 }
    );
  }
}
