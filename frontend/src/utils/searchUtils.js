// Diccionario de términos médicos y sus variantes
export const medicalTerms = {
  // Nombres de medicamentos y sus variantes comunes
  'fentanilo': ['fentalino', 'fentanil', 'fentanyl', 'fentalina'],
  'dexmedetomidina': ['dexmetedomidina', 'dexmed', 'precedex'],
  'midazolam': ['midazolan', 'dormicum'],
  'morfina': ['morfin', 'morfi'],
  'ketamina': ['ketamin', 'ketalar'],
  // Términos de presentación
  'ampolla': ['amp', 'amp.', 'ampolla'],
  'bolsa': ['bolsa', 'bag'],
  // Unidades de medida
  'mcg': ['mcg', 'µg', 'microgramos', 'microgramo'],
  'mg': ['mg', 'miligramos', 'miligramo'],
  'ml': ['ml', 'mililitros', 'mililitro'],
  // Vías de administración
  'intravenosa': ['iv', 'intravenosa', 'intravenoso', 'endovenosa'],
  'central': ['central', 'cvc', 'cateter central'],
  'periferico': ['periferico', 'periferica', 'vvp'],
};

// Palabras a ignorar en la búsqueda
export const stopWords = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'y', 'o', 'para', 'por', 'con', 'sin',
  'sobre', 'entre', 'detrás', 'después', 'antes',
  'durante', 'hacia', 'hasta', 'desde', 'como',
  'pero', 'sino', 'porque', 'pues', 'que', 'si',
  'bien', 'mal', 'así', 'mientras', 'tras',
  'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
  'me', 'te', 'se', 'nos', 'os', 'mi', 'tu', 'su',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'necesito', 'quiero', 'busco', 'cantidad', 'dar',
  'porfavor', 'por', 'favor', 'gracias', 'necesito', 'urgente', 'ayuda'
]);

// Función para normalizar términos médicos
export const normalizeMedicalTerm = (word) => {
  for (const [standardTerm, variants] of Object.entries(medicalTerms)) {
    if (variants.includes(word.toLowerCase())) {
      return standardTerm;
    }
  }
  return word;
};

// Función para calcular la relevancia de una coincidencia
export const calculateMatchRelevance = (medicationText, keyword) => {
  let score = 0;
  const text = medicationText.toLowerCase();
  const key = keyword.toLowerCase();

  // Coincidencia exacta
  if (text === key) return 100;

  // Coincidencia al inicio
  if (text.startsWith(key)) return 80;

  // Coincidencia como palabra completa
  if (text.includes(` ${key} `)) return 60;

  // Coincidencia parcial
  if (text.includes(key)) return 40;

  return score;
};

// Función para puntuar un medicamento
export const scoreMedication = (medication, keywords) => {
  let totalScore = 0;
  const fields = {
    name: { text: medication.name, weight: 10 },
    presentation: { text: medication.presentation, weight: 5 },
    dosage: { text: medication.dosage, weight: 4 },
    administration: { text: medication.administration, weight: 3 },
    concentration: { text: medication.concentration, weight: 3 },
    dilution: { text: medication.dilution, weight: 2 },
    observations: { text: medication.observations, weight: 1 }
  };

  keywords.forEach(keyword => {
    const normalizedKeyword = normalizeMedicalTerm(keyword);
    
    Object.entries(fields).forEach(([field, { text, weight }]) => {
      if (!text) return;
      const relevance = calculateMatchRelevance(text, normalizedKeyword);
      totalScore += relevance * weight;
    });
  });

  return totalScore;
};
