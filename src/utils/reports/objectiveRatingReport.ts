interface Criterion {
  id: string;
  name: string;
  weight: number;
  color: string;
}

interface InvestmentScore {
  name: string;
  scores: Record<string, number>;
  color: string;
}

const criteria: Criterion[] = [
  { id: 'returns', name: 'Rendimiento Potencial', weight: 20, color: '#10b981' },
  { id: 'risk', name: 'Nivel de Riesgo', weight: 15, color: '#3b82f6' },
  { id: 'liquidity', name: 'Liquidez', weight: 10, color: '#8b5cf6' },
  { id: 'diversification', name: 'Diversificación', weight: 15, color: '#6366f1' },
  { id: 'inflation', name: 'Protección Inflación', weight: 10, color: '#f97316' },
  { id: 'tangible', name: 'Activo Tangible', weight: 10, color: '#f59e0b' },
  { id: 'income', name: 'Generación Ingresos', weight: 10, color: '#059669' },
  { id: 'impact', name: 'Impacto Social', weight: 5, color: '#ec4899' },
  { id: 'sustainability', name: 'Sostenibilidad', weight: 5, color: '#14b8a6' }
];

const investments: Record<string, InvestmentScore> = {
  cosechaCapital: {
    name: 'RiderMex',
    scores: { returns: 9, risk: 8, liquidity: 6, diversification: 9, inflation: 9, tangible: 10, income: 9, impact: 10, sustainability: 10 },
    color: '#10b981'
  },
  cetes: {
    name: 'CETES',
    scores: { returns: 6, risk: 9, liquidity: 10, diversification: 3, inflation: 5, tangible: 2, income: 6, impact: 3, sustainability: 3 },
    color: '#3b82f6'
  },
  savings: {
    name: 'Ahorro Tradicional',
    scores: { returns: 3, risk: 10, liquidity: 10, diversification: 2, inflation: 2, tangible: 1, income: 3, impact: 2, sustainability: 2 },
    color: '#8b5cf6'
  },
  realEstate: {
    name: 'Bienes Raíces',
    scores: { returns: 7, risk: 6, liquidity: 4, diversification: 5, inflation: 8, tangible: 9, income: 7, impact: 5, sustainability: 4 },
    color: '#f97316'
  }
};

function calculateWeightedScore(investmentKey: string): number {
  const investment = investments[investmentKey];
  let totalScore = 0;

  criteria.forEach(criterion => {
    const score = investment.scores[criterion.id];
    totalScore += (score * criterion.weight) / 100;
  });

  return totalScore;
}

function getScoreColor(score: number): string {
  if (score >= 9) return '#10b981';
  if (score >= 8) return '#059669';
  if (score >= 7) return '#f59e0b';
  if (score >= 6) return '#f97316';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 9.0) return 'Excelente';
  if (score >= 8.0) return 'Muy Bueno';
  if (score >= 7.0) return 'Bueno';
  if (score >= 6.0) return 'Regular';
  return 'Bajo';
}

