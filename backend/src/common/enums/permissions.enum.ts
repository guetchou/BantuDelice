export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  UPDATE_PROFILE = 'update_profile',
  VIEW_ORDERS = 'view_orders',
  CREATE_ORDER = 'create_order',
  VIEW_SERVICES = 'view_services',
  ADD_FAVORITES = 'add_favorites',
  WRITE_REVIEWS = 'write_reviews',

  // Driver permissions
  VIEW_DRIVER_ORDERS = 'view_driver_orders',
  UPDATE_ORDER_STATUS = 'update_order_status',
  VIEW_DELIVERY_ROUTES = 'view_delivery_routes',
  UPDATE_LOCATION = 'update_location',

  // Restaurant Owner permissions
  MANAGE_RESTAURANT = 'manage_restaurant',
  MANAGE_MENU = 'manage_menu',
  VIEW_RESTAURANT_ORDERS = 'view_restaurant_orders',
  UPDATE_MENU_ITEMS = 'update_menu_items',
  VIEW_RESTAURANT_ANALYTICS = 'view_restaurant_analytics',

  // Caterer permissions
  MANAGE_CATERING = 'manage_catering',
  MANAGE_CATERING_MENU = 'manage_catering_menu',
  VIEW_CATERING_ORDERS = 'view_catering_orders',
  UPDATE_CATERING_ITEMS = 'update_catering_items',
  VIEW_CATERING_ANALYTICS = 'view_catering_analytics',

  // Baker permissions
  MANAGE_BAKERY = 'manage_bakery',
  MANAGE_BAKERY_PRODUCTS = 'manage_bakery_products',
  VIEW_BAKERY_ORDERS = 'view_bakery_orders',
  UPDATE_BAKERY_ITEMS = 'update_bakery_items',
  VIEW_BAKERY_ANALYTICS = 'view_bakery_analytics',

  // Grocer permissions
  MANAGE_GROCERY = 'manage_grocery',
  MANAGE_GROCERY_PRODUCTS = 'manage_grocery_products',
  VIEW_GROCERY_ORDERS = 'view_grocery_orders',
  UPDATE_GROCERY_ITEMS = 'update_grocery_items',
  VIEW_GROCERY_ANALYTICS = 'view_grocery_analytics',

  // Pharmacist permissions
  MANAGE_PHARMACY = 'manage_pharmacy',
  MANAGE_MEDICINES = 'manage_medicines',
  VIEW_PHARMACY_ORDERS = 'view_pharmacy_orders',
  UPDATE_MEDICINE_ITEMS = 'update_medicine_items',
  VIEW_PHARMACY_ANALYTICS = 'view_pharmacy_analytics',

  // Cleaner permissions
  MANAGE_CLEANING_SERVICES = 'manage_cleaning_services',
  VIEW_CLEANING_ORDERS = 'view_cleaning_orders',
  UPDATE_CLEANING_STATUS = 'update_cleaning_status',
  VIEW_CLEANING_SCHEDULE = 'view_cleaning_schedule',
  VIEW_CLEANING_ANALYTICS = 'view_cleaning_analytics',

  // Laundry permissions
  MANAGE_LAUNDRY_SERVICES = 'manage_laundry_services',
  VIEW_LAUNDRY_ORDERS = 'view_laundry_orders',
  UPDATE_LAUNDRY_STATUS = 'update_laundry_status',
  VIEW_LAUNDRY_SCHEDULE = 'view_laundry_schedule',
  VIEW_LAUNDRY_ANALYTICS = 'view_laundry_analytics',

  // Beauty Salon permissions
  MANAGE_BEAUTY_SERVICES = 'manage_beauty_services',
  VIEW_BEAUTY_ORDERS = 'view_beauty_orders',
  UPDATE_BEAUTY_STATUS = 'update_beauty_status',
  VIEW_BEAUTY_SCHEDULE = 'view_beauty_schedule',
  VIEW_BEAUTY_ANALYTICS = 'view_beauty_analytics',

  // Barber permissions
  MANAGE_BARBER_SERVICES = 'manage_barber_services',
  VIEW_BARBER_ORDERS = 'view_barber_orders',
  UPDATE_BARBER_STATUS = 'update_barber_status',
  VIEW_BARBER_SCHEDULE = 'view_barber_schedule',
  VIEW_BARBER_ANALYTICS = 'view_barber_analytics',

  // Fitness Trainer permissions
  MANAGE_FITNESS_SERVICES = 'manage_fitness_services',
  VIEW_FITNESS_ORDERS = 'view_fitness_orders',
  UPDATE_FITNESS_STATUS = 'update_fitness_status',
  VIEW_FITNESS_SCHEDULE = 'view_fitness_schedule',
  VIEW_FITNESS_ANALYTICS = 'view_fitness_analytics',

  // Tutor permissions
  MANAGE_TUTORING_SERVICES = 'manage_tutoring_services',
  VIEW_TUTORING_ORDERS = 'view_tutoring_orders',
  UPDATE_TUTORING_STATUS = 'update_tutoring_status',
  VIEW_TUTORING_SCHEDULE = 'view_tutoring_schedule',
  VIEW_TUTORING_ANALYTICS = 'view_tutoring_analytics',

  // Technician permissions
  MANAGE_TECHNICAL_SERVICES = 'manage_technical_services',
  VIEW_TECHNICAL_ORDERS = 'view_technical_orders',
  UPDATE_TECHNICAL_STATUS = 'update_technical_status',
  VIEW_TECHNICAL_SCHEDULE = 'view_technical_schedule',
  VIEW_TECHNICAL_ANALYTICS = 'view_technical_analytics',

  // Photographer permissions
  MANAGE_PHOTOGRAPHY_SERVICES = 'manage_photography_services',
  VIEW_PHOTOGRAPHY_ORDERS = 'view_photography_orders',
  UPDATE_PHOTOGRAPHY_STATUS = 'update_photography_status',
  VIEW_PHOTOGRAPHY_SCHEDULE = 'view_photography_schedule',
  VIEW_PHOTOGRAPHY_ANALYTICS = 'view_photography_analytics',

  // Musician permissions
  MANAGE_MUSIC_SERVICES = 'manage_music_services',
  VIEW_MUSIC_ORDERS = 'view_music_orders',
  UPDATE_MUSIC_STATUS = 'update_music_status',
  VIEW_MUSIC_SCHEDULE = 'view_music_schedule',
  VIEW_MUSIC_ANALYTICS = 'view_music_analytics',

  // Translator permissions
  MANAGE_TRANSLATION_SERVICES = 'manage_translation_services',
  VIEW_TRANSLATION_ORDERS = 'view_translation_orders',
  UPDATE_TRANSLATION_STATUS = 'update_translation_status',
  VIEW_TRANSLATION_SCHEDULE = 'view_translation_schedule',
  VIEW_TRANSLATION_ANALYTICS = 'view_translation_analytics',

  // Lawyer permissions
  MANAGE_LEGAL_SERVICES = 'manage_legal_services',
  VIEW_LEGAL_ORDERS = 'view_legal_orders',
  UPDATE_LEGAL_STATUS = 'update_legal_status',
  VIEW_LEGAL_SCHEDULE = 'view_legal_schedule',
  VIEW_LEGAL_ANALYTICS = 'view_legal_analytics',

  // Accountant permissions
  MANAGE_ACCOUNTING_SERVICES = 'manage_accounting_services',
  VIEW_ACCOUNTING_ORDERS = 'view_accounting_orders',
  UPDATE_ACCOUNTING_STATUS = 'update_accounting_status',
  VIEW_ACCOUNTING_SCHEDULE = 'view_accounting_schedule',
  VIEW_ACCOUNTING_ANALYTICS = 'view_accounting_analytics',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_SERVICES = 'manage_services',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_RESTAURANTS = 'manage_restaurants',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_PAYMENTS = 'manage_payments',
  MANAGE_NOTIFICATIONS = 'manage_notifications',
  SYSTEM_CONFIG = 'system_config',
}

