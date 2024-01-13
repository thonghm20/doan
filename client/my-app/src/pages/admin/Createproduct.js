import React, { useCallback, useEffect, useState } from 'react'
import {InputForm, Select, Button , Markdown, Loading} from '../../components'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import { validate, fileToBase64 } from '../../ultils/helper'
import { apiCreatProduct } from '../../apis/product'
import { showModal } from '../../app/appSlice'

const Createproduct = () => {
  const {categories} = useSelector(state => state.app)
  const dispatch = useDispatch()

  const {register, formState:{errors},reset,handleSubmit, watch} = useForm()
  const [preview, setPreview] = useState({
    thumb:null,
    images:[]
  })
  const [payload, setPayload] = useState({
    description:''
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) =>{
      setPayload(e)
  },[payload])

  const [hoverElm, setHoverElm] = useState(null)

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
        imagesPreview.push({name: file.name, path:base64})
    }
    setPreview(prev => ({...prev, images: imagesPreview}))
  }

  useEffect(() =>{
    handlePreviewThumb(watch('thumb')[0])
  },[watch('thumb')])
  useEffect(() =>{
    handlePreviewImages(watch('images'))
  },[watch('images')])



  const handleCreateProduct = async(data) =>{
    const invalids = validate(payload,setInvalidFields)
    if(invalids === 0){
    if(data.category) data.category = categories?.find(el => el._id ===  data.category)?.title
    const finalPayload = {...data,...payload}
    const formData = new FormData()
    for(let i of Object.entries(finalPayload  )) formData.append(i[0],i[1])
    if(finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
    if(finalPayload.images) {
      for(let image of finalPayload.images) formData.append('images',image)
    }
    dispatch(showModal({isShoModal:true, modalChildren:<Loading/>}))
    const response = await apiCreatProduct(formData)
    dispatch(showModal({isShoModal:false, modalChildren: null}))
    if(response.success) {
      toast.success(response.mes)
      reset()
      setPayload({
        thumb:'',
        image:[]
      })
     
    } else toast.error(response.mes)
  }
}
  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create New Product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
            option={categories?.map(el => ({code: el._id, value: el.title}))}
            register={register}
            id='category'
            validate={{required: 'Need fill this field'}}
            style='flex-auto'
            errors={errors}
            fullWidth
            />
            <Select
            label='Brand (Optional)'
            option={categories?.find((el) => el._id === watch('category'))?.brand?.map((el) => ({
              code: el,
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
        />
        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
          <input {...register('thumb',{required:'Need fill'})} errors={errors}  type='file' id='thumb' ></input>
           {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}

        </div>
      {preview.thumb &&   <div className='my-4'>
          <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'></img>
        </div>  }
        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='products'>Upload images of product</label>
          <input {...register('images',{required:'Need fill'})} type='file' id='products' multiple ></input>
          {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
        </div>
        {preview.images.length > 0 &&   <div className='my-4 flex w-full gap-3 flex-wrap'>
         {preview.images?.map((el,idx) =>(
          <div className='w-fit relative' key={idx}  onMouseEnter={() => setHoverElm(el.name)} onMouseLeave={() => setHoverElm(null)}>
             <img  src={el.path} alt='product' className='w-[200px] object-contain'></img>
           
          </div>
         ))}
        </div>  }
       <div className='my-6'>
       <Button  type='submit'>
          Creat new product
        </Button>
       </div>
        </form>

      </div>
    </div>
  )
}

export default Createproduct