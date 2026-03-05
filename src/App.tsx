import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from './components/layout/PatientLayout';
import { DoctorLayout } from './components/layout/DoctorLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { useDataStore } from './store/dataStore';
import { ToastContainer } from './components/ui/Toast';
import { useEffect } from 'react';
import { AuthGuard } from './components/auth/AuthGuard';
import Login from './pages/auth/Login';
import PatientDashboard from './pages/patient/PatientDashboard';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import PharmacyPage from './pages/patient/PharmacyPage';
import RecordsPage from './pages/patient/RecordsPage';
import MedicationSchedulePage from './pages/patient/MedicationSchedulePage';
import PatientProfile from './pages/patient/PatientProfile';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatientProfile from './pages/doctor/DoctorPatientProfile';
import DoctorPatientsList from './pages/doctor/DoctorPatientsList';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPatients from './pages/admin/AdminPatients';

export default function App() {
  const { initializeStore } = useDataStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Patient Routes */}
        <Route
          path="/patient/*"
          element={
            <AuthGuard allowedRoles={['patient']}>
              <PatientLayout>
                <Routes>
                  <Route path="/" element={<PatientDashboard />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/pharmacy" element={<PharmacyPage />} />
                  <Route path="/records" element={<RecordsPage />} />
                  <Route path="/schedule" element={<MedicationSchedulePage />} />
                  <Route path="/profile" element={<PatientProfile />} />
                </Routes>
              </PatientLayout>
            </AuthGuard>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <AuthGuard allowedRoles={['doctor']}>
              <DoctorLayout>
                <Routes>
                  <Route path="/" element={<DoctorDashboard />} />
                  <Route path="/appointments" element={<DoctorAppointments />} />
                  <Route path="/patients" element={<DoctorPatientsList />} />
                  <Route path="/patients/:id" element={<DoctorPatientProfile />} />
                </Routes>
              </DoctorLayout>
            </AuthGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AuthGuard allowedRoles={['admin']}>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/pharmacy" element={<AdminInventory />} />
                  <Route path="/doctors" element={<AdminDoctors />} />
                  <Route path="/patients" element={<AdminPatients />} />
                  <Route path="/reports" element={<div className="p-6 text-center text-[#7A9490]">قريباً - التقارير</div>} />
                  <Route path="/settings" element={<div className="p-6 text-center text-[#7A9490]">قريباً - الإعدادات</div>} />
                </Routes>
              </AdminLayout>
            </AuthGuard>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
