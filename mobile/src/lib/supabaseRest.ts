import { ENV } from '../config/env';
import { getToken, refreshSession, signOut } from './auth';

function getBase() {
  return ENV.supabaseUrl || '';
}
function getKey() {
  return ENV.supabaseAnonKey || '';
}
function headers(): Record<string, string> {
  const userToken = getToken();
  const key = getKey();
  return {
    apikey: key,
    Authorization: `Bearer ${userToken || key}`,
    'Content-Type': 'application/json',
  };
}

async function get(path: string, query?: string) {
  const res = await rawFetch('GET', path, undefined, query);
  return res.json();
}

async function patch(path: string, body: any, query?: string) {
  const res = await rawFetch('PATCH', path, body, query, { Prefer: 'return=representation' });
  return res.json();
}

export type Order = {
  id: number;
  code?: string;
  status: string;
  created_at: string;
  courier_name?: string;
  address?: string;
  total?: number;
  merchant_id?: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  name: string;
  quantity: number;
  price?: number;
  image_url?: string;
};

export type Merchant = {
  id: string;
  business_name: string;
  address?: string;
  delivery_fee?: number;
  coordinates?: any;
  image_url?: string;
};

export type Product = {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
};

export type Address = {
  id: string;
  user_id: string;
  street?: string;
  commune?: string;
  city?: string;
  is_default: boolean;
  alias?: string;
  type?: 'home' | 'work' | 'other';
};

export type Driver = {
  id: string;
  name: string;
  phone?: string;
};

export type Delivery = {
  id: string;
  order_id: number;
  driver_id?: string | null;
  assigned_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
};

export type PaymentMethod = {
  id: string;
  user_id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'cash';
  last4?: string;
  brand?: string;
  is_default: boolean;
};

export const api = {
  async listOrders(status?: string) {
    const filter = status ? `status=eq.${encodeURIComponent(status)}` : '';
    return get('/rest/v1/orders', `select=*&${filter}`);
  },
  async getOrderById(id: number) {
    const data = await get('/rest/v1/orders', `id=eq.${id}&select=*`);
    return Array.isArray(data) ? data[0] : data;
  },
  async listOrderItems(orderId: number) {
    return get('/rest/v1/order_items', `order_id=eq.${orderId}&select=*`);
  },
  async listMerchants() {
    return get('/rest/v1/merchants', 'select=id,business_name,address,delivery_fee,coordinates,image_url');
  },
  async listProducts(merchantId?: string) {
    const filter = merchantId ? `merchant_id=eq.${merchantId}` : '';
    return get('/rest/v1/products', `select=id,merchant_id,name,description,price,stock,image_url,category&${filter}`);
  },
  async listAddresses(userId?: string) {
    const filter = userId ? `user_id=eq.${userId}` : '';
    return get('/rest/v1/addresses', `select=id,user_id,street,commune,city,is_default&${filter}`);
  },
  async listPaymentMethods(userId?: string) {
    const filter = userId ? `user_id=eq.${userId}` : '';
    return get('/rest/v1/payment_methods', `select=id,user_id,type,last4,brand,is_default&${filter}`);
  },
  async getUserProfileById(id: string) {
    const data = await get('/rest/v1/users', `id=eq.${id}&select=id,email,name,phone,role,is_active,points,level`);
    return Array.isArray(data) ? data[0] : data;
  },
  async updateUserProfile(id: string, payload: Partial<{ name: string; phone: string }>) {
    const data = await patch('/rest/v1/users', payload, `id=eq.${id}`);
    return Array.isArray(data) ? data[0] : data;
  },
  async getDefaultAddressByUser(userId: string) {
    const data = await get('/rest/v1/addresses', `user_id=eq.${userId}&is_default=eq.true&select=id,user_id,street,commune,city,is_default,alias,type`);
    return Array.isArray(data) ? data[0] : data;
  },
  async updateAddress(id: string, payload: Partial<{ street: string; commune: string; city: string; is_default: boolean; alias: string; type: string }>) {
    const res = await rawFetch('PATCH', `/rest/v1/addresses?id=eq.${id}`, payload, undefined, { Prefer: 'return=representation' });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  },
  async createOrder(payload: Partial<{ status: string; address: string; total: number; courier_name: string | null; merchant_id: string | null }>) {
    const res = await rawFetch('POST', '/rest/v1/orders', payload, undefined, { Prefer: 'return=representation' });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  },
  async createOrderItems(items: Array<{ order_id: number; name: string; quantity: number; image_url: string | null }>) {
    const res = await rawFetch('POST', '/rest/v1/order_items', items, undefined, { Prefer: 'return=minimal' });
    return true;
  },
  async updateOrder(id: number, payload: Partial<{ status: string; courier_name: string | null }>) {
    const data = await patch('/rest/v1/orders', payload, `id=eq.${id}`);
    return Array.isArray(data) ? data[0] : data;
  },
  async listDrivers() {
    return get('/rest/v1/drivers', 'select=id,name,phone');
  },
  async getDeliveryByOrder(orderId: number) {
    const data = await get('/rest/v1/deliveries', `order_id=eq.${orderId}&select=*`);
    return Array.isArray(data) ? data[0] : data;
  },
  async createDelivery(payload: Partial<Delivery>) {
    const res = await rawFetch('POST', '/rest/v1/deliveries', payload, undefined, { Prefer: 'return=representation' });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  },
  async updateDelivery(id: string, payload: Partial<Delivery>) {
    const data = await patch('/rest/v1/deliveries', payload, `id=eq.${id}`);
    return Array.isArray(data) ? data[0] : data;
  },
};

async function rawFetch(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: any,
  query?: string,
  extraHeaders?: Record<string, string>,
) {
  const url = `${getBase()}${path}${query ? `?${query}` : ''}`;
  let res = await fetch(url, {
    method,
    headers: { ...headers(), ...(extraHeaders || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    const text = await res.text();
    if (text && /JWT expired|invalid token|Invalid JWT|authorization/i.test(text)) {
      try {
        await refreshSession();
        res = await fetch(url, {
          method,
          headers: { ...headers(), ...(extraHeaders || {}) },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (res.status === 401) {
          signOut();
          throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
      } catch {
        signOut();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
    } else {
      throw new Error(text || 'No autorizado');
    }
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${method} ${url}`);
  }
  return res;
}
