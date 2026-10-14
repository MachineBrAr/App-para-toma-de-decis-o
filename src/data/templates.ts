import { TemplateScenario } from '../types/decision';

export const TEMPLATES_PT: TemplateScenario[] = [
  {
    id: 'startup-vs-corporativo',
    category: 'carreira',
    title: 'Aceitar oferta de Startup com equity ou continuar na Empresa Consolidada?',
    description: 'Dilema clássico entre estabilidade com crescimento previsível vs alto potencial de ganho e impacto com risco.',
    options: [
      'Aceitar proposta da Startup (Salário + 1% Equity)',
      'Permanecer na Empresa Atual com promoção futura prometida',
    ],
    context: 'Tenho 6 meses de reserva de emergência e busco acelerar minha carreira, mas me preocupo com ritmo de trabalho extenuante e segurança de longo prazo.',
    priorities: ['Crescimento Acelerado', 'Segurança Financeira', 'Equilíbrio Trabalho/Vida'],
  },
  {
    id: 'comprar-vs-alugar',
    category: 'financas',
    title: 'Comprar o primeiro imóvel financiado ou continuar alugando e investindo a diferença?',
    description: 'Decisão patrimonial entre ter a chave da casa própria vs liquidez e flexibilidade geográfica.',
    options: [
      'Comprar apartamento com financiamento de 30 anos',
      'Continuar morando de aluguel e investir excedente em carteira diversificada',
    ],
    context: 'Tenho entrada de 20%. Quero constituir família nos próximos 3 anos, mas ainda não tenho certeza se ficarei na mesma cidade.',
    priorities: ['Segurança Emocional', 'Retorno do Patrimônio Líquido', 'Flexibilidade de Mudança'],
  },
  {
    id: 'mvp-agora-vs-polir',
    category: 'negocios',
    title: 'Lançar o MVP do produto agora como está ou gastar mais 3 meses polindo recursos?',
    description: 'Dúvida entre validar no mercado com usuários reais vs risco de primeira impressão com produto inacabado.',
    options: [
      'Lançar MVP imediatamente para os 100 primeiros clientes da lista de espera',
      'Adiar lançamento por 90 dias para implementar onboarding automatizado e integrações',
    ],
    context: 'O concorrente acabou de captar investimento seed. Nosso orçamento dura mais 5 meses de pista.',
    priorities: ['Velocidade de Feedback', 'Preservação de Caixa', 'Reputação da Marca'],
  },
  {
    id: 'transicao-carreira',
    category: 'carreira',
    title: 'Fazer transição para Inteligência Artificial / Produto ou virar Gestor na minha área?',
    description: 'Pivotar para um mercado em explosão recomeçando um degrau abaixo vs liderar equipe na área de domínio.',
    options: [
      'Transicionar para Product Manager com foco em IA',
      'Assumir coordenação / gerência da minha área atual',
    ],
    context: 'Sinto que minha área atual está estagnando, mas tenho reputação sólida e bom salário. IA é meu fascínio.',
    priorities: ['Relevância no Futuro', 'Remuneração Imediata', 'Satisfação Intelectual'],
  },
  {
    id: 'morar-exterior',
    category: 'pessoal',
    title: 'Aceitar oferta de transferência para filial na Europa ou permanecer no Brasil perto da família?',
    description: 'Experiência de vida internacional e moeda forte vs rede de apoio familiar e conforto cultural.',
    options: [
      'Aceitar expatriação para Lisboa/Madri por 2 anos',
      'Permanecer no Brasil trabalhando remoto',
    ],
    context: 'Pais estão envelhecendo com boa saúde, mas oportunidade internacional raramente aparece com visto pago.',
    priorities: ['Bagagem Cultural', 'Vínculos Familiares', 'Poder de Compra'],
  },
];

export const TEMPLATES_EN: TemplateScenario[] = [
  {
    id: 'startup-vs-corporate',
    category: 'carreira',
    title: 'Accept Startup Offer with Equity or Stay at Established Corporate Job?',
    description: 'Weigh predictable corporate progression against high upside and fast-paced autonomy.',
    options: [
      'Join high-growth Series A Startup (Equity + Salary)',
      'Stay at Fortune 500 company on leadership promotion track',
    ],
    context: 'I have 6 months of emergency savings. Eager for autonomy but worried about burnout.',
    priorities: ['Career Acceleration', 'Financial Safety', 'Work-Life Balance'],
  },
  {
    id: 'buy-vs-rent',
    category: 'financas',
    title: 'Buy a Home with 30-yr Mortgage or Rent and Invest in Index Funds?',
    description: 'The classic asset decision: emotional rootedness vs capital mobility and liquidity.',
    options: [
      'Buy a home with 20% down payment',
      'Rent modern flat and auto-invest surplus in index funds',
    ],
    context: 'May relocate within 3-4 years, but homeownership has been a lifelong aspiration.',
    priorities: ['Emotional Peace of Mind', 'Capital Growth Rate', 'Geographic Mobility'],
  },
];
