# 🤖 TajWater Telegram Bot Guide

> Two bots power TajWater field operations. This guide covers both.

---

## 📋 Table of Contents

1. [Bot Overview](#bot-overview)
2. [TajWater Bot — For Drivers](#-tajwater-bot--for-drivers)
   - [Step 1: Register](#step-1--link-your-account-first-time-only)
   - [Step 2: Open the Menu](#step-2--open-the-menu)
   - [Logging a Delivery](#logging-a-delivery)
   - [Inventory Tracking](#inventory-tracking)
   - [Customer Lookup](#customer-lookup)
   - [Logging Expenses](#logging-expenses)
   - [Capturing Leads](#capturing-leads)
3. [TajWater Bot — Admin Commands](#-tajwater-bot--admin-only-commands)
   - [Granting Admin Access](#granting-admin-access)
   - [Wallet Top-Up](#wallet-top-up)
   - [Manual Invoicing](#manual-invoicing)
   - [Assign Dispenser](#assign-dispenser-subscription)
   - [Broadcast to All Users](#broadcast-to-all-users)
   - [Reply to Support Tickets](#replying-to-support-tickets)
4. [TajExpense Bot](#-tajexpense-bot)
5. [Warnings & Common Errors](#-warnings--common-errors)

---

## Bot Overview

| Bot | Purpose | Who Uses It |
|-----|---------|-------------|
| **TajWater Bot** | Deliveries, CRM, inventory, admin ops | Drivers + Admins |
| **TajExpense Bot** | Logging business expenses | Drivers + Admins |

> **No setup required for users.** Anyone with a TajWater account can self-register using `/register`. Admin roles are promoted via the Supabase dashboard — no chat ID configuration needed.

---

## 🚚 TajWater Bot — For Drivers

### Step 1 — Link Your Account (First Time Only)

**Command:** `/register your@email.com`

```
/register john@tajwater.ca
```

Send this command with the **email address you signed up with** on the TajWater website. The bot will link your Telegram account to your profile automatically:

```
✅ Welcome, John!

Your Telegram account is now linked.
Role: 🚚 Driver

Type /start to open the menu.
```

You only need to do this **once**. After that, the bot always knows who you are.

> ⚠️ If your email isn't recognised, make sure it matches exactly what's on your TajWater account.

---

### Step 2 — Open the Menu

**Command:** `/start`

Opens an interactive button menu. Tap any button to get instructions for that action.

> If you haven't registered yet, `/start` will ask you to run `/register` first.

**Menu Buttons:**

| Button | What It Does |
|--------|-------------|
| 🚚 Start Shift | Marks the beginning of your shift |
| 🛑 End Shift | Shows today's collective delivery summary |
| 📦 Log Delivery | Shows delivery format instructions |
| 📥 Stock Truck | Shows how to log loaded bottles |
| 🔄 Return Empties | Shows how to log picked-up empties |
| 📜 Customer History | Shows how to look up a customer's transactions |
| 📊 My Stats | Shortcut to your daily inventory stats |

---

### Logging a Delivery

This is the core action. No command prefix needed — just send the customer's email followed by what you delivered.

**Format:**
```
customer@email.com, [qty] [item], [qty] [item], ...
```

**Examples:**
```
john@email.com, 5 bottles, 2 paper cups
sarah@example.com, 10 bottles, 1 dispenser, 3 paper cups
```

**What happens automatically:**
1. Customer is looked up by email
2. Items are matched to products in the database
3. Customer's wallet balance is checked
4. Total cost is deducted from their wallet
5. Delivered bottle count is added to the customer's "Jars Held"
6. Your truck inventory is updated
7. A receipt email is sent to the customer
8. You get a confirmation with an itemized breakdown

**⚠️ Warnings you may receive in the confirmation:**
- `⚠️ JARS WARNING` — Customer is holding 5+ empty jars after this delivery; collect them this visit
- `⚠️ LOW BALANCE WARNING` — Customer balance is under $15; remind them to top up

**📸 Proof of Delivery (Optional)**

Attach a **photo** and/or share your **location** in the same message as the delivery. The bot will:
- Compress and save the photo to secure cloud storage
- Attach it to the transaction log for admins to review

---

### Inventory Tracking

#### Load Truck (Full Bottles)

**Command:** `/stock [quantity]`

```
/stock 50
```

Logs that you loaded 50 full bottles onto your truck at the start of the day.

---

#### Return Empties (Picked Up from Customer)

**Command:** `/return [customer_email] [quantity]`

```
/return john@email.com 5
```

Logs that you picked up 5 empty jars from John. Decreases John's "Jars Held" count and updates your daily stats.

---

#### View My Stats

**Command:** `/stats`

Shows your personal daily inventory summary:

```
📊 Your Daily Stats

Truck Stock:
- Loaded Today: 50
- Delivered: 32
- Current Full: 18
- Empties Picked Up: 7
```

---

### Customer Lookup

#### View Customer Profile

**Command:** `/crm [customer_email]`

```
/crm john@email.com
```

Returns:
- Customer name
- Wallet balance
- Empty jars currently held
- Whether they have an active dispenser subscription
- Any admin notes on the account

---

#### View Transaction History

**Command:** `/history [customer_email]`

```
/history john@email.com
```

Shows the customer's last **5 transactions** (charges and top-ups) with dates and amounts.

---

### Logging Expenses

**Command:** `/expense [amount] [category] [description]`

```
/expense 60.50 Gas Refilled truck 2 on Main St
/expense 12.00 Supplies Bought receipt rolls
```

- `amount` — Dollar amount (no `$` sign needed)
- `category` — Single word (e.g. `Gas`, `Supplies`, `Maintenance`)
- `description` — Everything after the category; can be multiple words

Admins can view and export all logged expenses from the Admin Dashboard.

---

### Capturing Leads

**Command:** `/lead [Name] [ContactInfo] [Notes]`

```
/lead Jane 555-1234 Interested in 5 bottles a week
/lead Mike mike@gmail.com Office of 10 people, wants corporate plan
```

- `Name` — Single word or first name
- `ContactInfo` — Phone number or email (single word, no spaces)
- `Notes` — Everything after; can be as long as needed

Saves the lead into the CRM on the Admin Dashboard for the office to follow up.

> **Note:** Multi-word names are not supported yet. Use first name only, or combine with underscore (e.g. `Jane_Doe`).

---

## 👑 TajWater Bot — Admin-Only Commands

Admin commands require your profile to have `telegram_role = 'admin'` in the database. If you try an admin command without this role, you'll see:

```
❌ Admin access required. Register with /register first.
```

---

### Granting Admin Access

There are no hardcoded admin lists. Access is managed entirely in **Supabase**:

1. The user runs `/register their@email.com` in Telegram
2. Go to **Supabase Dashboard → Table Editor → `profiles`**
3. Find the row for that user
4. Set the `telegram_role` column to `admin`
5. They immediately gain admin access — no restart needed

> Regular drivers have `telegram_role = 'driver'` (set automatically on registration). Unregistered users have `NULL`.

**Required SQL migration** (run once in Supabase SQL Editor if not already done):
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_chat_id bigint UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_role text CHECK (telegram_role IN ('driver', 'admin'));
```

---

### Wallet Top-Up

**Command:** `/topup [customer_email] [amount]`

```
/topup john@email.com 100
```

Instantly adds $100 to the customer's wallet and logs the transaction as `admin_topup`. The customer's balance is updated immediately.

---

### Manual Invoicing

**Command:** `/invoice [customer_email] [amount] [description]`

```
/invoice john@email.com 200 Monthly corporate refill
```

Creates an **unpaid invoice** in the system. Visible on the Admin Dashboard under Invoices.

---

### Assign Dispenser Subscription

**Command:** `/assign_dispenser [customer_email]`

```
/assign_dispenser john@email.com
```

Turns on the `dispenser_subscription_active` flag for this customer. It will then show as "Yes" in their `/crm` profile.

---

### Broadcast to All Users

**Command:** `/broadcast [message]`

```
/broadcast Traffic delay on Highway 1, drive safely!
/broadcast Route change today — avoid downtown core until 3pm
```

Sends your message to **every registered Telegram user** (anyone who has ever run `/register`). They receive:

```
📢 ADMIN BROADCAST

Traffic delay on Highway 1, drive safely!
```

---

### Replying to Support Tickets

When a customer submits a support ticket via the website, all admins receive a notification:

```
🚨 New Support Ticket 🚨

From: Jane Doe (jane@email.com)
Subject: Missing delivery

Message:
My order from yesterday never arrived.
```

**To reply:**
1. Tap and hold on that specific notification message in Telegram
2. Tap **Reply**
3. Type your response and send

The bot emails your reply directly to the customer and confirms with `✅ Reply sent to jane@email.com`.

> ⚠️ You **must** use Telegram's Reply feature on the exact ticket message. A new message will not be routed.

---

## 💸 TajExpense Bot

A dedicated lightweight bot for logging business expenses. Operates independently from the TajWater Bot — no `/register` required.

### Getting Started

**Command:** `/start`

Sends a welcome message with usage instructions.

---

### Log an Expense

**Command:** `/expense [amount] [category] [description]`

```
/expense 50 Gas Refilled truck 1
/expense 23.75 Maintenance Oil change for van
/expense 8.50 Parking Downtown delivery
```

- `amount` — Dollar amount (decimals supported)
- `category` — Single word label
- `description` — Everything after category; optional but recommended

On success:
```
✅ Expense Logged!

Amount: $50.00
Category: Gas
Desc: Refilled truck 1
```

All expenses are visible and exportable from the Admin Dashboard.

---

## ⚠️ Warnings & Common Errors

| Message | Cause | Fix |
|---------|-------|-----|
| `❌ No email found` | Delivery message missing a valid email | Include the customer's email at the start |
| `❌ No items found after the email` | Email sent with no items | Add items after the email, e.g. `john@x.com, 5 bottles` |
| `❌ None of the items matched` | Item names don't match the database | Use names like: `bottles`, `refill`, `dispenser`, `paper cups` |
| `❌ Insufficient balance` | Customer wallet too low | Ask admin to `/topup`, do not deliver |
| `❌ No customer found with email` | Email not in the system | Double-check spelling |
| `❌ Admin access required` | Command needs admin role | Ask admin to set `telegram_role = 'admin'` in Supabase |
| `❌ No account found with email` | `/register` email doesn't match any profile | Use the exact email from your TajWater account |
| `⚠️ This email is already linked` | Email is registered on a different Telegram account | Contact your admin |
| `❌ Invalid amount` | Amount is 0, negative, or non-numeric | Use a positive number, e.g. `50` or `12.50` |
| `❌ Invalid format` | Command arguments are missing | Check the format in this guide |

---

*For technical issues, contact your system administrator.*
