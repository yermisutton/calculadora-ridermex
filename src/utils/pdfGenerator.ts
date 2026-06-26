import { Investment, InvestmentResults } from '../types';
import { generateRidermexReport, ReportOptions } from './reports/reportConfig';

interface AdvisorInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export type ReportType = 'ridermex';

const reportGenerators = {
  ridermex: generateRidermexReport
};

const reportNames = {
  ridermex: 'RiderMex'
};

export const generateExpressPDF = async (
  investment: Investment,
  results: InvestmentResults,
  advisorInfo: AdvisorInfo,
  reportType: ReportType = 'ridermex'
): Promise<void> => {
  let tempIframe: HTMLIFrameElement | null = null;

  try {
    const html2pdfModule = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    if (!results.yearlyData || results.yearlyData.length === 0) {
      throw new Error('No hay datos disponibles para generar el reporte');
    }

    const reportOptions: ReportOptions = {
      advisorName: advisorInfo.name,
      advisorPhone: advisorInfo.phone,
      advisorEmail: advisorInfo.email,
      clientName: ''
    };

    const reportGenerator = reportGenerators[reportType];
    const htmlContent = reportGenerator(investment, results, reportOptions);

    const isRidermex = reportType === 'ridermex';

    tempIframe = document.createElement('iframe');
    tempIframe.style.position = 'absolute';
    tempIframe.style.left = '-9999px';
    tempIframe.style.top = '0';
    tempIframe.style.width = isRidermex ? '8.5in' : '8.27in';
    tempIframe.style.border = 'none';
    document.body.appendChild(tempIframe);

    const iframeDoc = tempIframe.contentWindow?.document || tempIframe.contentDocument;
    if (!iframeDoc) {
      throw new Error('No se pudo acceder al documento del iframe temporal');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Inject override styles to clean margins and shadows for PDF printing
    const styleOverride = iframeDoc.createElement('style');
    styleOverride.textContent = `
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      }
      .pdf-page {
        margin: 0 !important;
        box-shadow: none !important;
      }
    `;
    iframeDoc.head.appendChild(styleOverride);

    // Wait a brief moment for assets to process
    await new Promise((resolve) => setTimeout(resolve, 100));

    const opt = {
      margin: isRidermex ? 0 : [10, 10, 10, 10],
      filename: `Reporte-${reportNames[reportType]}-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: isRidermex ? 816 : 1200,
        windowHeight: isRidermex ? 1056 : 1600,
        backgroundColor: isRidermex ? null : '#000000'
      },
      jsPDF: { unit: 'mm', format: isRidermex ? 'letter' : 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(iframeDoc.body).save();

    if (tempIframe && document.body.contains(tempIframe)) {
      document.body.removeChild(tempIframe);
      tempIframe = null;
    }
  } catch (error) {
    console.error('Error detallado al generar PDF:', error);

    if (tempIframe && document.body.contains(tempIframe)) {
      try {
        document.body.removeChild(tempIframe);
      } catch (cleanupError) {
        console.error('Error limpiando elemento temporal:', cleanupError);
      }
    }

    if (error instanceof Error) {
      throw new Error(`Error al generar el PDF: ${error.message}`);
    } else {
      throw new Error('Error desconocido al generar el PDF. Por favor, intenta de nuevo.');
    }
  }
};

export const generateExpressHTML = (
  investment: Investment,
  results: InvestmentResults,
  advisorInfo: AdvisorInfo,
  reportType: ReportType = 'ridermex'
): void => {
  try {
    if (!results.yearlyData || results.yearlyData.length === 0) {
      throw new Error('No hay datos disponibles para generar el reporte');
    }

    const reportOptions: ReportOptions = {
      advisorName: advisorInfo.name,
      advisorPhone: advisorInfo.phone,
      advisorEmail: advisorInfo.email,
      clientName: ''
    };

    const reportGenerator = reportGenerators[reportType];
    const htmlContent = reportGenerator(investment, results, reportOptions);

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = `Reporte-${reportNames[reportType]}-${new Date().getTime()}.html`;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
};
