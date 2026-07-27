const fs = require('fs');

let content = fs.readFileSync('app/api/telegram/webhook/route.ts', 'utf8');

// 1. Add /invoice command handling
const invoiceCode = `
    // Handle /invoice command for manual invoicing
    if (text.startsWith('/invoice')) {
      const args = text.split(' ')
      if (args.length < 4) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /invoice customer@email.com 50 Description")
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()
      const amount = parseFloat(args[2])
      const description = args.slice(3).join(' ')

      if (isNaN(amount) || amount <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid amount.")
        return NextResponse.json({ ok: true })
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('invoices').insert({
        customer_email: email,
        amount: amount,
        description: description,
        status: 'unpaid'
      })

      // Send email logic would go here (omitted for brevity, could use resend)
      await sendTelegramMessage(chatId, \`✅ Invoice generated for \${email} - $\${amount}\`)
      return NextResponse.json({ ok: true })
    }

    // Handle /lead command
    if (text.startsWith('/lead')) {
      const args = text.split(' ')
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /lead Name Contact Notes")
        return NextResponse.json({ ok: true })
      }
      const name = args[1]
      const contactInfo = args[2]
      const notes = args.slice(3).join(' ')

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('leads').insert({
        name: name,
        contact_info: contactInfo,
        notes: notes,
        created_by: chatId.toString()
      })

      await sendTelegramMessage(chatId, \`✅ Lead \${name} saved to CRM.\`)
      return NextResponse.json({ ok: true })
    }
    
    // Handle /crm command for customers
    if (text.startsWith('/crm')) {
      const args = text.split(' ')
      if (args.length < 2) {
        await sendTelegramMessage(chatId, "❌ Use: /crm customer@email.com")
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: profile } = await supabase.from('profiles').select('*').eq('email', email).single()
      if (!profile) {
        await sendTelegramMessage(chatId, \`❌ No customer found with email: \${email}\`)
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, \`👤 *Customer CRM: \${profile.name}*\nEmail: \${profile.email}\nBalance: $\${profile.wallet_balance}\nJars Held: \${profile.empty_jars_held || 0}\nDispenser Sub: \${profile.dispenser_subscription_active ? 'Yes' : 'No'}\nNotes: \${profile.notes || 'None'}\`, { parse_mode: 'Markdown' })
      return NextResponse.json({ ok: true })
    }
`;

content = content.replace('// Handle /start command', invoiceCode + '\n    // Handle /start command');

// 2. Add dispenser and empty_jars logic
const assignDispenserCode = `
    if (text.startsWith('/assign_dispenser')) {
      const args = text.split(' ');
      if (args.length < 2) return NextResponse.json({ ok: true });
      const email = args[1].toLowerCase();
      
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      await supabase.from('profiles').update({ dispenser_subscription_active: true }).eq('email', email);
      
      await sendTelegramMessage(chatId, \`✅ Dispenser assigned to \${email}\`);
      return NextResponse.json({ ok: true });
    }
`;

content = content.replace('// Handle /broadcast command for admins', assignDispenserCode + '\n    // Handle /broadcast command for admins');

// Update /return command to decrement jars
content = content.replace(
  `await supabase.from('inventory_logs').insert({`,
  `
      // Decrement jars
      const { data: prof } = await supabase.from('profiles').select('empty_jars_held').eq('email', email).single()
      if (prof) {
         await supabase.from('profiles').update({ empty_jars_held: Math.max(0, (prof.empty_jars_held || 0) - qty) }).eq('email', email)
      }

      await supabase.from('inventory_logs').insert({`
);

// 3. Add location and photo upload to supabase logic
// In Handle Photo (Proof of Delivery)
content = content.replace(
  `proofUrl = \`https://api.telegram.org/file/bot\${token}/\${fileData.result.file_path}\``,
  `
         // Upload to Supabase Storage
         const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
         const imgRes = await fetch(\`https://api.telegram.org/file/bot\${token}/\${fileData.result.file_path}\`);
         const imgBlob = await imgRes.blob();
         const fileName = \`\${Date.now()}-\${photo.file_id}.jpg\`;
         await supabase.storage.from('delivery-proofs').upload(fileName, imgBlob, { contentType: 'image/jpeg' });
         const { data: publicUrlData } = supabase.storage.from('delivery-proofs').getPublicUrl(fileName);
         proofUrl = publicUrlData.publicUrl;
  `
);

// Add location capture
content = content.replace(
  `let proofUrl = null`,
  `let proofUrl = null
    let locationData = null
    if (message.location) {
      locationData = message.location
    }`
);

// Modify transaction insert to include location
content = content.replace(
  `// if (proofUrl) insertData.proof_url = proofUrl`,
  `if (proofUrl) insertData.proof_url = proofUrl;
    if (locationData) insertData.location = locationData;`
);

// Smart equipment reminder
content = content.replace(
  `const bottleMatch = matched.find(m => m.product.name.toLowerCase().includes('bottle'))`,
  `const bottleMatch = matched.find(m => m.product.name.toLowerCase().includes('bottle'))
    if (bottleMatch) {
       // Increment jars
       await supabase.from('profiles').update({ empty_jars_held: (profile.empty_jars_held || 0) + bottleMatch.quantity }).eq('id', profile.id)
    }`
);

content = content.replace(
  `// Low balance warning`,
  `// Smart Jars Reminder
    if (profile.empty_jars_held > 5) {
      unmatchedNote += \`\\n\\n⚠️ *JARS WARNING*\\nCustomer is holding \${profile.empty_jars_held} empty jars! Please collect them.\`
    }
    
    // Low balance warning`
);

// Finally, update the single profile fetch to include the new columns
content = content.replace(
  `.select('id, name, email, wallet_balance')`,
  `.select('id, name, email, wallet_balance, empty_jars_held, dispenser_subscription_active, notes')`
);

fs.writeFileSync('app/api/telegram/webhook/route.ts', content, 'utf8');
console.log('Updated route.ts successfully!');
