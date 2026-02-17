import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  merchant_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  merchant_id: string;
  status: string;
  total_amount: number;
  delivery_fee: number;
  delivery_address: any;
  created_at: string;
  items?: OrderItem[];
  user?: {
    name: string;
    phone: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    name: string;
  };
}

export const merchantService = {
  async getMerchantByUserId(userId: string) {
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Si no existe, retornar null en lugar de lanzar error
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  async getProducts(merchantId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('name');
    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getOrders(merchantId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(name, phone),
        items:order_items(
          *,
          product:products(name)
        )
      `)
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMerchant(merchantId: string, updates: any) {
     const { data, error } = await supabase
      .from('merchants')
      .update(updates)
      .eq('id', merchantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getStats(merchantId: string) {
      // Esta es una implementación simplificada. 
      // Idealmente usaríamos RPC o consultas agregadas más complejas.
      
      // Obtener ventas del día
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const { count: ordersTodayCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId)
        .gte('created_at', today.toISOString());
        
      if (ordersError) throw ordersError;

      // Obtener total ventas (suma) - esto requeriría una función en DB o traer los datos
      // Por ahora traeremos los últimos pedidos para calcular en cliente (no ideal para prod)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('merchant_id', merchantId)
        .limit(100);

      const totalSales = recentOrders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

      return {
          ordersToday: ordersTodayCount || 0,
          totalSales,
          // Otros stats simulados o calculados
      };
  }
};