export function generateObjectiveRatingHTML(): string {
  const cosechaScore = calculateWeightedScore('cosechaCapital');
  const rankings = Object.keys(investments)
    .map(key => ({
      key,
      ...investments[key],
      weightedScore: calculateWeightedScore(key)
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const criteriaRows = criteria.map((criterion, index) => {
    const cosechaScore = investments.cosechaCapital.scores[criterion.id];
    const barWidth = (cosechaScore / 10) * 100;
    const rowBg = index % 2 === 0 ? '#111827' : '#0f172a';

    return `
      <tr style="border-bottom: 1px solid #374151; background: ${rowBg};">
        <td style="padding: 12px 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${criterion.color};"></div>
            <span style="font-weight: 500; color: #f9fafb; font-size: 0.875rem;">${criterion.name}</span>
          </div>
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #9ca3af; font-size: 0.875rem;">
          ${criterion.weight}%
        </td>
        <td style="padding: 12px 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="flex: 1; height: 24px; background: #1f2937; border-radius: 6px; overflow: hidden; position: relative;">
              <div style="height: 100%; background: linear-gradient(90deg, ${criterion.color}, ${criterion.color}dd); width: ${barWidth}%; transition: width 0.3s ease; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 0.75rem; font-weight: 600; color: white; position: absolute; left: 50%; transform: translateX(-50%);">${cosechaScore}/10</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const rankingsHTML = rankings.map((inv, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
    const cardBg = index === 0 ? '#0f172a' : '#1a1a2e';
    const borderColor = index === 0 ? '#22c55e' : '#374151';
    const borderWidth = index === 0 ? '2px' : '1px';
    return `
      <div class="rating-card" style="background: ${cardBg}; border-radius: 12px; padding: 20px; border: ${borderWidth} solid ${borderColor}; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5rem;">${medal}</span>
            <div>
              <div style="font-weight: 600; color: #f9fafb; font-size: 1rem;">${inv.name}</div>
              <div style="font-size: 0.75rem; color: #9ca3af;">Posición ${index + 1}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.75rem; font-weight: bold; color: ${inv.color};">
              ${inv.weightedScore.toFixed(1)}
            </div>
            <div style="font-size: 0.75rem; color: #9ca3af; font-weight: 600;">
              ${getScoreLabel(inv.weightedScore)}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section rating-section" style="page-break-inside: avoid; background: #111827; border-left: 4px solid #dc2626; border-radius: 12px; padding: 30px;">
      <h2 class="section-title" style="font-size: 2em; font-weight: bold; color: #f9fafb; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #dc2626; text-align: center;">
        ⭐ Calificación Total Objetiva
      </h2>

      <p style="text-align: center; color: #9ca3af; margin-bottom: 30px; font-size: 1rem;">
        Promedio ponderado de 9 criterios fundamentales de inversión
      </p>

      <div class="rating-score-box" style="background: #0f172a; border-radius: 16px; padding: 40px; margin-bottom: 30px; border: 3px solid #06b6d4; text-align: center;">
        <div style="margin-bottom: 12px;">
          <span style="font-size: 1rem; color: #06b6d4; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">RiderMex</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 16px;">
          <div style="font-size: 5rem; font-weight: bold; color: ${getScoreColor(cosechaScore)}; line-height: 1;">
            ${cosechaScore.toFixed(1)}
          </div>
          <div style="text-align: left;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #f9fafb;">/ 10</div>
            <div style="font-size: 1rem; color: ${getScoreColor(cosechaScore)}; font-weight: 600;">
              ${getScoreLabel(cosechaScore)}
            </div>
          </div>
        </div>
        <div style="background: #1a1a2e; border-radius: 12px; padding: 16px; display: inline-block; border: 1px solid #374151;">
          <p style="color: #9ca3af; font-size: 0.875rem; margin: 0;">
            <strong style="color: #d1d5db;">Metodología:</strong> Análisis objetivo basado en 9 criterios clave ponderados por su importancia relativa en la toma de decisiones de inversión
          </p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h4 style="font-weight: bold; color: #f9fafb; margin-bottom: 20px; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
          📊 Desglose por Criterio
        </h4>
        <div style="overflow-x: auto; border: 2px solid #374151; border-radius: 12px; background: #0f172a;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: linear-gradient(135deg, #dc2626, #991b1b);">
              <tr>
                <th style="padding: 14px 8px; text-align: left; color: white; font-weight: 600; font-size: 0.875rem;">Criterio</th>
                <th style="padding: 14px 8px; text-align: center; color: white; font-weight: 600; font-size: 0.875rem;">Peso</th>
                <th style="padding: 14px 8px; text-align: left; color: white; font-weight: 600; font-size: 0.875rem;">Calificación</th>
              </tr>
            </thead>
            <tbody>
              ${criteriaRows}
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h4 style="font-weight: bold; color: #f9fafb; margin-bottom: 20px; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
          🏆 Ranking Comparativo
        </h4>
        ${rankingsHTML}
      </div>

      <div class="rating-notes" style="background: #0f172a; border-radius: 12px; padding: 20px; border: 2px solid #f59e0b;">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 1.5rem;">💡</div>
          <div>
            <h5 style="font-weight: 600; color: #f59e0b; margin-bottom: 8px; font-size: 1rem;">Notas Metodológicas</h5>
            <ul style="color: #f59e0b; font-size: 0.875rem; line-height: 1.6; margin-left: 20px;">
              <li style="margin-bottom: 6px;">Las calificaciones van de 1 a 10, donde 10 es la puntuación máxima</li>
              <li style="margin-bottom: 6px;">Cada criterio tiene un peso específico que refleja su importancia relativa</li>
              <li style="margin-bottom: 6px;">La calificación total es el promedio ponderado de todos los criterios</li>
              <li style="margin-bottom: 6px;">Este análisis es objetivo y se basa en características verificables de cada inversión</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
