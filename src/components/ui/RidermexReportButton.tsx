import React, { useState } from 'react';
import { Download, FileText, CheckCircle, User, Phone, Mail, X } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { generateSpecializedHTMLReport, generateSpecializedPDFReport } from '../../utils/htmlReportGenerator';

interface RidermexReportButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RidermexReportButton: React.FC<RidermexReportButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const { investment, results } = useCalculator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'complete'>('idle');
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf'>('pdf');
  const [advisorInfo, setAdvisorInfo] = useState({
    advisorName: investment.executiveName || '',
    advisorPhone: investment.executivePhone || '55 1000 0604',
    advisorEmail: investment.executiveEmail || 'informacion@ridermex.com'
  });

  if (!results) return null;

  const handleGenerateReport = async (format: 'html' | 'pdf' = selectedFormat) => {
    if (!advisorInfo.advisorName.trim()) {
      alert('Por favor ingresa el nombre del asesor');
      return;
    }

    setDownloadStatus('downloading');

    try {
      const reportOptions = {
        advisorName: advisorInfo.advisorName,
        advisorPhone: advisorInfo.advisorPhone,
        advisorEmail: advisorInfo.advisorEmail,
        reportType: 'ridermex' as const
      };

      if (format === 'pdf') {
        await generateSpecializedPDFReport(investment, results, reportOptions);
      } else {
        generateSpecializedHTMLReport(investment, results, reportOptions);
      }

      setDownloadStatus('complete');
      setTimeout(() => {
        setDownloadStatus('idle');
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte. Por favor intenta nuevamente.');
      setDownloadStatus('idle');
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg',
    secondary: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50'
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
          rounded-lg font-semibold
          transform transition-all duration-200
          hover:scale-105 hover:shadow-xl
          flex items-center gap-2
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        `}
      >
        <FileText className="w-5 h-5" />
        <span>Descargar Reporte RiderMex</span>
        <Download className="w-5 h-5" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reporte RiderMex
              </h2>
              <p className="text-gray-600 text-sm">
                Ingresa la información del asesor para generar el reporte
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre del Asesor
                </label>
                <input
                  type="text"
                  value={advisorInfo.advisorName}
                  onChange={(e) => setAdvisorInfo({ ...advisorInfo, advisorName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={advisorInfo.advisorPhone}
                  onChange={(e) => setAdvisorInfo({ ...advisorInfo, advisorPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="55 1000 0604"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={advisorInfo.advisorEmail}
                  onChange={(e) => setAdvisorInfo({ ...advisorInfo, advisorEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="informacion@ridermex.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato del Reporte
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`
                      px-4 py-3 rounded-lg border-2 transition-all
                      ${selectedFormat === 'pdf'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                      }
                    `}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedFormat('html')}
                    className={`
                      px-4 py-3 rounded-lg border-2 transition-all
                      ${selectedFormat === 'html'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                      }
                    `}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">HTML</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleGenerateReport(selectedFormat)}
              disabled={downloadStatus === 'downloading'}
              className={`
                w-full py-3 rounded-lg font-semibold text-white
                transform transition-all duration-200
                flex items-center justify-center gap-2
                ${downloadStatus === 'downloading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : downloadStatus === 'complete'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105'
                }
              `}
            >
              {downloadStatus === 'downloading' && (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando reporte...</span>
                </>
              )}
              {downloadStatus === 'complete' && (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Reporte descargado</span>
                </>
              )}
              {downloadStatus === 'idle' && (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descargar Reporte {selectedFormat.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RidermexReportButton;
