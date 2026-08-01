# 🤖 TajWater Telegram Bot Guide

> Two bots power TajWater field operations. This guide covers both.

---

## 📋 Table of Contents

1. [Bot Overview](#bot-overview)
2. [TajWater Bot — For Drivers](#-tajwater-bot--for-drivers)
   - [Getting Started](#getting-started)
   - [Logging a Delivery](#logging-a-delivery)
   - [Inventory Tracking](#inventory-tracking)
   - [Customer Lookup](#customer-lookup)
   - [Logging Expenses](#logging-expenses)
   - [Capturing Leads](#capturing-leads)
3. [TajWater Bot — Admin Commands](#-tajwater-bot--admin-only-commands)
   - [Wallet Top-Up](#wallet-top-up)
   - [Manual Invoicing](#manual-invoicing)
   - [Assign Dispenser](#assign-dispenser-subscription)
   - [Broadcast to Drivers](#broadcast-to-drivers)
   - [Reply to Support Tickets](#replying-to-support-tickets)
4. [TajExpense Bot](#-tajexpense-bot)
5. [Warnings & Common Errors](#-warnings--common-errors)

---

## Bot Overview

| Bot | Purpose | Who Uses It |
|-----|---------|-------------|
| **TajWater Bot** | Deliveries, CRM, inventory, admin ops | Drivers + Admins |
| **TajExpense Bot** | Logging business expenses | Drivers + Admins |

> **Note:** Admin commands are role-locked. Roles are set in the Supabase dashboard — no pre-registration or chat ID lists required.

---

## 🚚 TajWater Bot — For Drivers

### Getting Started

#### Step 1 — Link Your Account (First Time Only)

**Command:** `/register your@email.com`

```
/register john@tajwater.ca
```

The first time you message the bot, you need to link your Telegram account to your TajWater profile. Send this command with the email you signed up with. You'll get a confirmation:

```
✅ Welcome, John!

Your Telegram account is now linked.
Role: 🚚 Driver

Type /start to open the menu.
```

You only need to do this **once**. After that, the bot remembers you.

---

#### Step 2 — Open the Menu

**Command:** `/start`

Opens an interactive button menu. Tap any button to get instructions for that action.

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
5. Bottle count is added to the customer's "Jars Held"
6. Your truck inventory is updated (delivered bottles)
7. A receipt email is sent to the customer
8. You get a confirmation with itemized breakdown

**⚠️ Warnings you may receive:**
- `❌ Insufficient balance` — Customer doesn't have enough funds; do not deliver until topped up
- `⚠️ JARS WARNING` — Customer is holding more than 5 empty jars; collect them this visit
- `⚠️ LOW BALANCE WARNING` — Customer balance is under $15; remind them to top up
- `⚠️ Not found in DB: "..."` — One or more items didn't match a product; the rest were still processed

**📸 Proof of Delivery (Optional)**

Attach a **photo** and/or share your **location** together with your delivery message. The bot will:
- Compress and save the photo to secure storage
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

> **Note:** Multi-word names with spaces are not yet supported. Use a first name only, or combine with an underscore (e.g. `Jane_Doe`).

---

## 👑 TajWater Bot — Admin-Only Commands

> These commands will return `❌ You do not have permission` if your Telegram account is not registered as an admin.

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

### Broadcast to Drivers

**Command:** `/broadcast [message]`

```
/broadcast Traffic delay on Highway 1, drive safely!
/broadcast Route change today — avoid downtown core until 3pm
```

Sends your message to **all registered Telegram users** (anyone who has run `/register`). They will receive:

```
📢 ADMIN BROADCAST

Traffic delay on Highway 1, drive safely!
```

---

### Replying to Support Tickets

When a customer submits a support ticket via the website, the bot sends a notification to all admin chats that looks like this:

```
🚨 New Support Ticket 🚨

From: Jane Doe (jane@email.com)
Subject: Missing delivery

Message:
My order from yesterday never arrived.
```

**To reply:**
1. Tap and hold on that specific notification message
2. Tap **Reply** in Telegram
3. Type your response and send

The bot will automatically email your reply to the customer and confirm with `✅ Reply sent to jane@email.com`.

> ⚠️ You **must** use Telegram's Reply feature on the exact ticket message. Sending a new message will not work.

---

## 💸 TajExpense Bot

A dedicated, lightweight bot purely for logging business expenses. Useful if you want a separate bot for expense tracking without access to delivery or CRM features.

### Getting Started

**Command:** `/start`

Sends a welcome message with the usage format.

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

All expenses are visible on the Admin Dashboard.

---

## ⚠️ Warnings & Common Errors

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `❌ No email found` | Delivery message missing a valid email | Include the customer's email at the start |
| `❌ No items found after the email` | Email sent but no items listed | Add items after the email, e.g. `john@x.com, 5 bottles` |
| `❌ None of the items matched` | Product names don't match the database | Use common names: `bottles`, `refill`, `dispenser`, `paper cups` |
| `❌ Insufficient balance` | Customer wallet too low | Ask admin to top up, or don't proceed with delivery |
| `❌ No customer found with email` | Email not registered in the system | Double-check the email spelling |
| `❌ You do not have permission` | Command is admin-only | Contact your admin |
| `❌ Invalid amount` | Amount is 0, negative, or not a number | Use a positive number, e.g. `50` or `12.50` |
| `❌ Invalid format` | Command arguments are missing or wrong | Check the format shown in this guide |

---

*For technical issues, contact your system administrator.*
