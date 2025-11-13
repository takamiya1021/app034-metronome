/**
 * AI Service - Google AI Studio API integration
 */

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface AIGenerationOptions {
  apiKey: string;
  bpm: number;
  timeSignature: string;
  genre?: string;
}

/**
 * Generate rhythm training suggestions
 */
export async function generateRhythmTraining(
  options: AIGenerationOptions
): Promise<string> {
  const prompt = `あなたはリズムトレーニングの専門家です。
現在のBPM ${options.bpm}、拍子 ${options.timeSignature} で練習している人に向けて、
効果的なリズムトレーニングメニューを150文字程度で提案してください。
段階的なテンポアップの方法も含めてください。`;

  try {
    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${options.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from API');
    }

    return text;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

/**
 * Generate genre-specific BPM suggestions
 */
export async function generateGenreBPM(
  options: AIGenerationOptions
): Promise<string> {
  const genre = options.genre || '一般的な音楽';
  const prompt = `あなたは音楽プロデューサーです。
${genre}（ジャンル）に適したBPMと、
そのジャンル特有のリズムパターンを100文字程度で提案してください。`;

  try {
    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${options.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from API');
    }

    return text;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}
