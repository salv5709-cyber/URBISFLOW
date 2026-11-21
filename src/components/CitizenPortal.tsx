import React, { useState } from 'react';
import { 
  Incident, 
  IncidentCategory, 
  IncidentPriority, 
  User 
} from '../types';
import { db } from '../services/db';
import { 
  AlertCircle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  Plus, 
  Filter, 
  Wrench, 
  Layers, 
  Upload,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface CitizenPortalProps {
  currentUser: User;
  incidents: Incident[];
  onIncidentCreated: () => void;
  onOpenMapLocationPicker: () => void;
  selectedLocationFromMap?: { lat: number; lng: number; address: string } | null;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  currentUser,
  incidents,
  onIncidentCreated,
  onOpenMapLocationPicker,
  selectedLocationFromMap
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'my_reports' | 'community'>('submit');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('buraco_via');
  const [priority, setPriority] = useState<IncidentPriority>('media');
  const [district, setDistrict] = useState(currentUser.district || 'Baixa-Chiado');
  const [address, setAddress] = useState(selectedLocationFromMap?.address || '');
  const [lat, setLat] = useState<number>(selectedLocationFromMap?.lat || 38.7188);
  const [lng, setLng] = useState<number>(selectedLocationFromMap?.lng || -9.1445);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // Filters for community incidents
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState<string>('all');
  const [communityDistrictFilter, setCommunityDistrictFilter] = useState<string>('all');

  // Update address & coords when map picker updates
  React.useEffect(() => {
    if (selectedLocationFromMap) {
      setLat(selectedLocationFromMap.lat);
      setLng(selectedLocationFromMap.lng);
      setAddress(selectedLocationFromMap.address);
    }
  }, [selectedLocationFromMap]);

  const categories: { id: IncidentCategory; label: string; desc: string; icon: string }[] = [
    { id: 'buraco_via', label: 'Pavimento & Vias', desc: 'Buracos, calçadas danificadas, tampas desniveladas', icon: '🚧' },
    { id: 'iluminacao', label: 'Iluminação Pública', desc: 'Candeeiros fundidos, cabos expostos, postes danificados', icon: '💡' },
    { id: 'residuos', label: 'Resíduos & Limpeza', desc: 'Contentores cheios, despejo ilegal, entulho em passeio', icon: '🗑️' },
    { id: 'inundacao_agua', label: 'Água & Saneamento', desc: 'Fugas de água, sarjetas entupidas, inundações', icon: '🚰' },
    { id: 'sinalizacao', label: 'Sinalização & Trânsito', desc: 'Semáforos avariados, sinais caídos, lombas danificadas', icon: '🚦' },
    { id: 'espacos_verdes', label: 'Parques & Árvores', desc: 'Ramos com risco de queda, relvados sem manutenção', icon: '🌳' },
  ];

  const samplePhotoPresets = [
    { label: 'Buraco de Pavimento', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Contentor Ecoponto Cheio', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80' },
    { label: 'Candeeiro Avariado', url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = db.createIncident({
        title,
        description,
        category,
        priority,
        district,
        address: address || `Rua Principal, ${district}`,
        lat: Number(lat),
        lng: Number(lng),
        image_url: imageUrl || undefined
      });

      setSuccessCode(created.code);
      setIsSubmitting(false);
      onIncidentCreated();

      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
    }, 400);
  };

  const handleUpvote = (id: string) => {
    db.toggleUpvote(id);
    onIncidentCreated();
  };

  const myIncidents = incidents.filter(i => i.citizen_id === currentUser.id);

  const filteredCommunityIncidents = incidents.filter(i => {
    if (communityCategoryFilter !== 'all' && i.category !== communityCategoryFilter) return false;
    if (communityDistrictFilter !== 'all' && i.district !== communityDistrictFilter) return false;
    return true;
  });

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'submetido':
        return <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">1. Submetido</span>;
      case 'triagem':
        return <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">2. Em Triagem Municipal</span>;
      case 'em_resolucao':
        return <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">3. Piquete no Local</span>;
      case 'resolvido':
        return <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">4. Concluído</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Citizen Banner / Welcome */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-cyan-800/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Portal de Cidadania Ativa & Ocorrências Urbanas
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Ajude a Cuidar da Sua Cidade
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Identificou um problema na via pública? Submeta o seu reporte com coordenadas GPS e fotografia.
            O UrbisFlow encaminha a ordem automaticamente para as brigadas municipais e mantém-no informado a cada etapa.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-cyan-800/50 text-xs text-cyan-200">
            <span>👤 Sessão Iniciada como: <strong>{currentUser.name}</strong></span>
            <span>·</span>
            <span>Freguesia: <strong>{currentUser.district}</strong></span>
            <span>·</span>
            <span>Tempo Médio de Triagem: <strong>&lt; 2 Horas</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => { setActiveTab('submit'); setSuccessCode(null); }}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'submit'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          Submeter Ocorrência
        </button>

        <button
          onClick={() => setActiveTab('my_reports')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'my_reports'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Minhas Ocorrências ({myIncidents.length})
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'community'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          Mural Comunitário ({incidents.length})
        </button>
      </div>

      {/* Tab 1: Submit Incident Form */}
      {activeTab === 'submit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {successCode ? (
            <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Ocorrência Registada com Sucesso!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                O seu reporte foi protocolado na plataforma municipal com o número de processo:
              </p>
              <div className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 py-2 px-4 rounded-lg inline-block border border-slate-200 dark:border-slate-700">
                {successCode}
              </div>
              <p className="text-xs text-slate-500">
                A equipa de piquete foi alertada. Pode acompanhar o progresso na aba "Minhas Ocorrências".
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('my_reports')}
                  className="px-4 py-2 text-sm font-semibold bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  Ver no Histórico
                </button>
                <button
                  onClick={() => setSuccessCode(null)}
                  className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
                >
                  Submeter Outra
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  1. Selecione a Categoria do Problema <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        category === cat.id
                          ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{cat.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    2. Título da Ocorrência <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Buraco de grande dimensão na Rua das Flores"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    3. Nível de Urgência Aparente
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="baixa">Baixa (Pode aguardar ronda normal)</option>
                    <option value="media">Média (Requer atenção esta semana)</option>
                    <option value="alta">Alta (Risco para trânsito ou peões)</option>
                    <option value="critica">Crítica (Perigo iminente de acidente)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  4. Descrição Pormenorizada dos Factos <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhes como dimensões, se afeta passadeiras, número da porta em frente, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                />
              </div>

              {/* Geolocation & Address */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    5. Localização e Coordenadas GPS
                  </label>
                  <button
                    type="button"
                    onClick={onOpenMapLocationPicker}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Marcar Diretamente no Mapa Interativo →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Freguesia</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Baixa-Chiado">Baixa-Chiado</option>
                      <option value="Alvalade">Alvalade</option>
                      <option value="Parque das Nações">Parque das Nações</option>
                      <option value="Belém">Belém</option>
                      <option value="Lumiar">Lumiar</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">Morada ou Ponto de Referência</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ex: Av. da Liberdade, junto ao nº 140"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>GPS Lat: <strong>{lat}</strong></span>
                  <span>GPS Lng: <strong>{lng}</strong></span>
                </div>
              </div>

              {/* Photo Upload / Attachment */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  6. Anexar Fotografia Comprovativa (Opcional)
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">Exemplos rápidos para demonstração ao Júri:</span>
                  {samplePhotoPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cole aqui o URL da fotografia ou utilize os botões acima"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                />

                {imageUrl && (
                  <div className="mt-2 w-32 h-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 relative">
                    <img src={imageUrl} alt="Pré-visualização" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'A registar na Base de Dados...' : 'Submeter Ocorrência Municipal'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: My Incidents (Timeline Tracking) */}
      {activeTab === 'my_reports' && (
        <div className="space-y-4">
          {myIncidents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Ainda não submeteu ocorrências</h3>
              <p className="text-xs text-slate-500 mt-1">Utilize a aba "Submeter Ocorrência" para reportar anomalias na via pública.</p>
            </div>
          ) : (
            myIncidents.map(inc => (
              <div key={inc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                        {inc.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{inc.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>{inc.address}</span>
                      <span>·</span>
                      <span>Freguesia: <strong>{inc.district}</strong></span>
                      <span>·</span>
                      <span>Criado em: {new Date(inc.created_at).toLocaleDateString('pt-PT')}</span>
                    </p>
                  </div>

                  <div>{getStatusBadge(inc.status)}</div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">{inc.description}</p>

                {/* Visual Step-by-Step Status Tracker */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Evolução do Processo Municipal
                  </div>
                  <div className="grid grid-cols-4 gap-2 relative">
                    {[
                      { step: 'submetido', label: '1. Submetido' },
                      { step: 'triagem', label: '2. Triagem' },
                      { step: 'em_resolucao', label: '3. Piquete no Local' },
                      { step: 'resolvido', label: '4. Concluído' }
                    ].map((s, idx) => {
                      const steps = ['submetido', 'triagem', 'em_resolucao', 'resolvido'];
                      const currentIdx = steps.indexOf(inc.status);
                      const isComplete = idx <= currentIdx;

                      return (
                        <div key={s.step} className="text-center">
                          <div className={`h-1.5 rounded-full mb-2 ${isComplete ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                          <span className={`text-[11px] font-medium ${isComplete ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400'}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit & Updates thread */}
                {inc.updates.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Histórico de Resposta dos Serviços:</span>
                    <div className="space-y-2">
                      {inc.updates.map(upd => (
                        <div key={upd.id} className="text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
                          <div>
                            <strong>{upd.user_name}</strong> ({upd.user_role === 'admin' ? 'Gestão Municipal' : 'Cidadão'}): {upd.comment}
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">
                            {new Date(upd.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Community Incidents Feed */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filtrar por:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={communityCategoryFilter}
                onChange={(e) => setCommunityCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">Todas as Categorias</option>
                <option value="buraco_via">Vias & Pavimento</option>
                <option value="iluminacao">Iluminação</option>
                <option value="residuos">Resíduos</option>
                <option value="inundacao_agua">Água</option>
              </select>

              <select
                value={communityDistrictFilter}
                onChange={(e) => setCommunityDistrictFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">Todas as Freguesias</option>
                <option value="Baixa-Chiado">Baixa-Chiado</option>
                <option value="Alvalade">Alvalade</option>
                <option value="Parque das Nações">Parque das Nações</option>
                <option value="Belém">Belém</option>
                <option value="Lumiar">Lumiar</option>
              </select>
            </div>
          </div>

          {/* Grid of incidents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunityIncidents.map(inc => {
              const hasUpvoted = inc.upvoted_by.includes(currentUser.id);

              return (
                <div
                  key={inc.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500">{inc.code}</span>
                      {getStatusBadge(inc.status)}
                    </div>

                    <h4 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {inc.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                      {inc.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{inc.address} ({inc.district})</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Reportado por <strong>{inc.citizen_name}</strong>
                    </span>

                    <button
                      onClick={() => handleUpvote(inc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        hasUpvoted
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-cyan-950'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Apoiar ({inc.upvotes})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
