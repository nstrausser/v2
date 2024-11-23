export type Installation = {
  id: string;
  date: string;
  customerName: string;
  vehicleInfo: string;
  installer: {
    id: string;
    name: string;
  };
  status: 'completed' | 'in-progress' | 'needs-recut';
  totalArea: number;
  cuts: Cut[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Cut = {
  id: string;
  installationId: string;
  panelName: string;
  squareFeet: number;
  rollId: string;
  filmType: string;
  status: 'completed' | 'recut' | 'failed';
  recutReason?: string;
  notes?: string;
  createdAt: string;
};

// Rest of the types remain the same...
export type Installer = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: 'Lead' | 'Installer' | 'Training';
  avatar?: string;
  joinedDate: string;
};

export type InstallerStats = {
  totalInstallations: number;
  averageInstallTime: number;
  filmUsage: number;
  revenueGenerated: number;
};

export type PPFRoll = {
  id: string;
  sku: string;
  rollId: string;
  name: string;
  lengthFeet: number;
  widthInches: number;
  price: number;
  category: string;
  manufacturer: string;
};

export type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleInfo: string;
  date: string;
  time: string;
  estimatedDuration: number;
  installerId: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  serviceType: 'Full Body' | 'Partial Body' | 'Custom' | 'Touch Up';
  estimatedSquareFeet: number;
  quotedPrice: number;
  deposit?: number;
  notes?: string;
};