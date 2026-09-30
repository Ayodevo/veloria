import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users / Admin Accounts
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("manager"), // 'owner' | 'manager' | 'editor'
  twoFactorSecret: text("two_factor_secret"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Key-Value Site Settings
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(), // JSON or string text
  group: text("group").notNull().default("general"), // general, appearance, languages, currency, next_shipment, order_mode, fees, notifications, seo, maintenance
  isTranslatable: integer("is_translatable", { mode: "boolean" }).default(false),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Menus
export const menus = sqliteTable("menus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  location: text("location").notNull(), // header, footer
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  menuId: integer("menu_id").references(() => menus.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // JSON: { fr: "", ar: "" }
  url: text("url").notNull(),
  icon: text("icon"),
  target: text("target").default("_self"),
  order: integer("order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true),
  parentId: integer("parent_id"),
});

// Custom Pages
export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(), // JSON
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // JSON rich text
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  metaTitle: text("meta_title"), // JSON
  metaDescription: text("meta_description"), // JSON
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_pages_slug").on(table.slug),
]);

// Homepage Sections
export const homeSections = sqliteTable("home_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title").notNull(), // JSON
  subtitle: text("subtitle"), // JSON
  content: text("content"), // JSON config
  isEnabled: integer("is_enabled", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Banners / Hero Slides
export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(), // JSON
  subtitle: text("subtitle"), // JSON
  desktopImageUrl: text("desktop_image_url").notNull(),
  mobileImageUrl: text("mobile_image_url"),
  buttonLabel: text("button_label"), // JSON
  buttonUrl: text("button_url"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// FAQ Categories & FAQ Items
export const faqCategories = sqliteTable("faq_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // JSON
  sortOrder: integer("sort_order").default(0),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => faqCategories.id, { onDelete: "set null" }),
  question: text("question").notNull(), // JSON
  answer: text("answer").notNull(), // JSON
  sortOrder: integer("sort_order").default(0),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
});

// Reviews
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerAvatar: text("customer_avatar"),
  rating: integer("rating").notNull().default(5),
  content: text("content").notNull(), // JSON
  photoUrl: text("photo_url"),
  isApproved: integer("is_approved", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Instagram Gallery
export const instagramItems = sqliteTable("instagram_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Categories (Nested)
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // JSON
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id"),
  description: text("description"), // JSON
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_categories_slug").on(table.slug),
]);

// Brands
export const brands = sqliteTable("brands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  description: text("description"), // JSON
  sortOrder: integer("sort_order").default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Products (Veloria Select)
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // JSON
  slug: text("slug").notNull().unique(),
  description: text("description"), // JSON
  shortDescription: text("short_description"), // JSON
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
  tags: text("tags").default("[]"), // JSON string array: ['new', 'featured', 'limited']
  priceEur: integer("price_eur").notNull(), // stored as cents (e.g. 2990 = 29.90 EUR)
  comparePriceEur: integer("compare_price_eur"),
  purchasePriceEur: integer("purchase_price_eur").default(0),
  mainImageUrl: text("main_image_url").notNull(),
  galleryUrls: text("gallery_urls").default("[]"), // JSON array of string URLs
  isStockTracked: integer("is_stock_tracked", { mode: "boolean" }).default(true),
  totalStock: integer("total_stock").notNull().default(0),
  badgeText: text("badge_text"), // JSON e.g. { fr: "Nouveau", ar: "جديد" }
  status: text("status").notNull().default("active"), // active, hidden, out_of_stock
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_products_slug").on(table.slug),
  index("idx_products_status").on(table.status),
]);

// Product Variants (Shade, Size, etc.)
export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // JSON e.g. { fr: "Teinte 01", ar: "درجة 01" }
  sku: text("sku"),
  priceEur: integer("price_eur"), // cents (if null, falls back to product priceEur)
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Shipment Batches
export const shipments = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  departureDate: text("departure_date").notNull(),
  orderDeadline: text("order_deadline").notNull(),
  status: text("status").notNull().default("active"), // active, closed, completed
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Requests & Orders (Unified)
export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // 'select' | 'shein' | 'special'
  reference: text("reference").notNull().unique(), // VS-0001, VX-0001, SO-0001
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  address: text("address"),
  status: text("status").notNull().default("received"), // received, quote_sent, confirmed, purchased, in_transit, arrived_tn, delivered, cancelled
  totalEur: integer("total_eur").default(0), // cents
  totalTnd: integer("total_tnd").default(0), // cents (millimes/centimes equivalent, e.g. 100 TND = 10000)
  purchaseCostEur: integer("purchase_cost_eur").default(0), // cents
  serviceFeeEur: integer("service_fee_eur").default(0), // cents
  deliveryFeeTnd: integer("delivery_fee_tnd").default(0), // cents
  giftWrapFeeTnd: integer("gift_wrap_fee_tnd").default(0), // cents
  marginEur: integer("margin_eur").default(0), // cents
  depositPaidEur: integer("deposit_paid_eur").default(0), // cents
  notes: text("notes"),
  trackingNumber: text("tracking_number"),
  shipmentId: integer("shipment_id").references(() => shipments.id, { onDelete: "set null" }),
  promoCode: text("promo_code"),
  isGiftWrapped: integer("is_gift_wrapped", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_requests_ref").on(table.reference),
  index("idx_requests_phone").on(table.phone),
  index("idx_requests_status").on(table.status),
  index("idx_requests_type").on(table.type),
]);

// Request Items
export const requestItems = sqliteTable("request_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id").notNull().references(() => requests.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: integer("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  productUrl: text("product_url"),
  screenshotUrl: text("screenshot_url"),
  quantity: integer("quantity").notNull().default(1),
  priceEur: integer("price_eur").default(0), // cents
  itemNotes: text("item_notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Request Status History Timeline
export const requestStatusHistory = sqliteTable("request_status_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id").notNull().references(() => requests.id, { onDelete: "cascade" }),
  oldStatus: text("old_status"),
  newStatus: text("new_status").notNull(),
  changedBy: text("changed_by").notNull().default("system"),
  note: text("note"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Customers Database
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  city: text("city"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpentEur: integer("total_spent_eur").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_customers_phone").on(table.phone),
]);

// Notification Message Templates
export const messageTemplates = sqliteTable("message_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(), // e.g. status_quote_sent, status_in_transit
  name: text("name").notNull(),
  channel: text("channel").notNull().default("whatsapp"), // whatsapp, email
  subject: text("subject"), // JSON
  body: text("body").notNull(), // JSON template with placeholders {name}, {reference}, {status}, {tracking_link}
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Promo Codes
export const promoCodes = sqliteTable("promo_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull().default("percent"), // percent, fixed
  discountValue: integer("discount_value").notNull(), // percentage or cents
  validFrom: text("valid_from"),
  validUntil: text("valid_until"),
  usageLimit: integer("usage_limit"),
  timesUsed: integer("times_used").notNull().default(0),
  appliesTo: text("applies_to").notNull().default("all"), // all, select, shein, special
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Subscribers (Newsletter & WhatsApp Broadcast)
export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull().default("whatsapp"), // whatsapp, email
  contact: text("contact").notNull().unique(), // phone or email
  isVerified: integer("is_verified", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Activity Log (Audit Trail)
export const activityLog = sqliteTable("activity_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
