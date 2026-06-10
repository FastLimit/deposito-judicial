"use client";

import React, { useState, useEffect, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Car,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shield,
  Menu,
  X,
  Eye,
  Loader2,
  UserCog,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ============= TYPES =============
type View = "dashboard" | "vehicles" | "users";

interface UserData {
  id: string;
  fullName: string;
  documentNumber: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleData {
  id: number;
  marca: string;
  modelo: string;
  dominio: string;
  ujInterviene: string;
  ubicacion: string;
  estadoConservacion: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormData {
  marca: string;
  modelo: string;
  dominio: string;
  ujInterviene: string;
  ubicacion: string;
  estadoConservacion: string;
}

interface UserFormData {
  fullName: string;
  documentNumber: string;
  password: string;
  role: string;
}

const ESTADOS_CONSERVACION = ["Excelente", "Bueno", "Regular", "Malo", "Chatarra"];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  OPERATOR: "Operador de Carga",
  CONSULTATION: "Consulta",
};

const ESTADO_COLORS: Record<string, string> = {
  Excelente: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Bueno: "bg-blue-100 text-blue-800 border-blue-200",
  Regular: "bg-amber-100 text-amber-800 border-amber-200",
  Malo: "bg-orange-100 text-orange-800 border-orange-200",
  Chatarra: "bg-red-100 text-red-800 border-red-200",
};

const emptyVehicleForm: VehicleFormData = {
  marca: "",
  modelo: "",
  dominio: "",
  ujInterviene: "",
  ubicacion: "",
  estadoConservacion: "",
};

const emptyUserForm: UserFormData = {
  fullName: "",
  documentNumber: "",
  password: "",
  role: "",
};

// ============= LOGIN VIEW =============
function LoginView() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber || !password) {
      toast.error("Complete todos los campos");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        documentNumber,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Documento o contraseña incorrectos");
      }
    } catch {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[oklch(0.30_0.08_255)] via-[oklch(0.35_0.10_255)] to-[oklch(0.25_0.06_255)]">
      {/* Header */}
      <header className="w-full py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield className="h-10 w-10 text-white/90" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Dpto. Depósitos Judiciales
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Policía de la Provincia de Córdoba
        </p>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-2 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCog className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document">Número de Documento</Label>
                <Input
                  id="document"
                  type="text"
                  placeholder="Ej: 12345678"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-white/50 text-xs md:text-sm">
          Derechos Reservados 2026 - Dpto. Depósitos Judiciales - Policía de la Provincia de Córdoba
        </p>
      </footer>
    </div>
  );
}

