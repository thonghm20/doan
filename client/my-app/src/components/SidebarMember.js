import React,{memo, Fragment, useState} from 'react'
import { memberSidebar } from '../ultils/containt'
import {  NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {AiOutlineDown, AiOutlineRight} from 'react-icons/ai' 
import { useSelector } from 'react-redux'
import avatar from '../assets/avarta.jpg';
import { IoHomeOutline } from "react-icons/io5";



const SidebarMember = () => {
    const activedStyle = 'px-4 py-2 flex items-center gap-2  bg-blue-500 '
const notactivedStyle = 'px-4 py-2 flex items-center gap-2  hover:bg-blue-100 '
const {current} = useSelector(state => state.user)
  const [actived, setActived] = useState([])
  const handleshowtab = (tabID)=>{
      if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el!==tabID))
      else setActived(prev => [...prev,tabID])
  } 

  return (
    <div className=' bg-white  w-[250px] flex-none h-full py-4'>
      <div  className='w-ful flex flex-col justify-center items-center py-4'>
        <img src={current?.avatar || avatar} alt='avatar' className='w-16 h-16 object-cover'></img>
        <small>{`${current?.lastname} ${current?.firstname}`}</small>
      </div>
      <div>
        {memberSidebar.map(el =>(
         <Fragment key={el.id}>
            {el.type === 'SINGLE' &&  <NavLink 
            className={({isActive}) => clsx(isActive && activedStyle, !isActive && notactivedStyle)}
            to={el.path}>
                <span>{el.icons}</span>
                <span>{el.text}</span>
          </NavLink>}
          {el.type === 'PARENT' && <div onClick={() => handleshowtab(+el.id)} className='flex flex-col  text-gray-900'>
              <div className='flex items-center justify-between cursor-pointer px-4 py-2  hover:bg-blue-100'>
                <div className='flex items-center gap-2'>
                    <span>{el.icons}</span>
                    <span>{el.text}</span>
              </div>
              {actived.some(id => id === el.id) ? <AiOutlineRight/> :<AiOutlineDown/>}
              </div>
            {actived.some(id => +id === +el.id) &&   <div  className=' flex flex-col '>
                {el.submenu.map(item =>(
                  <NavLink key={el.text}
                  className={({isActive}) => clsx(isActive && activedStyle, !isActive && notactivedStyle, `pl-6`)}
                  to={item.path}
                  onClick={e => e.stopPropagation()}
                  >
                    {item.text}
                  </NavLink>
                ))}
                
              </div>}
            </div>}
           
         </Fragment>
        ))}
            <NavLink to={'/'}  className={clsx(notactivedStyle)}><IoHomeOutline/> Go Home</NavLink>

      </div>
    </div>
  )
}

export default memo(SidebarMember)