import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  variant?: 'compact' | 'full';
}

export function DisclaimerBanner({ variant = 'compact' }: DisclaimerBannerProps) {
  if (variant === 'full') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>Aviso Legal Importante:</strong> Los resultados presentados son estimaciones basadas en proyecciones hipotéticas. No garantizan rendimientos futuros. RiderNation México, S.A.P.I. de C.V. (marca comercial RiderMex) no es una institución financiera regulada por la CNBV y no puede ofrecer asesoría financiera. Existe riesgo de pérdida de capital. Se recomienda consultar con un asesor independiente antes de invertir. Los datos utilizados en estos cálculos son únicamente ejemplares.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 mb-4 rounded text-xs text-yellow-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Aviso:</strong> Los resultados son estimaciones. Consulte con un asesor independiente. RiderNation no es institución regulada por CNBV. Existe riesgo de pérdida de capital.
        </p>
      </div>
    </div>
  );
}
