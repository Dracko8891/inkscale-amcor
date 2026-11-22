import React, { useState } from 'react';
import { AmcorLogo } from './AmcorLogo';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [loading, setLoading] = useState<'google' | 'microsoft' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha ao entrar com Google. Verifique a configuração Firebase.');
    } finally {
      setLoading(null);
    }
  };

  const handleMicrosoft = async () => {
    setLoading('microsoft');
    setError(null);
    try {
      await signInWithMicrosoft();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha ao entrar com Microsoft. Verifique o tenant e a configuração Firebase.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#00284D] via-[#003366] to-[#009FDF] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <AmcorLogo variant="dark" />
          <p className="text-slate-500 text-sm text-center">
            Central de Tintas · Formulação · Pesagem · Estoque
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition font-medium text-slate-700 disabled:opacity-60"
          >
            {loading === 'google' ? 'Entrando...' : 'Entrar com Google'}
          </button>

          <button
            onClick={handleMicrosoft}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition font-medium text-slate-700 disabled:opacity-60"
          >
            {loading === 'microsoft' ? 'Entrando...' : 'Entrar com Microsoft'}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
            <p className="mt-1 text-xs text-red-500">
              Em desenvolvimento, use as variáveis VITE_FIREBASE_* no arquivo .env
            </p>
          </div>
        )}

        <p className="text-xs text-center text-slate-400">
          Conta corporativa Microsoft libera acesso ao OneDrive / SharePoint interno.
          <br />
          Permissões granulares configuradas no perfil do usuário (ADMIN / COLORISTA / OPERADOR).
        </p>
      </div>

      <p className="mt-6 text-white/60 text-xs">
        Amcor InkScale · Central de Tintas · 2026
      </p>
    </div>
  );
}
