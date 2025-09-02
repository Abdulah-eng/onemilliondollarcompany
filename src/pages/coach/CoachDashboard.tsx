// src/pages/coach/CoachDashboard.tsx

const CoachDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Coach Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-foreground mb-2">Your Clients</h3>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-foreground mb-2">Programs</h3>
          <p className="text-muted-foreground">Create and manage training programs</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
          <p className="text-muted-foreground">Track client progress and engagement</p>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;