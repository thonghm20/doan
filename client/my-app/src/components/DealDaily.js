import React, {useState,useEffect, memo} from "react";
import icons from "../ultils/icons";
import { apiGetProducts } from "../apis/product";
import {renderStart,formatMoney} from '../ultils/helper'
import Counter from "./Counter";

const{MdOutlineStar, IoMenu} = icons
 const DealDaily = () =>{
const [hour, setHour] = useState(0);
const [minutes, setMinutes] = useState(0);
const [seconds, setSeconds] = useState(0);
const [expire, setExpire] = useState(false);
let idInterval;
const [DealDaily, setDealDaily] = useState(null);

const fetchDealDaily = async () => {
  const response = await apiGetProducts({
    limit: 1,
    page: Math.round(Math.random() * 10),
    totalRating: 5,
  });

  if (response.success) {
    setDealDaily(response.products[0]);
    const currentTime = new Date();
    const h = 23 - currentTime.getHours();
    const m = 59 - currentTime.getMinutes();
    const s = 59 - currentTime.getSeconds();
    setHour(h);
    setMinutes(m);
    setSeconds(s);
  } else {
    setHour(0);
    setMinutes(59);
    setSeconds(59);
  }
};

useEffect(() => {
  clearInterval(idInterval);
  fetchDealDaily();
}, [expire]);

useEffect(() => {
  idInterval = setInterval(() => {
    if (seconds > 0) {
      setSeconds((prev) => prev - 1);
    } else {
      if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        if (hour > 0) {
          setHour((prev) => prev - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          setExpire(true);
        }
      }
    }
  }, 1000);

  return () => {
    clearInterval(idInterval);
  };
}, [seconds, minutes, hour, expire]);
    return(
        <div className="border w-full flex-auto">
            <div className="flex items-center justify-between pd-4 w-full">
                <span className="flex-1 flex justify-center"><MdOutlineStar size={20} color="red"/></span>
                <span className="flex-8 font-semibold text-[20px] flex justify-center text-gray-700">Deal Daily</span>
                <span className="flex-1"></span>
            </div>
            <div className="w-full flex flex-col items-center pt-8 gap-2">
            <img src={DealDaily?.thumb || 'https://sudbury.legendboats.com/resource/defaultProductImage'} alt="" className="w-full object-contain mt-[90px] "/>
            <span className="flex h4-4">
                {renderStart(DealDaily?.totalRating)?.map((el, index) => (
                            <div key={index}>{el}</div>
                ))}
                </span>
                <span className="line-clamp-1 text-center">{DealDaily?.title}</span>
                <span>{DealDaily?.price !== undefined ? `${formatMoney(DealDaily.price)} VND` : 'Price not available'}</span>
            </div>
            <div className="px-4 mt-8">
            <div className="flex justify-center gap-2 items-center mb-4">
                <Counter unit={'Hours'} number={hour}/>
                <Counter unit={'Minutes'} number={minutes}/>
                <Counter unit={'Seconds'} number={seconds}/>  
            </div>
            <button className="flex gap-2 items-center w-full justify-center bg-main hover:bg-gray-800 text-white font-medium py-2 ">
                <IoMenu type="Button"
                />
                <span>Options</span>
            </button>
        </div>
        </div>
    )
 }
 export default memo(DealDaily)