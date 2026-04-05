import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true       
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:{
            name:"index_receiverId"
        }

    }

},{
    timestamps:true

})

const Messsage = mongoose.model.Messsage || mongoose.model("Message" , MessageSchema);

export default Messsage;
    
