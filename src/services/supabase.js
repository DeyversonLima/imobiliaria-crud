import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgsisqhexijtlcbsksib.supabase.co'
const supabaseKey = 'sb_publishable_qjUfQf5y83AEOAGYDAsC7g_HfKLW1w_'

export const supabase = createClient(supabaseUrl, supabaseKey)