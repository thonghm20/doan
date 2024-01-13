import React ,{useEffect, useState}from 'react'
import { useSelector } from 'react-redux'
import { BreadCrum, Button, OrderItem, SelectQuantity } from '../../components'
import withBaseComponent from '../../hocs/withBaseComponent'
import { formatMoney } from '../../ultils/helper'
import path from '../../ultils/path'
import { Link, createSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const DetaildCart = ({location ,navigate}) => {
  const {currentCart, current} = useSelector(state => state.user)
  const handleSubmit = () =>{
    if(!current?.address) return Swal.fire({
      icon:'info',
      title:'Alomost!',
      text:'Please update your address before',
      showCancelButton:true,
      showConfirmButton:true,
      confirmButtonText:'GO UPDATE',
      cancelButtonText:'Cancel'
    }).then((result) =>{
      if(result.isConfirmed) navigate({
        pathname:`/${path.MEMBER}/${path.PERSONAL}`,
        search: createSearchParams({redirect: location.pathname}).toString()
      })
    })
    else{
      window.open(`/${path.CHECK_OUT}`, '_blank')
    }
  }
  return (
    <div className='w-full '>
        <div className='h-[81px] flex justify-center items-center bg-gray-100'>
            <div className='w-main'>
        <h3 className='font-semibold text-2xl uppercase'>My Cart</h3>
          {/* <BreadCrum  category={location?.pathname?.replace('/','')?.split('-').join(' ')}/> */}
          </div>
        </div>
       <div className='flex flex-col border mt-8 w-main my-8 mx-auto'>
       <div className='w-main mx-auto bg-gray-200 font-bold py-3  grid grid-cols-10'>
            <span className='col-span-6 text-center'>Product</span>
            <span className='col-span-1 text-center'>Quantity</span>
            <span className='col-span-3 text-center'>Price</span>

        </div>
        {currentCart?.map(el => (
            <OrderItem key={el._id} color={el.color}  price={el.price} pid={el.product?._id} thumbnail={el.thumbnail} title={el.title} dfQuantity={el.quantity}/>
        ))}
       </div>
       <div className='w-main mx-auto flex  flex-col justify-center items-end mb-12 gap-3'>
        <div className='flex items-center gap-8 text-sm'>
        <span>Subtotal:</span>
        <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum,el) => +el.price*el.quantity + sum,0))} VND`}</span>
        </div>
        <span className='text-xs'>Shipping, taxes, and discounts calculated at checkout.</span>
        <Button handleOnclick={handleSubmit}>Checkout</Button>
        {/* <Link target='_blank' className='bg-main text-white uppercase px-4 py-2 rounded-md' to={`/${path.CHECK_OUT}`}>Check out</Link> */}
       </div> 
        </div>
  )
}

export default withBaseComponent(DetaildCart)