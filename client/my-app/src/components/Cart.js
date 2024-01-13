import React,{memo} from 'react'
import { IoClose } from "react-icons/io5";
import withBaseComponent from '../hocs/withBaseComponent';
import { showCart } from '../app/appSlice';
import { useSelector } from 'react-redux';
import { formatMoney } from '../ultils/helper'
import Button from './Button';
import { ImBin } from 'react-icons/im'
import { apiRemoveCart } from '../apis';
import { getCurrent } from '../app/user/asyncAction';
import { toast } from 'react-toastify';
import path from '../ultils/path';
const Cart = ({dispatch, navigate}) => {
  const {currentCart} = useSelector(state => state.user)
   const removeCart = async(pid,color) =>{
      const response  = await apiRemoveCart(pid, color)
      if(response.success) 
      {
      dispatch(getCurrent())
      }
      else toast.error(response.mes)
   }   
  return (
    <div onClick={e => e.stopPropagation()} className='w-[350px] h-screen animate-slide-left grid grid-rows-10 bg-black text-white p-6'>
        <header className=' row-span-1 h-full border-gray-500 border-b  flex items-center justify-between font-bold text-2xl' >
            <span>Your Cart</span>  
            <span onClick={() =>  dispatch(showCart())} className='p-2 cursor-pointer'><IoClose size={24}/>  </span>
         </header>
         <section className='row-span-6 gap-3 flex flex-col h-full max-h-full overflow-y-auto py-3'>
            {!currentCart && <span>Your cart is emty</span>}
            {currentCart && currentCart?.map(el =>  (
                <div key={el._id} className='flex justify-between items-center'>
                       <div className='flex gap-2'>
                       <img src={el.thumbnail} alt='thumb' className='w-16 h-16 object-cover'></img>
                       <div className='flex flex-col gap-1'>
                        <span className='text-sm'>{el.title}</span>
                        <span className='text-[10px]'>{el.color}</span>
                        <span className='text-[10px]'>{`Quantity  ${el.quantity}`}</span>
                        <span className='text-sm'>{formatMoney(el.price * el.quantity) + 'VND'}</span>
                       </div>
                       </div>
                       <span onClick={() => removeCart(el.product?._id, el.color)} className='h-8 w-8 flex items-center justify-center rouneded-full hover:bg-gray-700'><ImBin size={16}/></span>
                </div>
            ))}
         </section>
         <div className='row-span-2 mt-4 flex flex-col justify-between h-full '>
            <div className='flex mt-4 items-center justify-between pt-4 border-t'>
               <span>Subtotal</span>
               <span>{formatMoney(currentCart?.reduce((sum,el) => sum + Number(el.price)*el.quantity,0 )) + 'VND'}</span>
            </div>
            <span className='text-center mt-4 text-gray-700'>Shipping, taxes, and discounts calculated at checkout.</span>
            <Button handleOnclick={() =>{ 
               dispatch(showCart())
               navigate(`/${path.MEMBER   }/${path.DETAIL_CART}`)}} style='w-full mt-4 rounded-none bg-main py-3'>Shopping Cart</Button>
         </div>
    </div>
  )

}
export default withBaseComponent(memo(Cart))