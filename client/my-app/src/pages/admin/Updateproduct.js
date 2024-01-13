import React,{memo, useState,useEffect,useCallback  } from 'react'
import { useForm } from 'react-hook-form'
import {InputForm, Select, Button , Markdown, Loading} from '../../components'
import {toast} from 'react-toastify'
import { validate, fileToBase64 } from '../../ultils/helper'
import { apiUpdateProduct } from '../../apis/product'
import { showModal } from '../../app/appSlice'
import {useSelector, useDispatch} from 'react-redux'


const Updateproduct = ({Edit,render, setEdit}) => {    
    const [preview, setPreview] = useState({
        thumb:null,
        images:[]
      })
      const [payload, setPayload] = useState({
        description:''
      })
    useEffect(() =>{
        reset({
            title: Edit?.title || '',
            price: Edit?.price || '',
            quantity: Edit?.quantity || '',
            color: Edit?.color || '',
            category: Edit?.category || '',
            brand: Edit?.brand?.toLowerCase() || '',
        })
            setPayload({description: typeof Edit?.description === 'object' ? Edit?.description?.join(',') : Edit?.description})
            setPreview({
                thumb: Edit?.thumb || '',
                images: Edit?.images || []
            })
        },[Edit])
    
    const {categories} = useSelector(state => state.app)
    const dispatch = useDispatch()
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) =>{
        setPayload(e)
    },[payload])
    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
          if (invalids === 0) {
          if (data.category) data.category = categories?.find(el => el.title === data.category)?.title;
          const finalPayload = { ...data, ...payload };
          finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
          const formData = new FormData();
          for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
          finalPayload.images = data.images?.length === 0 ? preview.images : data.images  
          for (let image of finalPayload.images) formData.append('images',image);
          dispatch(showModal({ isShoModal: true, modalChildren: <Loading /> }));
          const response = await apiUpdateProduct(formData, Edit._id); 
          dispatch(showModal({ isShoModal: false, modalChildren: null }));
          console.log(response);
          if (response.success) {
            toast.success(response.mes)
            render()
            setEdit(null)
          } else toast.error(response.mes)
        }
      };
      
    const {register,handleSubmit,formState:{errors}, reset,watch} = useForm()
    const handlePreviewThumb =async(file) =>{
    const base64Thumb = await fileToBase64(file)
    setPreview(prev => ({...prev, thumb: base64Thumb}))
   
  }

  const handlePreviewImages = async(files) =>{
    const imagesPreview = []
    for(let file of files){
      if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
        toast.warning('File not supported')
        return
      }
        const base64 = await fileToBase64(file)
        imagesPreview.push(base64)
    }
    setPreview(prev => ({...prev, images: imagesPreview}))
   
  }


  useEffect(() =>{
    if(watch('thumb') instanceof FileList && watch('thumb').length > 0)
    handlePreviewThumb(watch('thumb')[0])
  },[watch('thumb')])


  useEffect(() =>{
    if(watch('images') instanceof FileList && watch('images').length > 0)
    handlePreviewImages(watch('images'))
  },[watch('images')])


  return (
    <div className='w-full flex flex-col  gap-4'>
         <div className='h-[69px] w-full'> </div>
      <div className='px-4 border-b  bg-gray-100 flex justify-between right-0 items-center   left-[327px]   top-0'>
        <h1 className='text-3xl font-bold track-tight border-b'>Update product</h1>
        <button onClick={() => setEdit(null)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
        Cancel
        </button>
      </div>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
          label='Name product'
          register={register}
          errors={errors}
          id='title'
          validate={{
            required:'Need fill this field'
          }}
          style='flex-1'
          placeholder='Name of new product'
          />
        <div className='w-full my-6 flex gap-4'>
        <InputForm
          label='Price'
          register={register}
          errors={errors}
          id='price'
          fullWidth
          validate={{
            required:'Need fill this field'
          }}
          style='flex-auto'
          placeholder='Price of new product'
          type='number'
          />
            <InputForm
          label='Quantity'
          register={register}
          errors={errors}
          id='quantity'
          validate={{
            required:'Need fill this field'
          }}
          style='flex-auto'
          placeholder='Quantity of new product'
          type='number'

          />
           <InputForm
          label='Color'
          register={register}
          errors={errors}
          id='color'
          validate={{
            required:'Need fill this field'
          }}
          style='flex-auto'
          placeholder='Color of new product'
          type='text'

          />
        </div>
        <div className='w-full my-6 flex gap-4'> 
            <Select
            label='Category'
            option={categories?.map(el => ({code: el.title, value: el.title}))}
            register={register}
            id='category'
            validate={{required: 'Need fill this field'}}
            style='flex-auto'
            errors={errors}
            fullWidth
            />
                <Select
            label='Brand (Optional)'
            option={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({
                code: el.toLowerCase(),
                value: el,
            }))}
            register={register}
            id='brand'
            style='flex-auto'
            errors={errors}
            fullWidth
        />
        </div>
        <Markdown
        name='description'
        changeValue={changeValue}
        label='Decription'
        invalidFields={invalidFields}
        setInvalidFields={setInvalidFields}
        value={payload.description}
        />
        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
          <input {...register('thumb')} errors={errors}  type='file' id='thumb' ></input>
           {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}

        </div>
      {preview.thumb &&   <div className='my-4'>
          <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'></img>
        </div>  }
        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='products'>Upload images of product</label>
          <input {...register('images')} type='file' id='products' multiple ></input>
          {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
        </div>
        {preview.images.length > 0 &&   <div className='my-4 flex w-full gap-3 flex-wrap'>
         {preview.images?.map((el,idx) =>(
          <div className='w-fit relative' key={idx} >
             <img  src={el} alt='product' className='w-[200px] object-contain'></img>
          </div>
         ))}
        </div>  }
       <div className='my-6'>
       <Button  type='submit'>
          Update product
        </Button>
       </div>
        </form>

      </div>
    </div>
  )
}

export default memo(Updateproduct)