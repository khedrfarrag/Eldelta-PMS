export type ProductCategoryValue =
  | 'electronics'
  | 'textiles'
  | 'food'
  | 'raw_materials'
  | 'chemicals'
  | 'machinery'
  | 'furniture'
  | 'construction'
  | 'cosmetics'
  | 'automotive'
  | 'medical'
  | 'home_appliances'

export type ProductCategory = {
  value: ProductCategoryValue
  labelAr: string
  labelEn: string
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { value: 'electronics', labelAr: 'إلكترونيات', labelEn: 'Electronics' },
  { value: 'textiles', labelAr: 'ملابس ومنسوجات', labelEn: 'Clothing & Textiles' },
  { value: 'food', labelAr: 'أغذية ومشروبات', labelEn: 'Food & Beverages' },
  { value: 'raw_materials', labelAr: 'مواد خام', labelEn: 'Raw Materials' },
  { value: 'chemicals', labelAr: 'كيميائيات', labelEn: 'Chemicals' },
  { value: 'machinery', labelAr: 'آلات ومعدات', labelEn: 'Machinery & Equipment' },
  { value: 'furniture', labelAr: 'أثاث', labelEn: 'Furniture' },
  { value: 'construction', labelAr: 'مواد بناء', labelEn: 'Construction Materials' },
  { value: 'cosmetics', labelAr: 'تجميل وعناية شخصية', labelEn: 'Cosmetics & Personal Care' },
  { value: 'automotive', labelAr: 'قطع غيار سيارات', labelEn: 'Automotive Parts' },
  { value: 'medical', labelAr: 'مستلزمات طبية', labelEn: 'Medical Supplies' },
  { value: 'home_appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
]

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map(c => c.value) as ProductCategoryValue[]

export function getCategoryLabelAr(value?: string): string {
  if (!value) return '-'
  const found = PRODUCT_CATEGORIES.find((c) => c.value === value)
  return found ? found.labelAr : value
}

export function getCategoryLabelEn(value?: string): string {
  if (!value) return '-'
  const found = PRODUCT_CATEGORIES.find((c) => c.value === value)
  return found ? found.labelEn : value
}


