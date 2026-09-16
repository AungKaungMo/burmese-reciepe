import type { PrismaClient } from '../../src/generated/prisma/client.js';

type UnitSeed = {
  code: string;
  /** Language-neutral display glyph / abbreviation (e.g. `g`, `kg`, `kcal`). */
  symbol: string;
  en: { name: string; shortLabel: string };
  my: { name: string; shortLabel: string };
};

const UNITS: UnitSeed[] = [
  { code: 'GRAM', symbol: 'g', en: { name: 'Gram', shortLabel: 'g' }, my: { name: 'ဂရမ်', shortLabel: 'ဂရမ်' } },
  { code: 'KILOGRAM', symbol: 'kg', en: { name: 'Kilogram', shortLabel: 'kg' }, my: { name: 'ကီလိုဂရမ်', shortLabel: 'ကီလို' } },
  { code: 'MILLIGRAM', symbol: 'mg', en: { name: 'Milligram', shortLabel: 'mg' }, my: { name: 'မီလီဂရမ်', shortLabel: 'mg' } },
  { code: 'MICROGRAM', symbol: 'mcg', en: { name: 'Microgram', shortLabel: 'mcg' }, my: { name: 'မိုက်ခရိုဂရမ်', shortLabel: 'mcg' } },
  { code: 'MILLILITER', symbol: 'ml', en: { name: 'Milliliter', shortLabel: 'ml' }, my: { name: 'မီလီလီတာ', shortLabel: 'ml' } },
  { code: 'LITER', symbol: 'L', en: { name: 'Liter', shortLabel: 'L' }, my: { name: 'လီတာ', shortLabel: 'လီတာ' } },
  { code: 'KILOCALORIE', symbol: 'kcal', en: { name: 'Kilocalorie', shortLabel: 'kcal' }, my: { name: 'ကီလိုကယ်လိုရီ', shortLabel: 'kcal' } },
  { code: 'TEASPOON', symbol: 'tsp', en: { name: 'Teaspoon', shortLabel: 'tsp' }, my: { name: 'လက်ဖက်ရည်ဇွန်း', shortLabel: 'လက်ဖက်ရည်ဇွန်း' } },
  { code: 'TABLESPOON', symbol: 'tbsp', en: { name: 'Tablespoon', shortLabel: 'tbsp' }, my: { name: 'စားပွဲတင်ဇွန်း', shortLabel: 'စားပွဲတင်ဇွန်း' } },
  { code: 'CUP', symbol: 'cup', en: { name: 'Cup', shortLabel: 'cup' }, my: { name: 'ခွက်', shortLabel: 'ခွက်' } },
  { code: 'PIECE', symbol: 'pc', en: { name: 'Piece', shortLabel: 'pc' }, my: { name: 'အခုအရေအတွက်', shortLabel: 'ခု' } },
  { code: 'WHOLE', symbol: 'whole', en: { name: 'Whole', shortLabel: 'whole' }, my: { name: 'အလုံး', shortLabel: 'လုံး' } },
  { code: 'PINCH', symbol: 'pinch', en: { name: 'Pinch', shortLabel: 'pinch' }, my: { name: 'လက်တစ်ဆိတ်', shortLabel: 'လက်တစ်ဆိတ်' } },
  { code: 'CLOVE', symbol: 'clove', en: { name: 'Clove', shortLabel: 'clove' }, my: { name: 'ကြက်သွန်တစ်မွှာ', shortLabel: 'မွှာ' } },
  { code: 'SLICE', symbol: 'slice', en: { name: 'Slice', shortLabel: 'slice' }, my: { name: 'အချပ်', shortLabel: 'ချပ်' } },
  { code: 'BUNCH', symbol: 'bunch', en: { name: 'Bunch', shortLabel: 'bunch' }, my: { name: 'အစည်း', shortLabel: 'စည်း' } },
  { code: 'STALK', symbol: 'stalk', en: { name: 'Stalk', shortLabel: 'stalk' }, my: { name: 'အတံ', shortLabel: 'တံ' } },
  { code: 'SPRIG', symbol: 'sprig', en: { name: 'Sprig', shortLabel: 'sprig' }, my: { name: 'အခက်', shortLabel: 'ခက်' } },
  { code: 'HANDFUL', symbol: 'handful', en: { name: 'Handful', shortLabel: 'handful' }, my: { name: 'လက်တစ်ဆုပ်', shortLabel: 'လက်တစ်ဆုပ်' } },
  { code: 'CAN', symbol: 'can', en: { name: 'Can', shortLabel: 'can' }, my: { name: 'ဘူး', shortLabel: 'ဘူး' } },
  { code: 'PACKET', symbol: 'pkt', en: { name: 'Packet', shortLabel: 'pkt' }, my: { name: 'အထုပ်', shortLabel: 'ထုပ်' } },
  { code: 'BOTTLE', symbol: 'bottle', en: { name: 'Bottle', shortLabel: 'bottle' }, my: { name: 'ပုလင်း', shortLabel: 'ပုလင်း' } },
  // Traditional Burmese units — no distinct Myanmar short label given, so it reuses the name.
  { code: 'VISS', symbol: 'viss', en: { name: 'Viss', shortLabel: 'viss' }, my: { name: 'ပိဿာ', shortLabel: 'ပိဿာ' } },
  { code: 'TICAL', symbol: 'tical', en: { name: 'Tical', shortLabel: 'tical' }, my: { name: 'ကျပ်သား', shortLabel: 'ကျပ်သား' } },
];

/**
 * Upserts the measurement-unit catalog (code + symbol) with EN/MY translations.
 * Idempotent: keyed by unique `code`, translations replaced each run. Returns the count.
 */
export async function seedMeasurementUnits(prisma: PrismaClient): Promise<number> {
  for (const unit of UNITS) {
    const translations = [
      { languageCode: 'EN', name: unit.en.name, shortLabel: unit.en.shortLabel },
      { languageCode: 'MY', name: unit.my.name, shortLabel: unit.my.shortLabel },
    ];

    await prisma.measurementUnit.upsert({
      where: { code: unit.code },
      update: {
        symbol: unit.symbol,
        translations: { deleteMany: {}, create: translations },
      },
      create: {
        code: unit.code,
        symbol: unit.symbol,
        translations: { create: translations },
      },
    });
  }

  return UNITS.length;
}
