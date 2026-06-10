import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        documentNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { fullName, documentNumber, password, role } = body;

    const validRoles = ["ADMIN", "OPERATOR", "CONSULTATION"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (documentNumber && documentNumber !== existing.documentNumber) {
      const duplicate = await db.user.findUnique({ where: { documentNumber } });
      if (duplicate) {
        return NextResponse.json({ error: "Ya existe un usuario con ese número de documento" }, { status: 409 });
      }
    }

    const updateData: {
      fullName?: string;
      documentNumber?: string;
      password?: string;
      role?: string;
    } = {};
    if (fullName) updateData.fullName = fullName;
    if (documentNumber) updateData.documentNumber = documentNumber;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        documentNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
