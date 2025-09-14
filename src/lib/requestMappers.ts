import { BaseRequest, ExportRequest, ImportRequest, LogisticsRequest, SuppliersRequest } from '@/lib/validations/serviceSchemas'

export function mapImportData(values: any, serviceId: string, serviceName?: string) : ImportRequest {
  return {
    customerName: values.customerName,
    email: values.email,
    phone: values.phone,
    serviceId,
    serviceName,
    serviceType: 'import',
    productType: values.productType,
    productSpecifications: values.productSpecifications,
    estimatedQuantity: String(values.estimatedQuantity ?? ''),
    exportCountry: values.exportCountry,
    destinationCountry: values.destinationCountry,
    totalValue: String(values.estimatedValue ?? values.totalValue ?? ''),
    importFrequency: values.importFrequency,
    customsAssistance: Boolean(values.customsAssistance),
    consultationNeeded: Boolean(values.consultationNeeded),
    additionalServices: values.additionalServices || [],
    commercialRecord: values.commercialRecord || '',
    preferredShippingMethod: values.preferredShippingMethod,
    preferredDeliveryMethod: values.preferredDeliveryMethod,
    notes: values.notes,
    budgetRange: values.budgetRange || '',
    heardAboutUs: values.heardAboutUs,
    readyDate: values.readyDate,
    desiredArrivalDate: values.desiredArrivalDate,
    insuranceNeeded: values.additionalServices?.includes('تأمين') ? 'نعم' : 'لا',
  }
}

export function mapExportData(values: any, serviceId: string, serviceName?: string) : ExportRequest {
  return {
    customerName: values.customerName,
    email: values.email,
    phone: values.phone,
    serviceId,
    serviceName,
    serviceType: 'export',
    productType: values.productType,
    productSpecifications: values.productSpecifications,
    productDetails: values.productDetails,
    estimatedQuantity: values.availableQuantity ? String(values.availableQuantity) : undefined,
    productionCapacity: values.productionCapacity,
    exportCountry: values.exportCountry || 'السعودية', // Default value
    destinationCountry: values.destinationCountry,
    totalValue: values.estimatedValue ? String(values.estimatedValue) : undefined,
    qualityCertificates: Boolean(values.qualityCertificates),
    packagingServices: Boolean(values.packagingServices),
    findImporters: Boolean(values.findImporters),
    commercialRecord: values.commercialRecord || '',
    preferredShippingMethod: values.preferredShippingMethod,
    preferredDeliveryMethod: values.preferredDeliveryMethod,
    notes: values.notes,
    budgetRange: values.budgetRange || '',
    heardAboutUs: values.heardAboutUs,
    readyDate: values.readyDate,
    desiredArrivalDate: values.desiredArrivalDate,
    insuranceNeeded: values.insuranceNeeded,
  }
}

export function mapLogisticsData(values: any, serviceId: string, serviceName?: string) : LogisticsRequest {
  const total = values.totalValue ?? values.estimatedValue
  return {
    customerName: values.customerName,
    email: values.email,
    phone: values.phone,
    serviceId,
    serviceName,
    serviceType: 'logistics',
    fromCountry: values.fromCountry,
    toCountry: values.toCountry,
    fromCity: values.fromCity,
    toCity: values.toCity,
    shipmentType: values.shipmentType,
    cargoNature: values.cargoNature,
    weight: values.weight,
    volume: values.volume,
    packagesCount: values.packagesCount,
    totalValue: total != null ? String(total) : undefined,
    doorToDoor: Boolean(values.doorToDoor),
    tracking: Boolean(values.tracking),
    customsAgent: Boolean(values.customsAgent),
    preferredShippingMethod: values.preferredShippingMethod,
    preferredDeliveryMethod: values.preferredDeliveryMethod,
    notes: values.notes,
    budgetRange: values.budgetRange || '',
    heardAboutUs: values.heardAboutUs,
    readyDate: values.readyDate,
    desiredArrivalDate: values.desiredArrivalDate,
    insuranceNeeded: values.insuranceNeeded,
  }
}

export function mapSuppliersData(values: any, serviceId: string, serviceName?: string) : SuppliersRequest {
  const total = values.totalValue ?? values.estimatedValue
  return {
    customerName: values.customerName,
    email: values.email,
    phone: values.phone,
    serviceId,
    serviceName,
    serviceType: 'suppliers',
    searchType: values.searchType || 'supplier', // Default value
    productType: values.productType,
    productSpecifications: values.productSpecifications,
    expectedQuantity: values.expectedQuantity ? String(values.expectedQuantity) : undefined,
    preferredCountry: values.preferredCountry,
    qualityLevel: values.qualityLevel,
    factoryVisits: Boolean(values.factoryVisits),
    negotiationServices: Boolean(values.negotiationServices),
    productionSupervision: Boolean(values.productionSupervision),
    samples: Boolean(values.samples),
    cooperationTiming: values.cooperationTiming,
    totalValue: total != null ? String(total) : undefined,
    commercialRecord: values.commercialRecord || '',
    preferredShippingMethod: values.preferredShippingMethod,
    preferredDeliveryMethod: values.preferredDeliveryMethod,
    notes: values.notes,
    budgetRange: values.budgetRange || '',
    heardAboutUs: values.heardAboutUs,
    readyDate: values.readyDate,
    desiredArrivalDate: values.desiredArrivalDate,
    insuranceNeeded: values.insuranceNeeded,
  }
}


