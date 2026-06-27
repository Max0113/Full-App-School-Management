"use client"

import { Clientaxios } from "@/lib/axios";

export const Connect = {
    getToken: async () => {
        return await Clientaxios.get('/sanctum/csrf-cookie');
    },
    postLogin: async (value) => {
        return await Clientaxios.post('/login', value);
    },
    postLogout: async () => {
        return await Clientaxios.post('/logout');
    },
    postRegister : async (value) => {
        return await Clientaxios.post('/register' , value)
    },
    getUser: async () => {
        return await Clientaxios.get('api/user');
    }
}
