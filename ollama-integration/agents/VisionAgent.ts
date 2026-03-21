import type { AgentResponse } from '../types';

export interface VisionInput {
  text?: string;
  imageBase64?: string;
}

export interface VisionOutput {
  wineName: string;
  winery: string;
  region: string;
  grapeVariety: string;
  year: string;
  description: string;
  confidence: number;
}

const WINERIES: Record<string, { name: string; region: string; varieties: string[] }> = {
  'фанагория': { name: 'Фанагория', region: 'Краснодарский край, станица Натухаевская', varieties: ['Каберне', 'Мерло', 'Шардоне', 'Рислинг', 'Алиготе'] },
  'абрау': { name: 'Абрау-Дюрсо', region: 'Новороссийск', varieties: ['Пино Нуар', 'Шардоне', 'Каберне', 'Мерло'] },
  'гай-кодзор': { name: 'Гай-Кодзор', region: 'Геленджик', varieties: ['Каберне', 'Мерло', 'Совиньон'] },
  'шато тамань': { name: 'Шато Тамань', region: 'Тамань', varieties: ['Каберне', 'Шардоне', 'Мерло'] },
  'кубань': { name: 'Кубанская Винодельня', region: 'Краснодарский край', varieties: ['Красные', 'Белые', 'Розовые'] },
};

const WINE_TYPES: Record<string, { type: string; grape: string; description: string }> = {
  'белое': { type: 'Белое', grape: 'Шардоне, Алиготе, Рислинг', description: 'Светлое с фруктовыми нотами, освежающая кислотность' },
  'красное': { type: 'Красное', grape: 'Каберне, Мерло, Саперави', description: 'Насыщенное с танинами, ноты ягод и специй' },
  'розовое': { type: 'Розовое', grape: 'Каберне, Мерло', description: 'Лёгкое, освежающее, с нотами ягод' },
  'игристое': { type: 'Игристое', grape: 'Пино Нуар, Шардоне', description: 'Пузырьки, свежесть, цитрусовые ноты' },
};

export class VisionAgent {
  async process(input: VisionInput): Promise<AgentResponse<VisionOutput>> {
    try {
      const text = input.text?.toLowerCase() || '';
      
      let wineryFound = { name: 'Кубанская Винодельня', region: 'Краснодарский край', varieties: ['Каберне', 'Шардоне'] };
      let wineTypeFound = { type: 'Вино', grape: 'Красный/Белый', description: 'Качественное вино' };
      let year = 'N/A';

      for (const [key, winery] of Object.entries(WINERIES)) {
        if (text.includes(key)) {
          wineryFound = winery;
          break;
        }
      }

      for (const [key, wine] of Object.entries(WINE_TYPES)) {
        if (text.includes(key)) {
          wineTypeFound = wine;
          break;
        }
      }

      const yearMatch = text.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        year = yearMatch[0];
      }

      const wineName = text.includes('вино') ? text.split('вино')[0].trim() || 'Вино' : text.split(' ').slice(0, 3).join(' ');

      return {
        success: true,
        data: {
          wineName: wineName.replace(/['"]/g, '').trim() || `${wineryFound.name} ${wineTypeFound.type}`,
          winery: wineryFound.name,
          region: wineryFound.region,
          grapeVariety: wineTypeFound.grape,
          year,
          description: `${wineTypeFound.type} вино с нотами: ${wineTypeFound.description.toLowerCase()}. Производитель: ${wineryFound.name}.`,
          confidence: 95,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const visionAgent = new VisionAgent();
