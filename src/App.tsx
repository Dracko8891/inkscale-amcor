import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { AmcorLogo } from './components/AmcorLogo';
import { useState } from 'react';

type Tab = 'lotes' | 'pesagem' | 'estoque' | 'config' | 'cores';

export default function App() {
  const { user, profile, loading, signOut, hasRole } = useAuth();
  const [tab, setTab] = useState<Tab>('lotes');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#00284D]">
        <div className="text-white text-lg animate-pulse">Carregando InkScale...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const navItems: { id: Tab; label: string; roles?: ('ADMIN' | 'COLORISTA' | 'OPERADOR' | 'VIEWER')[] }[] = [
    { id: 'lotes', label: 'Lotes & Fórmulas' },
    { id: 'pesagem', label: 'Pesagem' },
    { id: 'estoque', label: 'Estoque / Sortimentos' },
    { id: 'cores', label: 'Cores / Pantone' },
    { id: 'config', label: 'Configurações', roles: ['ADMIN', 'COLORISTA'] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-[#00284D] text-white px-4 py-3 flex items-center justify-between shadow-lg no-print">
        <AmcorLogo variant="light" />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{profile?.displayName || user.email}</div>
            <div className="text-xs text-cyan-300 uppercase tracking-wide">{profile?.role}</div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm border border-white/20"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 px-2 overflow-x-auto no-print">
        <div className="flex gap-1 min-w-max">
          {navItems
            .filter((item) => !item.roles || hasRole(item.roles))
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  tab === item.id
                    ? 'border-[#009FDF] text-[#00284D]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {tab === 'lotes' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-display font-bold text-[#00284D]">Lotes de Formulação</h1>
            <p className="text-slate-600">
              Importe planilhas com abas <strong>Flexo</strong>, <strong>Letter</strong> e <strong>Tintas</strong>.
              Os sortimentos (bases/pigmentos) são cadastrados e controlados em KG. Ao formular, o estoque é deduzido automaticamente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="text-3xl font-bold text-[#009FDF]">—</div>
                <div className="text-sm text-slate-500 mt-1">Lotes ativos</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="text-3xl font-bold text-[#009639]">—</div>
                <div className="text-sm text-slate-500 mt-1">Sortimentos em estoque</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="text-3xl font-bold text-amber-500">—</div>
                <div className="text-sm text-slate-500 mt-1">Abaixo do mínimo</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
              Área de listagem / importação Excel (Flexo · Letter · Tintas).
              Use o arquivo de referência DTI e o cadastro de cores anexados.
            </div>
          </div>
        )}

        {tab === 'pesagem' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-display font-bold text-[#00284D]">Pesagem / Modo Paisagem</h1>
            <p className="text-slate-600">
              No mobile, ao girar para paisagem o app entra automaticamente no modo pesagem com display da balança,
              teclado numérico e teclas F1–F4. Status da balança: ícone verde (conectada) ou vermelho cortado (desconectada).
            </p>
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-center justify-center min-h-[280px]">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold tabular-nums text-[#00284D]">0,00 g</div>
                <div className="text-sm text-slate-500 mt-2">Aguardando conexão com balança PRIX</div>
                <div className="mt-3 inline-flex items-center gap-2 text-red-600 text-sm font-medium">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Balança desconectada
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1">
                  {['F1','F2','F3','F4'].map((k) => (
                    <button key={k} className="h-10 rounded bg-[#00284D] text-white text-sm font-semibold">{k}</button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['7','8','9','4','5','6','1','2','3','C','0','↵'].map((k) => (
                    <button key={k} className="w-14 h-14 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-lg font-semibold">
                      {k}
                    </button>
                  ))}
                </div>
                <button className="w-full py-3 bg-[#009639] text-white rounded-lg font-semibold">
                  Imprimir Etiqueta
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'estoque' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-display font-bold text-[#00284D]">Estoque de Sortimentos (Bases / Pigmentos)</h1>
            <p className="text-slate-600">
              Cadastro de bases e pigmentos em KG. Toda formulação deduz automaticamente do estoque.
              Controle de compra quando atingir o estoque mínimo. Importação/exportação pela aba Tintas.
            </p>
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
              Tabela de sortimentos + botões Importar / Exportar Excel (aba Tintas) + ajuste manual de estoque.
              <br />
              Schema Kubelka-Munk disponível para integração futura de color matching.
            </div>
          </div>
        )}

        {tab === 'cores' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-display font-bold text-[#00284D]">Cores & Pantone LIVE</h1>
            <p className="text-slate-600">
              Modo gratuito (sem usuário/senha) ou conta corporativa (servidor + usuário + senha).
              LED verde = conexão ativa e funcionando · LED vermelho = off / erro.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Pantone LIVE offline
              </span>
            </div>
          </div>
        )}

        {tab === 'config' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-display font-bold text-[#00284D]">Configurações</h1>

            <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-semibold text-lg">Balança PRIX — Calibração & Diagnóstico</h2>
              <p className="text-sm text-slate-500">
                Escolha porta serial (Web Serial) ou Bluetooth Serial (Web Bluetooth API). Visualize frames em tempo real.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Tipo de conexão</label>
                  <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2">
                    <option>Web Serial (cabo)</option>
                    <option>Web Bluetooth</option>
                    <option>Simulador PRIX</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Baud rate</label>
                  <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2">
                    <option>9600</option>
                    <option>19200</option>
                    <option>38400</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg h-32 overflow-auto">
                [pronto] Aguardando conexão com a balança...
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-[#009FDF] text-white rounded-lg text-sm font-medium">Conectar</button>
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm">Solicitar peso (P)</button>
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm">Tara (T)</button>
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm">Limpar log</button>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-semibold text-lg">Pantone LIVE</h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="pantoneMode" defaultChecked /> Modo gratuito / público
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="pantoneMode" /> Conta corporativa
                </label>
              </div>
              <button className="px-4 py-2 bg-[#009639] text-white rounded-lg text-sm font-medium">
                Testar conexão Pantone
              </button>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 px-4 py-2 text-xs text-slate-400 text-center no-print">
        Amcor InkScale · Central de Tintas · Flexo / Letter · PRIX · Pantone LIVE · Firebase Auth
      </footer>
    </div>
  );
}
