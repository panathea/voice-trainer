// Sentence templates with pronoun placeholders
// Placeholders: {SUBJECT}, {OBJECT}, {POSSESSIVE}, {REFLEXIVE}, {WAS}, {IS}, {HAS}
// _CAP variants for capitalized versions

import { applySentencePronouns } from './pronouns';

export interface SentenceTemplate {
  id: string;
  original: string;
  template: string;
  tags: string[];
}

export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  // Voice and Speech themed
  {
    id: 'voice-001',
    original: "The sound of her voice was like music to his ears.",
    template: "The sound of {POSSESSIVE} voice was like music to {POSSESSIVE} ears.",
    tags: ['voice'],
  },
  {
    id: 'voice-002',
    original: "He spoke with a clear and confident tone.",
    template: "{SUBJECT_CAP} spoke with a clear and confident tone.",
    tags: ['voice', 'speech'],
  },
  {
    id: 'voice-003',
    original: "Her words carried the weight of experience.",
    template: "{POSSESSIVE_CAP} words carried the weight of experience.",
    tags: ['speech'],
  },
  {
    id: 'voice-004',
    original: "The voice that answered was gentle and kind.",
    template: "The voice that answered was gentle and kind.",
    tags: ['voice'],
  },
  {
    id: 'voice-005',
    original: "She found her voice in the most unexpected moment.",
    template: "{SUBJECT_CAP} found {POSSESSIVE} voice in the most unexpected moment.",
    tags: ['voice'],
  },
  {
    id: 'voice-006',
    original: "His voice rang out across the valley.",
    template: "{POSSESSIVE_CAP} voice rang out across the valley.",
    tags: ['voice'],
  },
  {
    id: 'voice-007',
    original: "The power of speech is the power to inspire.",
    template: "The power of speech is the power to inspire.",
    tags: ['speech'],
  },
  {
    id: 'voice-008',
    original: "Words spoken with conviction can move mountains.",
    template: "Words spoken with conviction can move mountains.",
    tags: ['speech'],
  },
  {
    id: 'voice-009',
    original: "Her voice trembled with emotion.",
    template: "{POSSESSIVE_CAP} voice trembled with emotion.",
    tags: ['voice'],
  },
  {
    id: 'voice-010',
    original: "He cleared his throat and began to speak.",
    template: "{SUBJECT_CAP} cleared {POSSESSIVE} throat and began to speak.",
    tags: ['voice', 'speech'],
  },
  {
    id: 'voice-011',
    original: "The echo of her voice lingered in the air.",
    template: "The echo of {POSSESSIVE} voice lingered in the air.",
    tags: ['voice'],
  },
  {
    id: 'voice-012',
    original: "A soft voice can carry great strength.",
    template: "A soft voice can carry great strength.",
    tags: ['voice'],
  },
  {
    id: 'voice-013',
    original: "She spoke with the wisdom of ages.",
    template: "{SUBJECT_CAP} spoke with the wisdom of ages.",
    tags: ['voice', 'speech'],
  },
  {
    id: 'voice-014',
    original: "His voice grew stronger with each word.",
    template: "{POSSESSIVE_CAP} voice grew stronger with each word.",
    tags: ['voice'],
  },
  {
    id: 'voice-015',
    original: "The silence was broken by a single voice.",
    template: "The silence was broken by a single voice.",
    tags: ['voice'],
  },

  // Personal Growth and Self-Improvement
  {
    id: 'growth-001',
    original: "Every day is a chance to become better.",
    template: "Every day is a chance to become better.",
    tags: ['growth'],
  },
  {
    id: 'growth-002',
    original: "She knew that change begins from within.",
    template: "{SUBJECT_CAP} knew that change begins from within.",
    tags: ['growth'],
  },
  {
    id: 'growth-003',
    original: "The journey of self-discovery never truly ends.",
    template: "The journey of self-discovery never truly ends.",
    tags: ['growth'],
  },
  {
    id: 'growth-004',
    original: "He learned to trust his own judgment.",
    template: "{SUBJECT_CAP} learned to trust {POSSESSIVE} own judgment.",
    tags: ['growth'],
  },
  {
    id: 'growth-005',
    original: "Growth comes from facing our fears.",
    template: "Growth comes from facing our fears.",
    tags: ['growth'],
  },
  {
    id: 'growth-006',
    original: "She embraced the challenge with open arms.",
    template: "{SUBJECT_CAP} embraced the challenge with open arms.",
    tags: ['growth'],
  },
  {
    id: 'growth-007',
    original: "The path to wisdom is paved with experience.",
    template: "The path to wisdom is paved with experience.",
    tags: ['growth'],
  },
  {
    id: 'growth-008',
    original: "He chose courage over comfort.",
    template: "{SUBJECT_CAP} chose courage over comfort.",
    tags: ['growth'],
  },
  {
    id: 'growth-009',
    original: "Progress is made one step at a time.",
    template: "Progress is made one step at a time.",
    tags: ['growth'],
  },
  {
    id: 'growth-010',
    original: "She discovered strength she never knew she had.",
    template: "{SUBJECT_CAP} discovered strength {SUBJECT} never knew {SUBJECT} had.",
    tags: ['growth'],
  },
  {
    id: 'growth-011',
    original: "The greatest teacher is experience itself.",
    template: "The greatest teacher is experience itself.",
    tags: ['growth'],
  },
  {
    id: 'growth-012',
    original: "He learned to see failure as a stepping stone.",
    template: "{SUBJECT_CAP} learned to see failure as a stepping stone.",
    tags: ['growth'],
  },
  {
    id: 'growth-013',
    original: "Change is the only constant in life.",
    template: "Change is the only constant in life.",
    tags: ['growth'],
  },
  {
    id: 'growth-014',
    original: "She transformed her weakness into strength.",
    template: "{SUBJECT_CAP} transformed {POSSESSIVE} weakness into strength.",
    tags: ['growth'],
  },
  {
    id: 'growth-015',
    original: "The power to change lies within us all.",
    template: "The power to change lies within us all.",
    tags: ['growth'],
  },
  {
    id: 'growth-016',
    original: "He found peace in accepting himself.",
    template: "{SUBJECT_CAP} found peace in accepting {REFLEXIVE}.",
    tags: ['growth'],
  },
  {
    id: 'growth-017',
    original: "Every moment offers a chance to begin again.",
    template: "Every moment offers a chance to begin again.",
    tags: ['growth'],
  },
  {
    id: 'growth-018',
    original: "She learned that patience is a virtue worth cultivating.",
    template: "{SUBJECT_CAP} learned that patience is a virtue worth cultivating.",
    tags: ['growth'],
  },
  {
    id: 'growth-019',
    original: "The mind is capable of remarkable things.",
    template: "The mind is capable of remarkable things.",
    tags: ['growth'],
  },
  {
    id: 'growth-020',
    original: "He discovered that true strength comes from within.",
    template: "{SUBJECT_CAP} discovered that true strength comes from within.",
    tags: ['growth'],
  },

  // General Wisdom and Life Lessons
  {
    id: 'wisdom-001',
    original: "The sun rose over the distant mountains.",
    template: "The sun rose over the distant mountains.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-002',
    original: "Time flows like a river, steady and sure.",
    template: "Time flows like a river, steady and sure.",
    tags: ['wisdom'],
  },
  {
    id: 'wisdom-003',
    original: "The old tree stood strong against the wind.",
    template: "The old tree stood strong against the wind.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-004',
    original: "She watched the stars appear one by one.",
    template: "{SUBJECT_CAP} watched the stars appear one by one.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-005',
    original: "The morning brought fresh hope and promise.",
    template: "The morning brought fresh hope and promise.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-006',
    original: "He walked through fields of golden wheat.",
    template: "{SUBJECT_CAP} walked through fields of golden wheat.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-007',
    original: "The ocean stretched endlessly before them.",
    template: "The ocean stretched endlessly before {OBJECT}.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-008',
    original: "Nature teaches us lessons we often overlook.",
    template: "Nature teaches us lessons we often overlook.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-009',
    original: "The seasons change but beauty remains.",
    template: "The seasons change but beauty remains.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-010',
    original: "She felt the warmth of the afternoon sun.",
    template: "{SUBJECT_CAP} felt the warmth of the afternoon sun.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-011',
    original: "The moon cast silver light upon the water.",
    template: "The moon cast silver light upon the water.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-012',
    original: "He found solace in the quiet of the forest.",
    template: "{SUBJECT_CAP} found solace in the quiet of the forest.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-013',
    original: "The wind whispered secrets through the trees.",
    template: "The wind whispered secrets through the trees.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-014',
    original: "She admired the simplicity of the countryside.",
    template: "{SUBJECT_CAP} admired the simplicity of the countryside.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-015',
    original: "The garden bloomed with vibrant colors.",
    template: "The garden bloomed with vibrant colors.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-016',
    original: "He listened to the song of the morning birds.",
    template: "{SUBJECT_CAP} listened to the song of the morning birds.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-017',
    original: "The rain fell gently on the roof.",
    template: "The rain fell gently on the roof.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-018',
    original: "She treasured the peace of the evening hour.",
    template: "{SUBJECT_CAP} treasured the peace of the evening hour.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-019',
    original: "The flowers swayed in the gentle breeze.",
    template: "The flowers swayed in the gentle breeze.",
    tags: ['nature'],
  },
  {
    id: 'wisdom-020',
    original: "He marveled at the beauty of creation.",
    template: "{SUBJECT_CAP} marveled at the beauty of creation.",
    tags: ['nature'],
  },

  // Relationships and Human Connection
  {
    id: 'relation-001',
    original: "Friendship is a treasure beyond measure.",
    template: "Friendship is a treasure beyond measure.",
    tags: ['relationship'],
  },
  {
    id: 'relation-002',
    original: "She valued honesty above all else.",
    template: "{SUBJECT_CAP} valued honesty above all else.",
    tags: ['relationship'],
  },
  {
    id: 'relation-003',
    original: "Trust is built slowly and lost quickly.",
    template: "Trust is built slowly and lost quickly.",
    tags: ['relationship'],
  },
  {
    id: 'relation-004',
    original: "He learned the importance of kindness.",
    template: "{SUBJECT_CAP} learned the importance of kindness.",
    tags: ['relationship'],
  },
  {
    id: 'relation-005',
    original: "Love grows stronger through shared experiences.",
    template: "Love grows stronger through shared experiences.",
    tags: ['relationship'],
  },
  {
    id: 'relation-006',
    original: "She showed compassion to all she met.",
    template: "{SUBJECT_CAP} showed compassion to all {SUBJECT} met.",
    tags: ['relationship'],
  },
  {
    id: 'relation-007',
    original: "Understanding bridges the gap between hearts.",
    template: "Understanding bridges the gap between hearts.",
    tags: ['relationship'],
  },
  {
    id: 'relation-008',
    original: "He offered a helping hand without hesitation.",
    template: "{SUBJECT_CAP} offered a helping hand without hesitation.",
    tags: ['relationship'],
  },
  {
    id: 'relation-009',
    original: "Gratitude opens doors to happiness.",
    template: "Gratitude opens doors to happiness.",
    tags: ['relationship'],
  },
  {
    id: 'relation-010',
    original: "She cherished the bonds of family.",
    template: "{SUBJECT_CAP} cherished the bonds of family.",
    tags: ['relationship'],
  },
  {
    id: 'relation-011',
    original: "True friends stand by you in difficult times.",
    template: "True friends stand by you in difficult times.",
    tags: ['relationship'],
  },
  {
    id: 'relation-012',
    original: "He learned to listen with an open heart.",
    template: "{SUBJECT_CAP} learned to listen with an open heart.",
    tags: ['relationship'],
  },
  {
    id: 'relation-013',
    original: "Respect is earned through consistent action.",
    template: "Respect is earned through consistent action.",
    tags: ['relationship'],
  },
  {
    id: 'relation-014',
    original: "She treated everyone with equal dignity.",
    template: "{SUBJECT_CAP} treated everyone with equal dignity.",
    tags: ['relationship'],
  },
  {
    id: 'relation-015',
    original: "Forgiveness frees the soul from burden.",
    template: "Forgiveness frees the soul from burden.",
    tags: ['relationship'],
  },

  // Action and Determination
  {
    id: 'action-001',
    original: "She set her mind to the task at hand.",
    template: "{SUBJECT_CAP} set {POSSESSIVE} mind to the task at hand.",
    tags: ['determination'],
  },
  {
    id: 'action-002',
    original: "He refused to give up despite the odds.",
    template: "{SUBJECT_CAP} refused to give up despite the odds.",
    tags: ['determination'],
  },
  {
    id: 'action-003',
    original: "Determination fuels the fire of achievement.",
    template: "Determination fuels the fire of achievement.",
    tags: ['determination'],
  },
  {
    id: 'action-004',
    original: "She took the first step toward her goal.",
    template: "{SUBJECT_CAP} took the first step toward {POSSESSIVE} goal.",
    tags: ['determination'],
  },
  {
    id: 'action-005',
    original: "Action speaks louder than words alone.",
    template: "Action speaks louder than words alone.",
    tags: ['determination'],
  },
  {
    id: 'action-006',
    original: "He pursued his dreams with unwavering focus.",
    template: "{SUBJECT_CAP} pursued {POSSESSIVE} dreams with unwavering focus.",
    tags: ['determination'],
  },
  {
    id: 'action-007',
    original: "She faced each obstacle with renewed vigor.",
    template: "{SUBJECT_CAP} faced each obstacle with renewed vigor.",
    tags: ['determination'],
  },
  {
    id: 'action-008',
    original: "Perseverance is the key to success.",
    template: "Perseverance is the key to success.",
    tags: ['determination'],
  },
  {
    id: 'action-009',
    original: "He worked diligently toward his purpose.",
    template: "{SUBJECT_CAP} worked diligently toward {POSSESSIVE} purpose.",
    tags: ['determination'],
  },
  {
    id: 'action-010',
    original: "She proved that dedication yields results.",
    template: "{SUBJECT_CAP} proved that dedication yields results.",
    tags: ['determination'],
  },
  {
    id: 'action-011',
    original: "The will to succeed overcomes many barriers.",
    template: "The will to succeed overcomes many barriers.",
    tags: ['determination'],
  },
  {
    id: 'action-012',
    original: "He moved forward with steadfast resolve.",
    template: "{SUBJECT_CAP} moved forward with steadfast resolve.",
    tags: ['determination'],
  },
  {
    id: 'action-013',
    original: "She turned her vision into reality.",
    template: "{SUBJECT_CAP} turned {POSSESSIVE} vision into reality.",
    tags: ['determination'],
  },
  {
    id: 'action-014',
    original: "Effort and patience bring their own rewards.",
    template: "Effort and patience bring their own rewards.",
    tags: ['determination'],
  },
  {
    id: 'action-015',
    original: "He demonstrated that hard work pays off.",
    template: "{SUBJECT_CAP} demonstrated that hard work pays off.",
    tags: ['determination'],
  },

  // Thought and Reflection
  {
    id: 'thought-001',
    original: "She paused to consider her next move.",
    template: "{SUBJECT_CAP} paused to consider {POSSESSIVE} next move.",
    tags: ['reflection'],
  },
  {
    id: 'thought-002',
    original: "Reflection brings clarity to confusion.",
    template: "Reflection brings clarity to confusion.",
    tags: ['reflection'],
  },
  {
    id: 'thought-003',
    original: "He pondered the meaning of his experiences.",
    template: "{SUBJECT_CAP} pondered the meaning of {POSSESSIVE} experiences.",
    tags: ['reflection'],
  },
  {
    id: 'thought-004',
    original: "The quiet mind sees what the busy mind misses.",
    template: "The quiet mind sees what the busy mind misses.",
    tags: ['reflection'],
  },
  {
    id: 'thought-005',
    original: "She valued moments of peaceful contemplation.",
    template: "{SUBJECT_CAP} valued moments of peaceful contemplation.",
    tags: ['reflection'],
  },
  {
    id: 'thought-006',
    original: "Wisdom comes from thoughtful consideration.",
    template: "Wisdom comes from thoughtful consideration.",
    tags: ['reflection'],
  },
  {
    id: 'thought-007',
    original: "He learned to think before acting.",
    template: "{SUBJECT_CAP} learned to think before acting.",
    tags: ['reflection'],
  },
  {
    id: 'thought-008',
    original: "The examined life is worth living.",
    template: "The examined life is worth living.",
    tags: ['reflection'],
  },
  {
    id: 'thought-009',
    original: "She questioned assumptions and sought truth.",
    template: "{SUBJECT_CAP} questioned assumptions and sought truth.",
    tags: ['reflection'],
  },
  {
    id: 'thought-010',
    original: "Understanding grows from careful observation.",
    template: "Understanding grows from careful observation.",
    tags: ['reflection'],
  },
  {
    id: 'thought-011',
    original: "He found answers in moments of stillness.",
    template: "{SUBJECT_CAP} found answers in moments of stillness.",
    tags: ['reflection'],
  },
  {
    id: 'thought-012',
    original: "The mind needs rest as much as the body.",
    template: "The mind needs rest as much as the body.",
    tags: ['reflection'],
  },
  {
    id: 'thought-013',
    original: "She practiced mindfulness in daily life.",
    template: "{SUBJECT_CAP} practiced mindfulness in daily life.",
    tags: ['reflection'],
  },
  {
    id: 'thought-014',
    original: "Reflection transforms experience into wisdom.",
    template: "Reflection transforms experience into wisdom.",
    tags: ['reflection'],
  },
  {
    id: 'thought-015',
    original: "He discovered insights through introspection.",
    template: "{SUBJECT_CAP} discovered insights through introspection.",
    tags: ['reflection'],
  },

  // Hope and Optimism
  {
    id: 'hope-001',
    original: "Tomorrow brings new opportunities.",
    template: "Tomorrow brings new opportunities.",
    tags: ['hope'],
  },
  {
    id: 'hope-002',
    original: "She held fast to hope in dark times.",
    template: "{SUBJECT_CAP} held fast to hope in dark times.",
    tags: ['hope'],
  },
  {
    id: 'hope-003',
    original: "The future is full of possibilities.",
    template: "The future is full of possibilities.",
    tags: ['hope'],
  },
  {
    id: 'hope-004',
    original: "He believed in the power of positive thinking.",
    template: "{SUBJECT_CAP} believed in the power of positive thinking.",
    tags: ['hope'],
  },
  {
    id: 'hope-005',
    original: "Light always follows the darkest night.",
    template: "Light always follows the darkest night.",
    tags: ['hope'],
  },
  {
    id: 'hope-006',
    original: "She saw the silver lining in every cloud.",
    template: "{SUBJECT_CAP} saw the silver lining in every cloud.",
    tags: ['hope'],
  },
  {
    id: 'hope-007',
    original: "Hope is the anchor of the soul.",
    template: "Hope is the anchor of the soul.",
    tags: ['hope'],
  },
  {
    id: 'hope-008',
    original: "He faced the future with optimism.",
    template: "{SUBJECT_CAP} faced the future with optimism.",
    tags: ['hope'],
  },
  {
    id: 'hope-009',
    original: "The dawn of a new day brings fresh starts.",
    template: "The dawn of a new day brings fresh starts.",
    tags: ['hope'],
  },
  {
    id: 'hope-010',
    original: "She trusted that better days were ahead.",
    template: "{SUBJECT_CAP} trusted that better days were ahead.",
    tags: ['hope'],
  },
  {
    id: 'hope-011',
    original: "Faith in tomorrow sustains us today.",
    template: "Faith in tomorrow sustains us today.",
    tags: ['hope'],
  },
  {
    id: 'hope-012',
    original: "He chose to see the good in every situation.",
    template: "{SUBJECT_CAP} chose to see the good in every situation.",
    tags: ['hope'],
  },
  {
    id: 'hope-013',
    original: "The human spirit is remarkably resilient.",
    template: "The human spirit is remarkably resilient.",
    tags: ['hope'],
  },
  {
    id: 'hope-014',
    original: "She found joy in simple pleasures.",
    template: "{SUBJECT_CAP} found joy in simple pleasures.",
    tags: ['hope'],
  },
  {
    id: 'hope-015',
    original: "Hope springs eternal in the human heart.",
    template: "Hope springs eternal in the human heart.",
    tags: ['hope'],
  },

  // Learning and Knowledge
  {
    id: 'learning-001',
    original: "Every experience teaches us something valuable.",
    template: "Every experience teaches us something valuable.",
    tags: ['learning'],
  },
  {
    id: 'learning-002',
    original: "She approached life as a constant student.",
    template: "{SUBJECT_CAP} approached life as a constant student.",
    tags: ['learning'],
  },
  {
    id: 'learning-003',
    original: "Knowledge is gained through curiosity and effort.",
    template: "Knowledge is gained through curiosity and effort.",
    tags: ['learning'],
  },
  {
    id: 'learning-004',
    original: "He read widely and learned continuously.",
    template: "{SUBJECT_CAP} read widely and learned continuously.",
    tags: ['learning'],
  },
  {
    id: 'learning-005',
    original: "The pursuit of learning enriches the mind.",
    template: "The pursuit of learning enriches the mind.",
    tags: ['learning'],
  },
  {
    id: 'learning-006',
    original: "She asked questions and sought understanding.",
    template: "{SUBJECT_CAP} asked questions and sought understanding.",
    tags: ['learning'],
  },
  {
    id: 'learning-007',
    original: "Ignorance is dispelled by the light of knowledge.",
    template: "Ignorance is dispelled by the light of knowledge.",
    tags: ['learning'],
  },
  {
    id: 'learning-008',
    original: "He valued education in all its forms.",
    template: "{SUBJECT_CAP} valued education in all its forms.",
    tags: ['learning'],
  },
  {
    id: 'learning-009',
    original: "The wise person never stops learning.",
    template: "The wise person never stops learning.",
    tags: ['learning'],
  },
  {
    id: 'learning-010',
    original: "She embraced new ideas with enthusiasm.",
    template: "{SUBJECT_CAP} embraced new ideas with enthusiasm.",
    tags: ['learning'],
  },
  {
    id: 'learning-011',
    original: "Books open windows to other worlds.",
    template: "Books open windows to other worlds.",
    tags: ['learning'],
  },
  {
    id: 'learning-012',
    original: "He learned from both success and failure.",
    template: "{SUBJECT_CAP} learned from both success and failure.",
    tags: ['learning'],
  },
  {
    id: 'learning-013',
    original: "The mind expands with each new discovery.",
    template: "The mind expands with each new discovery.",
    tags: ['learning'],
  },
  {
    id: 'learning-014',
    original: "She studied with dedication and purpose.",
    template: "{SUBJECT_CAP} studied with dedication and purpose.",
    tags: ['learning'],
  },
  {
    id: 'learning-015',
    original: "Knowledge empowers us to grow.",
    template: "Knowledge empowers us to grow.",
    tags: ['learning'],
  },

  // Courage and Bravery
  {
    id: 'courage-001',
    original: "She summoned courage from deep within.",
    template: "{SUBJECT_CAP} summoned courage from deep within.",
    tags: ['courage'],
  },
  {
    id: 'courage-002',
    original: "Fear is conquered by facing it directly.",
    template: "Fear is conquered by facing it directly.",
    tags: ['courage'],
  },
  {
    id: 'courage-003',
    original: "He took a brave step into the unknown.",
    template: "{SUBJECT_CAP} took a brave step into the unknown.",
    tags: ['courage'],
  },
  {
    id: 'courage-004',
    original: "Courage is not the absence of fear.",
    template: "Courage is not the absence of fear.",
    tags: ['courage'],
  },
  {
    id: 'courage-005',
    original: "She stood firm in her convictions.",
    template: "{SUBJECT_CAP} stood firm in {POSSESSIVE} convictions.",
    tags: ['courage'],
  },
  {
    id: 'courage-006',
    original: "Bravery is found in everyday actions.",
    template: "Bravery is found in everyday actions.",
    tags: ['courage'],
  },
  {
    id: 'courage-007',
    original: "He dared to be different from the crowd.",
    template: "{SUBJECT_CAP} dared to be different from the crowd.",
    tags: ['courage'],
  },
  {
    id: 'courage-008',
    original: "She spoke up when others remained silent.",
    template: "{SUBJECT_CAP} spoke up when others remained silent.",
    tags: ['courage', 'speech'],
  },
  {
    id: 'courage-009',
    original: "Courage transforms the ordinary into extraordinary.",
    template: "Courage transforms the ordinary into extraordinary.",
    tags: ['courage'],
  },
  {
    id: 'courage-010',
    original: "He refused to let fear dictate his choices.",
    template: "{SUBJECT_CAP} refused to let fear dictate {POSSESSIVE} choices.",
    tags: ['courage'],
  },

  // Peace and Contentment
  {
    id: 'peace-001',
    original: "She found peace in accepting what cannot be changed.",
    template: "{SUBJECT_CAP} found peace in accepting what cannot be changed.",
    tags: ['peace'],
  },
  {
    id: 'peace-002',
    original: "Contentment comes from within, not from without.",
    template: "Contentment comes from within, not from without.",
    tags: ['peace'],
  },
  {
    id: 'peace-003',
    original: "He learned to be still and simply be.",
    template: "{SUBJECT_CAP} learned to be still and simply be.",
    tags: ['peace'],
  },
  {
    id: 'peace-004',
    original: "The peaceful heart knows true happiness.",
    template: "The peaceful heart knows true happiness.",
    tags: ['peace'],
  },
  {
    id: 'peace-005',
    original: "She cultivated inner calm through practice.",
    template: "{SUBJECT_CAP} cultivated inner calm through practice.",
    tags: ['peace'],
  },
  {
    id: 'peace-006',
    original: "Serenity is found in the present moment.",
    template: "Serenity is found in the present moment.",
    tags: ['peace'],
  },
  {
    id: 'peace-007',
    original: "He let go of worry and embraced peace.",
    template: "{SUBJECT_CAP} let go of worry and embraced peace.",
    tags: ['peace'],
  },
  {
    id: 'peace-008',
    original: "She discovered joy in ordinary moments.",
    template: "{SUBJECT_CAP} discovered joy in ordinary moments.",
    tags: ['peace'],
  },
  {
    id: 'peace-009',
    original: "Peace begins with a smile and an open heart.",
    template: "Peace begins with a smile and an open heart.",
    tags: ['peace'],
  },
  {
    id: 'peace-010',
    original: "He found balance between effort and rest.",
    template: "{SUBJECT_CAP} found balance between effort and rest.",
    tags: ['peace'],
  },

  // Additional variety
  {
    id: 'misc-001',
    original: "The clock struck twelve as midnight approached.",
    template: "The clock struck twelve as midnight approached.",
    tags: ['misc'],
  },
  {
    id: 'misc-002',
    original: "She opened the door and stepped outside.",
    template: "{SUBJECT_CAP} opened the door and stepped outside.",
    tags: ['misc'],
  },
  {
    id: 'misc-003',
    original: "The path wound through hills and valleys.",
    template: "The path wound through hills and valleys.",
    tags: ['misc'],
  },
  {
    id: 'misc-004',
    original: "He remembered lessons from long ago.",
    template: "{SUBJECT_CAP} remembered lessons from long ago.",
    tags: ['misc'],
  },
  {
    id: 'misc-005',
    original: "The book lay open on the table.",
    template: "The book lay open on the table.",
    tags: ['misc'],
  },
  {
    id: 'misc-006',
    original: "She smiled at the memory of that day.",
    template: "{SUBJECT_CAP} smiled at the memory of that day.",
    tags: ['misc'],
  },
  {
    id: 'misc-007',
    original: "The bridge spanned the rushing river below.",
    template: "The bridge spanned the rushing river below.",
    tags: ['misc'],
  },
  {
    id: 'misc-008',
    original: "He gazed out the window at the world.",
    template: "{SUBJECT_CAP} gazed out the window at the world.",
    tags: ['misc'],
  },
  {
    id: 'misc-009',
    original: "The fire crackled warmly in the hearth.",
    template: "The fire crackled warmly in the hearth.",
    tags: ['misc'],
  },
  {
    id: 'misc-010',
    original: "She felt grateful for all she had been given.",
    template: "{SUBJECT_CAP} felt grateful for all {SUBJECT} had been given.",
    tags: ['misc'],
  },
];

// Get sentence with applied pronouns
export function getSentenceWithPronouns(
  templateId: string,
  pronounSetId: string
): string {
  const template = SENTENCE_TEMPLATES.find(t => t.id === templateId);
  if (!template) return '';
  
  if (pronounSetId === 'original') {
    return template.original;
  }
  
  return applySentencePronouns(template.template, pronounSetId);
}

// Get random sentences with pronouns applied
export function getRandomSentences(
  count: number,
  pronounSetId: string,
  excludeIds: string[] = []
): Array<{ id: string; text: string }> {
  const available = SENTENCE_TEMPLATES.filter(t => !excludeIds.includes(t.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  return selected.map(template => ({
    id: template.id,
    text: pronounSetId === 'original' 
      ? template.original 
      : applySentencePronouns(template.template, pronounSetId),
  }));
}

