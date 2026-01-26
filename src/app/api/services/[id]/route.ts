import { NextRequest, NextResponse } from 'next/server';

import { ServiceCreateInput, ServiceRecord } from 'types/service';

import { getCollection } from '../store';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = (await request.json()) as ServiceCreateInput;
    const tenantType = payload?.tenantType === 'tourism' ? 'tourism' : 'hotel';
    const services = getCollection(tenantType);
    const { id } = await context.params;
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updatedService = { ...services[index], ...payload, id } as ServiceRecord;
    services[index] = updatedService;

    return NextResponse.json({ service: updatedService });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const tenantType = request.nextUrl.searchParams.get('tenantType') === 'tourism' ? 'tourism' : 'hotel';
  const services = getCollection(tenantType);
  const { id } = await context.params;
  const index = services.findIndex((service) => service.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  services.splice(index, 1);
  return NextResponse.json({ success: true });
}
