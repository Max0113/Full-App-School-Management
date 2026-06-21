'use client'

import React, { useEffect, useState } from "react";
import { useAuth } from '@/components/Context/AuthContext';
import { useRouter } from "next/navigation";

function Page() {
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const route = useRouter();

    useEffect(() => {
        checkAuth()
            .catch((err) => {
                console.log(err.response?.data);
                route.push('/login');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [checkAuth, route]);

    if (isLoading) {
        return (
            <div className="p-10 h-[80vh] flex justify-center items-center ">
                <div className="w-10 h-10 border-4 border-gray-200 border-b-black rounded-full animate-spin"></div>
            </div>
        ); 
    }else {
        return (
            <div className="p-10">
                <h1>Welcome to the dashboard</h1>
                {isLoading && <p>Loading...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{user?.id}</td>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ); 
    }
}

export default Page;