// ============= DASHBOARD VIEW =============
function DashboardView({ userRole }: { userRole: string }) {
  const [stats, setStats] = useState({ totalVehicles: 0, totalUsers: 0, byEstado: {} as Record<string, number> });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const vehicleRes = await fetch("/api/vehicles?limit=9999");
        if (vehicleRes.ok) {
          const data = await vehicleRes.json();
          const totalVehicles = data.total || 0;
          const byEstado: Record<string, number> = {};
          ESTADOS_CONSERVACION.forEach((e) => (byEstado[e] = 0));
          (data.vehicles || []).forEach((v: VehicleData) => {
            if (byEstado[v.estadoConservacion] !== undefined) {
              byEstado[v.estadoConservacion]++;
            }
          });
          setStats((prev) => ({ ...prev, totalVehicles, byEstado }));
        }
      } catch {
        // silently ignore
      }

      if (userRole === "ADMIN") {
        try {
          const userRes = await fetch("/api/users");
          if (userRes.ok) {
            const users = await userRes.json();
            setStats((prev) => ({ ...prev, totalUsers: users.length }));
          }
        } catch {
          // silently ignore
        }
      }

      setLoading(false);
    };
    fetchStats();
  }, [userRole]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Panel Principal</h2>
        <p className="text-muted-foreground mt-1">
          Resumen general del depósito judicial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardDescription>Total Vehículos</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : stats.totalVehicles}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Vehículos secuestrados registrados</p>
          </CardContent>
        </Card>

        {userRole === "ADMIN" && (
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription>Total Usuarios</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {loading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : stats.totalUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Usuarios del sistema</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-l-4 border-l-primary md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Su Rol</CardDescription>
            <CardTitle className="text-xl font-bold">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {ROLE_LABELS[userRole] || userRole}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {userRole === "ADMIN" && "Acceso total al sistema"}
              {userRole === "OPERATOR" && "Puede cargar y editar vehículos"}
              {userRole === "CONSULTATION" && "Solo lectura"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Conservación breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehículos por Estado de Conservación</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ESTADOS_CONSERVACION.map((estado) => (
                <div
                  key={estado}
                  className={`rounded-lg border p-4 text-center ${ESTADO_COLORS[estado] || "bg-gray-100"}`}
                >
                  <p className="text-2xl font-bold">{stats.byEstado[estado] || 0}</p>
                  <p className="text-xs font-medium mt-1">{estado}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============= VEHICLES VIEW =============
function VehiclesView({ userRole }: { userRole: string }) {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [vehicleForm, setVehicleForm] = useState<VehicleFormData>(emptyVehicleForm);
  const [saving, setSaving] = useState(false);

  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canEdit = userRole === "ADMIN" || userRole === "OPERATOR";
  const canDelete = userRole === "ADMIN";

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });
      if (search) params.set("search", search);
      if (estadoFilter) params.set("estado", estadoFilter);

      const res = await fetch(`/api/vehicles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      toast.error("Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  }, [page, search, estadoFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm(emptyVehicleForm);
    setShowVehicleDialog(true);
  };

  const handleEditVehicle = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      dominio: vehicle.dominio,
      ujInterviene: vehicle.ujInterviene,
      ubicacion: vehicle.ubicacion,
      estadoConservacion: vehicle.estadoConservacion,
    });
    setShowVehicleDialog(true);
  };

  const handleSaveVehicle = async () => {
    if (!vehicleForm.marca || !vehicleForm.modelo || !vehicleForm.dominio ||
        !vehicleForm.ujInterviene || !vehicleForm.ubicacion || !vehicleForm.estadoConservacion) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setSaving(true);
    try {
      if (editingVehicle) {
        const res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleForm),
        });
        if (res.ok) {
          toast.success("Vehículo actualizado correctamente");
        } else {
          const data = await res.json();
          toast.error(data.error || "Error al actualizar vehículo");
        }
      } else {
        const res = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleForm),
        });
        if (res.ok) {
          toast.success("Vehículo creado correctamente");
        } else {
          const data = await res.json();
          toast.error(data.error || "Error al crear vehículo");
        }
      }
      setShowVehicleDialog(false);
      fetchVehicles();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!deleteVehicleId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/vehicles/${deleteVehicleId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Vehículo eliminado correctamente");
        setDeleteVehicleId(null);
        fetchVehicles();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al eliminar vehículo");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setDeleting(false);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vehículos Secuestrados</h2>
          <p className="text-muted-foreground mt-1">
            {total} vehículo{total !== 1 ? "s" : ""} registrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        {canEdit && (
          <Button onClick={handleNewVehicle} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Vehículo
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por dominio, marca o modelo..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-10"
              />
            </div>
            <Select
              value={estadoFilter}
              onValueChange={(v) => { setEstadoFilter(v === "all" ? "" : v); setPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-52 h-10">
                <SelectValue placeholder="Estado conservación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {ESTADOS_CONSERVACION.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search || estadoFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setEstadoFilter(""); setPage(1); }}
                className="h-10"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1">ID <SortIcon column="id" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("marca")}>
                    <div className="flex items-center gap-1">Marca <SortIcon column="marca" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("modelo")}>
                    <div className="flex items-center gap-1">Modelo <SortIcon column="modelo" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("dominio")}>
                    <div className="flex items-center gap-1">Dominio <SortIcon column="dominio" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort("ujInterviene")}>
                    <div className="flex items-center gap-1">UJ Interviene <SortIcon column="ujInterviene" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hidden lg:table-cell" onClick={() => handleSort("ubicacion")}>
                    <div className="flex items-center gap-1">Ubicación <SortIcon column="ubicacion" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("estadoConservacion")}>
                    <div className="flex items-center gap-1">Estado <SortIcon column="estadoConservacion" /></div>
                  </TableHead>
                  {(canEdit || canDelete) && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Cargando vehículos...</p>
                    </TableCell>
                  </TableRow>
                ) : vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground/40" />
                      <p className="text-muted-foreground mt-2">No se encontraron vehículos</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-semibold text-primary">{vehicle.id}</TableCell>
                      <TableCell className="font-medium">{vehicle.marca}</TableCell>
                      <TableCell>{vehicle.modelo}</TableCell>
                      <TableCell className="font-mono font-semibold uppercase">{vehicle.dominio}</TableCell>
                      <TableCell className="hidden md:table-cell">{vehicle.ujInterviene}</TableCell>
                      <TableCell className="hidden lg:table-cell">{vehicle.ubicacion}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${ESTADO_COLORS[vehicle.estadoConservacion] || ""}`}>
                          {vehicle.estadoConservacion}
                        </Badge>
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditVehicle(vehicle)}
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteVehicleId(vehicle.id)}
                                title="Eliminar"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Vehicle Create/Edit Dialog */}
      <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Editar Vehículo" : "Nuevo Vehículo"}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Modifique los datos del vehículo"
                : "Complete los datos del nuevo vehículo"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca *</Label>
                <Input
                  value={vehicleForm.marca}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, marca: e.target.value })}
                  placeholder="Ej: Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo *</Label>
                <Input
                  value={vehicleForm.modelo}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, modelo: e.target.value })}
                  placeholder="Ej: Corolla"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dominio *</Label>
              <Input
                value={vehicleForm.dominio}
                onChange={(e) => setVehicleForm({ ...vehicleForm, dominio: e.target.value.toUpperCase() })}
                placeholder="Ej: ABC123"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label>UJ que Interviene *</Label>
              <Input
                value={vehicleForm.ujInterviene}
                onChange={(e) => setVehicleForm({ ...vehicleForm, ujInterviene: e.target.value })}
                placeholder="Ej: UJ N° 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Ubicación *</Label>
              <Input
                value={vehicleForm.ubicacion}
                onChange={(e) => setVehicleForm({ ...vehicleForm, ubicacion: e.target.value })}
                placeholder="Ej: Playa A - Fila 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado de Conservación *</Label>
              <Select
                value={vehicleForm.estadoConservacion}
                onValueChange={(v) => setVehicleForm({ ...vehicleForm, estadoConservacion: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_CONSERVACION.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVehicleDialog(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVehicle} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingVehicle ? "Guardar Cambios" : "Crear Vehículo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteVehicleId !== null} onOpenChange={() => setDeleteVehicleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============= USERS VIEW =============
function UsersView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>(emptyUserForm);
  const [saving, setSaving] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("No autorizado");
      }
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.documentNumber.includes(searchUser)
  );

  const handleNewUser = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
    setShowUserDialog(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setUserForm({
      fullName: user.fullName,
      documentNumber: user.documentNumber,
      password: "",
      role: user.role,
    });
    setShowUserDialog(true);
  };

  const handleSaveUser = async () => {
    if (!userForm.fullName || !userForm.documentNumber || !userForm.role) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }
    if (!editingUser && !userForm.password) {
      toast.error("La contraseña es obligatoria para nuevos usuarios");
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const body: Record<string, string> = {
          fullName: userForm.fullName,
          documentNumber: userForm.documentNumber,
          role: userForm.role,
        };
        if (userForm.password) body.password = userForm.password;

        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("Usuario actualizado correctamente");
        } else {
          const data = await res.json();
          toast.error(data.error || "Error al actualizar usuario");
        }
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userForm),
        });
        if (res.ok) {
          toast.success("Usuario creado correctamente");
        } else {
          const data = await res.json();
          toast.error(data.error || "Error al crear usuario");
        }
      }
      setShowUserDialog(false);
      fetchUsers();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteUserId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuario eliminado correctamente");
        setDeleteUserId(null);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al eliminar usuario");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
          <p className="text-muted-foreground mt-1">
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleNewUser} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o documento..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Cargando usuarios...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/40" />
                      <p className="text-muted-foreground mt-2">No se encontraron usuarios</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell className="font-mono">{user.documentNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.role === "ADMIN"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : user.role === "OPERATOR"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }
                        >
                          {ROLE_LABELS[user.role] || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("es-AR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteUserId(user.id)}
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Create/Edit Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifique los datos del usuario"
                : "Complete los datos del nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nombre Completo *</Label>
              <Input
                value={userForm.fullName}
                onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Número de Documento *</Label>
              <Input
                value={userForm.documentNumber}
                onChange={(e) => setUserForm({ ...userForm, documentNumber: e.target.value })}
                placeholder="Ej: 12345678"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Contraseña {editingUser ? "(dejar vacío para no cambiar)" : "*"}
              </Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder={editingUser ? "Nueva contraseña" : "Contraseña"}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select
                value={userForm.role}
                onValueChange={(v) => setUserForm({ ...userForm, role: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="OPERATOR">Operador de Carga</SelectItem>
                  <SelectItem value="CONSULTATION">Consulta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingUser ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============= MAIN APP =============
export default function HomePage() {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize seed on first load
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  const userRole = (session?.user as { role: string })?.role || "";
  const isAdmin = userRole === "ADMIN";

  const navItems = [
    { id: "dashboard" as View, label: "Panel Principal", icon: LayoutDashboard },
    { id: "vehicles" as View, label: "Vehículos Secuestrados", icon: Car },
    ...(isAdmin ? [{ id: "users" as View, label: "Gestión de Usuarios", icon: Users }] : []),
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[oklch(0.30_0.08_255)] via-[oklch(0.35_0.10_255)] to-[oklch(0.25_0.06_255)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
          <p className="text-white/70 mt-4">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Shield className="h-6 w-6 hidden sm:block" />
            <h1 className="text-sm md:text-base font-semibold tracking-wide">
              Dpto. Depósitos Judiciales
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
              <div className="text-right">
                <p className="font-medium leading-tight">{session.user?.name}</p>
                <p className="text-xs text-primary-foreground/70">{ROLE_LABELS[userRole]}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8 bg-primary-foreground/20 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-14 md:top-14 z-40 h-[calc(100vh-3.5rem)]
            w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border
            transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="p-4 space-y-1">
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3 px-3">
              Navegación
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer - User Info (mobile) */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-sidebar-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">{session.user?.name}</p>
                <p className="text-xs text-sidebar-foreground/50">{ROLE_LABELS[userRole]}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {currentView === "dashboard" && <DashboardView userRole={userRole} />}
            {currentView === "vehicles" && <VehiclesView userRole={userRole} />}
            {currentView === "users" && isAdmin && <UsersView />}
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t bg-muted/30 px-4 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Derechos Reservados 2026 - Dpto. Depósitos Judiciales - Policía de la Provincia de Córdoba
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
