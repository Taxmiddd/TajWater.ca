import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  console.log("Checking tahmidashfaque0@gmail.com")
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('email', 'tahmidashfaque0@gmail.com')
  console.log('Profile by email:', profile, error)
  
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email === 'tahmidashfaque0@gmail.com')
  console.log('Auth user:', user ? user.id : 'Not found')
  
  if (user) {
    const { data: p2 } = await supabase.from('profiles').select('*').eq('id', user.id)
    console.log('Profile by auth id:', p2)
  }

  console.log("\nChecking ashfaquet874@gmail.com")
  const { data: profile2, error2 } = await supabase.from('profiles').select('*').eq('email', 'ashfaquet874@gmail.com')
  console.log('Profile by email:', profile2, error2)
  
  const user2 = users?.users?.find(u => u.email === 'ashfaquet874@gmail.com')
  console.log('Auth user:', user2 ? user2.id : 'Not found')
  
  if (user2) {
    const { data: p3 } = await supabase.from('profiles').select('*').eq('id', user2.id)
    console.log('Profile by auth id:', p3)
  }
}
test()
