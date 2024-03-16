import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export async function PATCH(req, { params }) {
  const id = params.id;
  const { newPassword, newUsername } = await req.json();
  // console.log({ email, id });

  // find existing user
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    // If user is not found, return error
    if (!findUser) {
      return NextResponse.json(
        { errorMessage: "Can't change user info. User not found" },
        { status: 404 }
      );
    }

    // Update the user's password if newPassword is provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
        },
      });
    }

    // Update the user's username if newUsername is provided
    if (newUsername) {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          username: newUsername,
        },
      });
    }

    // Fetch the updated user after updating username or password
    const updatedUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    // If the password or username update is successful, create JWT token
    const payload = {
      // id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    };

    // Create token
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
    const res = NextResponse.json(
      { message: "Change user info successful.", data: payload },
      { status: 200 }
    );
    res.cookies.set("token", token);

    return res;
  } catch (error) {
    console.log(error);
    return NextResponse.error(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
