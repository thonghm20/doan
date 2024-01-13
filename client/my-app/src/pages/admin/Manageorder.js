import React, { useEffect,useState } from 'react'
import { apiGetOrders, apiGetUserOrders } from '../../apis';
import { CustomSelect, InputForm, Pagination } from '../../components';
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { statusOrders } from '../../ultils/containt';
import withBaseComponent from '../../hocs/withBaseComponent';
import { useSelector } from 'react-redux';

const Manageorder = ({navigate, location}) => {
  const [Order, setOrders] = useState(null) 
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams()
  
  const {register,formState:{errors},watch,setValue} = useForm()
  const q = watch('q')
  const status = watch("status")
  const fetchOrder = async (params) => {
    const response = await apiGetOrders({...params,limit: process.env.REACT_APP_LIMIT});
    if(response.success){
      setOrders(response.Order)
      setCounts(response.counts);
    } 
  };
  useEffect(() =>{
    const pr = Object.fromEntries([...params])
    fetchOrder(pr)  
  },[params])
  return (
    <div className='w-full relative px-4'>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
      Manage order
  </header>
  <div className='flex justify-end  items-center px-4'>
      </div>
      <table className='table-auto w-full text-center'>
        <thead>
          <tr className='border bg-sky-900 text-white border-white py-2'>
            <th>#</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created At</th>
            <th>By</th>

          </tr>
        </thead>
        <tbody className='text-center py-2'>
          {Order?.map((el, index) => (
            <tr className='border-b-[2px] border-black-500' key={el._id}>
              <td>{((+params.get('page') > 1 ? +params.get('page') -1 : 0) * process.env.REACT_APP_LIMIT)+index+1}</td>
              {el.products?.map((item) => (
                <span className='flex col-span-1 items-center gap-2 ' key={item._id}>
                  <img src={item.thumbnail} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                  <span className='flex flex-col mt-4'>
                  <span className='text-main mt-4'>{item.title}</span>
                  <span className='flex items-center text-xs gap-2'>
                  <span>Quantity:</span>
                  <span className='text-main'>{item.quantity}</span>
                  </span>
                  </span>
                </span>
              ))}

              <td>{el.total+ ' USD'}</td>
              <td>{el.status}</td>
              <td>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
              <td>{el.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={counts}/>
      </div>
  </div>
  )
}

export default withBaseComponent(Manageorder)