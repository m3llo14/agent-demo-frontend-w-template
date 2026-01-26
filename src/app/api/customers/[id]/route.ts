import { NextRequest, NextResponse } from 'next/server';
import { CustomerList } from 'types/customer';

// Mock data
let mockCustomers: CustomerList[] = [];

// ==============================
// GET /api/customers/:id
// ==============================
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const customerId = Number(id);

  const customer = mockCustomers.find((c) => c.id === customerId);

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  return NextResponse.json({ customer });
}

// ==============================
// PUT /api/customers/:id
// ==============================
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const customerId = Number(id);
    const updatedCustomer: CustomerList = await request.json();

    const index = mockCustomers.findIndex((c) => c.id === customerId);

    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    mockCustomers[index] = { ...updatedCustomer, id: customerId };

    return NextResponse.json({ customer: mockCustomers[index] });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// ==============================
// DELETE /api/customers/:id
// ==============================
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const customerId = Number(id);

  const index = mockCustomers.findIndex((c) => c.id === customerId);

  if (index === -1) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  mockCustomers.splice(index, 1);

  return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
}
