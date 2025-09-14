import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة'),
})

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .max(100, 'كلمة المرور يجب أن تكون أقل من 100 حرف')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، رقم، ورمز خاص'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور وتأكيدها غير متطابقين',
  path: ['confirmPassword'],
})

// Service request validation schema
export const serviceRequestSchema = z.object({
  customerName: z
    .string()
    .min(1, 'اسم العميل مطلوب')
    .min(2, 'اسم العميل يجب أن يكون حرفين على الأقل')
    .max(100, 'اسم العميل يجب أن يكون أقل من 100 حرف'),
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح'),
  serviceId: z
    .string()
    .min(1, 'الخدمة مطلوبة'),
  productType: z
    .string()
    .min(1, 'نوع المنتج مطلوب')
    .min(2, 'نوع المنتج يجب أن يكون حرفين على الأقل'),
  productSpecifications: z
    .string()
    .min(1, 'مواصفات المنتج مطلوبة')
    .min(10, 'مواصفات المنتج يجب أن تكون 10 أحرف على الأقل'),
  commercialRecord: z
    .string()
    .min(1, 'السجل التجاري مطلوب')
    .min(5, 'السجل التجاري يجب أن يكون 5 أحرف على الأقل'),
  estimatedQuantity: z
    .string()
    .min(1, 'الكمية المقدرة مطلوبة')
    .regex(/^[0-9]+$/, 'الكمية يجب أن تكون أرقام فقط'),
  destinationCountry: z
    .string()
    .min(1, 'البلد الوجهة مطلوب')
    .min(2, 'البلد الوجهة يجب أن يكون حرفين على الأقل'),
  exportCountry: z
    .string()
    .min(1, 'بلد التصدير مطلوب')
    .min(2, 'بلد التصدير يجب أن يكون حرفين على الأقل'),
  totalValue: z
    .string()
    .min(1, 'القيمة الإجمالية مطلوبة')
    .regex(/^[0-9.]+$/, 'القيمة الإجمالية يجب أن تكون أرقام فقط'),
  preferredShippingMethod: z
    .string()
    .optional(),
  preferredDeliveryMethod: z
    .string()
    .optional(),
})

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم يجب أن يكون أقل من 100 حرف'),
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  message: z
    .string()
    .min(1, 'الرسالة مطلوبة')
    .min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل')
    .max(1000, 'الرسالة يجب أن تكون أقل من 1000 حرف'),
})

// Review validation schema
export const reviewSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم يجب أن يكون أقل من 100 حرف'),
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  rating: z
    .number()
    .min(1, 'التقييم مطلوب')
    .max(5, 'التقييم يجب أن يكون من 1 إلى 5'),
  comment: z
    .string()
    .min(1, 'التعليق مطلوب')
    .min(10, 'التعليق يجب أن يكون 10 أحرف على الأقل')
    .max(500, 'التعليق يجب أن يكون أقل من 500 حرف'),
})

// Service management validation schema
export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, 'اسم الخدمة مطلوب')
    .min(2, 'اسم الخدمة يجب أن يكون حرفين على الأقل')
    .max(100, 'اسم الخدمة يجب أن يكون أقل من 100 حرف'),
  description: z
    .string()
    .min(1, 'وصف الخدمة مطلوب')
    .min(10, 'وصف الخدمة يجب أن تكون 10 أحرف على الأقل')
    .max(1000, 'وصف الخدمة يجب أن يكون أقل من 1000 حرف'),
  price: z
    .string()
    .min(1, 'السعر مطلوب')
    .regex(/^[0-9.]+$/, 'السعر يجب أن يكون أرقام فقط'),
  category: z
    .string()
    .min(1, 'فئة الخدمة مطلوبة'),
  isActive: z
    .boolean()
    .optional()
    .default(true),
})

// Type exports
export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ServiceRequestForm = z.infer<typeof serviceRequestSchema>
export type ContactForm = z.infer<typeof contactSchema>
export type ReviewForm = z.infer<typeof reviewSchema>
export type ServiceForm = z.infer<typeof serviceSchema>
