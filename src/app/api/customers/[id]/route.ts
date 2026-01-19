import { NextRequest, NextResponse } from 'next/server';
import { CustomerList } from 'types/customer';

// Mock data (gerçek uygulamada bu veritabanından gelir)
// Bu örnek için basitlik adına global bir array kullanıyoruz
// Gerçek uygulamada veritabanı kullanmalısınız
let mockCustomers: CustomerList[] = [
  // ... aynı mock data buraya da eklenebilir veya
  // customers/route.ts'den import edilebilir
];

// GET /api/customers/:id - Tek müşteri getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  // Gerçek uygulamada veritabanından getirilir
  const customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ customer });
}

// PUT /api/customers/:id - Müşteri güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedCustomer: CustomerList = await request.json();
    
    // Gerçek uygulamada veritabanında güncellenir
    const index = mockCustomers.findIndex(c => c.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    mockCustomers[index] = { ...updatedCustomer, id };
    
    return NextResponse.json({ customer: mockCustomers[index] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/customers/:id - Müşteri sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  // Gerçek uygulamada veritabanından silinir
  const index = mockCustomers.findIndex(c => c.id === id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }
  
  mockCustomers.splice(index, 1);
  
  return NextResponse.json(
    { message: 'Customer deleted successfully' },
    { status: 200 }
  );
}