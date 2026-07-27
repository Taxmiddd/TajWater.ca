# TajWater Telegram Bot Guide

Welcome to the TajWater Telegram Bot! This bot is designed to help drivers and admins manage field operations, log deliveries, track expenses, and manage customers seamlessly from Telegram.

Below is a complete list of commands, formats, and how to use them.

---

## 🚚 For Drivers (Field Operations)

### 1. The Interactive Menu
- **Command**: `/start`
- **What it does**: Opens an interactive menu with buttons for common tasks.
- **Buttons Available**:
  - `Start Shift` / `End Shift`
  - `Log Delivery`
  - `Stock Truck` / `Return Empties`
  - `Customer History` / `My Stats`

### 2. Logging a Delivery (Charging a Customer)
- **Format**: `customer@email.com, [quantity] [item], [quantity] [item]`
- **Example**: `john@email.com, 5 bottles, 2 paper cups, 1 dispenser`
- **What it does**: 
  - Finds the customer by email.
  - Matches the items to products in the database.
  - Checks if the customer has enough wallet balance.
  - Deducts the total cost from their wallet.
  - Automatically logs any delivered bottles to your "delivered today" stats.
  - Increases the customer's "Jars Held" count.
  - Emails a receipt to the customer.
- **Proof of Delivery (Optional)**: If you attach a photo and/or location when sending this message, the bot will save the photo and attach it to the transaction log for admins to see!

### 3. Inventory Tracking
Track what goes in and out of your truck.

- **Load Truck (Full Bottles)**
  - **Command**: `/stock [quantity]`
  - **Example**: `/stock 50`
  - **What it does**: Logs that you loaded 50 full bottles onto your truck.

- **Return Empties (Picked up from customer)**
  - **Command**: `/return [customer_email] [quantity]`
  - **Example**: `/return john@email.com 5`
  - **What it does**: Logs that you picked up 5 empty jars from John. It decreases John's "Jars Held" count and updates your daily stats.

- **View My Stats**
  - **Command**: `/stats`
  - **What it does**: Shows your daily performance: Bottles loaded, bottles delivered, current full bottles remaining, and empties picked up.

### 4. CRM & Customer Info
Get info about a customer before you arrive.

- **View Customer Profile**
  - **Command**: `/crm [customer_email]`
  - **Example**: `/crm john@email.com`
  - **What it does**: Shows the customer's wallet balance, how many empty jars they are currently holding, if they have a dispenser subscription, and any internal admin notes.

- **View Customer History**
  - **Command**: `/history [customer_email]`
  - **Example**: `/history john@email.com`
  - **What it does**: Shows the last 5 transactions (charges or top-ups) for this customer.

- **Capture a New Lead**
  - **Command**: `/lead [Name] [Phone] [Notes]`
  - **Example**: `/lead "Jane Doe" 555-1234 Interested in 5 bottles a week`
  - **What it does**: Saves the person's info into the Leads CRM on the admin dashboard so the office can follow up.

### 5. Logging Expenses
- **Command**: `/expense [amount] [category] [description]`
- **Example**: `/expense 60.50 Gas Refilled truck 2`
- **What it does**: Logs a business expense. Admins can view and export this from the Admin Dashboard.

---

## 👑 For Administrators

Admins have access to all driver commands above, plus the following restricted commands:

### 1. Wallet Top-Up (Add Funds)
- **Command**: `/topup [customer_email] [amount]`
- **Example**: `/topup john@email.com 100`
- **What it does**: Instantly adds $100 to the customer's wallet balance.

### 2. Manual Invoicing
- **Command**: `/invoice [customer_email] [amount] [description]`
- **Example**: `/invoice john@email.com 200 Monthly corporate refill`
- **What it does**: Generates an unpaid invoice in the system for the office to track.

### 3. Assign Dispenser Subscription
- **Command**: `/assign_dispenser [customer_email]`
- **Example**: `/assign_dispenser john@email.com`
- **What it does**: Turns on the active dispenser subscription flag for this customer.

### 4. Broadcast to Drivers
- **Command**: `/broadcast [Message]`
- **Example**: `/broadcast Traffic delay on Highway 1, drive safely!`
- **What it does**: Sends your message to all drivers currently registered in the system.

### 5. Replying to Support Tickets
- **How to use**: When the bot sends you a "New Support Ticket" notification containing the customer's message, simply use Telegram's **"Reply"** feature on that specific message and type your response. 
- **What it does**: The bot will automatically take your reply and securely email it back to the customer via the TajWater support email.

---
*If you need help or run into errors, please contact your system administrator.*
