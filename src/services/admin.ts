import { supabase } from '../lib/supabase';

export interface AdminOrder {
    id: string;
    created_at: string;
    total_amount: number;
    delivery_fee: number;
    status: string;
    payment_method: string;
    delivery_address: any;
    merchant_id: string;
    user_id: string;
    merchant?: {
        business_name: string;
    };
    user?: {
        name: string;
        phone: string;
        email: string;
    };
    driver?: {
        name: string;
        phone: string;
    };
    items?: OrderItem[];
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
        image_url: string;
    };
}

export interface OrderFilters {
    status?: string;
    merchantId?: string;
    startDate?: string;
    endDate?: string;
}

export const adminService = {
    // ============ GESTIÓN DE PEDIDOS ============

    async getOrders(filters?: OrderFilters) {
        let query = supabase
            .from('orders')
            .select(`
        *,
        merchant:merchants(business_name),
        user:users!orders_user_id_fkey(name, phone, email),
        items:order_items(
          *,
          product:products(name, image_url)
        )
      `)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.merchantId) {
            query = query.eq('merchant_id', filters.merchantId);
        }
        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as AdminOrder[];
    },

    async getOrderById(orderId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        merchant:merchants(business_name, address, phone),
        user:users!orders_user_id_fkey(name, phone, email),
        items:order_items(
          *,
          product:products(name, image_url, price)
        )
      `)
            .eq('id', orderId)
            .single();

        if (error) throw error;
        return data as AdminOrder;
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

    async cancelOrder(orderId: string, reason: string) {
        const { data, error } = await supabase
            .from('orders')
            .update({
                status: 'cancelled',
                cancellation_reason: reason
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ============ GESTIÓN DE USUARIOS ============

    async getUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'customer')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getUserById(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async getUserOrders(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        id,
        created_at,
        total_amount,
        status,
        merchant:merchants(business_name)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    },

    async toggleUserStatus(userId: string, isActive: boolean) {
        const { data, error } = await supabase
            .from('users')
            .update({ is_active: isActive })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ============ GESTIÓN DE COMERCIOS ============

    async getMerchants() {
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getMerchantById(merchantId: string) {
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .eq('id', merchantId)
            .single();

        if (error) throw error;
        return data;
    },

    async getMerchantStats(merchantId: string) {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('id, total_amount, status')
            .eq('merchant_id', merchantId);

        if (error) throw error;

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders
            ?.filter(o => o.status === 'delivered')
            .reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;

        return {
            totalOrders,
            totalRevenue,
            deliveredOrders: orders?.filter(o => o.status === 'delivered').length || 0,
        };
    },

    async approveMerchant(merchantId: string) {
        const { data, error } = await supabase
            .from('merchants')
            .update({ is_approved: true })
            .eq('id', merchantId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async rejectMerchant(merchantId: string, reason: string) {
        const { data, error } = await supabase
            .from('merchants')
            .update({
                is_approved: false,
                rejection_reason: reason
            })
            .eq('id', merchantId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ============ GESTIÓN DE REPARTIDORES ============

    async getDrivers() {
        const { data, error } = await supabase
            .from('drivers')
            .select(`
        *,
        user:users(email)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getDriverById(driverId: string) {
        const { data, error } = await supabase
            .from('drivers')
            .select(`
        *,
        user:users(email)
      `)
            .eq('id', driverId)
            .single();

        if (error) throw error;
        return data;
    },

    async approveDriver(driverId: string) {
        const { data, error } = await supabase
            .from('drivers')
            .update({ is_approved: true })
            .eq('id', driverId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async toggleDriverStatus(driverId: string, isActive: boolean) {
        const { data, error } = await supabase
            .from('drivers')
            .update({ is_active: isActive })
            .eq('id', driverId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ============ ESTADÍSTICAS GLOBALES ============

    async getGlobalStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Pedidos del día
        const { count: ordersToday } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        // Total de usuarios
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'customer');

        // Total de comercios activos
        const { count: activeMerchants } = await supabase
            .from('merchants')
            .select('*', { count: 'exact', head: true })
            .eq('is_approved', true);

        // Repartidores disponibles
        const { count: availableDrivers } = await supabase
            .from('drivers')
            .select('*', { count: 'exact', head: true })
            .eq('is_available', true);

        return {
            ordersToday: ordersToday || 0,
            totalUsers: totalUsers || 0,
            activeMerchants: activeMerchants || 0,
            availableDrivers: availableDrivers || 0,
        };
    },
};
