import React, { useCallback, useEffect, useState } from 'react';
import { apiGetUsers, apiUpdataUser, apiDeleteUser } from '../../apis/user';
import { roles, blockStatus } from '../../ultils/containt';
import moment from 'moment';
import { InputField, InputForm, Pagination, Select, Button } from '../../components';
import useDeponse from '../../hooks/useDeponse';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import { FaRegEdit, FaBackspace } from 'react-icons/fa';
import { IoCaretBackOutline } from 'react-icons/io5';

const Manageuser = () => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    phone: '',
    isBlocked: '',
  });
  const [users, setUsers] = useState(null);
  const [queries, setqueries] = useState({
    q: '',
  });
  const [update, setUpdate] = useState(false);
  const [Edit, setEdit] = useState(null);
  const [params] = useSearchParams();

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT });
    if (response) setUsers(response);
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const queriesDebonce = useDeponse(queries.q, 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebonce) queries.q = queriesDebonce;
    fetchUsers(queries);
  }, [queriesDebonce, params, update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdataUser(data, Edit._id);
    if (response.success) {
      setEdit(null);
      render();
      toast.success(response.mes);
    } else toast.error(response.mes);
  };

  useEffect(() => {
    if (Edit) {
      reset();
    }
  }, [Edit, reset]);
  
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: 'Are  you sure ...',
      text: 'Are you ready to remove this user',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else toast.error(response.mes);
      }
    });
  };

  return (
    <div className={clsx('w-full', Edit && 'pl-16')}>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage users</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4'>
          <InputField
            namekey={'q'}
            value={queries.q}
            setvalue={setqueries}
            style={'w500'}
            placeholder='Search name or mail user'
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {Edit && (
            <Button type='submit' className='bg-red-500 ml-4 mb-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
              Update
            </Button>
          )}
          <table className='table-auto mb-6 text-left w-full'>
            <thead className='font-bold bg-gray-700 text-[13px]  text-white'>
              <tr className='border border-gray-500 -600'>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>Email address</th>
                <th className='px-4 py-2'>Firstname</th>
                <th className='px-4 py-2'>Lastname</th>
                <th className='px-4 py-2'>Role</th>
                <th className='px-4 py-2'>Phone</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Created At</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, index) => (
                <tr key={el._id} className='border w-main border-gray-500'>
                  <td className='py-2 px-4'>{index + 1}</td>
                  <td className='py-2 px-4 '>
                    {Edit?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={'email'}
                        validate={{
                          required: 'Require fill',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        }}
                        defaultValue={Edit?.email}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {Edit?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={'firstname'}
                        validate={{ required: 'Require fill' }}
                        defaultValue={Edit?.firstname}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {Edit?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={'lastname'}
                        validate={{ required: 'Require fill' }}
                        defaultValue={Edit?.lastname}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {Edit?._id === el._id ? (
                      <Select
                        register={register}
                        errors={errors}
                        style={'w-[116px]'}
                        id={'role'}
                        validate={{ required: 'Require fill' }}
                        defaultValue={el.role}
                        option={roles}
                      />
                    ) : (
                      <span>{roles.find((role) => +role.code === +el.role)?.value}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {Edit?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={'mobile'}
                        validate={{
                          required: 'Require fill',
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: 'Invalid phone number ',
                          },
                        }}
                        defaultValue={Edit?.mobile}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {Edit?._id === el._id ? (
                      <Select
                      register={register}
                      errors={errors}
                      id={'isBlocked'}
                      style={'w-[116px]'}
                      validate={{ required: 'Require fill' }}
                      defaultValue={el.isBlocked}
                      option={blockStatus}
                      className={Edit?._id === el._id ? 'edit-mode-select' : ''}
                      />
                    ) : (
                      <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td className=' flex flex-col items-center justify-center'>
                    {Edit?._id === el._id ? (
                      <span onClick={() => setEdit(null)} className='px-4 mt-3 text-yellow-500 text hover:underline cursor-pointer'>
                        <IoCaretBackOutline size={20} />
                      </span>
                    ) : (
                      <span onClick={() => setEdit(el)} className='px-2  text-yellow-500 hover:underline cursor-pointer'>
                        <FaRegEdit size={20} />
                      </span>
                    )}
                    <span onClick={() => handleDeleteUser(el._id)} className='px-4 mt-2 text-red-600 hover:underline cursor-pointer'>
                      <FaBackspace size={20} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className='w-full flex justify-end'>
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default Manageuser;
