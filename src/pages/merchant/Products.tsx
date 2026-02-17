import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Upload, Loader2, Package, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService, Product } from '@/services/merchant';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    if (!user) return;
    try {
      const merchant = await merchantService.getMerchantByUserId(user.id);
      if (merchant) {
        const data = await merchantService.getProducts(merchant.id);
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      is_active: true,
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;
    setIsSaving(true);
    try {
      const merchant = await merchantService.getMerchantByUserId(user.id);
      if (!merchant) throw new Error('Merchant not found');

      if (editingProduct.id) {
        await merchantService.updateProduct(editingProduct.id, editingProduct);
      } else {
        await merchantService.createProduct({
          ...(editingProduct as Omit<Product, 'id'>),
          merchant_id: merchant.id
        });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await merchantService.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setEditingProduct(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Asegúrate de que el bucket "images" exista en Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mis Productos</h2>
          <p className="text-gray-500 mt-1 font-medium">Gestiona tu catálogo, stock y visibilidad.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-black font-black px-6 py-3 rounded-xl flex items-center shadow-lg shadow-primary/20 transition-all transform active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filtros:</span>
            <select className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Todas las categorías</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Producto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Precio</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-sm font-bold text-gray-500">Cargando catálogo...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Package size={48} strokeWidth={1} />
                      <p className="font-bold">No se encontraron productos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="text-gray-300 w-6 h-6" />
                          )}
                          {!product.is_active && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <X className="text-white w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="ml-5">
                          <div className="text-sm font-black text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 font-medium line-clamp-1 max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {product.category || 'Varios'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-rose-600' : 'text-gray-900'}`}>{product.stock}</span>
                        {product.stock <= 5 && <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {product.is_active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary hover:text-black transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-over */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <p className="text-sm text-gray-500 font-medium">Completa los detalles para tu menú.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Image Upload Area */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="h-32 w-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative transition-all group-hover:border-primary/50">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : editingProduct?.image_url ? (
                      <img src={editingProduct.image_url} alt="Vista previa" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Upload size={24} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase mt-1">Imagen</span>
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-black rounded-xl shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-all">
                    <Plus size={16} strokeWidth={3} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                    placeholder="Ej: Pizza Napolitana Premium"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Descripción</label>
                  <textarea
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold min-h-[100px]"
                    placeholder="Describe los ingredientes o características..."
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Precio ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                      value={editingProduct?.price || 0}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stock Inicial</label>
                    <input
                      required
                      type="number"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                      value={editingProduct?.stock || 0}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Categoría</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                    placeholder="Ej: Comida Italiana"
                    value={editingProduct?.category || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editingProduct?.is_active}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-sm font-bold text-gray-700">Producto visible para clientes</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploading}
                  className="flex-1 py-4 bg-primary text-black font-black rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
