import type { PrismaClient } from '../../src/generated/prisma/client.js';

type NutrientSeed = {
  code: string;
  /** The `MeasurementUnit.code` this nutrient's amounts are measured in. */
  unitCode: string;
  en: string;
  my: string;
};

const NUTRIENTS: NutrientSeed[] = [
  { code: 'CALORIES', unitCode: 'KILOCALORIE', en: 'Calories', my: 'ကယ်လိုရီ' },
  { code: 'PROTEIN', unitCode: 'GRAM', en: 'Protein', my: 'ပရိုတင်း' },
  { code: 'CARBS', unitCode: 'GRAM', en: 'Carbohydrates', my: 'ကာဗိုဟိုက်ဒရိတ်' },
  { code: 'FAT', unitCode: 'GRAM', en: 'Fat', my: 'အဆီ' },
  { code: 'FIBER', unitCode: 'GRAM', en: 'Fiber', my: 'အမျှင်ဓာတ်' },
  { code: 'SUGAR', unitCode: 'GRAM', en: 'Sugar', my: 'သကြား' },
  { code: 'SODIUM', unitCode: 'MILLIGRAM', en: 'Sodium', my: 'ဆိုဒီယမ်' },
  { code: 'IRON', unitCode: 'MILLIGRAM', en: 'Iron', my: 'သံဓာတ်' },
  { code: 'CALCIUM', unitCode: 'MILLIGRAM', en: 'Calcium', my: 'ကယ်လ်စီယမ်' },
  { code: 'POTASSIUM', unitCode: 'MILLIGRAM', en: 'Potassium', my: 'ပိုတက်စီယမ်' },
  { code: 'VITAMIN_A', unitCode: 'MICROGRAM', en: 'Vitamin A', my: 'ဗီတာမင် A' },
  { code: 'VITAMIN_C', unitCode: 'MILLIGRAM', en: 'Vitamin C', my: 'ဗီတာမင် C' },
  { code: 'VITAMIN_B12', unitCode: 'MICROGRAM', en: 'Vitamin B12', my: 'ဗီတာမင် B12' },
  { code: 'SATURATED_FAT', unitCode: 'GRAM', en: 'Saturated Fat', my: 'ပြည့်ဝဆီ' },
  { code: 'TRANS_FAT', unitCode: 'GRAM', en: 'Trans Fat', my: 'အသွင်ပြောင်းဆီ' },
  { code: 'CHOLESTEROL', unitCode: 'MILLIGRAM', en: 'Cholesterol', my: 'ကိုလက်စထရော' },
  { code: 'MAGNESIUM', unitCode: 'MILLIGRAM', en: 'Magnesium', my: 'မဂ္ဂနီဆီယမ်' },
  { code: 'ZINC', unitCode: 'MILLIGRAM', en: 'Zinc', my: 'သွပ်ဓာတ်' },
  { code: 'PHOSPHORUS', unitCode: 'MILLIGRAM', en: 'Phosphorus', my: 'ဖော့စဖရပ်' },
  { code: 'VITAMIN_D', unitCode: 'MICROGRAM', en: 'Vitamin D', my: 'ဗီတာမင် D' },
  { code: 'VITAMIN_E', unitCode: 'MILLIGRAM', en: 'Vitamin E', my: 'ဗီတာမင် E' },
  { code: 'VITAMIN_K', unitCode: 'MICROGRAM', en: 'Vitamin K', my: 'ဗီတာမင် K' },
  { code: 'VITAMIN_B6', unitCode: 'MILLIGRAM', en: 'Vitamin B6', my: 'ဗီတာမင် B6' },
  { code: 'FOLATE', unitCode: 'MICROGRAM', en: 'Folate', my: 'ဖောလိတ်' },
  { code: 'OMEGA_3', unitCode: 'GRAM', en: 'Omega 3', my: 'အိုမီဂါ ၃' },
];

/**
 * Upserts the nutrient catalog with EN/MY translations. Each nutrient references a
 * measurement unit via `defaultUnitId`, resolved from the unit `code` — so units must
 * be seeded first. Idempotent: keyed by unique `code`. Returns the count.
 */
export async function seedNutrients(prisma: PrismaClient): Promise<number> {
  // Resolve each nutrient's unit code to its id (units are seeded before this runs).
  const units = await prisma.measurementUnit.findMany({ select: { id: true, code: true } });
  const unitIdByCode = new Map(units.map((unit) => [unit.code, unit.id]));

  for (const nutrient of NUTRIENTS) {
    const defaultUnitId = unitIdByCode.get(nutrient.unitCode);
    if (!defaultUnitId) {
      throw new Error(`Unit "${nutrient.unitCode}" for nutrient "${nutrient.code}" was not seeded.`);
    }

    const translations = [
      { languageCode: 'EN', name: nutrient.en, description: null },
      { languageCode: 'MY', name: nutrient.my, description: null },
    ];

    await prisma.nutrient.upsert({
      where: { code: nutrient.code },
      update: {
        defaultUnitId,
        translations: { deleteMany: {}, create: translations },
      },
      create: {
        code: nutrient.code,
        defaultUnitId,
        translations: { create: translations },
      },
    });
  }

  return NUTRIENTS.length;
}
