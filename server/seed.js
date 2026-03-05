const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    // Skip seed if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
        console.log('Database already seeded, skipping.');
        return;
    }

    console.log('Seeding data...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 2. Create Admin
    await prisma.user.create({
        data: {
            name: 'المسؤول الرئيسي',
            email: 'admin@healthcare.com',
            password: hashedPassword,
            role: 'admin'
        }
    });

    // 3. Create Doctors
    const doc1 = await prisma.user.create({
        data: {
            name: 'د. سارة خالد',
            email: 'sara@sop.com',
            password: hashedPassword,
            role: 'doctor',
            doctor: {
                create: {
                    specialty: 'استشاري أمراض باطنية',
                    rating: 4.8,
                    reviewsCount: 156,
                    status: 'active'
                }
            }
        },
        include: { doctor: true }
    });

    const doc2 = await prisma.user.create({
        data: {
            name: 'د. يوسف الشمري',
            email: 'yousef@sop.com',
            password: hashedPassword,
            role: 'doctor',
            doctor: {
                create: {
                    specialty: 'أخصائي قلب',
                    rating: 4.9,
                    reviewsCount: 89,
                    status: 'active'
                }
            }
        },
        include: { doctor: true }
    });

    // 4. Create Patient
    const pat1 = await prisma.user.create({
        data: {
            name: 'أحمد محمود',
            email: 'ahmed@sop.com',
            password: hashedPassword,
            role: 'patient',
            patient: {
                create: {
                    mrn: 'MRN-10294',
                    age: 45,
                    bloodType: 'O+',
                    chronicConditions: JSON.stringify(['السكري', 'ضغط الدم']),
                    allergies: JSON.stringify(['بنسلين'])
                }
            }
        },
        include: { patient: true }
    });

    // 5. Create Medications
    await prisma.medication.createMany({
        data: [
            { name: 'ميتفورمين 500mg', dosage: '500mg', instructions: 'حبة واحدة بعد الأكل (مرتين يومياً)', stock: 120, price: 25, requiresPrescription: true },
            { name: 'بانادول إكسترا 500mg', dosage: '500mg', instructions: 'حبة واحدة عند اللزوم', stock: 350, price: 15, requiresPrescription: false },
            { name: 'أملوديبين 5mg', dosage: '5mg', instructions: 'حبة واحدة مساءً', stock: 5, price: 32, requiresPrescription: true },
        ]
    });

    // 6. Create Appointments
    await prisma.appointment.create({
        data: {
            patientId: pat1.patient.id,
            doctorId: doc1.doctor.id,
            date: '2026-03-06',
            time: '10:00 ص',
            type: 'حضوري',
            status: 'مؤكد',
            reason: 'متابعة دورية للسكري'
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
