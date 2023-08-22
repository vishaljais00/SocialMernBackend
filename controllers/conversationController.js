const Conversation = require('../models/conversation');
const {Responce} = require('../helper/sendResponce')



exports.newConv = async(req, res) => {
    try {
            const newConversation = new Conversation({
                members: [req.body.senderId, req.body.receiverId]
            })

            const saveConversation  = await newConversation.save()
            return await Responce(res, 200 , 'new Conversation created', saveConversation)
            
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

exports.getConv = async(req, res) => {
    try {
           
            const conversation  = await Conversation.find({
                members: { $in : [req.params.userId]}
            })
            return await Responce(res, 200 , 'Conversation', conversation)
            
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}