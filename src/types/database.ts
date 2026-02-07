export type UserRole = 'admin' | 'user'
export type ClientType = 'ip' | 'ooo' | 'other'
export type ClientStatus = 'active' | 'inactive' | 'blocked' | 'pending'
export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
export type DocumentType = 'contract' | 'invoice' | 'act' | 'waybill' | 'certificate' | 'other'
export type ContactRequestStatus = 'new' | 'in_progress' | 'completed' | 'spam'
export type ImageType = 'logo' | 'hero' | 'gallery' | 'preview'

export interface Role {
  id: string
  name: UserRole
  description: string | null
  permissions: Record<string, string[]>
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role_id: string
  phone: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
  roles?: Role
}

export interface ClientTypeRecord {
  id: string
  code: ClientType
  name: string
  description: string | null
  required_fields: string[]
  created_at: string
}

export interface Client {
  id: string
  type_id: string
  status: ClientStatus
  company_name: string
  legal_name: string
  inn: string
  kpp: string | null
  ogrn: string
  legal_address: string
  actual_address: string | null
  postal_address: string | null
  director_name: string | null
  director_position: string
  accountant_name: string | null
  phone: string | null
  email: string | null
  website: string | null
  notes: string | null
  manager_id: string | null
  created_by: string
  created_at: string
  updated_at: string
  client_types?: ClientTypeRecord
  manager?: Profile
  bank_details?: ClientBankDetails[]
  contacts?: ClientContact[]
}

export interface ClientBankDetails {
  id: string
  client_id: string
  bank_name: string
  bik: string
  correspondent_account: string
  settlement_account: string
  is_primary: boolean
  created_at: string
}

export interface ClientContact {
  id: string
  client_id: string
  contact_type: string
  full_name: string
  position: string | null
  phone: string | null
  email: string | null
  is_primary: boolean
  created_at: string
}

export interface Brand {
  id: string
  slug: string
  name: string
  short_description: string | null
  full_description: string | null
  logo_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  images?: BrandImage[]
}

export interface BrandImage {
  id: string
  brand_id: string
  url: string
  alt_text: string | null
  image_type: ImageType
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  number: string
  client_id: string
  status: OrderStatus
  total_amount: number
  currency: string
  payment_terms: string | null
  delivery_address: string | null
  notes: string | null
  manager_id: string | null
  created_by: string
  created_at: string
  updated_at: string
  client?: Client
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface ContactRequest {
  id: string
  name: string
  phone: string | null
  email: string | null
  company: string | null
  message: string | null
  source_page: string | null
  status: ContactRequestStatus
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}
