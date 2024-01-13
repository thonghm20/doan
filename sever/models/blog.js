const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
        unique:true,
    },
    numberViews:{
        type:Number,
        default:0,
    },
    likes:[
    {
        type: mongoose.Types.ObjectId,
        ref:'User',

    }
    ],
    dislikes:[
    {
        type: mongoose.Types.ObjectId,
        ref:'User',

    }
    
    ],
    image:{
        type: String,
        default:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvhtEkrMxSwWjyCd0KZ_44C5dZZ_2xjpFNw&usqp=CAU`
    },
    author:{
        type: String,
        default:'Admin'
    }
}, {
    timestamps: true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);