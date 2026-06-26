import { Investment, InvestmentResults } from '../types';
import { generateCertificateEvolutionReport } from './reports/certificateEvolutionReport';
import { generateCompoundMultiplierReport } from './reports/compoundMultiplierReport';
import { generateComparativeAnalysisReport } from './reports/comparativeAnalysisReport';
import { generateCompleteAnalysisReport } from './reports/completeAnalysisReport';
import { generateExistingCompleteReport } from './reports/existingCompleteReport';
import { generateRidermexReport } from './reports/reportConfig';

export type ReportType = 'certificate-evolution' | 'compound-multiplier' | 'comparative-analysis' | 'complete-analysis' | 'existing-complete' | 'ridermex';

interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
  reportType: ReportType;
  downPaymentPercent?: number;
  annualInterestRate?: number;
}

export function generateSpecializedHTMLReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): void {
  try {
    let htmlContent: string;
    let filename: string;
    
    switch (options.reportType) {
      case 'ridermex':
        htmlContent = generateRidermexReport(investment, results, options);
        filename = `Reporte_RiderMex_${new Date().toISOString().split('T')[0]}.html`;
        break;
      case 'certificate-evolution':
        htmlContent = generateCertificateEvolutionReport(investment, results, options);
        filename = `Reporte_Evolucion_Certificados_${new Date().toISOString().split('T')[0]}.html`;
        break;
      case 'compound-multiplier':
        htmlContent = generateCompoundMultiplierReport(investment, results, options);
        filename = `Reporte_Multiplicador_${new Date().toISOString().split('T')[0]}.html`;
        break;
      case 'comparative-analysis':
        htmlContent = generateComparativeAnalysisReport(investment, results, options);
        filename = `Reporte_Comparativo_${new Date().toISOString().split('T')[0]}.html`;
        break;
      case 'complete-analysis':
      default:
        htmlContent = generateCompleteAnalysisReport(investment, results, options);
        filename = `Reporte_Completo_${new Date().toISOString().split('T')[0]}.html`;
        break;
      case 'existing-complete':
        htmlContent = generateExistingCompleteReport(investment, results, options);
        filename = `Analisis_Completo_Cosecha_Capital_${new Date().toISOString().split('T')[0]}.html`;
        break;
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error generating specialized HTML report:', error);
    throw error;
  }
}

export async function generateSpecializedPDFReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): Promise<void> {
  try {
    const html2pdfModule = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    let htmlContent: string;
    let filename: string;

    switch (options.reportType) {
      case 'ridermex':
        htmlContent = generateRidermexReport(investment, results, options);
        filename = `Reporte_RiderMex_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      case 'certificate-evolution':
        htmlContent = generateCertificateEvolutionReport(investment, results, options);
        filename = `Reporte_Evolucion_Certificados_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      case 'compound-multiplier':
        htmlContent = generateCompoundMultiplierReport(investment, results, options);
        filename = `Reporte_Multiplicador_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      case 'comparative-analysis':
        htmlContent = generateComparativeAnalysisReport(investment, results, options);
        filename = `Reporte_Comparativo_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      case 'complete-analysis':
        htmlContent = generateCompleteAnalysisReport(investment, results, options);
        filename = `Reporte_Completo_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      case 'existing-complete':
      default:
        htmlContent = generateExistingCompleteReport(investment, results, options);
        filename = `Analisis_Completo_Cosecha_Capital_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
    }

    // Optimize HTML for PDF generation
    const isRidermex = options.reportType === 'ridermex';
    const optimizedHtml = isRidermex ? htmlContent : optimizeHtmlForPdf(htmlContent);

    // Configure PDF options for better formatting
    const opt = {
      margin: isRidermex ? 0 : [0.3, 0.3, 0.3, 0.3],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: isRidermex ? 816 : 1200,
        windowHeight: isRidermex ? 1056 : 1600,
        backgroundColor: isRidermex ? null : '#000000'
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true,
        precision: 2
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.no-break'
      }
    };

    // Create a temporary hidden iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = isRidermex ? '8.5in' : '8.27in';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    try {
      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) {
        throw new Error('No se pudo acceder al documento del iframe temporal');
      }

      iframeDoc.open();
      iframeDoc.write(optimizedHtml);
      iframeDoc.close();

      // Inject override styles to clean margins and shadows for PDF printing
      const styleOverride = iframeDoc.createElement('style');
      styleOverride.textContent = `
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: ${isRidermex ? 'transparent' : '#000000'} !important;
          color: ${isRidermex ? '#1f2937' : '#d1d5db'} !important;
          font-family: ${isRidermex ? 'inherit' : 'system-ui, -apple-system, sans-serif'} !important;
        }
        .pdf-page {
          margin: 0 !important;
          box-shadow: none !important;
        }
      `;
      iframeDoc.head.appendChild(styleOverride);

      // Wait a brief moment for assets to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Generate PDF
      await html2pdf().set(opt).from(iframeDoc.body).save();
    } finally {
      // Remove temporary element
      if (iframe && document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }
  } catch (error) {
    console.error('Error generating specialized PDF report:', error);
    throw error;
  }
}

// Helper function to optimize HTML for PDF generation
function optimizeHtmlForPdf(htmlContent: string): string {
  return htmlContent
    // Add PDF-specific styles
    .replace('<style>', `<style>
      @page {
        margin: 0.3in;
        size: letter;
      }
      
      body {
        margin: 0;
        padding: 20px;
        font-size: 12px !important;
        line-height: 1.4 !important;
        color: #d1d5db !important;
        background: #000000 !important;
      }
      
      .page-break-before {
        page-break-before: always;
      }
      
      .page-break-after {
        page-break-after: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
      
      .section {
        page-break-inside: avoid;
        margin-bottom: 25px !important;
      }
      
      .header {
        page-break-after: avoid;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      .chart-section {
        page-break-inside: avoid;
      }
      
      .contact-section {
        page-break-before: auto;
      }
      
      .footer {
        page-break-before: avoid;
      }
      
      /* Reduce excessive white space */
      .section {
        padding: 20px !important;
        margin-bottom: 20px !important;
      }
      
      .metrics-grid {
        margin: 15px 0 !important;
      }
      
      .table-container {
        margin: 15px 0 !important;
      }
      
      h1, h2, h3, h4 {
        margin-bottom: 15px !important;
      }
      
      p {
        margin-bottom: 10px !important;
      }
      
    `)
    // Add no-break classes to important sections
    .replace(/class="section"/g, 'class="section no-break"')
    .replace(/class="chart-section"/g, 'class="chart-section no-break"')
    .replace(/class="table-container"/g, 'class="table-container no-break"')
    // Add page breaks before major sections
    .replace(/class="area-section"/g, 'class="area-section page-break-before"')
    .replace(/class="pillars-section"/g, 'class="pillars-section page-break-before"')
    .replace(/class="comparison-section"/g, 'class="comparison-section page-break-before"');
}