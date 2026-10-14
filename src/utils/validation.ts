export interface OptionValidationResult {
  isVague: boolean;
  reason?: string;
  suggestions: string[];
}

const VAGUE_PATTERNS_PT = [
  /n[ãa]o sei/i,
  /n[ãa]o sei o que fazer/i,
  /sei l[áa]/i,
  /sei n[ãa]o/i,
  /tanto faz/i,
  /qualquer cois/i,
  /qualquer uma?/i,
  /deixar rolar/i,
  /deixar pra l[áa]/i,
  /ver no que d[áa]/i,
  /esperar pra ver/i,
  /nenhuma?/i,
  /^nada$/i,
  /^teste$/i,
  /^op[çc][ãa]o\s*[0-9a-z]?$/i,
  /^[?.\s_-]+$/,
];

const VAGUE_PATTERNS_EN = [
  /i don'?t know/i,
  /idk/i,
  /dunno/i,
  /whatever/i,
  /anything/i,
  /nothing/i,
  /none/i,
  /no idea/i,
  /wait and see/i,
  /^test$/i,
  /^option\s*[0-9a-z]?$/i,
];

export function validateOptionText(
  text: string,
  language: 'pt' | 'en'
): OptionValidationResult {
  const trimmed = text.trim();

  // Empty or too short
  if (!trimmed) {
    return {
      isVague: false, // will be handled by required check
      suggestions: [],
    };
  }

  if (trimmed.length < 3 && !/^[0-9a-z]{3,}$/i.test(trimmed)) {
    return {
      isVague: true,
      reason: language === 'pt' 
        ? 'A opção é curta demais para descrever um caminho acionável.'
        : 'This option is too short to describe an actionable path.',
      suggestions: language === 'pt'
        ? ['Manter situação atual', 'Adiar por 30 dias', 'Buscar mentoria']
        : ['Maintain status quo', 'Postpone for 30 days', 'Seek mentorship'],
    };
  }

  // Check vague patterns
  const patterns = language === 'pt' ? VAGUE_PATTERNS_PT : VAGUE_PATTERNS_EN;
  const isMatch = patterns.some((regex) => regex.test(trimmed));

  if (isMatch) {
    return {
      isVague: true,
      reason: language === 'pt'
        ? 'Esta frase expressa indecisão ou paralisia, não uma escolha concreta. O Tiebreaker precisa comparar caminhos executáveis.'
        : 'This phrase expresses indecision or inaction rather than an executable path. The Tiebreaker requires concrete choices to compare.',
      suggestions: language === 'pt'
        ? [
            'Manter o status quo (esperar e observar)',
            'Adiar a decisão por 30 dias para obter mais dados',
            'Buscar mentoria ou conversar com especialista',
            'Testar um projeto piloto de baixo risco',
          ]
        : [
            'Maintain status quo (observe & wait)',
            'Postpone decision by 30 days for data gathering',
            'Consult an expert or mentor',
            'Run a low-risk pilot experiment',
          ],
    };
  }

  return {
    isVague: false,
    suggestions: [],
  };
}
