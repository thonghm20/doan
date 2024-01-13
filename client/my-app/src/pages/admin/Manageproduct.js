import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Pagination, Varriant } from '../../components';
import { useForm } from 'react-hook-form';
import { apiGetProducts, apiDelete } from '../../apis';
import moment from 'moment';
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import  useDeponse  from '../../hooks/useDeponse'
import Updateproduct from '../admin/Updateproduct'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FaRegEdit, FaBackspace  } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";


const Manageproduct = () => {
  const [cusomizeVarriant, setCusomizeVarriant] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm();
  const [Products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [Edit, setEdit] = useState(null)
  const [Update, setUpdate] = useState(false)

  const render = useCallback(() =>{
    setUpdate(!Update)
  })
  
  const fetchProducts = async (params) => {
    const response = await apiGetProducts({...params,limit: process.env.REACT_APP_LIMIT});
    if (response.success) {
      setProducts(response.products);
      setCounts(response.counts);
    }
  };
  const queryDecounce = useDeponse(watch('q'), 800)

  useEffect(() =>{
    if(queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q: queryDecounce}).toString()
      })
      }else navigate({
        pathname: location.pathname
      })
  },[queryDecounce])

  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    fetchProducts(searchParams);
  }, [params, Update]);
  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to remove this product?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDelete(pid);
        if (response.success) {
          toast.success(response.mes);
        } else {
          toast.error(response.mes);
        }
        render()
      }
    });
  };
  
  return (
    <div className='w-full flex flex-col relative gap-4'>
      {Edit && <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
        <Updateproduct setEdit={setEdit} Edit={Edit} render={render}/>
      </div>}

      {cusomizeVarriant && <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
        <Varriant cusomizeVarriant={cusomizeVarriant} setCusomizeVarriant={setCusomizeVarriant} render={render}/>
      </div>}

      <div className='h-[69px] w-full'> </div>
      <div className='px-4 border-b w-full bg-gray-100 flex justify-between items-center  top-0'>
        <h1 className='text-3xl font-bold track-tight border-b'>Manage product</h1>
      </div>
      <div className='flex justify-end  items-center px-4'>
        <form className='w-[45%]'>
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullWidth
            placeholder='Search products '
          />
        </form>
      </div>
      <table className='table-auto text-center'>
        <thead>
          <tr className='border bg-sky-900 text-white border-white py-2'>
            <th>Order</th>
            <th>Thumb</th>
            <th>Title</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sold</th>
            <th>Color</th>
            <th>Ratings</th>
            <th>Varriants</th>
            <th>UpdateAt</th>
            <th>Action</th>

          </tr>
        </thead>
        <tbody className='text-center py-2'>
          {Products?.map((el, index) => (
            <tr className='boder-b' key={el._id}>
              <td>{((+params.get('page') > 1 ? +params.get('page') -1 : 0) * process.env.REACT_APP_LIMIT)+index+1}</td>
              <td>
                <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover' />
              </td>
              <td>{el.title}</td>
              <td>{el.brand}</td>
              <td>{el.category}</td>
              <td>{el.price}</td>
              <td>{el.quantity}</td>
              <td>{el.sold}</td>
              <td>{el.color}</td>
              <td>{el.totalRating}</td>
              <td>{el.varriants.length || 0}</td>
              <td>{moment(el.date).format('DD/MM/YYYY')}</td>
              <td className='flex flex-col items-center justify-center '>
                <span onClick={() => setEdit(el)} className='text-yellow-500 px-1 mt-3 hover:text-yellow-700 cursor-pointer'><FaRegEdit size={20}/></span>
                <span onClick={() => handleDeleteProduct(el._id)} className='text-red-500 mt-3 hover:text-red-700 px-1 hover:underline cursor-pointer'><FaBackspace size={20}/></span>
                <span onClick={() => setCusomizeVarriant(el)} className='text-green-500 mt-3 hover:text-green-700 px-1 hover:underline cursor-pointer'><MdDashboardCustomize size={20}/></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={counts}/>
      </div>
    </div>
  );
};

export default Manageproduct;
