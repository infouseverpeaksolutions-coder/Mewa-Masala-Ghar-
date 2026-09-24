# Mewa Masala Ghar (मेवा मसाला घर)
### Authentic Indian Dry Fruits, Super Seeds, Makhana, Spices, Baby Nutrition & Natural Clays
**Enterprise E-Commerce Platform & Merchant Administration Monorepo**

---

## 📌 Project Overview
**Mewa Masala Ghar** is a production-grade full-stack digital commerce platform and merchant administration suite built strictly on **React (Vite + TypeScript) + Tailwind CSS + TanStack Query**, **Node.js (Express + TypeScript + Zod)**, and **MySQL 8 with Prisma ORM**.

The platform is architected around three specialized department stores powered by dynamic CSS-variable design systems matching `/design/homepage.png`:
1. **Mewa & Healthy Foods** — Royal Dry Fruits, Slow-Roasted Makhana, Wholesome Seeds & Stone-Ground Spices (Deep Forest Green `#2F5D3A` + Accent Gold `#D9A441` + Ivory `#FAF6EC`).
2. **Baby & Family Nutrition** — *Pratham Aahar* sprouted cereals, pregnancy care mixes, and age-specific restoratives (Sky Blue `#5DB4D6` + Warm Peach).
3. **Personal Care & Natural Clays** — Triple-sifted cosmetic grade Multani Mitti, Pink Multani, and mineral mud masks (Rose `#D47A88` + Sand).

---

## 🏛️ Monorepo Directory Structure

```text
mewa-masala-ghar/
├── client/                     # Storefront React SPA (Vite + TS + Tailwind + TanStack Query)
│   ├── src/
│   │   ├── components/         # Department theme provider, navbar, footer, cart drawer, modals
│   │   ├── context/            # Auth, Cart, Department, & UI state contexts
│   │   ├── pages/              # Landing, department store, catalog, PDP, cart, checkout, invoice
│   │   └── services/           # Axios API client with token refresh & interceptors
│   ├── .env.example
│   └── package.json
│
├── admin/                      # Merchant Admin Operations Dashboard (Vite + TS + Tailwind)
│   ├── src/
│   │   ├── components/         # Admin shell, sidebar, stat cards, data tables, modals
│   │   ├── context/            # Admin auth & role state
│   │   ├── pages/              # Analytics dashboard, order manager, product CRUD, settings
│   │   └── services/           # Admin API client
│   ├── .env.example
│   └── package.json
│
├── server/                     # REST API Backend (Node.js + Express + TypeScript + Zod)
│   ├── prisma/
│   │   ├── schema.prisma       # MySQL 8 normalized relational schema (27 tables + indexes)
│   │   └── seed.ts             # Comprehensive database seeder (3 stores, 34 products, settings)
│   ├── src/
│   │   ├── config/             # DB connection, env validation, JWT, Nodemailer, Razorpay
│   │   ├── controllers/        # Auth, product, order, coupon, admin, and tracking controllers
│   │   ├── middleware/         # JWT auth, role guard (SUPER_ADMIN, MANAGER, STAFF), rate limiter
│   │   ├── routes/             # RESTful API route declarations
│   │   └── utils/              # GST calculators (CGST/SGST/IGST), invoice generator, email templates
│   ├── .env.example
│   └── package.json
│
├── design/                     # Reference designs and assets (read-only)
│   └── homepage.png            # Visual style guide and design reference
│
├── docker-compose.yml          # MySQL 8.0 container service configuration
├── .env.example                # Root environment variables template
├── .eslintrc.cjs               # Monorepo ESLint configuration
├── .prettierrc                 # Code formatting rules
├── .prettierignore             # Prettier exclusions
└── README.md                   # Comprehensive run and architectural documentation
```

---

## 🗄️ Database Architecture (MySQL 8 with Prisma ORM)

The database schema in [`server/prisma/schema.prisma`](server/prisma/schema.prisma) comprises **27 normalized relational tables** engineered for high-concurrency Indian e-commerce:

