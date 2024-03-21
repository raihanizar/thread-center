import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export async function GET(req, { params }) {
  const id = params.id;

  try {
    // find user based on id
    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        username: true,
        email: true,
      },
    });

    // if user is not found
    if (!user) {
      return NextResponse.json(
        { errorMessage: "Can't get user. User not found.”" },
        { status: 404 }
      );
    }

    // if user found
    return NextResponse.json(
      { message: "Get user successful.", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const id = params.id;
  const { newUsername, newEmail } = await req.json();
  console.log({ newEmail, newUsername, id });

  try {
    // Find existing user
    const findUser = await prisma.user.findFirst({
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

    // Update user's username if newUsername is provided
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

    // Update user's email if newEmail is provided
    if (newEmail) {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: newEmail,
        },
      });
    }

    // Fetch the updated user after updating username or email
    const updatedUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    // Return success response with updated user data
    return NextResponse.json(
      {
        message: "Change user info successful.",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.error(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
