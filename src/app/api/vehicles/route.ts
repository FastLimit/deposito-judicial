import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const estado = searchParams.get("estado") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Prisma.VehicleWhereInput = {};

    if (search) {
      where.OR = [
        { dominio: { contains: search } },
        { marca: { contains: search } },
        { modelo: { contains: search } },
      ];
    }

    if (estado) {
      where.estadoConservacion = estado;
    }

    const skip = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.vehicle.count({ where }),
    ]);

    return NextResponse.json({
      vehicles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener vehículos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userRole = (session.user as { role: string }).role;
  if (userRole === "CONSULTATION") {
    return NextResponse.json({ error: "No tiene permisos para crear vehículos" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { marca, modelo, dominio, ujInterviene, ubicacion, estadoConservacion } = body;

    if (!marca || !modelo || !dominio || !ujInterviene || !ubicacion || !estadoConservacion) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const validEstados = ["Excelente", "Bueno", "Regular", "Malo", "Chatarra"];
    if (!validEstados.includes(estadoConservacion)) {
      return NextResponse.json({ error: "Estado de conservación inválido" }, { status: 400 });
    }

    const vehicle = await db.vehicle.create({
      data: {
        marca,
        modelo,
        dominio,
        ujInterviene,
        ubicacion,
        estadoConservacion,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear vehículo" }, { status: 500 });
  }
}
