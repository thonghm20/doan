import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createSearchParams, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts, apiUpdateCart } from '../../apis';
import clsx from 'clsx';
import {
  BreadCrum,
  Button,
  SelectQuantity,
  Productextrain,
  Productinfomation,
  CustomSlider
} from '../../components';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatPrice, formatMoney, renderStart } from '../../ultils/helper';
import { Productextraininfomation } from '../../ultils/containt';
import DOMPurify from 'dompurify';
import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import withBaseComponent from '../../hocs/withBaseComponent';
import { getCurrent } from '../../app/user/asyncAction';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import path from '../../ultils/path';

const DetailProduct = ({ isQuickView,data, location, dispatch, navigate }) => {
  const titleRef = useRef();
  const params = useParams();
  const {current} = useSelector(state => state.user)
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [pid, setPid] = useState(null)
  const [varriant, setVarriant] = useState(null)

  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    thumb: '',
    images: [],
    price: '',
    color: '',
    category: ''
  });

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  useEffect(() =>{
    if(data && data.pid) setPid(data.pid)
    else if(params && params.pid) setPid(params.pid)
  },[data,params])


  const handleToCart =  async() =>{
    if(!current) return Swal.fire({
      title:'Almost...',
      text:'Please Login',
      icon:'info',
      showCancelButton:true,
      confirmButtonText:"Go login page"
  }).then((rs) =>{
      if(rs.isConfirmed) navigate({
        pathname: `/${path.LOGIN}`,
        search: createSearchParams({redirect: location.pathname}).toString()
      })
  })
  const response  = await apiUpdateCart({
    pid,  
    color:currentProduct.color || product?.color,
    quantity,
    price: currentProduct.price || product.price ,
    thumbnail:currentProduct.thumb || product.thumb,
    title:currentProduct.title || product.title})
        if(response.success) 
        {toast.success(response.mes)
        dispatch(getCurrent())
        }
        else toast.error(response.mes)
        }

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentProduct({
        title: response.productData?.title,
        thumb: response.productData?.thumb,
        images: response.productData?.images,
        price: response.productData?.price,
        color: response.productData?.color,
        category: response.productData?.category
      });
    }
  };

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category: currentProduct.category });
    if (response.success) {
      setRelatedProduct(response.products);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
    // Check if titleRef.current is defined before calling scrollIntoView
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ block: 'center' });
    }
  }, [pid]);
  


  useEffect(() =>{
    if(varriant){
    setCurrentProduct({
      title: product?.varriants?.find(el => el.sku === varriant)?.title,
      color: product?.varriants?.find(el => el.sku === varriant)?.color,
      images: product?.varriants?.find(el => el.sku === varriant)?.images,
      price: product?.varriants?.find(el => el.sku === varriant)?.price,
      thumb: product?.varriants?.find(el => el.sku === varriant)?.thumb,
    


  })
}else{
  setCurrentProduct({
    title: product?.title,
    color: product?.color,
    images: product?.images || [],
    price: product?.price,
    thumb: product?.thumb,
  })

}
  },[varriant,product])

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return;
    } else setQuantity(number);
  }, [quantity]);

  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentProduct((prev) => ({ ...prev, thumb: el }));
  };

  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return;
    if (flag === 'minus') setQuantity((prev) => +prev - 1);
    if (flag === 'plus') setQuantity((prev) => +prev + 1);
  }, [quantity]);

  return (
    <div  className={clsx("w-full ")}>
      {!isQuickView && (
        <div className="h-[81px]  flex justify-center items-center bg-gray-100">
          <div  className="w-main">
            <h3 ref={titleRef} className="font-semibold">{currentProduct.title || product?.title}</h3>
            <BreadCrum title={currentProduct.title || product?.title} category={product?.category} />
          </div>
        </div>
      )}
      <div onClick={e => e.stopPropagation()} className={clsx(" bg-white m-auto mt-4 flex",isQuickView ? 'w-main' : 'w-main')}>
        <div className={clsx("flex flex-col gap-4 w-2/5",isQuickView && 'w-1/2')}>
          <div className="h-[458px] w-[458px]  border overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Product Image',
                  isFluidWidth: true,
                  src: currentProduct.thumb || product?.thumb
                },
                largeImage: {
                  src: currentProduct.thumb ||  product?.thumb ,
                  width: 1800,
                  height: 1500
                }
              }}
            />
          </div>
          <div className="w-[458px]">
            <Slider className="custom-slider flex gap-2 justify-between" {...settings}>
              {currentProduct.images.length === 0 && product?.images?.map((el) => (
                <div className="w-full" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt="sub-product"
                    className="h-[143px] cursor-pointer w-[143px] border object-contain"
                  />
                </div>
              ))}
               {currentProduct.images.length > 0 && currentProduct?.images?.map((el) => (
                <div className="w-full" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt="sub-product"
                    className="h-[143px] cursor-pointer w-[143px] border object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className={clsx("pr-[24px] w-2/5 flex flex-col gap-4", isQuickView && 'w-1/2 ')}>
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(
              formatPrice(currentProduct.price)
            )} VND`}</h2>
            <span className="text-sm text-main">{`In Stock:${product?.quantity}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {product?.totalRating &&
              renderStart(product.totalRating)?.map((el) => <span key={el}>{el}</span>)}
            <span className="text-sm text-main italic">{`(Sold: ${product?.sold})`}</span>
          </div>
          <ul className="list-square text-sm text-gray-500 pl-4">
            {product?.description?.length > 1 &&
              product?.description?.map((el) => <li className="leading-8" key={el}>{el}</li>)}
            {product?.description?.length === 1 && (
              <div
                className="text-sm line-clamp-[10] mb-8"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0])
                }}
              ></div>
            )}
          </ul>
          <div className='my-4 flex  gap-4'>
            <span className='font-bold'>Color</span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div  onClick={() => setVarriant(null)}  className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriant && 'border-red-500')}>
                <img src={product?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'></img>
                <span className='flex flex-col'>
                <span>{product?.color}</span>
                <span className='text-sm'>{product?.price && formatMoney(product.price)}</span>
                </span>
              </div>
              {product?.varriants?.map(el =>(
              
                <div   key={el.sku} onClick={() => setVarriant(el.sku)} 
                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', varriant === el.sku && 'border-red-500')}>
                <img src={el?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'></img>
                <span className='flex flex-col'>
                <span>{el?.color}</span>
                <span className='text-sm'>{el?.price && formatMoney(el.price)}</span>
                </span>
              </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity</span>
              <SelectQuantity
                quantity={quantity}
                handleChangeQuantity={handleChangeQuantity}
                handleQuantity={handleQuantity}
              />
            </div>
            <Button handleOnclick={handleToCart} fw>Add to cart</Button>
          </div>
        </div>
        {!isQuickView && (
          <div className=" w-1/5">
            {Productextraininfomation.map((el) => (
              <Productextrain key={el.id} title={el.title} sub={el.sub} icon={el.icon} />
            ))}
          </div>
        )}
      </div>
      {!isQuickView && 
        <div className="w-main m-auto mt-8">
          <Productinfomation
            pid={product?._id}
            rerender={rerender}
            totalRating={product?.totalRating}
            ratings={product?.ratings}
            nameProduct={product?.title}
          />
        </div>
      }
      {!isQuickView && 
        <>
          <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
              OTHER CUSTOMERS ALSO LIKED
            </h3>
            <CustomSlider normal={true} products={relatedProduct} />
          </div>
          <div className="h-[100px]"></div>
        </>
      }
    </div>
  );
};

export default withBaseComponent(DetailProduct);
