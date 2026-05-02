import messageRepository from "../../DB/Repositories/message.repository.js";

export const sendMessage = (body)=>{
    const { content , receiverId} = body;
    //Repo pattern
    return  messageRepository.create({content , receiverId})    
}

export const listMyMessages = (userId)=>{
    return messageRepository.find({receiverId:userId})
}