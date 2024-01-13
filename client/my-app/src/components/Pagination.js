import React from 'react';
import usePagination from '../hooks/usePagination';
import Pagitem from './Pagitem';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount, itemsPerPage = +process.env.REACT_APP_LIMIT || 10 }) => {
  const [params] = useSearchParams();
  const currentPage = +params.get('page') || 1;

  const pagination = usePagination(totalCount, currentPage, itemsPerPage);

  const range = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalCount);
    return `${start} - ${end}`;
  };

  return (
    <div className='flex w-full justify-between items-center'>
      {totalCount > 0 && (
        <span className='text-sm italic'>
          {`Show products ${range()} of ${totalCount} `}
        </span>
      )}
      {totalCount > itemsPerPage && (
        <div className='flex items-center'>
          {pagination.map((el) => (
            <Pagitem key={el}>{el}</Pagitem>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pagination;
