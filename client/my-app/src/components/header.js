import React ,{Fragment, useEffect, useState, memo}from "react";
import logo from "../assets/logo.png"
import icons from "../ultils/icons";
import {Link} from "react-router-dom"
import path from '../ultils/path'
import {  useSelector } from "react-redux/es/hooks/useSelector";
import {useDispatch} from 'react-redux'
import { logout } from "../app/user/userSlice";
import withBaseComponent from "../hocs/withBaseComponent";
import { showCart } from "../app/appSlice";

const Header =({dispatch}) =>{
    const {current} = useSelector(state  => state.user)
    const [isshowOption, setisShowOption] = useState(false)
    const {MdPhone, IoMdMail, IoBagHandleSharp, FaCircleUser} = icons
    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById('profile');
            if (profile && !profile.contains(e.target)) {
                setisShowOption(false);
            }
        };
    
        document.addEventListener('click', handleClickoutOptions);
    
        return () => {
            document.removeEventListener('click', handleClickoutOptions);
        };
    }, []);
    return(
        <div className="w-main flex justify-between h-[110px] py-[35px]">
            <Link to={`/${path.HOME}`}>
           <img src={logo} alt="logo" className="w-[234px] object-contain"></img>

            </Link>
            <div className="flex text-[13px]">
                <div className="flex flex-col px-4 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <MdPhone color="red"/>
                    <span className="font-semibold">(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className="flex flex-col items-center  px-4 border-r">
                    <span className="flex gap-4 items-center">
                        <IoMdMail color="red"/>
                    <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
               {current && <Fragment> <div  onClick={() => dispatch(showCart())} className="flex items-center cursor-pointer justify-center gap-2  px-6 border-r">
                    <IoBagHandleSharp color="red"/>
                    <span>{`${current?.cart?.length || 0} item(s)`}</span>
                </div>
                <div
                className="flex items-center cursor-pointer justify-center px-6 gap-2 relative"
                onClick={() => setisShowOption(prev => !prev)}
                id="profile"
                >
                        <FaCircleUser color="red" />
                        <span>Profile</span>
                        {isshowOption && <div  onclick={e => e.stopPropagation()} className="absolute animate-menu-slide-down  top-full flex flex-col left-[16px]   bg-white border min-w-[150px] py-2">
                                <Link className="p-2 w-full hover:text-main" to={`/${path.MEMBER}/${path.PERSONAL}`}>Personal</Link>
                                {+current.role === 1945 &&   <Link className="p-2 w-full hover:text-main" to={`/${path.ADMIN}/${path.DASHBOARD}`}>Admin workspace</Link>}
                        </div>}

                </div>
              
                </Fragment>}
            </div>
        </div>
    )
}
export default withBaseComponent(memo(Header))