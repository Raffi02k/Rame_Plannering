import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const TokenInspector = () => {
    const { rawClaims, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!rawClaims) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(rawClaims, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-2xl w-full sm:w-auto">
            <div className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh] w-full' : 'max-h-12 w-48'}`}>
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                    <div className="flex items-center gap-2 text-blue-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Token Inspector</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>

                {/* Content */}
                {isOpen && (
                    <div className="p-4 flex flex-col gap-4 bg-slate-900/90 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                Raw Identity Claims ({user?.authMethod === 'oidc' ? 'Microsoft Entra ID' : 'Local Auth'})
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Kopierat!' : 'Kopiera JSON'}
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <pre className="relative p-4 bg-black/50 border border-slate-800 rounded-xl text-[11px] font-mono text-blue-300 overflow-auto max-h-[50vh] no-scrollbar shadow-inner">
                                {JSON.stringify(rawClaims, null, 2)}
                            </pre>
                        </div>

                        <div className="text-[10px] text-slate-500 italic">
                            Denna information används för att bestämma dina rättigheter i systemet (Admin/Personal/Brukare).
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
