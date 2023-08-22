const Message = require('../models/message');
const {Responce} = require('../helper/sendResponce')



exports.newMessage = async(req, res) => {
    try {
            const newMessage = new Message(req.body)

            const saveMessage = await newMessage.save()
            return await Responce(res, 200 , 'message Saved', saveMessage)
            
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

exports.getMessage = async(req, res) => {
    try {
           
            const conversation  = await Message.find({
                conversationId: req.params.conversation
            })
            return await Responce(res, 200 , 'Conversation', conversation)
            
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}