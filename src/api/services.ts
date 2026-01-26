import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import { fetcher } from 'utils/axios';
import axiosServices from 'utils/axios';

// types
import { ServiceCreateInput, ServiceListResponse, ServiceRecord, TenantType } from 'types/service';

const endpoints = {
  key: 'api/services'
};

const buildKey = (tenantType: TenantType) => `${endpoints.key}?tenantType=${tenantType}`;

export function useGetServices(tenantType: TenantType) {
  const { data, isLoading, error, isValidating } = useSWR<ServiceListResponse>(buildKey(tenantType), fetcher, {
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
    const response = await axiosServices.post(endpoints.key, newService);
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

