import axios from '../ultils/axios'
export const apiGetCategories = () => axios({
    url: '/productcategory/',
    method:'get'
})