import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const vehicle = await db.vehicle.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch {
    return NextResponse.json({ error: "Error al obtener vehículo" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userRole = (session.user as { role: string }).role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "No tiene permisos para editar vehículos" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { marca, modelo, dominio, ujInterviene, ubicacion, estadoConservacion, observaciones } = body;

    const existing = await db.vehicle.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    const validEstados = ["Excelente", "Bueno", "Regular", "Malo", "Chatarra"];
    if (estadoConservacion && !validEstados.includes(estadoConservacion)) {
      return NextResponse.json({ error: "Estado de conservación inválido" }, { status: 400 });
    }

    const vehicle = await db.vehicle.update({
      where: { id: parseInt(id) },
      data: {
        ...(marca && { marca }),
        ...(modelo && { modelo }),
        ...(dominio && { dominio }),
        ...(ujInterviene && { ujInterviene }),
        ...(ubicacion && { ubicacion }),
        ...(estadoConservacion && { estadoConservacion }),
        ...(observaciones !== undefined && { observaciones }),
      },
    });

    return NextResponse.json(vehicle);
  } catch {
    return NextResponse.json({ error: "Error al actualizar vehículo" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userRole = (session.user as { role: string }).role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "No tiene permisos para eliminar vehículos" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await db.vehicle.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    await db.vehicle.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Vehículo eliminado correctamente" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar vehículo" }, { status: 500 });
  }
}
