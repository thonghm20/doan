import icons from "./icons"
const {MdOutlineStar,MdOutlineStarBorder} = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g , "").split(' ').join('-')
export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()
export const renderStart = (number, size) =>{
    if(!Number(number)) return
    const stars = []
    for(let i = 0; i < +number;i++) stars.push(<MdOutlineStar color="orange"  size={size || 16}/>)
    for(let i = 5; i > +number;i--) stars.push(<MdOutlineStarBorder color="orange" size={size || 16}/>)
    return stars

}
export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);

    for (let array of formatPayload) {
        if (array[1].trim() === '') {
            invalids++;
            setInvalidFields(prev => [...prev, { name: array[0], mes: 'Require this field' }]);
        }
    }

    for (let array of formatPayload) {
        switch (array[0]) {
            case 'email':
                const mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (!array[1].match(mailformat)) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: array[0], mes: 'Email invalid' }]);
                }
                break;

            case 'password':
                const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!array[1].match(passwordFormat)) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: array[0], mes: 'Password must be at least 6 characters ' }]);
                }
                break;

            default:
                break;
        }
    }

    return invalids;
};
export const  formatPrice  = number => Math.round(number/1000) * 1000

export const generateRange = (start,end) =>{
    const length = end+1-start 
    return Array.from({length},(_,index) => start+index)
}

export const  fileToBase64 =(file) =>{
    if(!file) return ''
    return new Promise((resolve,reject) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    })
}



