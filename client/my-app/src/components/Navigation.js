import React from "react";
import {navigation} from '../ultils/containt'
import {NavLink} from 'react-router-dom'

const notAcitvedStyle =''
const activedStyle =''

const Navigation =() =>{
    return(
        <div className="w-main h-[48px] py-2 border-y text-sm flex items-center">
            {navigation.map(el =>(
                <NavLink to={el.path}
                    key={el.id}
                    className={({isAvtive}) => isAvtive ? 'pr-12 hover:text-main text-main' : 'pr-12 hover:text-main'}
                >
                    
                    {el.value}
                </NavLink>
            ))}
        </div>
    )
}
export default Navigation