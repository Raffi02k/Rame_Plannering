import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, Building2, Fingerprint, Lock, AlertCircle } from "lucide-react";

export const LoginPage = () => {
    const { login, isAuthenticated, user } = useAuth();

    // Local login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect logic if already logged in
    if (isAuthenticated && user) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'staff' || user.role === 'personal') return <Navigate to="/staff" replace />;
        if (user.role === 'user' || user.role === 'brukare') return <Navigate to="/user" replace />;
        // Default fallback if role is unknown but authenticated
        return <Navigate to="/staff" replace />;
    }

    const handleMsalLogin = () => {
        login().catch((e) => console.error(e));
    };

    const handleLocalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            // Redirect happens automatically via the conditional check above
        } catch (err: any) {
            setError(err.message || 'Inloggning misslyckades');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c1117] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-xl z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 group ring-4 ring-blue-500/10 transition-all hover:scale-105">
                        <Fingerprint className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Rame Portal
                    </h1>
                    <p className="text-slate-400 font-medium">Logga in för att fortsätta</p>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-8 animate-in slide-in-from-bottom-5 duration-500">

                    {/* OIDC Section */}
                    <button
                        onClick={handleMsalLogin}
                        className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all ring-4 ring-blue-500/10"
                    >
                        <span className="inline-flex items-center justify-center w-6 h-6 transition-transform group-hover:translate-x-1">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                            </svg>
                        </span>
                        Logga in med Microsoft
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Eller användarkonto</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    {/* Local Login Section */}
                    <form onSubmit={handleLocalLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Användarnamn"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-200 outline-none transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Lösenord"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-200 outline-none transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-500/20">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold transition-all border border-slate-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Loggar in...' : 'Logga in Lokalt'}
                        </button>
                    </form>

                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] text-center pt-4">
                        Trollhättans Stad &bull; Säkerhetspolicy tillämpas
                    </p>
                </div>
            </div>
        </div>
    );
};
