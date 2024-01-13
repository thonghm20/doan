import { React, memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputForm from './InputForm';
import Button from './Button';
import { fileToBase64 } from '../ultils/helper';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { apiVarriant } from '../apis/product';
import Swal from 'sweetalert2';
import { showModal } from '../app/appSlice';
import { useDispatch } from 'react-redux';

const Varriant = ({ cusomizeVarriant, setCusomizeVarriant }) => {
 

  const dispatch = useDispatch();
  const [preview, setPreview] = useState({
    thumb:null,
    images:[]
  })
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await fileToBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File not supported');
        return;
      }
      const base64 = await fileToBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    reset({
      title: cusomizeVarriant?.title,
      color: cusomizeVarriant?.color,
      price: cusomizeVarriant?.price,
    });
    
  }, [cusomizeVarriant]);

  const handleAddVarriant = async (data) => {
    if (data.color === cusomizeVarriant.color) Swal.fire('Oops!', 'Color not changed', 'info');
    else {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      if (data.thumb) formData.append('thumb', data.thumb[0]);
      if (data.images) {
        for (let image of data.images) formData.append('images', image);
      }
      dispatch(showModal({ isShoModal: true, modalChildren: <Loading /> }));
      const response = await apiVarriant(formData, cusomizeVarriant._id);
      dispatch(showModal({ isShoModal: false, modalChildren: null }));
      if(response.success){
        toast.success(response.mes)
        reset()
        setPreview({thumb:'',images:[]})
      }
      else toast.error(response.mes)

    }
  };

 

  useEffect(() => {
    if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
      handlePreviewThumb(watch('thumb')[0]);
  }, [watch('thumb')]);

  useEffect(() => {
    if (watch('images') instanceof FileList && watch('images').length > 0)
      handlePreviewImages(watch('images'));
  }, [watch('images')]);

  return (
    <div className='w-full flex flex-col  gap-4'>
      <div className='h-[69px] w-full'> </div>
      <div className='px-4 border-b bg-gray-100 flex justify-between right-0 items-center left-[327px]  top-0'>
        <h1 className='text-3xl font-bold track-tight border-b'>Customize Varriant of product</h1>
        <button
          onClick={() => setCusomizeVarriant(null)}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit(handleAddVarriant)} className='p-4 flex flex-col gap-4 w-full'>
        <div className='flex gap-4 items-center'>
          <InputForm
            label='Original name'
            register={register}
            errors={errors}
            id='title'
            fullWidth
            style='flex-1 focus:outline-none focus:border-gray-300'
            placeholder='title of new varriant'
          />
        </div>
        <div className='flex gap-4 items-center'>
          <InputForm
            label='Price varriant'
            register={register}
            errors={errors}
            id='price'
            style='flex-1'
            placeholder='Price of new varriant'
          />
          <InputForm
            label='Color varriant'
            register={register}
            errors={errors}
            id='color'
            style='flex-1'
            placeholder='Color of new varriant'
          />
        </div>
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
  );
};

export default memo(Varriant);
