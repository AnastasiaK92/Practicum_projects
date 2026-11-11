export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SKILL: '/skill/:userId',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_STEP_2: '/register/step-2',
  REGISTER_STEP_3: '/register/step-3',
  SERVER_ERROR: '/500',
} as const

// Ключи данных, сохраняемых в localStorage и sessionStorage.
export const STORAGE_KEYS = {
  LOCAL_USER: 'skillswap_local_user',
  AUTH_ACCOUNT: 'skillswap_auth_account',
  AUTH_SESSION: 'skillswap_auth_session',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  NOTIFICATIONS: 'skillswap_notifications',
  CATALOG_FILTERS: 'skillswap_catalog_filters',
  CATALOG_SORT: 'skillswap_catalog_sort',
  THEME: 'skillswap_theme',
} as const
