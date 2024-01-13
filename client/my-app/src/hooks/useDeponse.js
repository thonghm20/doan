import React,{useEffect,useState} from 'react'

const useDeponse = (value, ms) => {
    const [decountvalue, setDecountvalue] = useState('')
    useEffect(() =>{
        const SettimeOutId = setTimeout(() =>{
            setDecountvalue(value)
        },ms)

        return() =>{
            clearTimeout(SettimeOutId)
        }

    },[value,ms])

    return (
        decountvalue
        )
}

export default useDeponse