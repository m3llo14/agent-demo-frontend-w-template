import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axios from 'axios';

// types
import { ServiceCreateInput, ServiceListResponse, ServiceRecord, TenantType } from 'types/service';

const endpoints = {
  key: '/api/services'
};

const buildKey = (tenantType: TenantType) => `${endpoints.key}?tenantType=${tenantType}`;

const sameOriginConfig = { baseURL: '' };
const publicApi = axios.create(sameOriginConfig);

const fetcherServices = async (url: string) => {
  const res = await publicApi.get(url);
  return res.data;
};

export function useGetServices(tenantType: TenantType) {
  const { data, isLoading, error, isValidating } = useSWR<ServiceListResponse>(buildKey(tenantType), fetcherServices, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      services: data?.services as ServiceRecord[],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.services?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertService(newService: ServiceCreateInput) {
  const tempId = `temp-${Date.now()}`;
  const listKey = buildKey(newService.tenantType);

  mutate(
    listKey,
    (currentData: ServiceListResponse | undefined) => {
      const currentServices = currentData?.services || [];
      const addedService = { ...newService, id: tempId } as ServiceRecord;
      return {
        ...currentData,
        services: [...currentServices, addedService]
      };
    },
    false
  );

  try {
    const response = await publicApi.post(endpoints.key, newService);
    const createdService = response.data.service as ServiceRecord;

    mutate(
      listKey,
      (currentData: ServiceListResponse | undefined) => {
        const services = currentData?.services || [];
        const updatedServices = services.map((service) => (service.id === tempId ? createdService : service));
        return { ...currentData, services: updatedServices };
      },
      false
    );

    return createdService;
  } catch (error) {
    mutate(listKey);
    throw error;
  }
}

export async function updateService(serviceId: string, updatedService: ServiceCreateInput) {
  const listKey = buildKey(updatedService.tenantType);

  mutate(
    listKey,
    (currentData: ServiceListResponse | undefined) => {
      const services = currentData?.services || [];
      const updatedServices = services.map((service) => (service.id === serviceId ? { ...service, ...updatedService } : service));
      return { ...currentData, services: updatedServices };
    },
    false
  );

  try {
    const response = await publicApi.put(`${endpoints.key}/${serviceId}`, updatedService);
    const savedService = response.data.service as ServiceRecord;

    mutate(
      listKey,
      (currentData: ServiceListResponse | undefined) => {
        const services = currentData?.services || [];
        const updatedServices = services.map((service) => (service.id === serviceId ? savedService : service));
        return { ...currentData, services: updatedServices };
      },
      false
    );

    return savedService;
  } catch (error) {
    mutate(listKey);
    throw error;
  }
}

export async function deleteService(serviceId: string, tenantType: TenantType) {
  const listKey = buildKey(tenantType);

  mutate(
    listKey,
    (currentData: ServiceListResponse | undefined) => {
      const services = currentData?.services || [];
      const filteredServices = services.filter((service) => service.id !== serviceId);
      return { ...currentData, services: filteredServices };
    },
    false
  );

  try {
    await publicApi.delete(`${endpoints.key}/${serviceId}`, { params: { tenantType } });
  } catch (error) {
    mutate(listKey);
    throw error;
  }
}

