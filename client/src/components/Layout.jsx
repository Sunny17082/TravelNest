import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='px-8 py-6 lg:px-64 flex flex-col min-h-screen'>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout