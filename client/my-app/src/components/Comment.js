import React from 'react'
import avatar from '../assets/avarta.jpg'
import moment from 'moment'
import { renderStart } from '../ultils/helper'

const Comment = ({image = avatar,name = 'Anonymus',updateAt,star, comment}) => {
  return (
    <div className='flex gap-4'>
        <div className='flex-none'>
            <img src={image} alt='' className='w-[25px] h-[25px] object-cover rounded-full'></img>
        </div>
        <div className='flex flex-col flex-auto text-xs'>
        <div className='flex justify-between items-center'>
            <h3 className='font-semibold '>{name}</h3>
            <span className='text-xs italic'>{moment(updateAt)?.fromNow()}</span>
        </div>
        <div className='flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-300 py-2 bg-gray-100'>
            <span className='flex items-center gap-1'>
            <span className='font-semibold'>Vote:</span>
            <span className='flex items-center gap-1'>{renderStart(star)?.map((el,index) => (
                    <span key={index}>{el}</span>
                  ))}</span>
            </span>
            <span className='flex  gap-1'>
            <span className='font-semibold'>Comment:</span>
            <span className='flex items-center gap-1'></span>{comment}</span>
        </div>
        </div>
    </div>
  )
}

export default Comment