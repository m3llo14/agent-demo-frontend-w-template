import { NextRequest, NextResponse } from 'next/server';
import { Gender } from 'config';
import { CustomerList } from 'types/customer';

// Mock data
const mockCustomers: CustomerList[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    fatherName: 'Robert Doe',
    email: 'john.doe@example.com',
    age: 32,
    gender: Gender.MALE,
    role: 'Developer',
    orders: 12,
    progress: 75,
    status: 1,
    orderStatus: 'Active',
    contact: '+1 234 567 8900',
    country: 'USA',
    location: 'New York',
    about: 'Experienced developer with 5+ years in web development',
    skills: ['React', 'TypeScript', 'Node.js'],
    time: ['9:00 AM', '5:00 PM'],
    date: new Date(),
    avatar: 1
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    fatherName: 'Michael Smith',
    email: 'jane.smith@example.com',
    age: 28,
    gender: Gender.FEMALE,
    role: 'Designer',
    orders: 8,
    progress: 60,
    status: 1,
    orderStatus: 'Active',
    contact: '+1 234 567 8901',
    country: 'Canada',
    location: 'Toronto',
    about: 'Creative designer specializing in UI/UX',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    time: ['10:00 AM', '6:00 PM'],
    date: new Date(),
    avatar: 2
  },
  {
    id: 3,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    fatherName: 'Mehmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    age: 35,
    gender: Gender.MALE,
    role: 'Manager',
    orders: 25,
    progress: 90,
    status: 1,
    orderStatus: 'Active',
    contact: '+90 555 123 4567',
    country: 'Turkey',
    location: 'Istanbul',
    about: 'Project manager with expertise in agile methodologies',
    skills: ['Project Management', 'Agile', 'Scrum'],
    time: ['8:00 AM', '5:00 PM'],
    date: new Date(),
    avatar: 3
  }
];

// GET /api/customers - Tüm müşterileri listele
export async function GET() {
  return NextResponse.json({
    customers: mockCustomers
  });
}

// POST /api/customers - Yeni müşteri oluştur
export async function POST(request: NextRequest) {
  try {
    const newCustomer: CustomerList = await request.json();
    
    // ID'yi otomatik oluştur
    const maxId = Math.max(...mockCustomers.map(c => c.id || 0), 0);
    newCustomer.id = maxId + 1;
    
    // Mock data'ya ekle (gerçek uygulamada veritabanına kaydedilir)
    mockCustomers.push(newCustomer);
    
    return NextResponse.json(
      { customer: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}