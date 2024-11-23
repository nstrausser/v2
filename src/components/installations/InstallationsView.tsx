import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import InstallationDialog from './InstallationDialog';
import type { Installation } from '@/types';

// Mock data
const mockInstallations: Installation[] = [
  {
    id: '1',
    date: '2024-03-15',
    customerName: 'John Doe',
    vehicleInfo: '2023 Tesla Model 3',
    installer: {
      id: '1',
      name: 'Matt Anderson',
    },
    status: 'completed',
    totalArea: 125.5,
    cuts: [
      {
        id: 'c1',
        installationId: '1',
        panelName: 'Hood',
        squareFeet: 15.5,
        rollId: 'R123456',
        filmType: 'XPEL Ultimate Plus',
        status: 'completed',
        createdAt: '2024-03-15T09:00:00Z',
      },
      {
        id: 'c2',
        installationId: '1',
        panelName: 'Front Bumper',
        squareFeet: 12.0,
        rollId: 'R123457',
        filmType: 'XPEL Ultimate Plus',
        status: 'completed',
        createdAt: '2024-03-15T09:30:00Z',
      },
    ],
    notes: 'Clean installation, customer very satisfied',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
  },
  {
    id: '2',
    date: '2024-03-14',
    customerName: 'Alice Smith',
    vehicleInfo: '2024 BMW M4',
    installer: {
      id: '2',
      name: 'Sarah Johnson',
    },
    status: 'needs-recut',
    totalArea: 165.2,
    cuts: [
      {
        id: 'c3',
        installationId: '2',
        panelName: 'Hood',
        squareFeet: 16.0,
        rollId: 'R123458',
        filmType: 'XPEL Ultimate Plus',
        status: 'recut',
        recutReason: 'Debris under film',
        createdAt: '2024-03-14T10:00:00Z',
      },
    ],
    notes: 'Hood needs recut due to contamination',
    createdAt: '2024-03-14T10:00:00Z',
    updatedAt: '2024-03-14T16:00:00Z',
  },
  {
    id: '3',
    date: '2024-03-14',
    customerName: 'Bob Wilson',
    vehicleInfo: '2023 Porsche 911',
    installer: {
      id: '1',
      name: 'Matt Anderson',
    },
    status: 'in-progress',
    totalArea: 185.8,
    cuts: [
      {
        id: 'c4',
        installationId: '3',
        panelName: 'Full Front',
        squareFeet: 45.0,
        rollId: 'R123459',
        filmType: 'XPEL Ultimate Plus',
        status: 'completed',
        createdAt: '2024-03-14T13:00:00Z',
      },
    ],
    notes: 'Complex curves, taking extra time for precision',
    createdAt: '2024-03-14T13:00:00Z',
    updatedAt: '2024-03-14T17:00:00Z',
  },
];

const getStatusBadgeVariant = (status: Installation['status']) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'secondary';
    case 'needs-recut':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function InstallationsView() {
  const [installations, setInstallations] = useState<Installation[]>(mockInstallations);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInstallations = installations.filter(
    (installation) =>
      (filterStatus === 'all' || installation.status === filterStatus) &&
      (installation.customerName.toLowerCase().includes(search.toLowerCase()) ||
        installation.vehicleInfo.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (installation: Installation) => {
    if (selectedInstallation) {
      setInstallations(installations.map(inst => 
        inst.id === installation.id ? installation : inst
      ));
    } else {
      setInstallations([installation, ...installations]);
    }
    setIsDialogOpen(false);
    setSelectedInstallation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installations</h1>
          <p className="text-muted-foreground">
            Track and manage PPF installations
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Installation
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search installations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="needs-recut">Needs Recut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Installer</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cuts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstallations.map((installation) => (
              <TableRow
                key={installation.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedInstallation(installation);
                  setIsDialogOpen(true);
                }}
              >
                <TableCell>
                  {new Date(installation.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{installation.customerName}</TableCell>
                <TableCell>{installation.vehicleInfo}</TableCell>
                <TableCell>{installation.installer.name}</TableCell>
                <TableCell>{installation.totalArea.toFixed(1)} ft²</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(installation.status)}>
                    {installation.status === 'needs-recut'
                      ? 'Needs Recut'
                      : installation.status === 'in-progress'
                      ? 'In Progress'
                      : 'Completed'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {installation.cuts.length} cut{installation.cuts.length !== 1 ? 's' : ''}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InstallationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        installation={selectedInstallation}
        onSave={handleSave}
      />
    </div>
  );
}