import React, { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { type UnitEconomicsData, generateUnitEconomicsHTML } from '../../utils/unitEconomicsReportGenerator';

interface UnitEconomicsDownloadButtonsProps {
  data: UnitEconomicsData;
}

const UnitEconomicsDownloadButtons: React.FC<UnitEconomicsDownloadButtonsProps> = ({ data }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'complete'>('idle');
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf'>('pdf');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadHTML = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const htmlContent = generateUnitEconomicsHTML(data);

      if (!htmlContent || htmlContent.length === 0) {
        throw new Error('HTML content is empty');
      }

      if (!htmlContent.includes('</html>')) {
        throw new Error('HTML content is incomplete or corrupted');
      }

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Analisis-Economia-Unitaria-${timestamp}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Error downloading HTML:', err);
      setError('Error al generar el HTML. Por favor intenta nuevamente.');
      throw err;
    }
  };

  const generatePDF = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const timestamp = new Date().toISOString().split('T')[0];
        const htmlContent = generateUnitEconomicsHTML(data);

        const container = document.createElement('div');
        container.id = 'pdf-print-container';
        container.innerHTML = htmlContent;
        container.style.position = 'absolute';
        container.style.left = '-10000px';
        container.style.width = '210mm';
        document.body.appendChild(container);

        setTimeout(() => {
          try {
            const html2pdf = (window as any).html2pdf;
            if (!html2pdf) {
              throw new Error('html2pdf library not available');
            }

            const element = container.querySelector('body') || container;

            html2pdf()
              .set({
                margin: [10, 10, 10, 10],
                filename: `Analisis-Economia-Unitaria-${timestamp}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                  scale: 2,
                  useCORS: true,
                  logging: false,
                  backgroundColor: '#ffffff'
                },
                jsPDF: {
                  orientation: 'portrait',
                  unit: 'mm',
                  format: 'a4'
                }
              })
              .from(element)
              .save()
              .then(() => {
                if (container.parentNode) {
                  document.body.removeChild(container);
                }
                resolve();
              })
              .catch(() => {
                if (container.parentNode) {
                  document.body.removeChild(container);
                }
                reject(new Error('Error generating PDF'));
              });
          } catch (err) {
            if (container.parentNode) {
              document.body.removeChild(container);
            }
            reject(err);
          }
        }, 200);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDownload = async () => {
    setDownloadStatus('downloading');
    setError(null);

    try {
      if (selectedFormat === 'pdf') {
        await generatePDF();
      } else {
        downloadHTML();
      }

      setDownloadStatus('complete');
      setTimeout(() => {
        setDownloadStatus('idle');
        setShowModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al generar el reporte. Intenta de nuevo.');
      setDownloadStatus('idle');
    }
  };

  return (
    <>
      <div className="flex gap-3 justify-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold"
        >
          <Download className="w-5 h-5" />
          Descargar Reporte
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Descargar Reporte
              </h3>
              <p className="text-gray-400 text-sm">
                Selecciona el formato en que deseas descargar tu análisis
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Formato del Reporte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedFormat('html');
                    setError(null);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === 'html'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/40 text-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">HTML</div>
                  <div className="text-xs text-gray-500 mt-1">Interactivo</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedFormat('pdf');
                    setError(null);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === 'pdf'
                      ? 'border-red-500 bg-red-950/40 text-red-300'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/40 text-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">PDF</div>
                  <div className="text-xs text-gray-500 mt-1">Imprimible</div>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                }}
                disabled={downloadStatus === 'downloading'}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDownload}
                disabled={downloadStatus === 'downloading'}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-semibold ${
                  downloadStatus === 'complete'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : downloadStatus === 'downloading'
                    ? 'bg-gray-700 text-gray-300 opacity-75'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {downloadStatus === 'idle' && (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </>
                )}
                {downloadStatus === 'downloading' && (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                    <span>Generando...</span>
                  </>
                )}
                {downloadStatus === 'complete' && (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Descargado!</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
              <p className="text-xs text-yellow-300">
                <strong>Nota:</strong> El reporte contiene proyecciones con fines ilustrativos.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnitEconomicsDownloadButtons;
