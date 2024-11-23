// Update the status display in the Badge component
<Badge className={getStatusColor(installation.status)}>
  {installation.status === 'needs-recut'
    ? 'Needs Recut'
    : installation.status === 'in-progress'
    ? 'In Progress'
    : 'Completed'}
</Badge>