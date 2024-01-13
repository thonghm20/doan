import React, {useState, useEffect} from "react";
import {apiGetProducts} from '../apis/product'
import {Product, CustomSlider }from "./";
import Slider from "react-slick";
import {getnewProducts} from '../app/product/asyncAction'
import {useDispatch, useSelector} from 'react-redux'
import clsx from "clsx";

const tabs = [
    {id:1, name:'best seller'},
    {id:2, name:'new arrivals'}

]

const BestSeller = () =>{
const [bestSeller,setbestSeller] = useState(null)
const [activedTab,setactivedTab] = useState(0)
const [products, setproducts] = useState(null)
const dispatch = useDispatch()
const {newProducts} = useSelector(state => state.products)
const {isShowModal} = useSelector(state => state.app)
const fetchProducts = async () => {
    try {
        const res = await apiGetProducts({sort: '-sold' })
        if(res.success) 
        {
            setproducts(res.products)
            setbestSeller(res.products)
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};
    useEffect(() => {
    fetchProducts();
    dispatch(getnewProducts())
        } ,[]);

    useEffect(() =>{
        if(activedTab == 1) setproducts(bestSeller)
        if(activedTab == 2) setproducts(newProducts)

    }, [activedTab])
        return(
    <div className={clsx(isShowModal ? 'hidden' : '')}>
        <div className="flex text-[20px] gap-8   ml-[-32px]">
           {tabs.map(el => (
             <span key={el.id} onClick={() => setactivedTab(el.id)} className={`font-semibold capitalize cursor-pointer px-8 border-r text-gray-400 ${activedTab === el.id ?` text-gray-900`: ''}`} >{el.name}</span>
           ))}
        </div>
        <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4"> 
            <CustomSlider products={products} activedTab={activedTab}/>
   
    </div>
    <div className="w-full flex gap-4 mt-6">
        <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657" className="flex-1"></img>
        <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657" className="flex-1"></img>

    </div>
    </div>
)
}
export default BestSeller