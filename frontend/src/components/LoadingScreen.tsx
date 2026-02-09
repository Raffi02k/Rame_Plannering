import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const LoadingScreen: React.FC<{ label?: string }> = ({ label = "Loading session" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-purple-500/20 blur-[140px]" />
      <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl shadow-2xl">
        <DotLottieReact
          src="https://lottie.host/e3c1ed71-c514-4904-87ec-d265bb7cdbca/P8Gc2t7Me3.lottie"
          loop
          autoplay
          style={{ height: 180, width: 180 }}
        />
        <div className="text-xs uppercase tracking-[0.2em] text-slate-200">{label}</div>
      </div>
    </div>
  );
};
