import { createClient } from '@supabase/supabase-js';

let supabaseClient;

export const getSupabaseClient = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    }

    return supabaseClient;
};

const connectToDB = async () => {
    try {
        getSupabaseClient();
        console.log('Supabase client ready');
    }
    catch (error) {
        console.log('db error', error.message);
    }
};

export default connectToDB;