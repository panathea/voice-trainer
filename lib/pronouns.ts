// Pronoun configuration and utilities

export interface PronounSet {
  id: string;
  name: string;
  forms: {
    subject: string;      // she/he/they/ze/xe/e/fae
    object: string;       // her/him/them/zir/xem/em/faer
    possessive: string;   // her/his/their/zir/xer/eir/faer
    possessivePronoun: string; // hers/his/theirs/zirs/xers/eirs/faers
    reflexive: string;    // herself/himself/themselves/zirself/xemself/emself/faerself
  };
  verbConjugation: 'singular' | 'plural';
}

export const PRONOUN_SETS: Record<string, PronounSet> = {
  random: {
    id: 'random',
    name: 'Random',
    forms: {
      subject: '',
      object: '',
      possessive: '',
      possessivePronoun: '',
      reflexive: '',
    },
    verbConjugation: 'singular',
  },
  original: {
    id: 'original',
    name: 'Original',
    forms: {
      subject: '',
      object: '',
      possessive: '',
      possessivePronoun: '',
      reflexive: '',
    },
    verbConjugation: 'singular',
  },
  she_her: {
    id: 'she_her',
    name: 'she/her',
    forms: {
      subject: 'she',
      object: 'her',
      possessive: 'her',
      possessivePronoun: 'hers',
      reflexive: 'herself',
    },
    verbConjugation: 'singular',
  },
  he_him: {
    id: 'he_him',
    name: 'he/him',
    forms: {
      subject: 'he',
      object: 'him',
      possessive: 'his',
      possessivePronoun: 'his',
      reflexive: 'himself',
    },
    verbConjugation: 'singular',
  },
  they_them: {
    id: 'they_them',
    name: 'they/them',
    forms: {
      subject: 'they',
      object: 'them',
      possessive: 'their',
      possessivePronoun: 'theirs',
      reflexive: 'themself',
    },
    verbConjugation: 'plural',
  },
  ze_zir: {
    id: 'ze_zir',
    name: 'ze/zir',
    forms: {
      subject: 'ze',
      object: 'zir',
      possessive: 'zir',
      possessivePronoun: 'zirs',
      reflexive: 'zirself',
    },
    verbConjugation: 'singular',
  },
  xe_xem: {
    id: 'xe_xem',
    name: 'xe/xem',
    forms: {
      subject: 'xe',
      object: 'xem',
      possessive: 'xer',
      possessivePronoun: 'xers',
      reflexive: 'xemself',
    },
    verbConjugation: 'singular',
  },
  e_em: {
    id: 'e_em',
    name: 'e/em',
    forms: {
      subject: 'e',
      object: 'em',
      possessive: 'eir',
      possessivePronoun: 'eirs',
      reflexive: 'emself',
    },
    verbConjugation: 'singular',
  },
  fae_faer: {
    id: 'fae_faer',
    name: 'fae/faer',
    forms: {
      subject: 'fae',
      object: 'faer',
      possessive: 'faer',
      possessivePronoun: 'faers',
      reflexive: 'faerself',
    },
    verbConjugation: 'singular',
  },
};

// Helper function to capitalize first letter
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Apply pronouns to a template sentence
export function applySentencePronouns(
  template: string,
  pronounSetId: string
): string {
  const pronounSet = PRONOUN_SETS[pronounSetId];
  
  // If original or no pronouns in template, return as-is
  if (pronounSetId === 'original' || !template.includes('{')) {
    return template;
  }

  let result = template;
  const forms = pronounSet.forms;
  const isPlural = pronounSet.verbConjugation === 'plural';

  // Replace pronouns (case-sensitive for capitalization)
  const replacements: Record<string, string> = {
    '{SUBJECT}': forms.subject,
    '{SUBJECT_CAP}': capitalize(forms.subject),
    '{OBJECT}': forms.object,
    '{OBJECT_CAP}': capitalize(forms.object),
    '{POSSESSIVE}': forms.possessive,
    '{POSSESSIVE_CAP}': capitalize(forms.possessive),
    '{POSSESSIVE_PRONOUN}': forms.possessivePronoun,
    '{POSSESSIVE_PRONOUN_CAP}': capitalize(forms.possessivePronoun),
    '{REFLEXIVE}': forms.reflexive,
    '{REFLEXIVE_CAP}': capitalize(forms.reflexive),
    
    // Verb conjugations
    '{WAS}': isPlural ? 'were' : 'was',
    '{WAS_CAP}': isPlural ? 'Were' : 'Was',
    '{IS}': isPlural ? 'are' : 'is',
    '{IS_CAP}': isPlural ? 'Are' : 'Is',
    '{HAS}': isPlural ? 'have' : 'has',
    '{HAS_CAP}': isPlural ? 'Have' : 'Has',
  };

  // Apply all replacements
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder, 'g'), replacement);
  }

  return result;
}

// Get list of pronoun set options for UI
export function getPronounSetOptions(): Array<{ id: string; name: string }> {
  return Object.values(PRONOUN_SETS).map(set => ({
    id: set.id,
    name: set.name,
  }));
}

