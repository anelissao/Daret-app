import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 font-sans">
        <Routes>
          <Route path="/" element={<div className="p-10 text-center"><h1 className="text-4xl font-bold gradient-text mb-4">Daret App</h1><p className="text-muted-foreground">Premium Tontine Management</p></div>} />
          {/* Routes will be added here */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
