import {Schema, model} from "mongoose";

const CategorySchema = Schema({
    nameCategory: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        maxLength: [35, 'No puede superar los 35 caracteres']
    },

    descriptionCategory: {
        type: String,
        required: [true, 'La descripción de la categoría es obligatoria'],
        maxLength: [100, 'No puede superar los 100 caracteres']
        
    },
    
    keeper: {
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


export default model('Category', CategorySchema)