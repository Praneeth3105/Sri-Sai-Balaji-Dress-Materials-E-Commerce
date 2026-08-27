import React from "react";
import { Mail, CheckCircle2 } from "lucide-react";

const Verify = () => {
  return (
    <div className="relative w-full h-[760px] overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 px-4">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl shadow-orange-200/50 border border-orange-100 w-full max-w-md text-center transition-all duration-300 hover:shadow-orange-300/40">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center ring-8 ring-orange-50">
            <Mail className="w-9 h-9 text-orange-500" strokeWidth={1.8} />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-3 tracking-tight">
            Check Your Mail
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm md:text-base font-serif leading-relaxed mb-6">
            We've sent you an email to verify your account. Please check your
            inbox and click the verification link to continue.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs uppercase tracking-widest text-gray-400 font-sans">
              Almost there
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Status hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 py-3 px-4 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">
              Didn't get it? Check your spam folder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
