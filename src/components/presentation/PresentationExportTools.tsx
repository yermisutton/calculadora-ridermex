import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, Share2, QrCode, Download, Check, X } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';

const PresentationExportTools: React.FC = () => {
  const { investment, results, saveScenario } = useCalculator();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [sessionLink, setSessionLink] = useState('');

  const generatePDF = () => {
    const pdfButton = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
    if (pdfButton) {
      pdfButton.click();
      showSuccessMessage();
    } else {
      alert('Por favor ve a la sección de Resultados para generar el PDF completo');
    }
  };

  const generateShareableLink = () => {
    const sessionData = encodeURIComponent(JSON.stringify(investment));
    const link = `${window.location.origin}?session=${sessionData}`;
    setSessionLink(link);
    navigator.clipboard.writeText(link);
    showSuccessMessage();
  };

  const generateQRCode = () => {
    const compactData = {
      c: investment.initialCertificates,
      p: investment.certificateBasePrice,
      y: investment.years,
      r: investment.reinvestProfits,
      ap: investment.annualProfit
    };

    const sessionData = encodeURIComponent(JSON.stringify(compactData));
    const link = `https://calculadora2.cosechacapital.com?s=${sessionData}`;

    setSessionLink(link);
    setShowQRCode(true);
  };

  const sendEmail = () => {
    if (!email) return;

    const subject = encodeURIComponent('Tu Propuesta de Inversión Personalizada - Cosecha Capital');
    const body = encodeURIComponent(`
Hola,

Te comparto la proyección personalizada de tu inversión con Cosecha Capital:

Inversión Inicial: $${investment.initialPayment.toLocaleString()}
Plazo: ${investment.years} años
Rendimiento Anual: ${investment.annualProfit}%

${results ? `
Proyección:
- Patrimonio Final: $${results.finalPatrimony.toLocaleString()}
- Utilidades Totales: $${results.totalProfit.toLocaleString()}
- Retorno Estimado Total: ${results.roi.toFixed(2)}%
` : ''}

Link para ver la proyección completa:
${sessionLink || window.location.href}

Saludos,
Equipo Cosecha Capital
    `);

    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setShowEmailDialog(false);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Herramientas de Exportación</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.button
            onClick={generatePDF}
            className="flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-xl font-semibold transition-all border-2 border-red-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-6 h-6" />
            <div className="text-left">
              <div>Generar PDF</div>
              <div className="text-xs font-normal">Reporte completo</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setShowEmailDialog(true)}
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl font-semibold transition-all border-2 border-blue-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-6 h-6" />
            <div className="text-left">
              <div>Enviar por Email</div>
              <div className="text-xs font-normal">Resumen personalizado</div>
            </div>
          </motion.button>

          <motion.button
            onClick={generateShareableLink}
            className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl font-semibold transition-all border-2 border-green-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-6 h-6" />
            <div className="text-left">
              <div>Copiar Link</div>
              <div className="text-xs font-normal">Para compartir</div>
            </div>
          </motion.button>

          <motion.button
            onClick={generateQRCode}
            className="flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl font-semibold transition-all border-2 border-orange-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <QrCode className="w-6 h-6" />
            <div className="text-left">
              <div>Generar QR</div>
              <div className="text-xs font-normal">Escanear con móvil</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              const htmlButton = document.querySelector('[data-html-button]') as HTMLButtonElement;
              if (htmlButton) {
                htmlButton.click();
                showSuccessMessage();
              }
            }}
            className="flex items-center gap-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-xl font-semibold transition-all border-2 border-yellow-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-6 h-6" />
            <div className="text-left">
              <div>Descargar HTML</div>
              <div className="text-xs font-normal">Archivo interactivo</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              const scenarioName = `Sesión ${new Date().toLocaleString('es-MX')}`;
              saveScenario(scenarioName);
              showSuccessMessage();
            }}
            className="flex items-center gap-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 p-4 rounded-xl font-semibold transition-all border-2 border-cyan-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-6 h-6" />
            <div className="text-left">
              <div>Guardar Sesión</div>
              <div className="text-xs font-normal">En la memoria local</div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {showEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Enviar por Email</h3>
              <button
                onClick={() => setShowEmailDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-gray-900 focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && sendEmail()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={sendEmail}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
              <button
                onClick={() => setShowEmailDialog(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showQRCode && sessionLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Código QR</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl flex items-center justify-center mb-4">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sessionLink)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Escanea este código con tu móvil para acceder a la presentación
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
        >
          <Check className="w-6 h-6" />
          <span className="font-semibold">Operación exitosa</span>
        </motion.div>
      )}
    </>
  );
};

export default PresentationExportTools;
