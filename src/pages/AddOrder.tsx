import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, AlertCircle, CheckCircle, Trash2, Package } from 'lucide-react';
import { bulkInsertOrders, getProducts } from '../services/api';
import type { Product } from '../types';

interface OrderItem {
    sku: string;
    quantity: number;
}

export default function AddOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [formData, setFormData] = useState({
        order_id: '',
        user_id: '',
        created_at: new Date().toISOString().slice(0, 16), // datetime-local format
        currency: 'INR',
    });

    const [items, setItems] = useState<OrderItem[]>([
        { sku: '', quantity: 1 }
    ]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products for price calculation');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { sku: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const calculateTotalAmount = (): number => {
        return items.reduce((total, item) => {
            const product = products.find(p => p.sku === item.sku);
            if (product && item.quantity > 0) {
                return total + (product.price * item.quantity);
            }
            return total;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!formData.order_id || !formData.user_id || !formData.created_at) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate items
        const validItems = items.filter(item => item.sku && item.quantity > 0);
        if (validItems.length === 0) {
            setError('Please add at least one valid item with SKU and quantity');
            return;
        }

        // Check if all SKUs exist in products
        const invalidSKUs = validItems.filter(item =>
            !products.find(p => p.sku === item.sku)
        );
        if (invalidSKUs.length > 0) {
            setError(`Invalid SKU(s): ${invalidSKUs.map(i => i.sku).join(', ')}`);
            return;
        }

        try {
            setLoading(true);

            const totalAmount = calculateTotalAmount();

            // Create array with single order object
            const orderData = [{
                order_id: formData.order_id,
                user_id: formData.user_id,
                items: validItems,
                total_amount: totalAmount,
                currency: formData.currency,
                created_at: formData.created_at,
            }];

            await bulkInsertOrders(orderData);

            setSuccess(true);

            // Reset form
            setFormData({
                order_id: '',
                user_id: '',
                created_at: new Date().toISOString().slice(0, 16),
                currency: 'INR',
            });
            setItems([{ sku: '', quantity: 1 }]);

            // Navigate to orders page after 2 seconds
            setTimeout(() => {
                navigate('/orders');
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add order');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = calculateTotalAmount();

    return (
        <div className="space-y-6">
            <div className="animate-fadeInUp">
                <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
                    <Plus className="w-8 h-8 text-cyan-400" />
                    Add New Order
                </h2>
                <p className="text-slate-400 mt-2">Create a new order with multiple items</p>
            </div>

            <div className="glass rounded-2xl p-8 card-glow animate-scaleIn max-w-4xl">
                {success && (
                    <div className="mb-6 glass border-green-500/30 rounded-xl p-4 animate-fadeInUp">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-green-400">Success!</h3>
                                <p className="text-sm text-slate-300 mt-1">Order added successfully. Redirecting...</p>
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

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Order Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-cyan-400" />
                            Order Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Order ID <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="order_id"
                                    value={formData.order_id}
                                    onChange={handleChange}
                                    placeholder="e.g., O1003"
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    User ID <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                    placeholder="e.g., U003"
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Created At <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="created_at"
                                    value={formData.created_at}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
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
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
                                >
                                    <option value="INR" className="bg-slate-800 text-white">INR</option>
                                    <option value="USD" className="bg-slate-800 text-white">USD</option>
                                    <option value="EUR" className="bg-slate-800 text-white">EUR</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-cyan-400" />
                                Order Items
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="glass border border-white/10 rounded-xl p-4 animate-fadeInUp">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                        <div className="md:col-span-6">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Product SKU <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                value={item.sku}
                                                onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
                                                required
                                            >
                                                <option value="" className="bg-slate-800 text-slate-400">Select a product</option>
                                                {products.map(product => (
                                                    <option key={product.sku} value={product.sku} className="bg-slate-800 text-white">
                                                        {product.sku} - {product.name} (₹{product.price})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Quantity <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                min="1"
                                                className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Subtotal
                                            </label>
                                            <div className="px-4 py-3 glass border border-white/10 rounded-xl text-green-400 font-semibold">
                                                ₹{(products.find(p => p.sku === item.sku)?.price || 0) * item.quantity}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                                className="w-full px-3 py-3 glass border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-5 h-5 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="glass border border-cyan-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-slate-300">Total Amount:</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                ₹{totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || loadingProducts}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Order...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Create Order
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/orders')}
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
