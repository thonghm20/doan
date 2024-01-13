import React from "react";
import { renderStart,formatMoney } from "../ultils/helper";
import withBaseComponent from "../hocs/withBaseComponent";
import path from "../ultils/path";
const ProductCart = ({price,totalRating,title,image,pid,navigate,category}) =>{
    return(
        <div onClick={e => navigate( `/${category?.toLowerCase()}/${pid}/${title}`)} className="w-1/3 flex-auto cursor-pointer px-[10px] mb-[20px]">
           <div className="flex w-full border">
           <img src={image} alt="products"  className="w-[120px] object-contain p-4"></img>
            <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-sm">
                <span className="line-clamp-1 capitalize text-sm">{title?.toLowerCase() }</span>
                <span className="flex h4-4">
                {renderStart(totalRating)?.map((el, index) => (
                            <div key={index}>{el}</div>
                ))}
                </span>
                <span>{price !== undefined ? `${formatMoney(price)} VND` : 'Price not available'}</span>
            </div>
           </div>
        </div>

    )
}
export default withBaseComponent(ProductCart)