import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { api } from '../services/api';
import { Plus, Search, Edit2, Trash2, X, Loader2, Calendar, Car, User, Store as StoreIcon } from 'lucide-react';

interface Servico {
  id: string;
  data_hora: string;
  placa_veiculo: string;
  tipo: string;
  valor: number;
  status_pagamento: string;
  forma_pagamento: string;
  observacoes: string;
  loja?: { id: string; nome: string };
  perito?: { id: string; nome: string };
}

interface Loja {
  id: string;
  nome: string;
}

interface Perito {
  id: string;
  nome: string;
}

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [peritos, setPeritos] = useState<Perito[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  
  const [formData, setFormData] = useState({
    data_hora: '',
    placa_veiculo: '',
    tipo: 'VISTORIA_CAUTELAR',
    valor: '',
    status_pagamento: 'em_aberto',
    forma_pagamento: 'PIX',
    observacoes: '',
    loja_id: '',
    perito_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [servicosRes, lojasRes, peritosRes] = await Promise.all([
        api.get('/servicos'),
        api.get('/lojas'),
        api.get('/peritos'),
      ]);
      setServicos(servicosRes.data);
      setLojas(lojasRes.data);
      setPeritos(peritosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        valor: Number(formData.valor),
        data_hora: new Date(formData.data_hora).toISOString(),
      };

      if (editingServico) {
        await api.put(`/servicos/${editingServico.id}`, payload);
      } else {
        await api.post('/servicos', payload);
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await api.delete(`/servicos/${id}`);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
      }
    }
  }

  function openModal(servico?: Servico) {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        data_hora: new Date(servico.data_hora).toISOString().slice(0, 16),
        placa_veiculo: servico.placa_veiculo,
        tipo: servico.tipo,
        valor: String(servico.valor),
        status_pagamento: servico.status_pagamento,
        forma_pagamento: servico.forma_pagamento || 'PIX',
        observacoes: servico.observacoes || '',
        loja_id: servico.loja?.id || '',
        perito_id: servico.perito?.id || '',
      });
    } else {
      setEditingServico(null);
      setFormData({
        data_hora: new Date().toISOString().slice(0, 16),
        placa_veiculo: '',
        tipo: 'VISTORIA_CAUTELAR',
        valor: '',
        status_pagamento: 'em_aberto',
        forma_pagamento: 'PIX',
        observacoes: '',
        loja_id: '',
        perito_id: '',
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingServico(null);
  }

  const filteredServicos = servicos.filter(s =>
    s.placa_veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.loja?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-500">Gerencie as vistorias e serviços realizados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por placa ou loja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Data/Hora</th>
                <th className="px-6 py-3 font-medium">Veículo</th>
                <th className="px-6 py-3 font-medium">Loja/Perito</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Carregando...
                  </td>
                </tr>
              ) : filteredServicos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum serviço encontrado.
                  </td>
                </tr>
              ) : (
                filteredServicos.map((servico) => (
                  <tr key={servico.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(servico.data_hora).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        <Car size={16} className="text-gray-400" />
                        {servico.placa_veiculo}
                      </div>
                      <div className="text-xs text-gray-500 ml-6">{servico.tipo}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2 text-sm">
                        <StoreIcon size={14} className="text-gray-400" />
                        {servico.loja?.nome || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <User size={14} className="text-gray-400" />
                        {servico.perito?.nome || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      R$ {Number(servico.valor).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        servico.status_pagamento === 'pago' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {servico.status_pagamento}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(servico)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(servico.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.data_hora}
                    onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo</label>
                  <input
                    type="text"
                    required
                    value={formData.placa_veiculo}
                    onChange={(e) => setFormData({ ...formData, placa_veiculo: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loja</label>
                  <select
                    value={formData.loja_id}
                    onChange={(e) => setFormData({ ...formData, loja_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione uma loja...</option>
                    {lojas.map(loja => (
                      <option key={loja.id} value={loja.id}>{loja.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perito</label>
                  <select
                    required
                    value={formData.perito_id}
                    onChange={(e) => setFormData({ ...formData, perito_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione um perito...</option>
                    {peritos.map(perito => (
                      <option key={perito.id} value={perito.id}>{perito.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="VISTORIA_CAUTELAR">Vistoria Cautelar</option>
                    <option value="VISTORIA_PREVIA">Vistoria Prévia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={formData.forma_pagamento}
                    onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                    <option value="BOLETO">Boleto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
