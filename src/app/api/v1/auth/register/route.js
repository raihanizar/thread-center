import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

export async function POST(req) {
  const { username, email, password } = await req.json();

  //cek apakah email sudah teregistrasi
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // jika sudah teregistrasi, return ini
  if (existingUser) {
    return NextResponse.json(
      { message: "Email is already registered." },
      { status: 400 }
    );
  }

  try {
    // bikin hashed password untuk user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    // kirim user baru ke db
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
