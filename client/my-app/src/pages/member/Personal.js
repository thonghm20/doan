import React, { useEffect } from 'react'
import {useForm} from 'react-hook-form'
import { Button, InputForm } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import  avatar  from '../../assets/avarta.jpg'
import { apiUpdateCurren } from '../../apis'
import { getCurrent } from '../../app/user/asyncAction'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
import withBaseComponent from '../../hocs/withBaseComponent'

const Personal = ({navigate}) => {
  const {register,formState:{errors, isDirty},handleSubmit,reset} = useForm()
  const {current} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams( )
  useEffect(() =>{
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
      address: current?.address,


    })
  },[])
  const handleUpdateuser =async(data) =>{
    const formData = new FormData()
    if(data.avatar.length > 0) formData.append('avatar',data.avatar[0])
    delete data.avatar
    for(let i of Object.entries(data)) formData.append(i[0],i[1])
    const response = await apiUpdateCurren(formData)
    if(response.success){
     dispatch(getCurrent())
     toast.success(response.mes)
     if(searchParams.get('redirect')) navigate(searchParams.get('redirect'))
    }else toast.error(response.mes)
    
  }
  return (
    <div className='w-full relative px-4'>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
        Personal
      </header>
      <form onSubmit={handleSubmit(handleUpdateuser)} className='w-4/5 mx-auto py-8 flex flex-col gap-4'>
      <InputForm
          label='Firstname'
          register={register}
          errors={errors}
          id='firstname'
          validate={{ 
            required:'Need fill this field'
          }}
          style='flex-auto'

          />
          <InputForm
          label='Lastname'
          register={register}
          errors={errors}
          id='lastname'
          validate={{
            required:'Need fill this field'
          }}
          style='flex-auto'
          />
           <InputForm
          label='Email address'
          register={register}
          errors={errors}
          id='email'
          validate={{
            required:'Need fill this field',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          style='flex-auto'
          />
           <InputForm
          label='Phone'
          register={register}
          errors={errors}
          id='mobile'
          validate={{
            required:'Need fill this field',
            pattern: {
              value: /^[62|0]+\d{9}/gi,
              message: 'Invalid phone number ',
            },
          }}
          style='flex-auto'
          />
          <InputForm
          label='Address'
          register={register}
          errors={errors}
          id='address'
          validate={{
            required:'Need fill this field',
          }}
          style='flex-auto'
          />
          <div className='flex items-center gap-2 '>
            <span className='font-medium'>Account Status:</span>
            <span>{current?.isBLocked?'Blocked' : 'Actived'}</span>
          </div>
          <div className='flex items-center gap-2 '>
            <span className='font-medium'>Role:</span>
            <span>{+current?.role === 1945 ?'Admin' : 'User'}</span>
          </div>
          <div className='flex items-center gap-2 '>
            <span className='font-medium'>Created At:</span>
            <span>{moment(current?.createdAt).fromNow()}</span>
          </div>
          <div className='flex flex-col  gap-2'>
            <span className='font-medium'>Profile image</span>
             <label htmlFor='file'>
             <img  src={current?.avatar || avatar} alt='avatar' className='w-20 h-20 ml-8 object-cover rounded-full'></img>
             </label>
             <input type='file' id='file' hidden {...register('avatar')}></input>
          </div>
          {isDirty && <div className='flex  justify-end '><Button type='submit'>Updated infomation</Button></div>}
      </form>
    </div>
  )
}
  
export default withBaseComponent(Personal)