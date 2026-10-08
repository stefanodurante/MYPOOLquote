import {
  boolean,
  doublePrecision,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("staff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const catalogModels = pgTable("catalog_models", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  lengthM: doublePrecision("length_m").notNull(),
  widthM: doublePrecision("width_m").notNull(),
  depthM: doublePrecision("depth_m").notNull(),
  poolType: text("pool_type").notNull(),
  imageUrl: text("image_url"),
});

export const catalogPrices = pgTable("catalog_prices", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  category: text("category").notNull(),
  value: doublePrecision("value").notNull(),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull().default(""),
  contact: text("contact").notNull().default(""),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  customerUserId: text("customer_user_id").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id),
  builderName: text("builder_name").notNull(),
  builderRef: text("builder_ref").notNull().default(""),
  builderPiva: text("builder_piva").notNull().default(""),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address").notNull().default(""),
  clientContact: text("client_contact").notNull().default(""),
  appVersion: text("app_version").notNull(),
  quoteMode: text("quote_mode").notNull(),
  status: text("status").notNull().default("saved"),
  inputs: jsonb("inputs").notNull(),
  lineItems: jsonb("line_items").notNull(),
  bomState: jsonb("bom_state").notNull(),
  totals: jsonb("totals").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
