import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { installers } from './AppointmentsView';
import type { Appointment } from '@/types';

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  onSave: (appointment: Appointment) => void;
};

export default function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSave,
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleInfo: '',
    date: '',
    time: '',
    estimatedDuration: '',
    installerId: '',
    serviceType: '',
    estimatedSquareFeet: '',
    quotedPrice: '',
    deposit: '',
    notes: '',
    status: 'scheduled' as Appointment['status'],
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        customerName: appointment.customerName,
        customerPhone: appointment.customerPhone,
        customerEmail: appointment.customerEmail,
        vehicleInfo: appointment.vehicleInfo,
        date: appointment.date,
        time: appointment.time,
        estimatedDuration: appointment.estimatedDuration.toString(),
        installerId: appointment.installerId,
        serviceType: appointment.serviceType,
        estimatedSquareFeet: appointment.estimatedSquareFeet.toString(),
        quotedPrice: appointment.quotedPrice.toString(),
        deposit: appointment.deposit?.toString() || '',
        notes: appointment.notes || '',
        status: appointment.status,
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleInfo: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        estimatedDuration: '480',
        installerId: '',
        serviceType: '',
        estimatedSquareFeet: '',
        quotedPrice: '',
        deposit: '',
        notes: '',
        status: 'scheduled',
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: appointment?.id || Date.now().toString(),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      vehicleInfo: formData.vehicleInfo,
      date: formData.date,
      time: formData.time,
      estimatedDuration: parseInt(formData.estimatedDuration),
      installerId: formData.installerId,
      serviceType: formData.serviceType as Appointment['serviceType'],
      estimatedSquareFeet: parseFloat(formData.estimatedSquareFeet),
      quotedPrice: parseFloat(formData.quotedPrice),
      deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
      notes: formData.notes,
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerPhone: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleInfo">Vehicle Information</Label>
              <Input
                id="vehicleInfo"
                placeholder="Year Make Model"
                value={formData.vehicleInfo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleInfo: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">
                Duration (minutes)
              </Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="0"
                step="30"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDuration: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installer">Installer</Label>
              <Select
                value={formData.installerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, installerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select installer" />
                </SelectTrigger>
                <SelectContent>
                  {installers.map((installer) => (
                    <SelectItem key={installer.id} value={installer.id}>
                      {installer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Appointment['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Body">Full Body</SelectItem>
                  <SelectItem value="Partial Body">
                    Partial Body
                  </SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                  <SelectItem value="Touch Up">Touch Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedSquareFeet">
                Estimated Sq. Ft.
              </Label>
              <Input
                id="estimatedSquareFeet"
                type="number"
                min="0"
                step="0.1"
                value={formData.estimatedSquareFeet}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedSquareFeet: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotedPrice">Quoted Price</Label>
              <Input
                id="quotedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.quotedPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quotedPrice: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit Amount</Label>
              <Input
                id="deposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({ ...formData, deposit: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about the appointment..."
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {appointment ? 'Update Appointment' : 'Schedule Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}