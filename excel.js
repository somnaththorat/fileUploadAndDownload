import mongoose from 'mongoose'

const excelSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobilenumber:{
        type:String,
        require:true
    },
})

const exc = mongoose.model('exceldata', excelSchema)
export default exc;
