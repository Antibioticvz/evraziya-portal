import { z } from 'zod'

// INN validation with checksum
function validateInn(inn: string): boolean {
  if (!/^\d{10}$|^\d{12}$/.test(inn)) return false

  const checkDigit = (inn: string, coefficients: number[]): number => {
    let sum = 0
    for (let i = 0; i < coefficients.length; i++) {
      sum += coefficients[i] * parseInt(inn[i], 10)
    }
    return (sum % 11) % 10
  }

  if (inn.length === 10) {
    const n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8])
    return n10 === parseInt(inn[9], 10)
  }

  if (inn.length === 12) {
    const n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
    const n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
    return n11 === parseInt(inn[10], 10) && n12 === parseInt(inn[11], 10)
  }

  return false
}

function validateKpp(kpp: string): boolean {
  return /^\d{4}[\dA-Z][\dA-Z]\d{3}$/.test(kpp)
}

function validateOgrn(ogrn: string): boolean {
  if (!/^\d{13}$|^\d{15}$/.test(ogrn)) return false

  if (ogrn.length === 13) {
    const num = parseInt(ogrn.slice(0, 12), 10)
    const checkDigit = num % 11 % 10
    return checkDigit === parseInt(ogrn[12], 10)
  }

  if (ogrn.length === 15) {
    const num = parseInt(ogrn.slice(0, 14), 10)
    const checkDigit = num % 13 % 10
    return checkDigit === parseInt(ogrn[14], 10)
  }

  return false
}

function validateBik(bik: string): boolean {
  return /^\d{9}$/.test(bik)
}

export const bankDetailsSchema = z.object({
  bankName: z.string().min(1, 'Укажите название банка'),
  bik: z.string().refine(validateBik, 'Некорректный БИК'),
  correspondentAccount: z.string().length(20, 'Корр. счёт должен содержать 20 цифр'),
  settlementAccount: z.string().length(20, 'Расчётный счёт должен содержать 20 цифр'),
  isPrimary: z.boolean().default(false),
})

export const contactPersonSchema = z.object({
  contactType: z.string().default('general'),
  fullName: z.string().min(2, 'Укажите ФИО'),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  isPrimary: z.boolean().default(false),
})

export const clientSchema = z.object({
  typeId: z.string().uuid(),
  companyName: z.string().min(1, 'Укажите название компании'),
  legalName: z.string().min(1, 'Укажите полное наименование'),
  inn: z.string().refine(validateInn, 'Некорректный ИНН'),
  kpp: z.string().refine(val => !val || validateKpp(val), 'Некорректный КПП').optional().or(z.literal('')),
  ogrn: z.string().refine(validateOgrn, 'Некорректный ОГРН/ОГРНИП'),
  legalAddress: z.string().min(1, 'Укажите юридический адрес'),
  actualAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  directorName: z.string().optional(),
  directorPosition: z.string().default('Генеральный директор'),
  accountantName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  website: z.string().url('Некорректный URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  bankDetails: z.array(bankDetailsSchema).optional(),
  contacts: z.array(contactPersonSchema).optional(),
}).refine(
  (data) => {
    // КПП обязателен для 10-значного ИНН (ООО)
    if (data.inn.length === 10 && (!data.kpp || data.kpp === '')) {
      return false
    }
    return true
  },
  { message: 'КПП обязателен для юридических лиц', path: ['kpp'] }
)

export type ClientFormValues = z.infer<typeof clientSchema>
export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>
export type ContactPersonFormValues = z.infer<typeof contactPersonSchema>

export { validateInn, validateKpp, validateOgrn, validateBik }
