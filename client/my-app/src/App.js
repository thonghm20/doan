import React, { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom'
import {Login, Home, Public, FAQ,Service,DetailProduct,Blog, Products , FinalRegister, ResetPassword,DetaildCart} from './pages/public'
import {Adminlayout, Manageorder, Manageproduct, Manageuser, Createproduct, Dashboard} from './pages/admin'
import {Memberlayout, Personal, Mycart,WishList,History, Checkout} from './pages/member'
import path from './ultils/path';
import { getCategories } from './app/asyncAction';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cart, Modal } from './components';
import { showCart } from './app/appSlice';
function App() {
  const dispatch = useDispatch()
  const {isShowModal, modalChildren, isShowCart} = useSelector(state => state.app)
  useEffect(() =>{
    dispatch(getCategories())
  },[])
  return (
    <div className=' font-main h-screen relative'>
      {isShowCart && <div onClick={() => dispatch(showCart())} className='absolute inset-0 bg-overlay z-50 flex justify-end'>
        <Cart></Cart>
      </div>}
      {isShowModal && <Modal>{modalChildren}</Modal>}
        <Routes>
        <Route path={path.CHECK_OUT} element={<Checkout/>}/>
          <Route path={path.PUBLIC} element={<Public />}>
              <Route path={path.HOME} element={<Home/>}/>
              <Route path={path.BLOGS} element={<Blog/>}/>
              <Route path={path.DETAIL_PRODUCT_CATEGORY_PID_TITLE} element={<DetailProduct/>}/>
              <Route path={path.FAQ} element={<FAQ/>}/>
              <Route path={path.OUR_SERVICES} element={<Service/>}/>
              <Route path={path.PRODUCTS_CATEGORY} element={<Products/>}/>
              <Route path={path.RESET_PASSWORD} element={<ResetPassword/>}/>
              <Route path={path.ALL} element={<Home/>}/>  

          </Route>

          <Route path={path.ADMIN} element={<Adminlayout/>}>
            <Route path={path.DASHBOARD} element={<Dashboard />}/>
            <Route path={path.MANAGE_ORDER} element={<Manageorder />}/>
            <Route path={path.MANAGE_USER} element={<Manageuser />}/>
            <Route path={path.MANAGE_PRODUCTS} element={<Manageproduct />}/>
            <Route path={path.CREATE_PRODUCTS} element={<Createproduct />}/>
          </Route>

          <Route path={path.MEMBER} element={<Memberlayout />}>
            <Route path={path.PERSONAL} element={<Personal />}/>
            <Route path={path.MY_CART} element={<DetaildCart/> }/>
            <Route path={path.WISHLIST} element={<WishList />}/>
            <Route path={path.HISTORY} element={<History />}/>


          </Route>


          <Route path={path.FINAL_REGISTER} element={<FinalRegister/>}/>
          <Route path={path.LOGIN} element={<Login/>}/>

        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
          {/* Same as */}
        <ToastContainer />

    </div>
  );
}

export default App;
