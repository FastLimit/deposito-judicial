import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        fullName: true,
        documentNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, documentNumber, password, role } = body;

    if (!fullName || !documentNumber || !password || !role) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "OPERATOR", "CONSULTATION"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { documentNumber },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con ese número de documento" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        fullName,
        documentNumber,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        fullName: true,
        documentNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
