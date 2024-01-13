import React from "react";
import {Sidebar,Banner, BestSeller,DealDaily, FeatureProduct, CustomSlider} from "../../components"
import Slider from "react-slick";
import {useSelector} from "react-redux"
import icons from "../../ultils/icons";
import withBaseComponent from "../../hocs/withBaseComponent";
import { createSearchParams } from "react-router-dom";

const {IoIosArrowForward} = icons
const Home =({navigate}) =>{
   const{newProducts} = useSelector(state => state.products)
   const{categories} = useSelector(state => state.app)
   const{isLoggedIn, current} = useSelector(state => state.user)
    
    return(
        <>
        <div className="w-main flex mt-6">
            <div className="flex flex-col gap-5 w-[25%] flex-auto "> 
                <Sidebar/>
                <DealDaily/>
            </div>
            <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto "> 
                <Banner/>
                <BestSeller/>
            </div>
        </div>
        <div className="my-8">
            <FeatureProduct/>
        </div>
        <div className="my-8 w-main">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
                NEW ARRIVALS
      </h3>
         <div className=" mt-4 mx-[-10px]  ">
            <CustomSlider products={newProducts}/>
         </div>
        </div>
        <div className="my-8 w-main">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">HOT COLLECTION</h3>
            <div className="flex flex-wrap gap-4 mt-4 ">
                {categories?.filter((el) => el.brand.length > 0)?.map((el) => (
                    <div className="w-[396px] " key={el._id}>
                        <div className="border flex p-4 gap-4 mt-4 min-h-[190px]">
                            <img src={el?.image} alt="" className="flex-1 w-[144px] h-[129px] object-contain"></img>
                            <div className="text-gray-700 flex-1">
                                <h4 className="font-semibold uppercase">{el.title}</h4>
                                <ul className="text-sm">
                                    {el?.brand?.map((item) =>(
                                        <span className="flex gap-1 cursor-pointer hover:underline items-center text-gray-500"
                                        key={item}
                                        onClick={() => navigate({
                                            pathname:`/${el.title}`,
                                            search: createSearchParams({brand: item}).toString()
                                        })}
                                        >
                                            <IoIosArrowForward size={14}/>
                                            <span className="cursor-pointer"><li key={item}>{item}</li></span>
                                        </span>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
                                
        </>
    )
}
export default withBaseComponent(Home)