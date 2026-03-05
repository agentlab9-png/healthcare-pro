export type Role = 'patient' | 'doctor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface Patient extends User {
    role: 'patient';
    mrn?: string;
    age?: number;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: Medication[];
}

export interface Doctor extends User {
    role: 'doctor';
    specialty: string;
    experience?: string;
    rating?: number;
    reviewsCount?: number;
    consultationFee?: number;
    status?: 'active' | 'inactive';
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName?: string;
    patientName?: string;
    date: string;
    time: string;
    type: 'حضوري' | 'استشارة فيديو' | 'صوتي';
    status: 'في الانتظار' | 'مؤكد' | 'مكتمل' | 'ملغي';
    reason?: string;
    notes?: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    instructions: string;
    stock?: number;
    price?: number;
    requiresPrescription?: boolean;
}
