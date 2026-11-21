import React, { useState } from 'react';
import { 
  Incident, 
  IncidentStatus, 
  MaintenanceTeam, 
  IoTSensor, 
  CityAlert 
} from '../types';
import { db } from '../services/db';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Radio, 
  Download, 
  Printer, 
  Filter, 
  Users, 
  Wrench, 
  FileText,
  Search,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  incidents: Incident[];
  sensors: IoTSensor[];
  alerts: CityAlert[];
  teams: MaintenanceTeam[];
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  incidents,
  sensors,
  alerts,
  teams,
  onDataChanged
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>('triagem');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [adminComment, setAdminComment] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // KPIs
  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(i => i.status !== 'resolvido').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolvido').length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;
  const onlineSensors = sensors.filter(s => s.status !== 'offline').length;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    db.updateIncidentStatus(
      selectedIncident.id,
      selectedStatus,
      adminComment || `Despacho emitido pela Direção Municipal.`,
      selectedTeamId || undefined
    );

    setSelectedIncident(null);
    setAdminComment('');
    onDataChanged();
  };

  const handleExportCsv = () => {
    const headers = ['Codigo', 'Titulo', 'Categoria', 'Prioridade', 'Estado', 'Freguesia', 'Morada', 'Cidadao', 'Piquete', 'DataCriacao'];
    const rows = incidents.map(i => [
      i.code,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.priority,
      i.status,
      i.district,
      `"${i.address.replace(/"/g, '""')}"`,
      i.citizen_name,
      i.assigned_team_name || 'N/A',
      i.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `urbisflow_ocorrencias_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const filteredIncidents = incidents.filter(i => {
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Municipal Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ocorrências Ativas</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {activeIncidents}
          </div>
          <p className="text-xs text-slate-500 mt-1">{resolvedIncidents} concluídas com sucesso este mês</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxa de Resolução</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {resolutionRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Tempo médio de resposta: 18.4 horas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rede IoT Conectada</span>
            <span className="p-2 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-2 tabular-nums">
            {onlineSensors} / {sensors.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">98.6% disponibilidade operacional</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Piquetes em Terreno</span>
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2 tabular-nums">
            {teams.filter(t => t.status === 'em_servico').length} / {teams.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">4 equipas de intervenção rápida</p>
        </div>
      </div>

      {/* Main Incident Triage Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Consola de Gestão e Despacho Municipal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Triagem de ocorrências, atribuição a brigadas de piquete e auditoria de estados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Resumo
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por código, título ou rua..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Todas as Categorias</option>
              <option value="buraco_via">Vias & Pavimento</option>
              <option value="iluminacao">Iluminação</option>
              <option value="residuos">Resíduos</option>
              <option value="inundacao_agua">Água</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Todos os Estados</option>
              <option value="submetido">1. Submetido</option>
              <option value="triagem">2. Em Triagem</option>
              <option value="em_resolucao">3. Em Resolução</option>
              <option value="resolvido">4. Resolvido</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Assunto / Descrição</th>
                <th className="px-4 py-3">Freguesia</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Piquete Atribuído</th>
                <th className="px-4 py-3">Apoios</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Nenhuma ocorrência encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(inc => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedIncident(inc);
                      setSelectedStatus(inc.status);
                      setSelectedTeamId(inc.assigned_team_id || '');
                    }}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                      {inc.code}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{inc.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{inc.address}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {inc.district}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        inc.priority === 'critica' || inc.priority === 'alta'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {inc.assigned_team_name ? (
                        <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                          <Wrench className="w-3 h-3" /> {inc.assigned_team_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pendente atribuição</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                      ▲ {inc.upvotes}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                          setSelectedStatus(inc.status);
                          setSelectedTeamId(inc.assigned_team_id || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
                      >
                        Despachar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Teams Operational Readiness Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          Brigadas Municipais e Equipas de Piquete em Serviço
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map(team => (
            <div
              key={team.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{team.code}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  team.status === 'disponivel'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  {team.status === 'disponivel' ? 'Disponível' : 'Em Terreno'}
                </span>
              </div>

              <div className="font-semibold text-sm text-slate-900 dark:text-white">{team.name}</div>
              <p className="text-xs text-slate-500">Resp: <strong>{team.leader_name}</strong></p>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
                <span>Missões ativas: <strong>{team.active_tasks}</strong></span>
                <span className="font-mono">{team.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Drawer for Dispatching Incident */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                  {selectedIncident.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              {selectedIncident.description}
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Novo Estado da Ocorrência
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as IncidentStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="submetido">1. Submetido</option>
                    <option value="triagem">2. Em Triagem</option>
                    <option value="em_resolucao">3. Em Resolução (Piquete)</option>
                    <option value="resolvido">4. Resolvido / Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Atribuir a Piquete
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="">Nenhum / Não alterar</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.active_tasks} ativas)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Despacho Técnico / Nota para o Cidadão
                </label>
                <textarea
                  rows={2}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Ex: Equipa despachada para o local com viatura pesada para reparação do pavimento."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white shadow-md"
                >
                  Confirmar Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
