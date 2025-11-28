import { MainLayout } from '../layouts/MainLayout';
import { TrendingUp, Users, Store, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Total de Vistorias', value: '1,234', change: '+12%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Lojas Ativas', value: '45', change: '+2', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Peritos Ativos', value: '12', change: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pendências', value: '5', change: '-2', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Últimas Vistorias</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                    ABC
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Placa ABC-123{i}</p>
                    <p className="text-sm text-gray-500">Loja Exemplo {i}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Há {i} horas</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contas a Receber</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Vistoria #100{i}</p>
                  <p className="text-sm text-gray-500">Vencimento: 2{i}/11/2025</p>
                </div>
                <span className="font-bold text-gray-900">R$ 150,00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
