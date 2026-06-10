import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Ya existe un usuario administrador" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await db.user.create({
      data: {
        fullName: "Administrador General",
        documentNumber: "00000000",
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        fullName: true,
        documentNumber: true,
        role: true,
      },
    });

    return NextResponse.json({ message: "Administrador creado exitosamente", admin }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear administrador" }, { status: 500 });
  }
}
