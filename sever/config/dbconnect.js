const {default : mongoose} = require('mongoose')
mongoose.set('strictQuery',false)


const dbConnect = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if(conn.connection.readyState === 1){
            console.log('thanh cong')
        }
        else{
            console.log('faild')
        }
    }catch(error){
        console.log("connect failed")
        throw new Error(error)
    }
}
module.exports = dbConnect