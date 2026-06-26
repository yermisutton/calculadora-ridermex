export const DISCLAIMER_HTML = `
  <div class="disclaimer">
    <h4>⚠️ Aviso Legal Importante</h4>
    <p>Las proyecciones mostradas en este reporte son estimaciones basadas en los parámetros especificados y datos históricos del sector agrícola.
    No constituyen garantías de rendimientos futuros. Los resultados reales pueden variar debido a factores de mercado,
    climáticos, económicos y otros riesgos inherentes a la inversión agrícola. Se recomienda consultar con un asesor financiero
    antes de tomar decisiones de inversión. Cosecha Capital no garantiza rendimientos específicos y toda inversión conlleva riesgos.</p>
    <p style="margin-top: 15px;"><strong>Este documento es únicamente informativo y no genera obligaciones contractuales.</strong>
    La información presentada no debe considerarse como asesoramiento legal, fiscal o de inversión.
    Todas las decisiones de inversión deben basarse en una evaluación completa de los documentos oficiales y contratos correspondientes.</p>
  </div>
`;

export const DISCLAIMER_STYLES = `
  .disclaimer {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    padding: 25px;
    border-radius: 12px;
    margin: 30px 0;
    border: 2px solid #f59e0b;
  }

  .disclaimer h4 {
    font-size: 1.3em;
    font-weight: bold;
    color: #92400e;
    margin-bottom: 15px;
  }

  .disclaimer p {
    color: #78350f;
    line-height: 1.5;
  }
`;

