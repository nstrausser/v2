import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, TrendingUp, Ruler, DollarSign } from 'lucide-react';
import type { Installer, InstallerStats, InstallationRecord } from '@/types';

// Mock installation records
const mockInstallations: Record<string, InstallationRecord[]> = {
  '1': [
    {
      id: '1',
      installerId: '1',
      date: '2024-01-15',
      vehicleType: '2023 Tesla Model 3',
      filmUsed: 125.5,
      timeSpent: 480,
      customerSatisfaction: 5,
      notes: 'Perfect installation, customer very happy',
      rollIds: ['R123456', 'R123457'],
    },
    {
      id: '2',
      installerId: '1',
      date: '2024-01-14',
      vehicleType: '2024 Porsche 911',
      filmUsed: 185.8,
      timeSpent: 540,
      customerSatisfaction: 5,
      notes: 'Complex curves handled well',
      rollIds: ['R123458', 'R123459'],
    },
  ],
};

type InstallerProfileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installer: Installer;
  stats: InstallerStats;
};

export default function InstallerProfile({
  open,
  onOpenChange,
  installer,
  stats,
}: InstallerProfileProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const installations = mockInstallations[installer.id] || [];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateEfficiency = (avgTime: number) => {
    const standardTime = 480;
    const efficiency =
      ((standardTime - (avgTime - standardTime)) / standardTime) * 100;
    return Math.min(Math.max(efficiency, 0), 100);
  };

  const efficiency = calculateEfficiency(stats.averageInstallTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Installer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {installer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{installer.name}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{installer.role}</Badge>
                <span className="text-sm text-muted-foreground">
                  Since {new Date(installer.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Efficiency Rating
                </div>
                <Progress value={efficiency} className="h-2" />
                <span className="text-2xl font-bold">
                  {efficiency.toFixed(1)}%
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Average Installation Time
                </div>
                <span className="text-2xl font-bold">
                  {formatTime(stats.averageInstallTime)}
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Ruler className="mr-2 h-4 w-4" />
                  Total Film Usage
                </div>
                <span className="text-2xl font-bold">
                  {stats.filmUsage.toLocaleString()} ft²
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Revenue Generated
                </div>
                <span className="text-2xl font-bold">
                  ${stats.revenueGenerated.toLocaleString()}
                </span>
              </div>
            </Card>
          </div>

          {/* Recent Installations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Recent Installations
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Film Used</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Satisfaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installations.map((installation) => (
                    <TableRow key={installation.id}>
                      <TableCell>
                        {new Date(
                          installation.date
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{installation.vehicleType}</TableCell>
                      <TableCell>
                        {installation.filmUsed.toFixed(1)} ft²
                      </TableCell>
                      <TableCell>
                        {formatTime(installation.timeSpent)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={
                              installation.customerSatisfaction >= 4
                                ? 'text-green-600 dark:text-green-500'
                                : installation.customerSatisfaction >= 3
                                ? 'text-yellow-600 dark:text-yellow-500'
                                : 'text-red-600 dark:text-red-500'
                            }
                          >
                            {installation.customerSatisfaction}/5
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}