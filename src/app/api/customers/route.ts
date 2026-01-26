import { NextRequest, NextResponse } from 'next/server';
import { CustomerList } from 'types/customer';

// Mock data
const mockCustomers: CustomerList[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 32,
    contact: '+1 234 567 8900',
    avatar: 1
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    age: 28,
    contact: '+1 234 567 8901',
    avatar: 2
  },
  {
    id: 3,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    age: 35,
    contact: '+90 555 123 4567',
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
    const maxId = Math.max(...mockCustomers.map((c) => c.id || 0), 0);
    newCustomer.id = maxId + 1;

    // Mock data'ya ekle (gerçek uygulamada veritabanına kaydedilir)
    mockCustomers.push(newCustomer);

    return NextResponse.json({ customer: newCustomer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