export const RolePermissions = {
  USER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDER,
    Permission.VIEW_SERVICES,
    Permission.ADD_FAVORITES,
    Permission.WRITE_REVIEWS,
  ],
  
  DRIVER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.VIEW_DRIVER_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_DELIVERY_ROUTES,
    Permission.UPDATE_LOCATION,
  ],
  
  RESTAURANT_OWNER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_RESTAURANT,
    Permission.MANAGE_MENU,
    Permission.VIEW_RESTAURANT_ORDERS,
    Permission.UPDATE_MENU_ITEMS,
    Permission.VIEW_RESTAURANT_ANALYTICS,
  ],

  CATERER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_CATERING,
    Permission.MANAGE_CATERING_MENU,
    Permission.VIEW_CATERING_ORDERS,
    Permission.UPDATE_CATERING_ITEMS,
    Permission.VIEW_CATERING_ANALYTICS,
  ],

  BAKER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_BAKERY,
    Permission.MANAGE_BAKERY_PRODUCTS,
    Permission.VIEW_BAKERY_ORDERS,
    Permission.UPDATE_BAKERY_ITEMS,
    Permission.VIEW_BAKERY_ANALYTICS,
  ],

  GROCER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_GROCERY,
    Permission.MANAGE_GROCERY_PRODUCTS,
    Permission.VIEW_GROCERY_ORDERS,
    Permission.UPDATE_GROCERY_ITEMS,
    Permission.VIEW_GROCERY_ANALYTICS,
  ],

  PHARMACIST: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_PHARMACY,
    Permission.MANAGE_MEDICINES,
    Permission.VIEW_PHARMACY_ORDERS,
    Permission.UPDATE_MEDICINE_ITEMS,
    Permission.VIEW_PHARMACY_ANALYTICS,
  ],

  CLEANER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_CLEANING_SERVICES,
    Permission.VIEW_CLEANING_ORDERS,
    Permission.UPDATE_CLEANING_STATUS,
    Permission.VIEW_CLEANING_SCHEDULE,
    Permission.VIEW_CLEANING_ANALYTICS,
  ],

  LAUNDRY: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_LAUNDRY_SERVICES,
    Permission.VIEW_LAUNDRY_ORDERS,
    Permission.UPDATE_LAUNDRY_STATUS,
    Permission.VIEW_LAUNDRY_SCHEDULE,
    Permission.VIEW_LAUNDRY_ANALYTICS,
  ],

  BEAUTY_SALON: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_BEAUTY_SERVICES,
    Permission.VIEW_BEAUTY_ORDERS,
    Permission.UPDATE_BEAUTY_STATUS,
    Permission.VIEW_BEAUTY_SCHEDULE,
    Permission.VIEW_BEAUTY_ANALYTICS,
  ],

  BARBER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_BARBER_SERVICES,
    Permission.VIEW_BARBER_ORDERS,
    Permission.UPDATE_BARBER_STATUS,
    Permission.VIEW_BARBER_SCHEDULE,
    Permission.VIEW_BARBER_ANALYTICS,
  ],

  FITNESS_TRAINER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_FITNESS_SERVICES,
    Permission.VIEW_FITNESS_ORDERS,
    Permission.UPDATE_FITNESS_STATUS,
    Permission.VIEW_FITNESS_SCHEDULE,
    Permission.VIEW_FITNESS_ANALYTICS,
  ],

  TUTOR: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_TUTORING_SERVICES,
    Permission.VIEW_TUTORING_ORDERS,
    Permission.UPDATE_TUTORING_STATUS,
    Permission.VIEW_TUTORING_SCHEDULE,
    Permission.VIEW_TUTORING_ANALYTICS,
  ],

  TECHNICIAN: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_TECHNICAL_SERVICES,
    Permission.VIEW_TECHNICAL_ORDERS,
    Permission.UPDATE_TECHNICAL_STATUS,
    Permission.VIEW_TECHNICAL_SCHEDULE,
    Permission.VIEW_TECHNICAL_ANALYTICS,
  ],

  PHOTOGRAPHER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_PHOTOGRAPHY_SERVICES,
    Permission.VIEW_PHOTOGRAPHY_ORDERS,
    Permission.UPDATE_PHOTOGRAPHY_STATUS,
    Permission.VIEW_PHOTOGRAPHY_SCHEDULE,
    Permission.VIEW_PHOTOGRAPHY_ANALYTICS,
  ],

  MUSICIAN: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_MUSIC_SERVICES,
    Permission.VIEW_MUSIC_ORDERS,
    Permission.UPDATE_MUSIC_STATUS,
    Permission.VIEW_MUSIC_SCHEDULE,
    Permission.VIEW_MUSIC_ANALYTICS,
  ],

  TRANSLATOR: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_TRANSLATION_SERVICES,
    Permission.VIEW_TRANSLATION_ORDERS,
    Permission.UPDATE_TRANSLATION_STATUS,
    Permission.VIEW_TRANSLATION_SCHEDULE,
    Permission.VIEW_TRANSLATION_ANALYTICS,
  ],

  LAWYER: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_LEGAL_SERVICES,
    Permission.VIEW_LEGAL_ORDERS,
    Permission.UPDATE_LEGAL_STATUS,
    Permission.VIEW_LEGAL_SCHEDULE,
    Permission.VIEW_LEGAL_ANALYTICS,
  ],

  ACCOUNTANT: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_ACCOUNTING_SERVICES,
    Permission.VIEW_ACCOUNTING_ORDERS,
    Permission.UPDATE_ACCOUNTING_STATUS,
    Permission.VIEW_ACCOUNTING_SCHEDULE,
    Permission.VIEW_ACCOUNTING_ANALYTICS,
  ],
  
  ADMIN: [
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.MANAGE_USERS,
    Permission.MANAGE_SERVICES,
    Permission.MANAGE_ORDERS,
    Permission.MANAGE_RESTAURANTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_PAYMENTS,
    Permission.MANAGE_NOTIFICATIONS,
    Permission.SYSTEM_CONFIG,
  ],
}; 