export interface User {
  id: string;
  email: string;
  role: 'patient' | 'clinic' | 'doctor';
  name: string;
  profilePicture?: string;
}

export interface Patient extends User {
  role: 'patient';
  phone: string;
  dateOfBirth: string;
  address: string;
}

export interface Clinic extends User {
  role: 'clinic';
  clinicName: string;
  address: string;
  phone: string;
  description: string;
  services: string[];
  operatingHours: string;
  bookingPolicy: string;
  paymentRequired: boolean;
}

export interface Doctor extends User {
  role: 'doctor';
  clinicId: string;
  specialization: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reason: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentAmount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}