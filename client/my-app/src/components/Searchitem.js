import React,{memo ,useEffect,useState} from 'react'
import icons from '../ultils/icons'
import { colors } from '../ultils/containt'
import {createSearchParams, useNavigate, useParams , useSearchParams} from 'react-router-dom'
import useDeponse from '../hooks/useDeponse'
import { apiGetProducts } from '../apis'
const {FaChevronDown} = icons
const Searchitem = ({name, activeClick , changeActive, type = 'checkbox'}) => {
    const navigate = useNavigate()
    const {category} = useParams()
    const [params] = useSearchParams()
    const [bestprice, setBestprice] = useState(null)
    const [Price, setPrice] = useState(
        {
            from:'',
            to:''
        }
    )
    const [selected, setSelected] = useState([])
    const fetchBestApiProduct = async() =>{
        const  response =await apiGetProducts({sort: '-price', limit: 1})
        if(response.success) setBestprice(response.products[0].price)
    }
    const deboundcePriceFrom = useDeponse(Price.from,500)
    const deboundcePriceTo = useDeponse(Price.to,500)
    const handleSelected = (e) => {
        if (e.target && e.target.value) {
            const alreadyEl = selected.find(el => el === e.target.value);
            if (alreadyEl) {
                setSelected(prev => prev.filter(el => el !== e.target.value));
            } else {
                setSelected(prev => [...prev, e.target.value]);
            }
         changeActive(null)
        }
    };
    useEffect(() =>{
        let param = []
        for(let i of params.entries()) param.push(i)
        const queries = {}
        for(let i of param) queries[i[0]] = i[1]
        if(selected.length > 0){
            queries.color = selected.join(',')
            queries.page = 1
        }else delete queries.color
        navigate({
            pathname:`/${category}`,
            search: createSearchParams(queries).toString()
        }) 
    },[selected])
    useEffect(() =>{
        if(type === 'input') fetchBestApiProduct()
    },[type])
    useEffect(() =>{
        if(Price.form && Price.to && Price.from > Price.to) alert('From price cannot greater than To priece')
    },[Price])
   useEffect(() =>{
    let param = []
    for(let i of params.entries()) param.push(i)
    const queries = {}
    for(let i of param) queries[i[0]] = i[1]
    if(Number(Price.from)>0) queries.from = Price.from
    else delete queries.from
    if(Number(Price.to)>0)queries.to = Price.to
    else delete queries.to
    queries.page = 1
    navigate({
        pathname:`/${category}`,
        search: createSearchParams(queries).toString()
    })
   },[deboundcePriceFrom,deboundcePriceTo])
  return (
    <div
    className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex items-center justify-between'
    onClick={() => changeActive(name)}
    >
        <span className='capitalize'>{name}</span>
        <FaChevronDown/>
       {activeClick === name &&  <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px] '>
            {type === 'checkbox' && <div className=''>
                <div className='p-4 items-center flex justify-between gap-8 border-b'>
                <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                <span onClick={e => {
                    e.stopPropagation()
                    setSelected([])
                }} className='underline cursor-pointer hover:text-main'>Reset</span>
                </div>
                <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                    {colors.map((el , index) =>(
                        <div key={index} className='flex items-center gap-4'>
                            <input type='checkbox' className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500'
                            value={el}
                            onClick={handleSelected}
                            id={el}
                            checked={selected.some(setSelectedItem => setSelectedItem === el)}
                            ></input>
                            <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                        </div>
                    ))}
                </div>
                </div>}
                {type === 'input' && <div onClick={e => e.stopPropagation()}>
                <div  className='p-4 items-center flex justify-between gap-8 border-b'>
                <span className='whitespace-nowrap'>{`The highest price is ${Number(bestprice).toLocaleString()} VND`}</span>
                <span onClick={e => {
                    e.stopPropagation()
                    setPrice({from:'',to:''})
                    changeActive(null)
                }} className='underline cursor-pointer hover:text-main'>Reset</span>
                </div>
                <div className='flex items-center p-2 gap-2'> 
                <div className=' flex items-center gap-2'>
                    <label htmlFor='from'>From</label>
                    <input
                    value={Price.from}
                    onChange={e => setPrice(prev => ({...prev, from: e.target.value}))}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' type='number' id='from'></input>
                </div>
                <div className=' flex items-center gap-2'>
                    <label htmlFor='to'>To</label>
                    <input
                    value={Price.to}
                    onChange={e => setPrice(prev => ({...prev, to: e.target.value}))}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' type='number' id='to'></input>
                </div>
                </div>

                    </div>}
        </div>}
    </div>
  )
}

export default memo(Searchitem)