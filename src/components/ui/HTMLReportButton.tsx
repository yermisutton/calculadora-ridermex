import React, { useState } from 'react';
import { Download, FileText, CheckCircle, User, Phone, Mail, Globe, FileDown } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { generateSpecializedHTMLReport, generateSpecializedPDFReport, ReportType } from '../../utils/htmlReportGenerator';

interface HTMLReportButtonProps {
  reportType: ReportType;
  buttonText?: string;
  className?: string;
}

const HTMLReportButton: React.FC<HTMLReportButtonProps> = ({ 
  reportType, 
  buttonText,
  className = ''
}) => {
  const { investment, results } = useCalculator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'complete'>('idle');
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf'>('html');
  const [advisorInfo, setAdvisorInfo] = useState({
    advisorName: investment.executiveName || '',
    advisorPhone: investment.executivePhone || '+52 55 1000 0615',
    advisorEmail: investment.executiveEmail || 'inversiones@cosechacapital.com'
  });

  if (!results) return null;

  const getDefaultButtonText = () => {
    return 'Reporte HTML Completo';
  };

  const handleGenerateReport = (format: 'html' | 'pdf' = selectedFormat) => {
    if (!advisorInfo.advisorName.trim()) {
      alert('Por favor ingresa el nombre del asesor');
      return;
    }

    setDownloadStatus('downloading');

    try {
      if (format === 'pdf') {
        generateSpecializedPDFReport(investment, results, {
          ...advisorInfo,
          clientName: investment.investorName,
          reportType,
          downPaymentPercent: investment.financingDownPaymentPercent,
          annualInterestRate: investment.financingAnnualInterestRate
        });
      } else {
        generateSpecializedHTMLReport(investment, results, {
          ...advisorInfo,
          clientName: investment.investorName,
          reportType,
          downPaymentPercent: investment.financingDownPaymentPercent,
          annualInterestRate: investment.financingAnnualInterestRate
        });
      }
      
      setTimeout(() => {
        setDownloadStatus('complete');
        setIsModalOpen(false);
        setTimeout(() => setDownloadStatus('idle'), 2000);
      }, 1500);
    } catch (error) {
      console.error('Error generating report:', error);
      setDownloadStatus('idle');
      alert('Error al generar el reporte HTML. Por favor intenta de nuevo.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Globe className="w-5 h-5" />
        <span>{buttonText || getDefaultButtonText()}</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {getDefaultButtonText()}
              </h3>
              <p className="text-gray-600 text-sm">
                Completa la información del asesor para generar el reporte personalizado
              </p>
            </div>

            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato del Reporte
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedFormat('html')}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      selectedFormat === 'html'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">HTML</div>
                      <div className="text-xs text-gray-500">Archivo web interactivo</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      selectedFormat === 'pdf'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FileDown className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">PDF</div>
                      <div className="text-xs text-gray-500">Documento imprimible</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Asesor
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={advisorInfo.advisorName}
                    onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo del asesor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del Asesor
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={advisorInfo.advisorPhone}
                    onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorPhone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+52 55 1000 0615"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email del Asesor
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={advisorInfo.advisorEmail}
                    onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorEmail: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="asesor@citruspatrimonial.mx"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={downloadStatus === 'downloading'}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleGenerateReport()}
                disabled={downloadStatus === 'downloading'}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  downloadStatus === 'complete' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {downloadStatus === 'idle' && (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Generar {selectedFormat.toUpperCase()}</span>
                  </>
                )}
                {downloadStatus === 'downloading' && (
                  <>
                    <FileText className="w-5 h-5 animate-pulse" />
                    <span>Generando {selectedFormat.toUpperCase()}...</span>
                  </>
                )}
                {downloadStatus === 'complete' && (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>¡Descargado!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HTMLReportButton;