| # | Table Name | Key Columns & Model Features | B-Tree Indexes |
|:---|:---|:---|:---|
| 1 | `stores` | `id`, `slug`, `name`, `theme_key`, `primary_color`, `accent_color`, `fssai_number` | `slug` |
| 2 | `categories` | `id`, `store_id`, `parent_id` (self-relation for nested hierarchy), `name`, `slug`, `display_order` | `slug`, `store_id`, `parent_id` |
| 3 | `products` | `id`, `store_id`, `category_id`, `name`, `slug`, `hsn_code`, `gst_rate`, `is_combo`, `combo_count` | `slug`, `store_id`, `category_id` |
| 4 | `product_variants`| `id`, `product_id`, `sku`, `weight_grams`, `pack_qty`, `mrp`, `price`, `gst_percent`, `stock_qty` | `sku`, `product_id` |
| 5 | `product_images` | `id`, `product_id`, `url`, `alt_text`, `is_primary`, `display_order` | `product_id` |
| 6 | `bundles` | `id`, `name`, `slug`, `price`, `mrp`, `is_active` | `slug` |
| 7 | `bundle_items` | `id`, `bundle_id`, `product_variant_id`, `quantity` | `bundle_id`, `product_variant_id` |
| 8 | `users` | `id`, `email`, `password`, `phone` (unique/optional), `role` (`CUSTOMER`, `STAFF`, `MANAGER`, `SUPER_ADMIN`), `email_verified` | `email`, `phone` |
| 9 | `addresses` | `id`, `user_id`, `name`, `phone`, `address_line1`, `address_line2`, `city`, `state`, `state_code`, `pincode`, `is_default` | `user_id` |
| 10 | `carts` | `id`, `user_id`, `session_id`, `coupon_id` | `user_id`, `session_id` |
| 11 | `cart_items` | `id`, `cart_id`, `product_variant_id`, `quantity` | `cart_id`, `product_variant_id` |
| 12 | `orders` | `id`, `order_no`, `invoice_no`, `user_id`, `tracking_token`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address_snapshot`, `billing_address_snapshot`, `status`, `subtotal`, `gst_amount`, `cgst`, `sgst`, `igst`, `total_amount` | `order_no`, `status`, `tracking_token`, `user_id` |
| 13 | `order_items` | `id`, `order_id`, `product_id`, `variant_id`, `sku`, `hsn_code`, `unit_price`, `quantity`, `gst_percent`, `gst_amount`, `total` | `order_id`, `product_id`, `variant_id`, `sku` |
| 14 | `order_status_history`| `id`, `order_id`, `status`, `comment`, `created_by`, `created_at` | `order_id`, `status` |
| 15 | `payments` | `id`, `order_id`, `method` (`COD`, `RAZORPAY`, `UPI`, `NETBANKING`), `status`, `amount`, `transaction_id`, `razorpay_order_id` | `order_id`, `status`, `transaction_id` |
| 16 | `coupons` | `id`, `code`, `discount_type` (`PERCENTAGE`, `FLAT`), `discount_value`, `min_order_value`, `max_discount`, `start_date`, `end_date`, `is_active` | `code` |
| 17 | `reviews` | `id`, `product_id`, `user_id`, `user_name`, `rating`, `title`, `comment`, `is_verified`, `is_approved` | `product_id`, `user_id` |
| 18 | `wishlist` | `id`, `user_id`, `product_id` (unique composite `[user_id, product_id]`) | `user_id`, `product_id` |
| 19 | `banners` | `id`, `store_id`, `title`, `subtitle`, `image_url`, `link_url`, `display_order`, `is_active` | `store_id` |
| 20 | `pages` | `id`, `slug`, `title`, `content` (`LONGTEXT`), `meta_title`, `meta_description`, `is_published` | `slug` |
| 21 | `settings` | `id`, `key` (unique), `value` (`TEXT`), `group` | `key` |
| 22 | `activity_logs` | `id`, `user_id`, `action`, `entity_type`, `entity_id`, `metadata`, `ip_address` | `user_id`, `[entity_type, entity_id]` |
| 23 | `contact_messages`| `id`, `name`, `email`, `phone`, `subject`, `message`, `status` (`NEW`, `IN_PROGRESS`, `RESOLVED`), `admin_note` | `status` |
| 24 | `shipments` | `id`, `order_id`, `courier`, `awb_no`, `tracking_url`, `expected_delivery`, `status` (`PENDING`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `RTO`) | `order_id`, `status`, `awb_no` |
| 25 | `tracking_events` | `id`, `order_id`, `shipment_id`, `status` (`PLACED`, `CONFIRMED`, `PACKED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RETURNED`), `title`, `description`, `location`, `event_time` | `order_id`, `shipment_id`, `status` |
| 26 | `password_reset_tokens`| `id`, `user_id`, `token` (unique), `expires_at` | `user_id`, `token` |
| 27 | `email_verifications`| `id`, `user_id`, `token` (unique), `expires_at` | `user_id`, `token` |

---

## 🇮🇳 Indian Statutory & E-Commerce Compliance

- **FSSAI License Compliance**: Displays Central FSSAI License Number `10021051000123` across all storefront footers, food product detail cards, checkout summaries, and statutory tax invoices.
- **GST-Inclusive Consumer Pricing**: Consumer prices are shown inclusive of GST, with automatic intra-state (Maharashtra `27`: 50% CGST + 50% SGST) vs inter-state (100% IGST) calculations based on delivery pincode state code.
- **HSN Code Tax Invoices**: Generates compliant Indian Tax Invoices with seller GSTIN `27AABCM1234F1Z5`, buyer details, HSN codes (`0801` dry fruits, `0910` spices, `1204/1206` seeds, `3304` cosmetics), and tax distribution summaries.
- **6-Digit Pincode Validator**: Live serviceability check validating turnaround times (2-4 business days) and Cash on Delivery eligibility across Mumbai (`400xxx`), Delhi (`110xxx`), Bengaluru (`560xxx`), Pune (`411xxx`), etc.
- **AYUSH & Cosmetic Disclaimers**: Strict adherence to AYUSH disclaimers for herbal products and cosmetic-use warnings for Multani Mitti and clays.

---

## 🚀 Installation & Run Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MySQL 8.0**: Local instance or via Docker

### 2. Launch MySQL via Docker (Optional)
```bash
docker-compose up -d
```

### 3. Environment Setup
Copy the provided `.env.example` templates:
```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env

