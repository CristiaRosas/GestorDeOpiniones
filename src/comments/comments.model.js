import {Schema, model} from "mongoose";

const CommentsSchema = Schema({

    keeperPublication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxLength: [200, 'Cant be overcome 100 characters']
    },
    keeperUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Comments', CommentsSchema)