import { useEffect, useState } from 'react';
import { X, ShoppingCart, Calendar, DollarSign } from 'lucide-react';
import { getOrders } from '../services/api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [minAmount, setMinAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [minAmount, startDate, endDate, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (minAmount) {
      const min = parseFloat(minAmount);
      if (!isNaN(min)) {
        filtered = filtered.filter((order) => order.total_amount >= min);
      }
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => new Date(order.created_at) <= end);
    }

    setFilteredOrders(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fadeInUp">
        <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
          <ShoppingCart className="w-8 h-8 text-cyan-400" />
          Orders
        </h2>
        <p className="text-slate-400 mt-2">View and filter all orders</p>
      </div>

      <div className="glass rounded-2xl p-6 card-glow animate-scaleIn">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Min Amount
            </label>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 glass border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-white/5 cursor-pointer transition-all duration-200 animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-cyan-400">
                    {order.order_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {order.user_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-semibold">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDateTime(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No orders found matching your filters.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeInUp">
          <div className="glass rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 card-glow">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-2xl font-semibold gradient-text">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="glass hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 mb-1">Order ID</p>
                  <p className="text-base text-cyan-400 font-semibold">{selectedOrder.order_id}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 mb-1">User ID</p>
                  <p className="text-base text-white font-medium">{selectedOrder.user_id}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 mb-1">Total Amount</p>
                  <p className="text-base text-green-400 font-bold">
                    {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 mb-1">Created At</p>
                  <p className="text-base text-white">
                    {formatDateTime(selectedOrder.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Order Items
                </h4>
                <div className="glass border border-white/10 rounded-xl overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-white/5">
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-sm text-cyan-400 font-medium">{item.sku}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
