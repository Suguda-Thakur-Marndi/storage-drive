import { getSupabaseClient } from '../config/db.js';

const getUsersTable = () => getSupabaseClient().from('users');

const userModel = {
    async create(userData) {
        const { data, error } = await getUsersTable()
            .insert([userData])
            .select('id, username, email, password')
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    async findOne(query) {
        let request = getUsersTable().select('id, username, email, password');

        if (query.email) {
            request = request.eq('email', query.email);
        }

        if (query.username) {
            request = request.eq('username', query.username);
        }

        const { data, error } = await request.maybeSingle();

        if (error) {
            throw error;
        }

        return data;
    }
};

export default userModel;