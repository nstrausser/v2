import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Scan, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Installation, Cut } from '@/types';

type InstallationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installation?: Installation | null;
  onSave: (installation: Installation) => void;
};

const commonPanels = [
  { name: 'Hood', avgArea: 15.5 },
  { name: 'Front Bumper', avgArea: 12.0 },
  { name: 'Rear Bumper', avgArea: 11.5 },
  { name: 'Front Fenders', avgArea: 8.0 },
  { name: 'Doors', avgArea: 10.0 },
  { name: 'Mirrors', avgArea: 2.5 },
  { name: 'Rockers', avgArea: 6.0 },
  { name: 'Trunk', avgArea: 12.0 },
];

export default function InstallationDialog({
  open,
  onOpenChange,
  installation,
  onSave,
}: InstallationDialogProps) {
  const [formData, setFormData] = useState({
    customerName: installation?.customerName || '',
    vehicleInfo: installation?.vehicleInfo || '',
    date: installation?.date || new Date().toISOString().split('T')[0],
    installer: installation?.installer || { id: '', name: '' },
    cuts: installation?.cuts || [],
    notes: installation?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [showAddedAnimation, setShowAddedAnimation] = useState<number>(-1);

  const cutsByPanel = formData.cuts.reduce((acc, cut) => {
    if (!acc[cut.panelName]) {
      acc[cut.panelName] = [];
    }
    acc[cut.panelName].push(cut);
    return acc;
  }, {} as Record<string, Cut[]>);

  const addCut = (panelName?: string, defaultArea?: number) => {
    const newCut: Cut = {
      id: Math.random().toString(36).substr(2, 9),
      installationId: installation?.id || '',
      panelName: panelName || '',
      squareFeet: defaultArea || 0,
      rollId: '',
      filmType: '',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setFormData((prev) => ({
      ...prev,
      cuts: [...prev.cuts, newCut],
    }));

    if (panelName) {
      setExpandedPanels((prev) => 
        prev.includes(panelName) ? prev : [...prev, panelName]
      );
    }

    setShowAddedAnimation(formData.cuts.length);
    setTimeout(() => setShowAddedAnimation(-1), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.customerName) errors.customerName = 'Required';
    if (!formData.vehicleInfo) errors.vehicleInfo = 'Required';
    if (!formData.installer.id) errors.installer = 'Required';
    if (formData.cuts.length === 0) errors.cuts = 'At least one cut is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const totalArea = formData.cuts.reduce((sum, cut) => sum + cut.squareFeet, 0);

    onSave({
      id: installation?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
      status: installation?.status || 'in-progress',
      totalArea,
      createdAt: installation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px]">
        <DialogHeader>
          <DialogTitle>
            {installation ? 'Edit Installation' : 'New Installation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  error={errors.customerName}
                />
              </div>

              <div>
                <Label htmlFor="vehicleInfo">Vehicle Information</Label>
                <Input
                  id="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleInfo: e.target.value })
                  }
                  error={errors.vehicleInfo}
                />
              </div>

              <div>
                <Label htmlFor="date">Installation Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="installer">Installer</Label>
                <Select
                  value={formData.installer.id}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      installer: {
                        id: value,
                        name: value === '1' ? 'Matt Anderson' : 'Sarah Johnson',
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select installer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Matt Anderson</SelectItem>
                    <SelectItem value="2">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="h-[calc(100%-2rem)]"
                placeholder="Additional notes about the installation..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Installation Cuts</h3>
                <p className="text-sm text-muted-foreground">
                  Record cuts and material usage
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCut()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Cut
                </Button>
                <Button type="button" onClick={() => addCut()}>
                  <Scan className="mr-2 h-4 w-4" />
                  Scan New Cut
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quick Add Common Panels</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonPanels.slice(0, Math.ceil(commonPanels.length / 2)).map((panel) => (
                    <Button
                      key={panel.name}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => addCut(panel.name, panel.avgArea)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{panel.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Typical area: {panel.avgArea} ft²
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Panels</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonPanels.slice(Math.ceil(commonPanels.length / 2)).map((panel) => (
                    <Button
                      key={panel.name}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => addCut(panel.name, panel.avgArea)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{panel.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Typical area: {panel.avgArea} ft²
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <Accordion
                type="multiple"
                value={expandedPanels}
                onValueChange={setExpandedPanels}
                className="space-y-4"
              >
                {Object.entries(cutsByPanel).map(([panel, cuts]) => (
                  <AccordionItem
                    key={panel}
                    value={panel}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 hover:bg-accent/50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold">{panel}</span>
                          <Badge variant="secondary">
                            {cuts.length} cut{cuts.length !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Total: {cuts.reduce((sum, cut) => sum + cut.squareFeet, 0).toFixed(1)} ft²
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {cuts.some(cut => cut.status === 'recut' || cut.status === 'failed') && (
                            <Badge variant="destructive" className="mr-2">
                              Needs Attention
                            </Badge>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addCut(panel);
                            }}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add to {panel}
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="divide-y">
                        {cuts.map((cut, index) => {
                          const globalIndex = formData.cuts.findIndex(c => c.id === cut.id);
                          return (
                            <div
                              key={cut.id}
                              className={cn(
                                "p-4 space-y-4",
                                showAddedAnimation === globalIndex && "animate-in fade-in-0 slide-in-from-top-4"
                              )}
                            >
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label>Roll ID</Label>
                                  <div className="flex space-x-2">
                                    <Input
                                      value={cut.rollId}
                                      onChange={(e) => {
                                        const newCuts = [...formData.cuts];
                                        newCuts[globalIndex] = {
                                          ...cut,
                                          rollId: e.target.value,
                                        };
                                        setFormData({ ...formData, cuts: newCuts });
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        // Simulate scanning
                                        const newCuts = [...formData.cuts];
                                        newCuts[globalIndex] = {
                                          ...cut,
                                          rollId: `R${Math.random().toString().slice(2, 8)}`,
                                        };
                                        setFormData({ ...formData, cuts: newCuts });
                                      }}
                                    >
                                      <Scan className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <Label>Area (ft²)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={cut.squareFeet}
                                    onChange={(e) => {
                                      const newCuts = [...formData.cuts];
                                      newCuts[globalIndex] = {
                                        ...cut,
                                        squareFeet: parseFloat(e.target.value) || 0,
                                      };
                                      setFormData({ ...formData, cuts: newCuts });
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select
                                    value={cut.status}
                                    onValueChange={(value: Cut['status']) => {
                                      const newCuts = [...formData.cuts];
                                      newCuts[globalIndex] = {
                                        ...cut,
                                        status: value,
                                      };
                                      setFormData({ ...formData, cuts: newCuts });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="recut">Needs Recut</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {(cut.status === 'recut' || cut.status === 'failed') && (
                                <div>
                                  <Label>Reason</Label>
                                  <Input
                                    value={cut.recutReason || ''}
                                    onChange={(e) => {
                                      const newCuts = [...formData.cuts];
                                      newCuts[globalIndex] = {
                                        ...cut,
                                        recutReason: e.target.value,
                                      };
                                      setFormData({ ...formData, cuts: newCuts });
                                    }}
                                    placeholder="Reason for recut..."
                                  />
                                </div>
                              )}

                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => {
                                    const newCuts = formData.cuts.filter(c => c.id !== cut.id);
                                    setFormData({ ...formData, cuts: newCuts });
                                  }}
                                >
                                  Remove Cut
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {formData.cuts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-4">
                    <Scissors className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">No Cuts Added Yet</h4>
                  <p className="text-sm">
                    Add cuts using the quick add buttons above or create a custom cut
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="submit">
              {installation ? 'Update Installation' : 'Create Installation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}