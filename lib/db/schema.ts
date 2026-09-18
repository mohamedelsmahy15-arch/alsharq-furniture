import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables --------------------------------------------------------
// This is a single-tenant admin CMS: all admin accounts manage the SAME
// store content (packages, products, site settings) — not per-user data.
// So app tables intentionally have NO userId scoping.

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  titleAr: text('titleAr').notNull(),
  badge: text('badge'),
  price: integer('price').notNull(),
  description: text('description').notNull().default(''),
  descriptionAr: text('descriptionAr').notNull().default(''),
  shortDescription: text('shortDescription').notNull().default(''),
  shortDescriptionAr: text('shortDescriptionAr').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const packageHighlights = pgTable('package_highlights', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  textEn: text('textEn').notNull().default(''),
  textAr: text('textAr').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageContents = pgTable('package_contents', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  textEn: text('textEn').notNull().default(''),
  textAr: text('textAr').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageBenefits = pgTable('package_benefits', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  icon: text('icon').notNull().default('✓'),
  titleEn: text('titleEn').notNull().default(''),
  titleAr: text('titleAr').notNull(),
  descriptionEn: text('descriptionEn').notNull().default(''),
  descriptionAr: text('descriptionAr').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageGallery = pgTable('package_gallery', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  imageUrl: text('imageUrl').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageFaq = pgTable('package_faq', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  questionEn: text('questionEn').notNull().default(''),
  questionAr: text('questionAr').notNull(),
  answerEn: text('answerEn').notNull().default(''),
  answerAr: text('answerAr').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageTestimonials = pgTable('package_testimonials', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  text: text('text').notNull(),
  rating: integer('rating').notNull().default(5),
  image: text('image'),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const packageRelated = pgTable('package_related', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  relatedPackageId: integer('relatedPackageId').notNull(),
})

export const productCategories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  heroImage: text('heroImage').notNull().default(''),
  description: text('description').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('categoryId').notNull(),
  name: text('name').notNull(),
  image: text('image').notNull().default(''),
  note: text('note'),
  price: integer('price').notNull(),
  originalPrice: integer('originalPrice').notNull(),
  inStock: boolean('inStock').notNull().default(true),
  longDescription: text('longDescription').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const productGallery = pgTable('product_gallery', {
  id: serial('id').primaryKey(),
  productId: integer('productId').notNull(),
  imageUrl: text('imageUrl').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const productSpecs = pgTable('product_specs', {
  id: serial('id').primaryKey(),
  productId: integer('productId').notNull(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const productRelatedCategories = pgTable('product_related_categories', {
  id: serial('id').primaryKey(),
  categoryId: integer('categoryId').notNull(),
  relatedCategoryId: integer('relatedCategoryId').notNull(),
})

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull().default(''),
})

export const customerReviews = pgTable('customer_reviews', {
  id: serial('id').primaryKey(),
  customerName: text('customerName').notNull(),
  location: text('location').notNull().default(''),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull().default(5),
  poster: text('poster').notNull().default(''),
  videoUrl: text('videoUrl').notNull().default(''),
  showOnSite: boolean('showOnSite').notNull().default(true),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const deliveryShowcase = pgTable('delivery_showcase', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  imageUrl: text('imageUrl').notNull(),
  videoUrl: text('videoUrl').notNull().default(''),
  packageName: text('packageName').notNull().default(''),
  showOnSite: boolean('showOnSite').notNull().default(true),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const optionTags = pgTable('option_tags', {
  id: serial('id').primaryKey(),
  group: text('group').notNull(),
  label: text('label').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const packageFurnitureCategories = pgTable('package_furniture_categories', {
  id: serial('id').primaryKey(),
  packageId: integer('packageId').notNull(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export const furnitureOptions = pgTable('furniture_options', {
  id: serial('id').primaryKey(),
  categoryId: integer('categoryId').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  imageUrl: text('imageUrl').notNull().default(''),
  features: text('features').notNull().default('[]'),
  specs: text('specs').notNull().default('[]'),
  media: text('media').notNull().default('[]'),
  videoUrl: text('videoUrl').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
})
