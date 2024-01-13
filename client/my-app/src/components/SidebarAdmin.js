import React,{memo, Fragment, useState} from 'react'
import logo from '../assets/logo.png'
import { adminSidebar } from '../ultils/containt'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {AiOutlineDown, AiOutlineRight} from 'react-icons/ai' 

const activedStyle = 'px-4 py-2 flex items-center gap-2  bg-blue-500 '
const notactivedStyle = 'px-4 py-2 flex items-center gap-2  hover:bg-blue-100 '
const SidebarAdmin = () => {
  const [actived, setActived] = useState([])
  const handleshowtab = (tabID)=>{
      if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el!==tabID))
      else setActived(prev => [...prev,tabID])
  } 
  return (
    <div className='p-4 bg-white h-full py-4'>
      <Link to={'/'} className='flex flex-col items-center p-4 justify-center gap-2'>
        <img src={logo} alt='logo' className='w-[200px] object-contain'></img>
        <small>Admin Workspace</small>
      </Link>
      <div>
        {adminSidebar.map(el =>(
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
      </div>
    </div>
  )
}

export default memo(SidebarAdmin)