"use client"
import { useAuth } from '@/components/Context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function page() {
    const [isLoading , setIsLoading] = useState(false);
    const { user , checkAuth , isAuthenticated , SetIsAuthenticated } = useAuth();
    const route = useRouter();

    useEffect(() => {
        setIsLoading(true);

        checkAuth()
            .then(() => {})
            .catch((err) => {
            console.error(err);
            route.push("/login")

            })
            .finally(() => {
            setIsLoading(false);
            });

    },[isAuthenticated])

    if(isLoading) {
        return (
            <main className='flex justify-center items-center h-full min-h-[90vh]'>
               <div className='w-10 h-10 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin'></div>
            </main>
        )

    }else{
        return (
            <main className='px-10'>
            <h1 className='text-3xl font-bold py-10'>Welcome to dashboard</h1>
            
        <div className="w-full max-w-4xl overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
                <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                </tr>
            </thead>

            <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4">{user?.id}</td>
                <td className="px-6 py-4">{user?.name}</td>
                <td className="px-6 py-4">{user?.email}</td>
                </tr>
            </tbody>
            </table>
        </div>
        </main>
        )
    }
  
}

export default page