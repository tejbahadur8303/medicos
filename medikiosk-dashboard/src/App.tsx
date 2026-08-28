import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";

import { Dashboard } from "./pages/Dashboard";
import { PatientQueuePage } from "./pages/PatientQueue";
import { PriorityPatients } from "./pages/PriorityPatients";
import { Patients } from "./pages/Patients";
import { Documents } from "./pages/Documents";
import { HistoryPage } from "./pages/History";
import { Settings } from "./pages/Settings";
import { PatientDetails } from "./pages/PatientDetails";
import { Login } from "./pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("medikiosk_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppShell() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-canvas">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route path="/queue" element={<PatientQueuePage />} />

              <Route path="/priority" element={<PriorityPatients />} />

              <Route path="/patients" element={<Patients />} />

              <Route path="/patients/:patientId" element={<PatientDetails />} />

              <Route path="/documents" element={<Documents />} />

              <Route path="/history" element={<HistoryPage />} />

              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
