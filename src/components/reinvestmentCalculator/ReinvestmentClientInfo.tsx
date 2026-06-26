import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, ChevronLeft, User, Phone, Mail, MapPin, Building, Calendar, Download, FileText, DollarSign, Clock } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN } from '../../utils/formatters';

interface ReinvestmentClientInfoProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentClientInfo: React.FC<ReinvestmentClientInfoProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();

  const generatePaymentScheduleHTML = () => {
    const totalInvestment = convertFromMXN(
      investment.initialCertificates * investment.certificateBasePrice,
      investment.currencyFormat,
      investment.exchangeRate,
      investment.exchangeRateEUR
    );
    const downPaymentAmount = totalInvestment * (investment.downPaymentPercentage / 100);
    const totalFinanced = totalInvestment - downPaymentAmount;
    const monthlyPayment = totalFinanced / 48;

    const currentDate = new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate down payment schedule
    let downPaymentScheduleHTML = '';
    if (investment.enableCustomDownPaymentSchedule && investment.customDownPaymentSchedule.length > 0) {
      downPaymentScheduleHTML = `
        <div class="schedule-section">
          <h3>📅 Cronograma de Pagos de Enganche</h3>
          <table>
            <thead>
              <tr>
                <th>Pago #</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${investment.customDownPaymentSchedule.map((payment, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(payment.date).toLocaleDateString('es-MX')}</td>
                  <td>${formatCurrency(convertFromMXN(payment.amount, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                  <td>${payment.description || 'Pago de enganche'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      downPaymentScheduleHTML = `
        <div class="schedule-section">
          <h3>📅 Pago de Enganche</h3>
          <div class="payment-card">
            <div class="payment-label">Enganche (${investment.downPaymentPercentage}%)</div>
            <div class="payment-amount">${formatCurrency(downPaymentAmount, investment.currencyFormat)}</div>
            <div class="payment-date">Fecha: Al firmar el contrato</div>
            ${investment.downPaymentInstallments > 1 ? `
              <div class="payment-note">En ${investment.downPaymentInstallments} pagos de ${formatCurrency(downPaymentAmount / investment.downPaymentInstallments, investment.currencyFormat)} cada uno</div>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Generate monthly payment schedule
    let monthlyScheduleHTML = '';
    if (investment.enableCustomPayments && investment.customPaymentSchedule.length > 0) {
      monthlyScheduleHTML = `
        <div class="schedule-section">
          <h3>📅 Cronograma de Pagos Mensuales Personalizado</h3>
          <table>
            <thead>
              <tr>
                <th>Pago #</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${investment.customPaymentSchedule.slice(0, 10).map((payment, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(payment.date).toLocaleDateString('es-MX')}</td>
                  <td>${formatCurrency(payment.amount, investment.currencyFormat)}</td>
                  <td>${payment.description || 'Pago mensual'}</td>
                </tr>
              `).join('')}
              ${investment.customPaymentSchedule.length > 10 ? `
                <tr>
                  <td colspan="4" style="text-align: center; font-style: italic; color: #6b7280;">
                    ... y ${investment.customPaymentSchedule.length - 10} pagos adicionales
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      `;
    } else if (totalFinanced > 0) {
      monthlyScheduleHTML = `
        <div class="schedule-section">
          <h3>📅 Pagos Mensuales Estándar</h3>
          <div class="payment-card">
            <div class="payment-label">Mensualidad</div>
            <div class="payment-amount">${formatCurrency(monthlyPayment, investment.currencyFormat)}</div>
            <div class="payment-date">48 pagos mensuales</div>
            <div class="payment-note">Inicio: Mes siguiente al enganche</div>
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cronograma de Pagos Personalizado - ${investment.investorName || 'Cliente'}</title>
        
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #1f2937;
            background: #f8fafc;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .header-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .logo {
            height: 80px;
            width: auto;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
          
          .header h1 {
            font-size: 2.5em;
            margin-bottom: 15px;
            font-weight: bold;
          }
          
          .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 10px;
          }
          
          .header .date {
            font-size: 1em;
            opacity: 0.8;
          }
          
          .content {
            padding: 30px;
          }
          
          .client-info {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #3b82f6;
          }
          
          .client-title {
            font-size: 1.5em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .client-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          
          .client-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #bfdbfe;
          }
          
          .client-label {
            font-size: 0.9em;
            color: #1e40af;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          .client-value {
            font-size: 1.1em;
            color: #374151;
            font-weight: 600;
          }
          
          .schedule-section {
            margin-bottom: 40px;
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
          }
          
          .schedule-section h3 {
            font-size: 1.4em;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .payment-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 2px solid #3b82f6;
          }
          
          .payment-label {
            font-size: 1.1em;
            color: #3b82f6;
            margin-bottom: 10px;
            font-weight: bold;
          }
          
          .payment-amount {
            font-size: 2em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          
          .payment-date {
            font-size: 1em;
            color: #374151;
            margin-bottom: 5px;
          }
          
          .payment-note {
            font-size: 0.9em;
            color: #6b7280;
            font-style: italic;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          th {
            background: #3b82f6;
            color: white;
            padding: 12px 10px;
            text-align: center;
            font-weight: bold;
            font-size: 0.9em;
          }
          
          td {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
            font-size: 0.9em;
          }
          
          tr:nth-child(even) {
            background: #f9fafb;
          }
          
          .summary-section {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            border: 2px solid #16a34a;
          }
          
          .summary-title {
            font-size: 1.4em;
            font-weight: bold;
            color: #16a34a;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #bbf7d0;
          }
          
          .summary-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #16a34a;
            margin-bottom: 5px;
          }
          
          .summary-label {
            font-size: 0.9em;
            color: #15803d;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
            color: #6b7280;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          
          .print-button:hover {
            background: #2563eb;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .print-button {
              display: none;
            }
            
            .container {
              box-shadow: none;
            }
          }
          
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }
            
            .content {
              padding: 20px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .header h1 {
              font-size: 2em;
            }
            
            .client-grid {
              grid-template-columns: 1fr;
            }
            
            .summary-grid {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Imprimir Cronograma</button>
        
        <div class="container">
          <!-- HEADER -->
          <div class="header">
            <div class="header-logos">
              <img src="/rider_inversiones.png" alt="Cosecha Capital" class="logo">
            </div>
            <h1>Cronograma de Pagos Personalizado</h1>
            <div class="subtitle">Cosecha Capital - Certificado de Crecimiento Exponencial</div>
            <div class="date">${currentDate}</div>
          </div>
          
          <div class="content">
            <!-- INFORMACIÓN DEL CLIENTE -->
            <div class="client-info">
              <div class="client-title">Información del Cliente</div>
              <div class="client-grid">
                <div class="client-item">
                  <div class="client-label">👤 Nombre del Inversionista</div>
                  <div class="client-value">${investment.investorName || 'No especificado'}</div>
                </div>
                <div class="client-item">
                  <div class="client-label">📞 Teléfono</div>
                  <div class="client-value">${investment.investorPhone || 'No especificado'}</div>
                </div>
                <div class="client-item">
                  <div class="client-label">📧 Email</div>
                  <div class="client-value">${investment.investorEmail || 'No especificado'}</div>
                </div>
              </div>
            </div>

            <!-- RESUMEN DE INVERSIÓN -->
            <div class="summary-section">
              <div class="summary-title">💰 Resumen de Inversión</div>
              <div class="summary-grid">
                <div class="summary-card">
                  <div class="summary-value">${investment.initialCertificates}</div>
                  <div class="summary-label">Certificados</div>
                </div>
                <div class="summary-card">
                  <div class="summary-value">${formatCurrency(totalInvestment, investment.currencyFormat)}</div>
                  <div class="summary-label">Inversión Total</div>
                </div>
                <div class="summary-card">
                  <div class="summary-value">${formatCurrency(downPaymentAmount, investment.currencyFormat)}</div>
                  <div class="summary-label">Enganche (${investment.downPaymentPercentage}%)</div>
                </div>
                <div class="summary-card">
                  <div class="summary-value">${formatCurrency(totalFinanced, investment.currencyFormat)}</div>
                  <div class="summary-label">A Financiar</div>
                </div>
                ${totalFinanced > 0 ? `
                  <div class="summary-card">
                    <div class="summary-value">${formatCurrency(monthlyPayment, investment.currencyFormat)}</div>
                    <div class="summary-label">Mensualidad</div>
                  </div>
                ` : ''}
              </div>
            </div>

            ${downPaymentScheduleHTML}
            ${monthlyScheduleHTML}


            <!-- CONTACTO -->
            <div style="background: #dbeafe; padding: 20px; border-radius: 12px; border: 2px solid #3b82f6;">
              <h4 style="color: #1e40af; font-size: 1.2em; margin-bottom: 15px; text-align: center;">📞 Información de Contacto</h4>
              <div style="text-align: center;">
                <p><strong>WhatsApp:</strong> 55 1000 0604</p>
                <p><strong>Email:</strong> informacion@ridermex.com</p>
                <p><strong>Horario:</strong> Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <p><strong>© 2026 RiderMex</strong></p>
            <p>Cronograma personalizado generado el ${currentDate}</p>
            <p><strong>Para dudas o modificaciones:</strong> informacion@ridermex.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPaymentSchedule = () => {
    const htmlContent = generatePaymentScheduleHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cronograma_pagos_${investment.investorName?.replace(/\s+/g, '_') || 'cliente'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-700/50">
        <div className="p-8 space-y-8">
          {/* Header con botón de descarga */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Información del Cliente</h3>
                  <p className="text-slate-300">Datos personales y cronograma de pagos</p>
                </div>
              </div>
              
              <button
                onClick={downloadPaymentSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                title="Descargar cronograma personalizado de pagos"
              >
                <Download className="w-5 h-5" />
                <span>Descargar Cronograma</span>
              </button>
            </div>
          </div>

          {/* Información del Inversionista */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              <span>Datos del Inversionista</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={investment.investorName}
                  onChange={(e) => updateInvestment({ investorName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre completo del inversionista"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={investment.investorPhone}
                  onChange={(e) => updateInvestment({ investorPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+52 55 1234 5678"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-200 mb-2">Email</label>
                <input
                  type="email"
                  value={investment.investorEmail}
                  onChange={(e) => updateInvestment({ investorEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="inversionista@email.com"
                />
              </div>
            </div>
          </div>

          {/* Información del Ejecutivo */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              <span>Datos del Ejecutivo/Asesor</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Nombre del Ejecutivo</label>
                <input
                  type="text"
                  value={investment.executiveName}
                  onChange={(e) => updateInvestment({ executiveName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nombre del ejecutivo de ventas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Teléfono del Ejecutivo</label>
                <input
                  type="tel"
                  value={investment.executivePhone}
                  onChange={(e) => updateInvestment({ executivePhone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="55 1000 0604"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-200 mb-2">Email del Ejecutivo</label>
                <input
                  type="email"
                  value={investment.executiveEmail}
                  onChange={(e) => updateInvestment({ executiveEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="ejecutivo@ridermex.com"
                />
              </div>
            </div>
          </div>

          {/* Cronograma de Pagos Personalizado */}
          {(investment.enableCustomDownPaymentSchedule || investment.enableCustomPayments) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Cronograma Personalizado Configurado</span>
                </h3>
                
                <button
                  onClick={downloadPaymentSchedule}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  <FileText className="w-5 h-5" />
                  <span>Ver Cronograma Completo</span>
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pagos de Enganche */}
                  {investment.enableCustomDownPaymentSchedule && investment.customDownPaymentSchedule.length > 0 && (
                    <div className="bg-dark-card p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Pagos de Enganche Programados
                      </h4>
                      <div className="space-y-2">
                        {investment.customDownPaymentSchedule.slice(0, 3).map((payment, index) => (
                          <div key={payment.id} className="flex justify-between items-center text-sm">
                            <span className="text-neutral-300">
                              {new Date(payment.date).toLocaleDateString('es-MX')}
                            </span>
                            <span className="font-medium text-amber-700">
                              {formatCurrency(convertFromMXN(payment.amount, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                            </span>
                          </div>
                        ))}
                        {investment.customDownPaymentSchedule.length > 3 && (
                          <div className="text-xs text-neutral-400 text-center">
                            ... y {investment.customDownPaymentSchedule.length - 3} pagos más
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Pagos Mensuales */}
                  {investment.enableCustomPayments && investment.customPaymentSchedule.length > 0 && (
                    <div className="bg-dark-card p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Pagos Mensuales Programados
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-300">Primer pago:</span>
                          <span className="font-medium text-amber-700">
                            {new Date(investment.customPaymentSchedule[0].date).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-300">Total pagos:</span>
                          <span className="font-medium text-amber-700">
                            {investment.customPaymentSchedule.length} mensualidades
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-300">Monto promedio:</span>
                          <span className="font-medium text-amber-700">
                            {formatCurrency(
                              investment.customPaymentSchedule.reduce((sum, p) => sum + p.amount, 0) / investment.customPaymentSchedule.length,
                              investment.currencyFormat
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Cronograma Activo</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Se ha configurado un cronograma personalizado de pagos. Haz clic en "Descargar Cronograma" 
                    para obtener el documento completo con todas las fechas y montos detallados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de Inversión */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 text-center">Resumen de tu Inversión</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-dark-card p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-300 mb-1">Certificados</div>
                <div className="text-xl font-bold text-green-700">{investment.initialCertificates}</div>
              </div>
              <div className="bg-dark-card p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-300 mb-1">Inversión Total</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(convertFromMXN(investment.initialCertificates * investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                </div>
              </div>
              <div className="bg-dark-card p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-300 mb-1">Plazo</div>
                <div className="text-xl font-bold text-purple-700">{investment.years} años</div>
              </div>
              <div className="bg-dark-card p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-300 mb-1">Utilidad Anual</div>
                <div className="text-xl font-bold text-orange-700">
                  {investment.ridermexProductType 
                    ? `${(investment.investorAnnualReturn || investment.averageSalePricePerKg || 0).toFixed(1)}%`
                    : `${((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-surface text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <span>Continuar</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReinvestmentClientInfo;