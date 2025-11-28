import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { bulkInsertProducts } from '../services/api';

export default function AddProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        price: '',
        currency: 'INR',
        in_stock: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!formData.sku || !formData.name || !formData.category || !formData.price) {
            setError('Please fill in all required fields');
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            setError('Price must be a positive number');
            return;
        }

        try {
            setLoading(true);

            const productData = [{
                sku: formData.sku,
                name: formData.name,
                category: formData.category,
                price: price,
                currency: formData.currency,
                in_stock: formData.in_stock,
            }];

            await bulkInsertProducts(productData);

            setSuccess(true);

            setFormData({
                sku: '',
                name: '',
                category: '',
                price: '',
                currency: 'INR',
                in_stock: true,
            });

            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="animate-fadeInUp">
                <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
                    <Plus className="w-8 h-8 text-cyan-400" />
                    Add New Product
                </h2>
                <p className="text-slate-400 mt-2">Add a new product to your inventory</p>
            </div>

            <div className="glass rounded-2xl p-8 card-glow animate-scaleIn max-w-2xl">
                {success && (
                    <div className="mb-6 glass border-green-500/30 rounded-xl p-4 animate-fadeInUp">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-green-400">Success!</h3>
                                <p className="text-sm text-slate-300 mt-1">Product added successfully. Redirecting...</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 glass border-red-500/30 rounded-xl p-4 animate-fadeInUp">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-red-400">Error</h3>
                                <p className="text-sm text-slate-300 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                SKU <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="e.g., P003"
                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Product Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Gaming Headset"
                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., electronics"
                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Price <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g., 1999"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="in_stock"
                                    checked={formData.in_stock}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-slate-300">In Stock</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Package className="w-5 h-5" />
                                    Add Product
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 glass border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
