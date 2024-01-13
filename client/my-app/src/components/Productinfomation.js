import React, {memo, useState, useCallback } from 'react'
import {productInfoTabs} from '../ultils/containt'
import Votebar from './Votebar'
import { renderStart } from '../ultils/helper'
import { apiRating } from '../apis'
import Button from './Button'
import Comment from './Comment'
import Voteoption from './Voteoption'
import {useDispatch , useSelector} from 'react-redux'
import { showModal } from '../app/appSlice'
import path from '../ultils/path'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'


  const Productinfomation = ({totalRating , ratings, nameProduct, pid ,rerender}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isLoggedIn} = useSelector(state => state.user)
  const handlevoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: 'Oops',
        cancelButtonText: 'cancel',
        confirmButtonText: 'Go login',
        title: 'Oops',
        showCancelButton: true
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(showModal({ isShowModal: true, modalChildren: <Voteoption nameProduct={nameProduct} handlSubmitVoteOption={handlSubmitVoteOption} /> }));
    }
  };
  
  const handlSubmitVoteOption = async ({comment,score}) =>{
    console.log({comment,score,pid})
    if(!comment || !pid || !score) {
      alert('Please vote when click submit ')
      return
    }
    await apiRating({star: score, comment,pid ,updateAt: Date.now()})
    rerender()
    dispatch(showModal({isShowModal:false,modalChildren:null}))
  }
  const [activedTab, setactivedTab] = useState(1)
 
  return (
    <div >
     
          <div className='flex items-center gap-2 relative bottom-[-1px]'>
            {productInfoTabs.map(el =>(
              <span 
              onClick={() => setactivedTab(el.id)}
              className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0':'bg-gray-200'}`} key={el.id}>{el.name}</span>
            ))}
             </div>
        <div className='w-full border p-4'>
              {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab).content}
        </div>
       <div className='flex py-8 flex-col w-main'>
               <div className='flex border'>
               <div className='flex-4 flex flex-col items-center justify-center '>
                  <span className='font-semibold text-3x'>{`${totalRating}/5`}</span>
                  <span className='flex items-center gap-1'>{renderStart(totalRating)?.map((el,index) => (
                    <span key={index}>{el}</span>
                  ))}</span>
                  <span className='text-sm'>{`${ratings?.length} reviewers`}</span>
                  </div>
                  <div className='flex-6  flex gap-2 flex-col p-4'>
                    {Array.from(Array(5).keys()).reverse().map(el =>(
                      <Votebar
                        key={el}
                        number={el+1}
                        ratingTotal={ratings?.length}
                        ratingCount={ratings?.filter(i=>i.star === el +1)?.length}
                      />
                    ))}
                  </div>
               </div>
                  <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
                  <span>Do you  review this product?</span>
                  <Button 
                      handleOnclick={handlevoteNow}   >
                         Vote now!
                   </Button>

                  </div>
                  <div className='flex flex-col gap-4'>
                      {ratings?.map(el =>(
                          <Comment
                          key={el.id}
                          star={el.star}
                          updateAt={el.updateAt}
                          comment={el.comment}
                          name={`${el.posttedBy?.lastname} ${el.posttedBy?.firstname}`}
                          />
                      ))}
                  </div>
                </div>
        </div>

  )
}

export default memo(Productinfomation)