export const WHY_INVEST_HTML = `
  <div class="section why-invest-section">
    <h2 class="section-title" style="text-align: center; margin-bottom: 40px;">
      ¿Por Qué Invertir con Cosecha Capital?
    </h2>

    <!-- Argumentos de Inversión -->
    <div class="why-invest-grid">
      <!-- Card 1: Alto Rendimiento -->
      <div class="why-invest-card">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <h3>Alto Rendimiento y Potencial de Ganancia</h3>
          <p class="subtitle">Desde 18% hasta 27% mensual</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Rendimiento Mínimo Garantizado: 18%</strong>
              <p>Calculado en escenarios conservadores. En meses de buena cosecha puede alcanzar 26-27%</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Interés Compuesto Multiplicador</strong>
              <p>Una inversión de $200,000 puede convertirse en $25 millones en 20 años reinvirtiendo las ganancias</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Flujo Mensual Programable</strong>
              <p>Un Ticket de Inversión genera mínimo $6,000 mensuales. Dos hectáreas pueden generar $100,000 mensuales para el retiro</p>
            </div>
          </div>
          <div class="why-invest-stats">
            <div class="stat-item green">
              <span class="stat-value">18%</span>
              <span class="stat-label">Rendimiento Mínimo</span>
            </div>
            <div class="stat-item blue">
              <span class="stat-value">27%</span>
              <span class="stat-label">Rendimiento Máximo</span>
            </div>
            <div class="stat-item purple">
              <span class="stat-value">$6K+</span>
              <span class="stat-label">Flujo por Ticket de Inversión</span>
            </div>
          </div>
          <div class="why-invest-highlight green">
            18% - 27% rendimiento mensual en el mejor negocio del mundo: la tierra
          </div>
        </div>
      </div>

      <!-- Card 2: Seguridad Patrimonial -->
      <div class="why-invest-card">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3>Seguridad Patrimonial y Contra Riesgos Económicos</h3>
          <p class="subtitle">Protección total contra inflación y devaluación</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Plusvalía del Terreno</strong>
              <p>La tierra aumenta de valor cada año. Plusvalía del 12% anual. El Ticket de Inversión subió de $140K a $258K en año y medio</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Ganas en Dólares</strong>
              <p>100% exportación. Cobras en dólares, protegiéndote contra la devaluación del peso</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Inversión en Commodity</strong>
              <p>El limón subió 56-60% en un año (similar al oro). La inflación te ayuda en lugar de perjudicarte</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Resiliencia en Crisis</strong>
              <p>Durante la pandemia, el limón nunca dejó de venderse. Tu dinero sigue llegando ante cualquier eventualidad</p>
            </div>
          </div>
          <div class="why-invest-stats">
            <div class="stat-item blue">
              <span class="stat-value">12%</span>
              <span class="stat-label">Plusvalía Anual</span>
            </div>
            <div class="stat-item green">
              <span class="stat-value">+56%</span>
              <span class="stat-label">Aumento Precio Limón</span>
            </div>
            <div class="stat-item purple">
              <span class="stat-value">USD</span>
              <span class="stat-label">Cobro</span>
            </div>
          </div>
          <div class="why-invest-highlight blue">
            Inversión a prueba de inflación, devaluación y crisis económicas
          </div>
        </div>
      </div>

      <!-- Card 3: Modelo Pasivo -->
      <div class="why-invest-card">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3>Modelo 100% Pasivo y de Baja Demanda</h3>
          <p class="subtitle">Invierte sin pisar el campo</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Inversión Pasiva Total</strong>
              <p>No necesitas ser agricultor ni pisar los campos. La empresa maneja todo: compra, siembra, cosecha y venta</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Inversión en Talento Comprobado</strong>
              <p>Inviertes en un equipo exportador con historial familiar y experiencia demostrada en el sector</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Demanda Excedente</strong>
              <p>Si llegas a McAllen con un camión, se vende en 20 minutos. Expansión estratégica hacia Asia y EE.UU.</p>
            </div>
          </div>
          <div class="why-invest-stats">
            <div class="stat-item green">
              <span class="stat-value">0%</span>
              <span class="stat-label">Esfuerzo Requerido</span>
            </div>
            <div class="stat-item blue">
              <span class="stat-value">20 min</span>
              <span class="stat-label">Venta en McAllen</span>
            </div>
            <div class="stat-item purple">
              <span class="stat-value">Global</span>
              <span class="stat-label">Demanda</span>
            </div>
          </div>
          <div class="why-invest-highlight purple">
            Inversión 100% pasiva en un producto con demanda excedente mundial
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Confianza -->
    <h3 style="text-align: center; margin: 60px 0 30px 0; font-size: 28px; color: #1f2937;">
      Seguridad y Confianza
    </h3>

    <div class="why-invest-grid">
      <!-- Card 4: Seguridad Jurídica -->
      <div class="why-invest-card confidence">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3>Seguridad Jurídica y Transparencia Total</h3>
          <p class="subtitle">Tu dinero nunca entra a caja de la empresa</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Doble Fideicomiso</strong>
              <p>Fideicomiso de Tierra: Citrus no puede hipotecar ni vender. Fideicomiso del Dinero (697): Todo cae al fideicomiso, no a la empresa</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Auditorías y Proceso Notarial</strong>
              <p>Auditorías obligatorias cada 6 meses con proceso notarial que da fe de hechos con imágenes y firma</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon green">✓</div>
            <div>
              <strong>Reparto Automático</strong>
              <p>El fideicomiso reparte automáticamente: 65% inversionistas / 35% empresa. Citrus no controla el flujo</p>
            </div>
          </div>
          <div class="verification-badge green">
            ✓ Verificado por banco y notario público cada 6 meses
          </div>
        </div>
      </div>

      <!-- Card 5: Mitigación de Riesgos -->
      <div class="why-invest-card confidence">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3>Mitigación Total de Riesgos Operacionales</h3>
          <p class="subtitle">Imposible no recibir tu dinero</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Seguro de Vida de la Planta (100%)</strong>
              <p>Cubre 100% de replantación desde que se planta hasta que produce. Anexado al certificado</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon blue">✓</div>
            <div>
              <strong>Seguro de Cosecha (70%)</strong>
              <p>Una vez productivo, paga 70% de cosecha si hay pérdida por plaga, robo o huracán. Imposible no recibir dinero</p>
            </div>
          </div>
          <div class="verification-badge blue">
            ✓ Pólizas de seguro anexadas a cada certificado
          </div>
        </div>
      </div>

      <!-- Card 6: Ubicación Estratégica -->
      <div class="why-invest-card confidence">
        <div class="why-invest-header" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);">
          <div class="why-invest-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3>Ubicación Estratégica en Yucatán</h3>
          <p class="subtitle">El lugar más seguro y productivo</p>
        </div>
        <div class="why-invest-content">
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Estado Más Seguro</strong>
              <p>Yucatán es el estado más seguro de México y Latinoamérica. Cero extorsión, cero "cobro de piso"</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Protección contra Inundaciones</strong>
              <p>Terrenos a 150 metros sobre nivel del mar. Cero riesgo de inundación por huracanes o lluvias</p>
            </div>
          </div>
          <div class="why-invest-point">
            <div class="point-icon purple">✓</div>
            <div>
              <strong>Mejor Producto del Mercado</strong>
              <p>Injerto de naranja agria con limón persa sin semilla (calidad US One). Resistente a plagas y alta calidad de exportación</p>
            </div>
          </div>
          <div class="verification-badge purple">
            ✓ Certificación US One para exportación directa
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const WHY_INVEST_STYLES = `
  .why-invest-section {
    margin: 50px 0;
  }

  .why-invest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
  }

  .why-invest-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .why-invest-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .why-invest-header {
    padding: 25px;
    color: white;
    text-align: center;
  }

  .why-invest-icon {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
  }

  .why-invest-header h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .why-invest-header .subtitle {
    font-size: 14px;
    opacity: 0.95;
    margin: 0;
  }

  .why-invest-content {
    padding: 25px;
  }

  .why-invest-point {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
    align-items: flex-start;
  }

  .point-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    flex-shrink: 0;
  }

  .point-icon.green {
    background: #d1fae5;
    color: #065f46;
  }

  .point-icon.blue {
    background: #dbeafe;
    color: #1e40af;
  }

  .point-icon.purple {
    background: #ede9fe;
    color: #5b21b6;
  }

  .why-invest-point strong {
    display: block;
    color: #1f2937;
    margin-bottom: 4px;
    font-size: 15px;
  }

  .why-invest-point p {
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
    font-size: 14px;
  }

  .why-invest-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 20px 0;
    padding: 15px 0;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  .stat-item {
    text-align: center;
    padding: 10px;
    border-radius: 8px;
  }

  .stat-item.green {
    background: #d1fae5;
  }

  .stat-item.blue {
    background: #dbeafe;
  }

  .stat-item.purple {
    background: #ede9fe;
  }

  .stat-value {
    display: block;
    font-size: 22px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .stat-label {
    display: block;
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .why-invest-highlight {
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  }

  .why-invest-highlight.green {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
  }

  .why-invest-highlight.blue {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .why-invest-highlight.purple {
    background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
    color: #5b21b6;
  }

  .verification-badge {
    margin-top: 15px;
    padding: 12px 16px;
    border-radius: 8px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
  }

  .verification-badge.green {
    background: #d1fae5;
    color: #065f46;
    border: 2px solid #10b981;
  }

  .verification-badge.blue {
    background: #dbeafe;
    color: #1e40af;
    border: 2px solid #0284c7;
  }

  .verification-badge.purple {
    background: #ede9fe;
    color: #5b21b6;
    border: 2px solid #7c3aed;
  }

  @media print {
    .why-invest-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;