# Admin configuration
cp admin/.env.example admin/.env
```

Ensure your `server/.env` has the correct MySQL connection string:
```env
DATABASE_URL="mysql://root:H%40snain07@localhost:3306/mewa_masala_ghar"
```

### 4. Database Setup & Seeding
From the `/server` directory:
```bash
cd server
npm.cmd install

# Sync Prisma schema with MySQL
npx.cmd prisma db push

# Seed complete catalog (3 stores, categories, 34 products, combo hampers, banners, pages, settings)
npm.cmd run db:seed

# Build server TypeScript
npm.cmd run build
```

### 5. Install Client & Admin Dependencies
```bash
# Client Storefront
cd ../client
npm.cmd install

# Admin Operations Portal
cd ../admin
npm.cmd install
```

### 6. Run the Monorepo Services
Run each service in separate terminal windows:

```bash
# 1. Start REST API Backend (Port 5000)
cd server
npm.cmd run dev

# 2. Start Client Storefront (Port 5173)
cd client
npm.cmd run dev

# 3. Start Admin Operations Portal (Port 5174)
cd admin
npm.cmd run dev
```

---

## 🔑 Default Seeded Accounts & Credentials

| Role | Email | Password | Permissions |
|:---|:---|:---|:---|
| **Super Admin** | `admin@mewamasalaghar.com` | `Admin@12345` | Full system access, settings, inventory, staff management |
| **Manager** | `manager@mewamasalaghar.com` | `Manager@12345` | Catalog management, order processing, coupon operations |
| **Staff** | `staff@mewamasalaghar.com` | `Staff@12345` | Dispatch, shipment tracking, order status updates |
| **Customer** | `aarav@example.com` | `Customer@12345` | Storefront customer with saved address & wishlist |

---

## 🧪 Verification & Health Check

1. **API Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   # Response: {"status":"OK","timestamp":"...","environment":"development"}
   ```

2. **Run End-to-End Test Suite**:
   ```bash
   node test-e2e.js
   ```

3. **Verify All 27 Database Tables**:
   ```bash
   cd server
   node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); Promise.all([p.store.count(), p.product.count(), p.category.count(), p.bundle.count()]).then(r => console.log('Stores:', r[0], 'Products:', r[1], 'Categories:', r[2], 'Bundles:', r[3])).finally(() => p.$disconnect());"
   ```

---

## 🛡️ Role-Based Access Control (RBAC) Hierarchy

```mermaid
graph TD
    SA["SUPER_ADMIN (Full Platform & Setting Control)"] --> M["MANAGER (Orders, Products, Discounts)"]
    M --> S["STAFF (Fulfillment, AWB Tracking, Order Status)"]
    SA --> C["CUSTOMER (Browse, Cart, Checkout, Profile, Tracking)"]
```
