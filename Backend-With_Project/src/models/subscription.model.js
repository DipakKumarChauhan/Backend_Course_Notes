import mongoose,{Schema} from "mongoose"

const subscriptionSchema = new Schema({

    subscriber: 
    {
        type: Schema.Types.ObjectId, // One Who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // On to whom subsriber is subscribing
        ref: "User"
    },
}, {timesptamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)