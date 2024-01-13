import React from 'react'
import { Link } from 'react-router-dom';
import useBredcrum from 'use-react-router-breadcrumbs'
import icons from '../ultils/icons';


const{IoIosArrowForward} = icons
const BreadCrum = ({title, category}) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },

      ];    
      const breadcrumbs = useBredcrum(routes)
    
  return (
    <div className='text-sm flex items-center gap-1'>
         {breadcrumbs?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
        <Link className='flex gap-1 items-center hover:text-main' key={match.pathname} to={match.pathname}>
           <span className='capitalize'>{breadcrumb}</span>
           {index !== self.length - 1 && <IoIosArrowForward/> }
        </Link>
      ))}
    </div>
  )
}

export default BreadCrum