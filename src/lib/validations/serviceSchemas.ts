import { z } from 'zod'
import { PRODUCT_CATEGORY_VALUES } from '@/lib/constants/productCategories'

// Common/base fields required for any service request
export const baseRequestSchema = z.object({
  customerName: z.string().min(1, 'اسم العميل مطلوب').max(100),
  companyName: z.string().min(1, 'اسم الشركة مطلوب').max(100),
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب').regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح'),
  serviceId: z.string().min(1, 'الخدمة مطلوبة'),
  serviceName: z.union([z.string(), z.object({
    ar: z.string(),
    en: z.string()
  })]).optional(),
  serviceType: z.enum(['import', 'export', 'logistics', 'suppliers']).optional(),

  // Common optional fields
  notes: z.string().optional(),
  heardAboutUs: z.string().optional(),
  budgetRange: z.string().optional(),
  preferredShippingMethod: z.string().optional(),
  preferredDeliveryMethod: z.string().optional(),
  readyDate: z.union([z.string(), z.date()]).optional(),
  desiredArrivalDate: z.union([z.string(), z.date()]).optional(),
  insuranceNeeded: z.union([z.string(), z.boolean()]).optional(),
})

// Import service specific schema
export const importRequestSchema = baseRequestSchema.extend({
  productType: z.enum(PRODUCT_CATEGORY_VALUES as unknown as [string, ...string[]]),
  productSpecifications: z.string().min(1, 'مواصفات المنتج مطلوبة'),
  productSpecsPdfUrl: z.string().url('رابط PDF غير صحيح').optional(),
  estimatedQuantity: z.string().min(1, 'الكمية مطلوبة').regex(/^[0-9]+$/, 'الكمية يجب أن تكون أرقام فقط'),
  exportCountry: z.string().min(1, 'بلد التصدير مطلوب'),
  destinationCountry: z.string().min(1, 'بلد الوجهة مطلوب'),
  totalValue: z.string().min(1, 'القيمة الإجمالية مطلوبة').regex(/^[0-9.]+$/, 'القيمة الإجمالية يجب أن تكون أرقام فقط'),

  // Extras
  importFrequency: z.enum(['once', 'monthly', 'quarterly', 'yearly']).optional(),
  customsAssistance: z.boolean().optional(),
  consultationNeeded: z.boolean().optional(),
  additionalServices: z.array(z.string()).optional(),
  commercialRecord: z.string().optional(),
  hasShippingPlan: z.boolean().optional(),
})

// Export service specific schema
export const exportRequestSchema = baseRequestSchema.extend({
  productType: z.enum(PRODUCT_CATEGORY_VALUES as unknown as [string, ...string[]]),
  productSpecifications: z.string().optional(),
  productDetails: z.string().optional(),
  estimatedQuantity: z.string().regex(/^[0-9]+$/, 'الكمية يجب أن تكون أرقام فقط').optional(),
  productionCapacity: z.string().optional(),
  exportCountry: z.string().optional(),
  destinationCountry: z.string().min(1, 'بلد الوجهة مطلوب'),
  totalValue: z.string().regex(/^[0-9.]+$/, 'القيمة الإجمالية يجب أن تكون أرقام فقط').optional(),
  qualityCertificates: z.boolean().optional(),
  packagingServices: z.boolean().optional(),
  findImporters: z.boolean().optional(),
  commercialRecord: z.string().optional(),
})

// Logistics service specific schema
export const logisticsRequestSchema = baseRequestSchema.extend({
  fromCountry: z.string().optional(),
  toCountry: z.string().optional(),
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  shipmentType: z.enum(['full_container', 'partial_container', 'air', 'land', 'express']).optional(),
  productType: z.enum(PRODUCT_CATEGORY_VALUES as unknown as [string, ...string[]]).optional(),
  weight: z.union([z.string(), z.number()]).optional(),
  volume: z.union([z.string(), z.number()]).optional(),
  packagesCount: z.union([z.string(), z.number()]).optional(),
  totalValue: z.string().regex(/^[0-9.]+$/, 'القيمة يجب أن تكون أرقام فقط').optional(),
  doorToDoor: z.boolean().optional(),
  tracking: z.boolean().optional(),
  customsAgent: z.boolean().optional(),
  shippingUrgency: z.enum(['urgent', 'normal']).optional(),
})

// Suppliers/Importers sourcing service schema
export const suppliersRequestSchema = baseRequestSchema.extend({
  searchType: z.enum(['supplier', 'importer']).optional(),
  productType: z.enum(PRODUCT_CATEGORY_VALUES as unknown as [string, ...string[]]),
  productSpecifications: z.string().optional(),
  expectedQuantity: z.string().regex(/^[0-9]+$/, 'الكمية يجب أن تكون أرقام فقط').optional(),
  preferredCountry: z.string().optional(),
  qualityLevel: z.enum(['normal', 'medium', 'high', 'world_class']).optional(),
  factoryVisits: z.boolean().optional(),
  negotiationServices: z.boolean().optional(),
  productionSupervision: z.boolean().optional(),
  samples: z.boolean().optional(),
  cooperationTiming: z.enum(['immediate', 'one_month', 'three_months']).optional(),
  totalValue: z.string().regex(/^[0-9.]+$/, 'القيمة يجب أن تكون أرقام فقط').optional(),
  commercialRecord: z.string().optional(),
})

export type BaseRequest = z.infer<typeof baseRequestSchema>
export type ImportRequest = z.infer<typeof importRequestSchema>
export type ExportRequest = z.infer<typeof exportRequestSchema>
export type LogisticsRequest = z.infer<typeof logisticsRequestSchema>
export type SuppliersRequest = z.infer<typeof suppliersRequestSchema>


