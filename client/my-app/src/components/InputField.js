import React,{memo} from 'react'
import clsx from 'clsx'
const InputField = ({value,setvalue,namekey,type,invalidFields,setInvalidFields,style, fullwith, placeholder, isHideLabel}) => {
  return (
    <div className={clsx(' flex flex-col relative mb-2',fullwith && 'w-full')}>
        {!isHideLabel && value?.trim() !== '' && <label className='text-[10px] absolute animate-slide-top-sm top-0 left-[12px] block bg-white px-1' htmlFor={namekey}>{namekey?.slice(0,1).toUpperCase() + namekey?.slice(1)}</label>}
        <input type={type || 'text'} className={clsx('px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none',style)} 
        placeholder={placeholder ||namekey?.slice(0,1).toUpperCase() + namekey?.slice(1)}
        value={value}
        onChange={e => setvalue(prev => ({...prev, [namekey]: e.target.value}))}
        onFocus={() =>setInvalidFields && setInvalidFields([])}
        
        ></input>
        {invalidFields?.some(el => el.name === namekey) && <small className='text-main text-[10px] italic'>{invalidFields.find(el => el.name === namekey)?.mes}</small>}
    </div>
  )
}

export default memo(InputField)