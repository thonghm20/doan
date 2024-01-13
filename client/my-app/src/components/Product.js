import React, {useState} from "react";
import {formatMoney} from '../ultils/helper'
import trending from '../assets/trending.png'
import label from '../assets/new.png'
import { renderStart } from "../ultils/helper";
import SelectOption from "./SelectOption";
import icons from "../ultils/icons";
import { Link, createSearchParams } from "react-router-dom";
import path from "../ultils/path";
import  withBaseComponent  from '../hocs/withBaseComponent'
import { showModal } from "../app/appSlice";
import DetailProduct from "../pages/public/DetailProduct";
import { CiShoppingCart } from "react-icons/ci";
import { apiUpdatawishList, apiUpdateCart } from "../apis";
import { toast } from "react-toastify";
import { getCurrent } from "../app/user/asyncAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BsCartCheckFill } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa";
import clsx from "clsx";



const{FaEye,IoMenu,FaHeart} = icons
const Product = ({productData, isNew, normal, navigate,dispatch,location,pid,className}) =>{
    const [isShowOption,setisShowOption] = useState(false)
    const {current} = useSelector(state => state.user)
    const handleClickOption =  async(e,flag) =>{
        e.stopPropagation()
        if(flag === 'CART') {
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
                pid: productData?._id,  
                color: productData?.color,  
                quantity:1,
                price:  productData?.price,  
                thumbnail: productData?.thumb,  
                title: productData?.title,  })
                    if(response.success) 
                    {toast.success(response.mes)
                    dispatch(getCurrent())
                    }
                    else toast.error(response.mes)
                    }
            
        if(flag === 'WISHLIST') {
            const response = await apiUpdatawishList(pid)
            if(response.success){
                dispatch(getCurrent())
                toast.success(response.mes)
            }
            else{
                toast.error(response.mes)   
            }
        }
        if(flag === 'QUICK_VIEW') {
            dispatch(showModal({isShowModal: true, modalChildren:<DetailProduct data={{pid: productData?._id, category: productData?.category} } isQuickView/>}))
        }
    }
    return(
        <div className={clsx("w-full text-base px-[10px] ",className)}>
            <div className="w-full border p-[15px] flex flex-col items-center"
                onClick={e => navigate( `/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
                onMouseEnter={e =>{
                    e.stopPropagation()
                    setisShowOption(true)
                }}
                onMouseLeave={e =>{
                    e.stopPropagation()
                    setisShowOption(false)
                }}
            >
                <div className="w-full relative">
                    {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
                        <span title="Quick view" onClick={(e) => handleClickOption(e,'QUICK_VIEW')}><SelectOption icon={<FaEye/>}/></span>
                        {current?.cart?.some(el => el.product === productData._id)?<span title="Add to cart" ><SelectOption icon={<BsCartCheckFill color="green"/>}/></span>:<span title="Added to cart" onClick={(e) => handleClickOption(e,'CART')}><SelectOption icon={<FaCartPlus/>}/></span>}
                        <span title="Add to Wishlist" onClick={(e) => handleClickOption(e,'WISHLIST')}><SelectOption icon={<FaHeart  color={current?.wishlist?.some(i => i._id === pid)? 'pink' : 'gray'}/>}/></span>
                    </div>}
            <img src={productData?.thumb || 'https://sudbury.legendboats.com/resource/defaultProductImage'} alt="" className="w-[243px] h-[243px] "/>
           {!normal &&  <img
            src={isNew ? label : trending}
            className={`absolute w-[100px] h-[35px] top-0 right-0 object-cover `}
            alt="Label"
            />  }      
            <span className="font-bold top-[-10px] left-[-12px] text-white absolute" >{isNew ?'New' : 'Trending'}</span>

                </div>
            <div className=" flex flex-col mt-[15px] item-start gap-1 w-full">
            <span className="flex h4-4">
                {renderStart(productData?.totalRating)?.map((el, index) => (
                            <div key={index}>{el}</div>
                ))}
                </span>
                <span>{productData?.title}</span>
                <span>{`${formatMoney(productData?.price)} VND`}</span>
            </div>
            </div>
        </div>
    )
}

export default withBaseComponent(Product)