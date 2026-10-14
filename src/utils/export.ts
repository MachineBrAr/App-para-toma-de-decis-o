import { DecisionAnalysisResponse } from '../types/decision';

export function generateMarkdownReport(
  title: string,
  data: DecisionAnalysisResponse,
  language: 'pt' | 'en'
): string {
  const isPt = language === 'pt';

  let md = `# ${isPt ? 'Relatório de Decisão - The Tiebreaker' : 'Decision Report - The Tiebreaker'}\n\n`;
  md += `**${isPt ? 'Dilema / Decisão:' : 'Dilemma / Decision:'}** ${title}\n`;
  md += `**${isPt ? 'Data da Análise:' : 'Date:'}** ${new Date().toLocaleDateString()}\n\n`;
  md += `### ${isPt ? 'Resumo Executivo' : 'Executive Summary'}\n${data.summary}\n\n`;

  md += `## 🏆 ${isPt ? 'O Veredito do Tiebreaker' : 'The Tiebreaker Verdict'}\n\n`;
  md += `**${isPt ? 'Opção Recomendada:' : 'Recommended Option:'}** ${data.verdict.recommendedOptionName} (${isPt ? 'Confiança:' : 'Confidence:'} ${data.verdict.confidenceLevel})\n\n`;
  md += `> "${data.verdict.headline}"\n\n`;
  md += `**${isPt ? 'Justificativa Racional:' : 'Rational Verdict:'}**\n${data.verdict.rationalVerdict}\n\n`;
  md += `**${isPt ? 'O Fator de Desempate (The Clincher):' : 'The Clincher:'}**\n${data.verdict.theClincher}\n\n`;
  md += `**${isPt ? 'Teste do Alívio (Instinto):' : 'Gut-Check Question:'}**\n${data.verdict.gutCheckQuestion}\n\n`;

  md += `### ${isPt ? 'Plano de Ação Imediato' : 'Immediate Action Plan'}\n`;
  data.verdict.actionPlan.forEach((step) => {
    md += `- [ ] **Passo ${step.step}: ${step.title}** (${step.timeline}) - ${step.description}\n`;
  });
  md += `\n`;

  md += `## ⚖️ ${isPt ? 'Prós e Contras Ponderados' : 'Weighted Pros & Cons'}\n\n`;
  data.optionsAnalysis.forEach((opt) => {
    md += `### ${opt.name}\n\n`;
    md += `#### ${isPt ? 'Prós (+)' : 'Pros (+)'}\n`;
    opt.pros.forEach((p) => {
      md += `- **[+${p.weight} pts]** ${p.text} *(${p.category})* - ${p.explanation || ''}\n`;
    });
    md += `\n#### ${isPt ? 'Contras (-)' : 'Cons (-)'}\n`;
    opt.cons.forEach((c) => {
      md += `- **[-${c.weight} pts]** ${c.text} *(${c.category})* - ${c.mitigation ? `${isPt ? 'Mitigação: ' : 'Mitigation: '}${c.mitigation}` : ''}\n`;
    });
    md += `\n`;
  });

  md += `## 📊 ${isPt ? 'Tabela Comparativa Multicritério' : 'Multi-Criteria Comparison'}\n\n`;
  md += `| ${isPt ? 'Critério' : 'Criterion'} | ${isPt ? 'Peso' : 'Weight'} | ${data.optionsAnalysis.map((o) => o.name).join(' | ')} |\n`;
  md += `|---|---|${data.optionsAnalysis.map(() => '---').join('|')}|\n`;

  data.comparisonMatrix.criteria.forEach((crit) => {
    const scores = data.optionsAnalysis.map((opt) => {
      const s = data.comparisonMatrix.scores.find(
        (sc) => sc.optionId === opt.id && sc.criterionId === crit.id
      );
      return s ? `${s.score}/10` : '-';
    });
    md += `| ${crit.name} | ${crit.defaultWeight}x | ${scores.join(' | ')} |\n`;
  });
  md += `\n`;

  md += `## 🎯 ${isPt ? 'Análise SWOT (FOFA)' : 'SWOT Matrix'}\n\n`;
  data.optionsAnalysis.forEach((opt) => {
    md += `### ${opt.name}\n`;
    md += `- **${isPt ? 'Forças (Strengths):' : 'Strengths:'}** ${opt.swot.strengths.join('; ')}\n`;
    md += `- **${isPt ? 'Fraquezas (Weaknesses):' : 'Weaknesses:'}** ${opt.swot.weaknesses.join('; ')}\n`;
    md += `- **${isPt ? 'Oportunidades (Opportunities):' : 'Opportunities:'}** ${opt.swot.opportunities.join('; ')}\n`;
    md += `- **${isPt ? 'Ameaças (Threats):' : 'Threats:'}** ${opt.swot.threats.join('; ')}\n\n`;
  });

  md += `---\n*Gerado por The Tiebreaker - AI Decision Assistant*\n`;

  return md;
}
