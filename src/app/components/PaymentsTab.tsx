import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { DollarSign, Plus, Trash2, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export interface Payment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  amount: number;
  healthInsurance: string;
  paymentMethod: "efectivo" | "transferencia" | "debito" | "credito";
  notes: string;
  registered: boolean;
}

interface PaymentsTabProps {
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, "id">) => void;
  onDeletePayment: (id: string) => void;
  onToggleRegistered: (id: string) => void;
}

export function PaymentsTab({ payments, onAddPayment, onDeletePayment, onToggleRegistered }: PaymentsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "registered">("all");
  const [newPayment, setNewPayment] = useState({
    patientName: "",
    date: new Date(),
    time: "",
    amount: "",
    healthInsurance: "",
    paymentMethod: "efectivo" as const,
    notes: "",
    registered: false
  });

  const handleAddPayment = () => {
    if (!newPayment.patientName || !newPayment.amount || !newPayment.time) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    onAddPayment({
      ...newPayment,
      amount: parseFloat(newPayment.amount)
    });

    setNewPayment({
      patientName: "",
      date: new Date(),
      time: "",
      amount: "",
      healthInsurance: "",
      paymentMethod: "efectivo",
      notes: "",
      registered: false
    });
    setIsDialogOpen(false);
    toast.success("Cobro registrado exitosamente");
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === "pending") return !payment.registered;
    if (filterStatus === "registered") return payment.registered;
    return true;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => !p.registered).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Cobros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString("es-AR")}</div>
            <p className="text-xs text-gray-500 mt-1">
              {filteredPayments.length} {filteredPayments.length === 1 ? "registro" : "registros"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes de Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${pendingAmount.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => !p.registered).length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${payments.filter(p => p.registered).reduce((sum, p) => sum + p.amount, 0).toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => p.registered).length} registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Registro de Cobros
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cobro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Cobro</DialogTitle>
                  <DialogDescription>
                    Complete los datos del cobro
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Paciente *</Label>
                    <Input
                      id="patient"
                      value={newPayment.patientName}
                      onChange={(e) => setNewPayment({ ...newPayment, patientName: e.target.value })}
                      placeholder="Nombre del paciente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={format(newPayment.date, "yyyy-MM-dd")}
                        onChange={(e) => setNewPayment({ ...newPayment, date: new Date(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Hora *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newPayment.time}
                        onChange={(e) => setNewPayment({ ...newPayment, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="healthInsurance">Obra Social</Label>
                    <Input
                      id="healthInsurance"
                      value={newPayment.healthInsurance}
                      onChange={(e) => setNewPayment({ ...newPayment, healthInsurance: e.target.value })}
                      placeholder="Ej: OSDE, Particular"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select
                      value={newPayment.paymentMethod}
                      onValueChange={(value: any) => setNewPayment({ ...newPayment, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="debito">Débito</SelectItem>
                        <SelectItem value="credito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Input
                      id="notes"
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPayment}>
                    Guardar Cobro
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los cobros</SelectItem>
                <SelectItem value="pending">Pendientes de registro</SelectItem>
                <SelectItem value="registered">Registrados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay cobros registrados</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Obra Social</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(payment.date, "dd/MM/yyyy", { locale: es })} {payment.time}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{payment.patientName}</TableCell>
                      <TableCell>{payment.healthInsurance || "-"}</TableCell>
                      <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${payment.amount.toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={payment.registered ? "outline" : "default"}
                          onClick={() => {
                            onToggleRegistered(payment.id);
                            toast.success(payment.registered ? "Marcado como pendiente" : "Marcado como registrado");
                          }}
                          className={payment.registered ? "text-green-600 border-green-600" : ""}
                        >
                          {payment.registered ? "Registrado" : "Pendiente"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onDeletePayment(payment.id);
                            toast.success("Cobro eliminado");
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
