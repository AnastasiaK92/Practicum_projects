// ─── User ────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'preferNotToSay'

export interface OfferedSkill {
  title: string
  categoryId: string
  subcategoryId: string
  description: string
  imageUrls: string[]
}

export interface User {
  id: string
  name: string
  birthDate: string
  gender: Gender
  cityId: string
  avatarUrl: string | null
  description: string
  offeredSkill: OfferedSkill
  learningSubcategoryIds: string[]
  likesCount: number
  createdAt: string
}

// ─── Reference data ──────────────────────────────────────

export interface Subcategory {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

export interface City {
  id: string
  name: string
}

// ─── Catalog filters ─────────────────────────────────────

export type CatalogOfferType = 'all' | 'learning' | 'teaching'

export type CatalogGender = 'all' | 'male' | 'female'

export type CatalogSort = 'default' | 'newest'

export interface CatalogFilters {
  offerType: CatalogOfferType
  gender: CatalogGender
  subcategoryIds: string[]
  cityIds: string[]
}

// ─── Registration / Auth ─────────────────────────────────

export interface RegistrationDraft {
  email: string
  password: string
  name: string
  birthDate: string
  gender: Gender | null
  cityId: string
  avatarUrl: string | null
  learningSubcategoryIds: string[]
  offeredSkill: OfferedSkill
}

export interface AuthAccount {
  userId: string
  email: string
  password: string
}

export interface AuthSession {
  userId: string
}

// ─── Requests / Notifications ────────────────────────────

export interface SwapRequest {
  id: string
  fromUserId: string
  toUserId: string
  createdAt: string
}

export interface Notification {
  requestId: string
  isRead: boolean
}
