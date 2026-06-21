'use client'

import React, { useEffect, useState } from 'react'
import ButtonPr from '../ui/ButtonPr'
import ButtonSe from '../ui/ButtonSe'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../Context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout, checkAuth } = useAuth()
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkAuth()
      .catch(() => {})
      .finally(() => {
        setIsChecking(false)
      })
  }, [checkAuth])

  const LogoutFun = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <main className='flex justify-around items-center py-5 bg-white'>
      <h1 className='text-3xl font-extrabold'>School.</h1>

      <nav className="flex gap-5">
        <Link href="/">Home</Link>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>
      </nav>

      {isChecking ? ( <div className='h-13 w-34 rounded-md bg-gray-200 animate-pulse'></div> ) : isAuthenticated ? (
        <div className='flex gap-3'>
          <div onClick={LogoutFun} className="cursor-pointer">
            <ButtonPr text="Logout" />
          </div>
        </div>
      ) : (
        <div className='flex gap-3'>
          <div onClick={() => router.push('/login')} className="cursor-pointer">
            <ButtonPr text="Login" />
          </div>

          <div onClick={() => router.push('/register')} className="cursor-pointer">
            <ButtonSe text="Sign up" />
          </div>
        </div>
      )}
    </main>
  )
}

export default Navbar
