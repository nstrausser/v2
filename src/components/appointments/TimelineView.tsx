// Previous imports remain the same...

function AppointmentCard({ 
  appointment,
  onClick,
  daysSpan,
  startColumn,
}: { 
  appointment: Appointment;
  onClick: () => void;
  daysSpan: number;
  startColumn: number;
}) {
  const parts = appointment.vehicleInfo.split(' - ');
  const customer = parts[0];
  const vehicle = parts[1];
  const service = parts[2];

  return (
    <div
      className={cn(
        "absolute inset-y-0 h-[calc(100%-12px)] px-3 py-2 mx-1 my-1.5",
        "text-sm font-medium bg-white dark:bg-white/5 border rounded-md cursor-pointer",
        "hover:bg-accent hover:border-primary/20 dark:hover:bg-accent/10",
        "transition-all duration-200 shadow-sm",
        "flex flex-col justify-center"
      )}
      onClick={onClick}
      style={{
        left: `${(startColumn - 1) * 100}%`,
        width: `${daysSpan * 100 - 1}%`,
        zIndex: 10,
      }}
    >
      <div className="font-semibold truncate">
        {customer}
      </div>
      <div className="truncate text-muted-foreground text-xs">
        {vehicle} - {service}
      </div>
    </div>
  );
}

export default function TimelineView({
  appointments,
  onAppointmentClick,
  selectedInstallerId,
}: TimelineViewProps) {
  // Previous code remains the same...

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
      <div className="bg-primary/5 dark:bg-primary/10 p-3 text-center font-semibold border-b text-lg">
        PPF DAILY OBJECTIVES
      </div>
      
      <div className="grid grid-cols-6 divide-x divide-border border-b bg-secondary/50 dark:bg-secondary/20">
        <div className="p-3 font-medium">BOOKING STATUS:</div>
        {dates.map((date) => (
          <div key={date.toISOString()} className="p-3 text-center">
            <div className="font-medium">{format(date, 'EEEE').toUpperCase()}</div>
            <div className="text-sm text-muted-foreground">{format(date, 'M/d')}</div>
          </div>
        ))}
      </div>

      <div className="divide-y divide-border">
        {appointmentsByInstaller.map((installer) => (
          <div 
            key={installer.id} 
            className={cn(
              "grid grid-cols-6 divide-x divide-border min-h-[100px]",
              installerColors[installer.id as keyof typeof installerColors]
            )}
          >
            <div className="p-3 font-medium">
              {installer.name.toUpperCase()}
            </div>
            <div className="col-span-5 relative min-h-[100px]">
              {installer.appointments.map((appointment) => {
                const aptDate = parseISO(appointment.date);
                const daysSpan = Math.ceil(appointment.estimatedDuration / 480);
                
                const startColumn = dates.findIndex(date => 
                  isSameDay(date, aptDate)
                ) + 1;

                if (startColumn > 0) {
                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => onAppointmentClick(appointment)}
                      daysSpan={Math.min(daysSpan, 6 - startColumn)}
                      startColumn={startColumn}
                    />
                  );
                }
                return null;
              })}
              {installer.id === '1' && isSameDay(dates[0], today) && (
                <div className="absolute inset-0 flex items-center justify-center text-xl font-medium text-muted-foreground">
                  OFF
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}