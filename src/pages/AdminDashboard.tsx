import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ProductCategory, Product, BrochureRequest } from '../lib/supabase';
import { Upload, LogOut, Image as ImageIcon, Palette, Plus, Trash2, Save, FileText } from 'lucide-react';

interface SiteSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export default function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'colors' | 'brochures'>('products');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<BrochureRequest[]>([]);
  const [colors, setColors] = useState<SiteSettings>({
    primary_color: '#06b6d4',
    secondary_color: '#3b82f6',
    accent_color: '#22d3ee',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadColors();
    loadBrochureRequests();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .order('display_order');
    if (data) {
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0].id);
    }
  };

  const loadProducts = async (categoryId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order');
    if (data) setProducts(data);
  };

  const loadColors = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const settings: Record<string, string> = {};
      data.forEach((setting) => {
        settings[setting.key] = setting.value;
      });
      setColors(settings as unknown as SiteSettings);
    }
  };

  const loadBrochureRequests = async () => {
    const { data } = await supabase
      .from('brochure_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBrochureRequests(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const { error } = await supabase.from('products').insert({
        category_id: selectedCategory,
        name: newProduct.name,
        description: newProduct.description,
        image_url: imageUrl,
        display_order: products.length,
      });

      if (error) throw error;

      setMessage('Product added successfully!');
      setNewProduct({ name: '', description: '' });
      setSelectedFile(null);
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error adding product');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      if (imageUrl) {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('product-images').remove([path]);
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setMessage('Product deleted successfully!');
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error deleting product');
    }
  };

  const handleSaveColors = async () => {
    try {
      for (const [key, value] of Object.entries(colors)) {
        await supabase
          .from('site_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() });
      }
      setMessage('Colors updated successfully! Refresh the main site to see changes.');
    } catch {
      setMessage('Error updating colors');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFiles || bulkFiles.length === 0) {
      setMessage('Please select files to upload');
      return;
    }

    setBulkUploading(true);
    setMessage('');

    try {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < bulkFiles.length; i++) {
        const file = bulkFiles[i];
        const productName = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

        try {
          const imageUrl = await uploadImage(file);

          await supabase.from('products').insert({
            category_id: selectedCategory,
            name: productName,
            description: `${productName} product`,
            image_url: imageUrl,
            display_order: products.length + successCount,
          });

          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error uploading ${file.name}:`, error);
        }
      }

      setMessage(
        `Bulk upload complete! ${successCount} products added${
          errorCount > 0 ? `, ${errorCount} failed` : ''
        }`
      );
      setBulkFiles(null);
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error during bulk upload');
    } finally {
      setBulkUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 text-gray-300 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            {message}
          </div>
        )}

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <ImageIcon size={20} />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => setActiveTab('brochures')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'brochures'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <FileText size={20} />
            <span>Brochure Requests</span>
            {brochureRequests.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-cyan-500 text-white rounded-full text-xs">
                {brochureRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'colors'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <Palette size={20} />
            <span>Customize Colors</span>
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Bulk Upload Products</h2>
              <p className="text-gray-400 mb-6">Upload multiple images at once - product names will be automatically generated from filenames</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleBulkUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Multiple Images
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setBulkFiles(e.target.files)}
                      className="hidden"
                      id="bulk-file-upload"
                    />
                    <label
                      htmlFor="bulk-file-upload"
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-300 hover:border-cyan-400 cursor-pointer transition-colors"
                    >
                      <Upload size={20} />
                      <span>{bulkFiles ? `${bulkFiles.length} files selected` : 'Choose Multiple Images'}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bulkUploading}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  <Upload size={20} />
                  <span>{bulkUploading ? 'Uploading...' : 'Upload All'}</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add Single Product</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-300 hover:border-cyan-400 cursor-pointer transition-colors"
                    >
                      <Upload size={20} />
                      <span>{selectedFile ? selectedFile.name : 'Choose Image'}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span>{uploading ? 'Adding...' : 'Add Product'}</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Existing Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900/50 rounded-xl border border-cyan-500/20 overflow-hidden"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="text-gray-600" size={48} />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.image_url)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors w-full justify-center"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brochures' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Brochure Requests</h2>
            <p className="text-gray-400 mb-6">
              Customer requests for product brochures and catalogues
            </p>

            {brochureRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No brochure requests yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Country</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brochureRequests.map((request) => (
                      <tr key={request.id} className="border-b border-cyan-500/10 hover:bg-slate-900/30">
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-white">{request.name}</td>
                        <td className="py-4 px-4 text-cyan-400">
                          <a href={`mailto:${request.email}`} className="hover:underline">
                            {request.email}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {request.company || <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-4 px-4 text-gray-300">{request.country}</td>
                        <td className="py-4 px-4 text-gray-300">{request.contact_number}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                            {request.category_name}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Customize Website Colors</h2>
            <p className="text-gray-400 mb-8">
              Change the accent colors used throughout your website
            </p>

            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Color (Main Accents)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.primary_color}
                    onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.primary_color}
                    onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secondary Color (Gradients)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.secondary_color}
                    onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.secondary_color}
                    onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Accent Color (Highlights)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.accent_color}
                    onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.accent_color}
                    onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-white font-semibold mb-4">Preview</h3>
                <div
                  className="p-6 rounded-xl"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary_color}, ${colors.secondary_color})`,
                  }}
                >
                  <p className="text-white font-bold text-lg">Sample Gradient Background</p>
                  <p className="text-white/80">This shows how your colors will look</p>
                </div>
              </div>

              <button
                onClick={handleSaveColors}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all"
              >
                <Save size={20} />
                <span>Save Colors</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
