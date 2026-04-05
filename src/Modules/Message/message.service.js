import messageRepository from "../../DB/Repositories/message.repository.js";

export const sendMessage = (body)=>{
    const { content , receiverId} = body;
    //Repo pattern
    return  messageRepository.create({content , receiverId})    
}