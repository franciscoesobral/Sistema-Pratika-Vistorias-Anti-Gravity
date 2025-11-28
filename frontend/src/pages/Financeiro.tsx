import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { api } from '../services/api';
import { Plus, Search, Edit2, Trash2, X, Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Conta {
  id: string;
  descricao: string;
  valor: number | string; // Handle both for display
  valor_total?: number; // For Receber
  data_vencimento: string;
  status: string;
  tipo: 'RECEBER' | 'PAGAR';
}

export function Financeiro() {
  const [contasReceber, setContasReceber] = useState<Conta[]>([]);
  const [contasPagar, setContasPagar] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'RECEBER' | 'PAGAR'>('RECEBER');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simplified for brevity - full implementation would include full CRUD for both types
  // For now, listing and basic structure

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [receberRes, pagarRes] = await Promise.all([
        api.get('/financeiro/receber'),
        api.get('/financeiro/pagar'),
      ]);
      setContasReceber(receberRes.data.map((c: any) => ({ ...c, tipo: 'RECEBER', valor: c.valor_total })));
      setContasPagar(pagarRes.data.map((c: any) => ({ ...c, tipo: 'PAGAR' })));
    } catch (error) {
      console.error('Erro ao carregar financeiro:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentData = activeTab === 'RECEBER' ? contasReceber : contasPagar;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-500">Gestão de contas a pagar e receber</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nova Conta
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('RECEBER')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'RECEBER'
              ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowDownCircle size={20} />
          Contas a Receber
        </button>
        <button
          onClick={() => setActiveTab('PAGAR')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'PAGAR'
              ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowUpCircle size={20} />
          Contas a Pagar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Descrição</th>
                <th className="px-6 py-3 font-medium">Vencimento</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Carregando...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma conta encontrada.
                  </td>
                </tr>
              ) : (
                currentData.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{conta.descricao || 'Sem descrição'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(conta.data_vencimento).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 font-bold ${
                      activeTab === 'RECEBER' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {Number(conta.valor).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conta.status === 'pago' || conta.status === 'recebido'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {conta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
