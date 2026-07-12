import Notification from "../models/notification.js";

// GET ALL

export const getNotifications = async (
    req,
    res
) => {

    try {

        const { userId } = req.params;

        const notifications =
            await Notification.find({

                receiverId: userId

            }).sort({

                createdAt:-1

            });

        res.json({

            success:true,

            notifications

        });

    }

    catch(error){

        res.json({

            success:false,

            message:error.message

        });

    }

};

// MARK READ

export const markRead = async (

req,
res

)=>{

try{

const {id}=req.params;

await Notification.findByIdAndUpdate(

id,

{

isRead:true

}

);

res.json({

success:true

});

}

catch(error){

res.json({

success:false,

message:error.message

});

}

};