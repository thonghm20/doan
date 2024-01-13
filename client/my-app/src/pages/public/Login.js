import React, { useState, useCallback, useEffect } from "react";
import { InputField, Button, Loading } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from "../../apis/user";
import Swal from 'sweetalert2';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import path from "../../ultils/path";
import { login } from '../../app/user/userSlice';
import { showModal } from "../../app/appSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "../../ultils/helper";

const Login = () => {
  const [VerifiedEmail, setVerifiedEmail] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: ''
  });

  const [invalidFields, setInvalidFields] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams()

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes);
    } else {
      toast.info(response.mes);
    }
  };

  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: ''
    });
  };

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire({
        title: response.success ? 'Congratulations' : 'Oops!',
        text: response.mes,
        icon: response.success ? 'success' : 'error'
      }).then(() => {
        setIsLogin(false);
        resetPayload();
      });
      setVerifiedEmail(false);
    } else {
      Swal.fire('Oops!', response.mes, 'error');
      setVerifiedEmail(false);
      setToken('');
    }
  };

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isLogin ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);

    if (invalids === 0) {
      if (isLogin) {
        dispatch(showModal({isShowModal:true,modalChildren:<Loading/>}))
        const response = await apiRegister(payload);
        dispatch(showModal({isShowModal:true,modalChildren: null}))
        if (response.success) {
          setVerifiedEmail(true);
        } else {
          Swal.fire('Oops!', response.mes, 'error');
        }
      } else {
        const response = await apiLogin(data);
        if (response.success) {
          dispatch(login({ isLoggedIn: true, token: response.accessToken, userData: response.userData }));
          searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
        }
        Swal.fire({
          title: response.success ? 'Congratulations' : 'Oops!',
          text: response.mes,
          icon: response.success ? 'success' : 'error'
        }).then(() => {
          setIsLogin(false);
          resetPayload();
        });
      }
    }
  }, [payload, isLogin]);

  useEffect(() => {
    resetPayload();
  }, [isLogin]);

  return (
    <div className="w-screen h-screen relative">
      {VerifiedEmail && <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center">
        <div className="bg-white w-[500px] rounded-md p-8">
          <h4>We sent a code to your mail</h4>
          <input
            className="p-2 rounded-md"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="text"
            placeholder="Enter your code"
          />
          <button onClick={finalRegister} className="px-4 py-2 bg-blue-500 font-semibold rounded-md ml-4 text-white" type="button">
            Submit
          </button>
        </div>
      </div>}
      {isForgotPassword && <div className="absolute top-0 left-0 bottom-0 right-0 animate-slide-right bg-white  flex  flex-col items-center py-8 z-50">
        <div className="flex flex-col gap-4">
          <label htmlFor="email">Enter your email:</label>
          <input
            type="text"
            id="email"
            className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
            placeholder="Exp: email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <div className="flex items-center justify-end w-full gap-4">
            <Button
              children='Submit'
              handleOnclick={handleForgotPassword}
              style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
            />
            <Button
              children='Back'
              handleOnclick={() => setIsForgotPassword(false)}
            />
          </div>
        </div>
      </div>}
      <img className="w-full h-full object-cover" src="https://img.freepik.com/free-photo/3d-illustration-smartphone-with-products-coming-out-screen-online-shopping-e-commerce-concept_58466-14529.jpg" alt="background" />
      <div className="absolute top-0 bottom-0 left-0  right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
          <h1 className="text-[28px] font-semibold text-main mb-8">{isLogin ? 'Register' : 'Login'}</h1>
          {isLogin && <div className="flex items-center gap-2">
            <InputField
              value={payload.firstname}
              setvalue={setPayload}
              fullwith
              namekey='firstname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputField
              value={payload.lastname}
              fullwith
              setvalue={setPayload}
              namekey='lastname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>}
          <InputField
            value={payload.email}
            setvalue={setPayload}
            fullwith
            namekey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          {isLogin && <InputField
            value={payload.mobile}
            fullwith
            setvalue={setPayload}
            namekey='mobile'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />}
          <InputField
            value={payload.password}
            setvalue={setPayload}
            fullwith
            namekey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            handleOnclick={handleSubmit}
            fw>{isLogin ? 'Register' : 'Login'}</Button>
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isLogin && <span onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">Forgot your Account?</span>}
            {!isLogin && <span onClick={() => setIsLogin(true)} className="text-blue-500 hover:underline cursor-pointer">Create Account</span>}
            {isLogin && <span onClick={() => setIsLogin(false)} className="text-blue-500 hover:underline cursor-pointer w-full text-center">Go Login</span>}
          </div>
          <Link className="text-blue-500 text-sm hover:underline cursor-pointer" to={`/${path.HOME}`}>Go home?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
