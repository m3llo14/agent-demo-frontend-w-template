import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import { fetcher } from 'utils/axios';
import axiosServices from 'utils/axios';

// types
import { CustomerList, CustomerProps } from 'types/customer';

const initialState: CustomerProps = {
  modal: false
};

// ==============================|| API - CUSTOMER (RESTful) ||============================== //

const endpoints = {
  key: 'api/customers',  // RESTful: çoğul isim
  modal: '/modal'        // Modal state için ayrı endpoint
};

// GET /api/customers - Tüm müşterileri listele
export function useGetCustomer() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.customers as CustomerList[],
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && !data?.customers?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// GET /api/customers/:id - Tek müşteri getir
export function useGetCustomerById(id: number) {
  
  const { data, isLoading, error } = useSWR(
    id ? `${endpoints.key}/${id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    customer: data?.customer as CustomerList,
    customerLoading: isLoading,
    customerError: error
  };
}

// POST /api/customers - Yeni müşteri oluştur
export async function insertCustomer(newCustomer: Omit<CustomerList, 'id'>) {

  const tempId = Date.now(); // Geçici ID

  // Optimistic update - local state'i güncelle
  mutate(
    endpoints.key,
    (currentData: any) => {

      const addedCustomer: CustomerList = { ...newCustomer, id: tempId } as CustomerList;
      
      return {
        ...currentData,
        customers: [...(currentData?.customers || []), addedCustomer]
      };
    },
    false
  );

  // Server'a gönder
  try {
    const response = await axiosServices.post(endpoints.key, newCustomer);
    const createdCustomer = response.data.customer;
    
    // Server'dan gelen gerçek ID ile güncelle
    mutate(
      endpoints.key,
      (currentData: any) => {
        const customers = currentData?.customers || [];
        const updatedCustomers = customers.map((c: CustomerList) =>
          c.id === tempId ? createdCustomer : c
        );
        return { ...currentData, customers: updatedCustomers };
      },
      false
    );
    
    return createdCustomer;
  } catch (error) {
    // Hata durumunda rollback
    mutate(endpoints.key);
    throw error;
  }
}

// PUT /api/customers/:id - Müşteri güncelle
export async function updateCustomer(customerId: number, updatedCustomer: Partial<CustomerList>) {
  // Optimistic update
  mutate(
    endpoints.key,
    (currentData: any) => {
      const customers = currentData?.customers || [];
      const updatedCustomers = customers.map((customer: CustomerList) =>
        customer.id === customerId ? { ...customer, ...updatedCustomer } : customer
      );
      return { ...currentData, customers: updatedCustomers };
    },
    false
  );

  // Server'a gönder
  try {
    const response = await axiosServices.put(`${endpoints.key}/${customerId}`, updatedCustomer);
    const updated = response.data.customer;
    
    // Server'dan gelen veri ile güncelle
    mutate(
      endpoints.key,
      (currentData: any) => {
        const customers = currentData?.customers || [];
        const updatedCustomers = customers.map((customer: CustomerList) =>
          customer.id === customerId ? updated : customer
        );
        return { ...currentData, customers: updatedCustomers };
      },
      false
    );
    
    return updated;
  } catch (error) {
    // Hata durumunda rollback
    mutate(endpoints.key);
    throw error;
  }
}

// DELETE /api/customers/:id - Müşteri sil
export async function deleteCustomer(customerId: number) {
  // Optimistic update
  mutate(
    endpoints.key,
    (currentData: any) => {
      const customers = currentData?.customers || [];
      const filteredCustomers = customers.filter((customer: CustomerList) => customer.id !== customerId);
      return { ...currentData, customers: filteredCustomers };
    },
    false
  );

  // Server'a gönder
  try {
    await axiosServices.delete(`${endpoints.key}/${customerId}`);
    // Başarılı ise zaten optimistic update yapıldı
  } catch (error) {
    // Hata durumunda rollback
    mutate(endpoints.key);
    throw error;
  }
}

// Modal state için (değişmedi)
export function useGetCustomerMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.modal, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customerMaster: data,
      customerMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerCustomerDialog(modal: boolean) {
  mutate(
    endpoints.key + endpoints.modal,
    (currentCustomermaster: any) => {
      return { ...currentCustomermaster, modal };
    },
    false
  );
}