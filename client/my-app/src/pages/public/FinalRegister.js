import React, { useEffect } from 'react'
import {useParams, Navigate, useNavigate} from 'react-router-dom'
import path from '../../ultils/path'
import Swal from 'sweetalert2'

const FinalRegister = () => {
  const {status } = useParams()
  const nagitive = useNavigate()
  useEffect(() =>{
    if(status === 'failed') Swal.fire('Oops!','Đăng ký không thành công','error').then(() =>{
        nagitive(`/${path.LOGIN}`)
    })
    if(status === 'success') Swal.fire('Congratulation!','Đăng ký thành công','success').then(() =>{
      nagitive(`/${path.LOGIN}`)
  })
  },[])
  return (
   <div className='h-screen w-screen bg-gray-100'>

   </div>
  )
}

export default FinalRegister