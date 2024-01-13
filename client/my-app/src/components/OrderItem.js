import React,{useEffect, useState} from 'react'
import SelectQuantity from './SelectQuantity'
import { formatMoney } from '../ultils/helper'
import { updateCart } from '../app/user/userSlice'
import withBaseComponent from '../hocs/withBaseComponent'

const OrderItem = ({el, color,dfQuantity=1,price,title,thumbnail,pid, dispatch}) => {

  const [quantity, setQuantity] = useState(() => dfQuantity)  

    const handleQuantity =(number) => {
        if(+number > 1) setQuantity(number)
       };
       
    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') setQuantity((prev) => +prev - 1);
        if (flag === 'plus') setQuantity((prev) => +prev + 1);
      };
  useEffect(() =>{
    dispatch(updateCart({pid,quantity,color}))
  },[quantity])
    
  return (
    <div><div  className='w-main mx-auto border-b font-bold  grid grid-cols-10'>
    <span className='col-span-6  mt-4 text-center'> <div className='flex gap-2'>
               <img src={thumbnail } alt='thumb' className='w-28 h-28 object-cover'></img>
               <div className='flex flex-col items-start gap-1'>
                <span className='text-sm mt-4'>{title}</span>
                <span className='text-[10px] font-main'>{color}</span>
               </div>
               </div></span>
    <span className='col-span-1 text-center'>
        <div className='flex items-center h-full'>
        <SelectQuantity
        quantity={quantity}
        handleChangeQuantity={handleChangeQuantity}
        handleQuantity={handleQuantity}
      />
        </div>
    </span>
    <span className='col-span-3 h-full flex items-center justify-center text-center'>
        <div className='text-lg'>
        <span className='text-sm'>{formatMoney(price * quantity) + 'VND'}</span>
        </div>
    </span>

</div></div>
  )
}

export default withBaseComponent(OrderItem)