import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    type Appointment,
    type Medication,
    type Doctor,
    type Patient
} from '../types';
import { API_URL } from '../config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    date: string;
    title: string;
    type: 'report' | 'lab';
    content: string;
    status?: string;
    color?: string;
}

interface DataState {
    appointments: Appointment[];
    medications: Medication[];
    doctors: Doctor[];
    patients: Patient[];
    records: MedicalRecord[];
    doctorApplications: {
        id: string;
        name: string;
        specialty: string;
        experience: string;
        date: string;
    }[];
    systemAlerts: {
        id: string;
        type: 'warning' | 'error' | 'info' | 'success';
        message: string;
        date?: string;
    }[];

    // Appointment Actions
    addAppointment: (appointment: Appointment) => void;
    cancelAppointment: (id: string) => void;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

    // Medication Actions
    addMedication: (medication: Medication) => void;
    updateMedication: (id: string, updates: Partial<Medication>) => void;
    deleteMedication: (id: string) => void;

    // User Actions
    addDoctor: (doctor: Doctor) => Promise<void>;
    updateDoctorStatus: (id: string, status: string) => Promise<void>;
    addPatient: (patient: Patient) => void;
    addRecord: (record: MedicalRecord) => Promise<void>;
    approveDoctor: (id: string) => void;

    // System Alerts Actions
    addSystemAlert: (alert: Omit<DataState['systemAlerts'][0], 'id'>) => void;
    removeSystemAlert: (id: string) => void;

    // API Actions
    initializeStore: () => Promise<void>;
}

export const useDataStore = create<DataState>()(
    persist(
        (set) => ({
            appointments: [],
            medications: [],
            doctors: [],
            patients: [],
            records: [],
            doctorApplications: [
                { id: 'APP-001', name: 'د. يوسف الشمري', specialty: 'استشاري قلب', experience: '15 سنة', date: 'منذ ساعتين' },
                { id: 'APP-002', name: 'د. ليلى حسن', specialty: 'أخصائية جلدية', experience: '8 سنوات', date: 'أمس' },
            ],
            systemAlerts: [],

            addAppointment: async (app: Appointment) => {
                try {
                    const response = await fetch(`${API_URL}/appointments`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(app)
                    });
                    if (response.ok) {
                        const newApp = await response.json();
                        set((state) => ({ appointments: [...state.appointments, newApp] }));
                    }
                } catch (error) {
                    console.error('Failed to add appointment:', error);
                }
            },
            cancelAppointment: async (id: string) => {
                try {
                    const response = await fetch(`${API_URL}/appointments/${id}`, {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ status: 'ملغي' })
                    });
                    if (response.ok) {
                        set((state) => ({
                            appointments: state.appointments.map(a => a.id === id ? { ...a, status: 'ملغي' } : a)
                        }));
                    }
                } catch (error) {
                    console.error('Failed to cancel appointment:', error);
                }
            },
            updateAppointmentStatus: (id: string, status: Appointment['status']) => set((state) => ({
                appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
            })),

            addMedication: async (med: Medication) => {
                try {
                    const response = await fetch(`${API_URL}/medications`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(med)
                    });
                    if (response.ok) {
                        const newMed = await response.json();
                        set((state) => ({ medications: [...state.medications, newMed] }));
                    }
                } catch (error) {
                    console.error('Failed to add medication:', error);
                }
            },
            updateMedication: async (id: string, updates: Partial<Medication>) => {
                // Optimistic update
                set((state) => ({
                    medications: state.medications.map(m => m.id === id ? { ...m, ...updates } : m)
                }));
                try {
                    await fetch(`${API_URL}/medications/${id}`, {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(updates)
                    });
                } catch (error) {
                    console.error('Failed to update medication:', error);
                }
            },
            deleteMedication: async (mid) => {
                try {
                    const response = await fetch(`${API_URL}/medications/${mid}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });
                    if (response.ok) {
                        set((state) => ({
                            medications: state.medications.filter(m => m.id !== mid)
                        }));
                    }
                } catch (error) {
                    console.error('Failed to delete medication:', error);
                }
            },

            addDoctor: async (doc: Doctor) => {
                try {
                    const response = await fetch(`${API_URL}/doctors`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(doc)
                    });
                    if (response.ok) {
                        const newDoc = await response.json();
                        set((state) => ({ doctors: [...state.doctors, newDoc] }));
                    }
                } catch (error) {
                    console.error('Failed to add doctor:', error);
                }
            },
            updateDoctorStatus: async (did, status) => {
                set((state) => ({
                    doctors: state.doctors.map(d => d.id === did ? { ...d, status: status as 'active' | 'inactive' } : d)
                }));
                try {
                    await fetch(`${API_URL}/doctors/${did}/status`, {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ status })
                    });
                } catch (error) {
                    console.error('Failed to update doctor status:', error);
                }
            },
            addPatient: (pat: Patient) => set((state) => ({ patients: [...state.patients, pat] })),
            addRecord: async (record: MedicalRecord) => {
                set((state) => ({ records: [record, ...state.records] }));
                try {
                    await fetch(`${API_URL}/records`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(record)
                    });
                } catch (error) {
                    console.error('Failed to save record:', error);
                }
            },
            approveDoctor: (aid) => set((state) => {
                const app = state.doctorApplications.find(a => a.id === aid);
                if (!app) return state;
                const newDoctor: Doctor = {
                    id: `DOC-${Date.now()}`,
                    name: app.name,
                    specialty: app.specialty,
                    rating: 0,
                    role: 'doctor',
                    email: `dr.${app.name.split(' ').join('.')}@healthcare.com`,
                    status: 'active'
                };
                return {
                    doctors: [...state.doctors, newDoctor],
                    doctorApplications: state.doctorApplications.filter(a => a.id !== aid)
                };
            }),

            addSystemAlert: (alert) => set((state) => ({
                systemAlerts: [...state.systemAlerts, { ...alert, id: Math.random().toString(36).substring(2, 11) }]
            })),
            removeSystemAlert: (id: string) => set((state) => ({
                systemAlerts: state.systemAlerts.filter(alert => alert.id !== id)
            })),

            initializeStore: async () => {
                try {
                    const headers = getAuthHeaders();
                    const [docsRes, medsRes, appsRes, patsRes, recsRes] = await Promise.all([
                        fetch(`${API_URL}/doctors`, { headers }),
                        fetch(`${API_URL}/medications`, { headers }),
                        fetch(`${API_URL}/appointments`, { headers }),
                        fetch(`${API_URL}/patients`, { headers }),
                        fetch(`${API_URL}/records`, { headers })
                    ]);

                    if (!docsRes.ok || !medsRes.ok || !appsRes.ok || !patsRes.ok || !recsRes.ok) {
                        throw new Error('Failed to fetch data');
                    }

                    const doctors = await docsRes.json();
                    const medications = await medsRes.json();
                    const appointments = await appsRes.json();
                    const patients = await patsRes.json();
                    const records = await recsRes.json();
                    set({ doctors, medications, appointments, patients, records });
                } catch (error) {
                    console.error('Failed to initialize store:', error);
                }
            }
        }),
        {
            name: 'healthcare-data',
        }
    )
);
