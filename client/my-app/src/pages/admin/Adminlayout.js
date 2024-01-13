import React from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import path from '../../ultils/path'
import {useSelector} from 'react-redux'
import SidebarAdmin from '../../components/SidebarAdmin'



const Adminlayout = () => {
  const {isLoggedIn, current} = useSelector(state => state.user)
  if(!isLoggedIn ||  !current || +current.role !== 1945) return  <Navigate to={`/${path.LOGIN}`} replace={true}/>
  return (
    <div className='flex w-full bg-gray-100 min-h-screen text-gray-900 relative'>
      <div className='w-[327px] top-0 bottom-0  flex-none fixed'>
        <SidebarAdmin/>
      </div>
      <div className='w-[327px]'>

      </div>
      <div className='flex-auto'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Adminlayout