import React,{memo, useRef, useEffect, useState} from 'react'
import logo from '../assets/logo.png'
import { VoteOptions } from '../ultils/containt'
import {AiFillStar} from "react-icons/ai"
import Button from './Button'

const Voteoption = ({nameProduct, handlSubmitVoteOption}) => {
  const modalRef = useRef()
  const [choosenStart, setChoosenStart] = useState(null)
  const [comment, setComment] = useState('')
  const [score, setScore] = useState(null)
  useEffect(() =>{
      modalRef.current.scrollIntoView({block: 'center', behavior:'smooth'})
  },[])

  return (
    <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] z-10  p-4 flex-col gap-4 flex items-center justify-center'>
        <img src={logo} alt='logo' className='w-[300px] my-8 object-contain'></img>
        <h2 className='text-center text-medium text-lg'>{`Voting the product ${nameProduct}`}</h2>
        <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder='Tpye Something' 
        className='form-textarea w-full placeholder:text-xs placeholder:text-gray-500 text-sm '></textarea>
        <div className=' w-full flex flex-col gap-4'>
          <p>How do you like this product?</p>
          <div className='flex justify-center gap-4 items-center'>
            {VoteOptions.map(el => (
              <div onClick={() =>
                 {setChoosenStart(el.id)
                 setScore(el.id)}} className='w-[100px] bg-gray-200  cursor-pointer h-[100px] rounded-md p-4  flex items-center justify-center flex-col gap-2' key={el.id}>
                 {(Number(choosenStart) && choosenStart >= el.id)  ? <AiFillStar color='orange'/> :  <AiFillStar color='gray'/> }
                  <span>{el.text}</span>
              </div>
            ))}
          </div>
        </div>
                <Button handleOnclick={() => handlSubmitVoteOption({comment, score:choosenStart})} fw>Submit</Button>
    </div>
  )
}

export default memo(Voteoption)