import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, IndianRupee, Sparkles } from 'lucide-react';
import { getAnalyticsSummary } from '../services/api';
import type { AnalyticsSummary } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await getAnalyticsSummary();
      setData(summary);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="animate-fadeInUp">
        <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
          Dashboard
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </h2>
        <p className="text-slate-400 mt-2">Overview of your e-commerce analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass glass-hover rounded-2xl p-6 card-glow animate-scaleIn">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Total Orders
              </p>
              <p className="text-4xl font-bold text-white mt-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {data.total_orders}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 border border-cyan-500/30">
                <ShoppingBag className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass glass-hover rounded-2xl p-6 card-glow animate-scaleIn delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Total Revenue
              </p>
              <p className="text-4xl font-bold text-white mt-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {formatCurrency(data.total_revenue)}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30">
                <IndianRupee className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 card-glow animate-fadeInUp delay-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Revenue Over Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenue_by_date}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                color: '#e2e8f0'
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="total_revenue"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 5, strokeWidth: 2, stroke: '#0e7490' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              fill="url(#colorRevenue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-6 card-glow animate-fadeInUp delay-300">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Top Products
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.top_products.map((product, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-cyan-400">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {product.total_quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-semibold">
                    {formatCurrency(product.total_revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
