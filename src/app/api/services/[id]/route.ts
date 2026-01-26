import { NextRequest, NextResponse } from 'next/server';

import { ServiceCreateInput, ServiceRecord, TenantType } from 'types/service';

import { getCollection } from '../store';

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const payload = (await request.json()) as ServiceCreateInput;
    const tenantType = payload?.tenantType === 'tourism' ? 'tourism' : 'hotel';
    const services = getCollection(tenantType);
    const index = services.findIndex((service) => service.id === context.params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updatedService = { ...services[index], ...payload, id: context.params.id } as ServiceRecord;
    services[index] = updatedService;

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const tenantType = request.nextUrl.searchParams.get('tenantType') === 'tourism' ? 'tourism' : 'hotel';
  const services = getCollection(tenantType);
  const index = services.findIndex((service) => service.id === context.params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  services.splice(index, 1);
  return NextResponse.json({ success: true });
}

