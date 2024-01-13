import React, {memo, useEffect} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import path from '../ultils/path'
import { getCurrent } from '../app/user/asyncAction'
import {useDispatch,useSelector} from 'react-redux'
import icons from '../ultils/icons'
import { logout , clearMessage} from '../app/user/userSlice'
import Swal from 'sweetalert2'
const {IoIosLogOut} = icons
const TopHeader = () => {
  const dispatch = useDispatch()
  const {isLoggedIn, current, mes} = useSelector(state => state.user)
  const navigate = useNavigate()
  useEffect(() =>{
    const setTimeOutid  = setTimeout(() =>
    {
      if(isLoggedIn) dispatch(getCurrent())
    },300)
  return() =>{
    clearTimeout(setTimeOutid)
  }
  },[dispatch,isLoggedIn])
  useEffect(() =>{
    if(mes) Swal.fire('Oops!',mes,'info').then(() =>{
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
    })
  },[mes])
  return (
    <div className='h-[38px] w-full bg-main flex items-center justify-center'>
        <div className='w-main flex items-center justify-between text-xs text-white'>
            <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            {isLoggedIn && current  ? <div className='flex gap-4 text-sm items-center'> 
              <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
              <span onClick={() => dispatch(logout())} className='  cursor-pointer hover:text-gray-500 p-2'><IoIosLogOut size={18}/></span>
            </div>
            :<Link className='hover:text-gray-500' to={`/${path.LOGIN}`}>Sign In or Create Account</Link> }
        </div>
    </div>
  )
}

export default memo(TopHeader)