import { response } from "express";
//import Category from '../category/category.model.js';
import User from '../user/user.model.js';
import Publication from './publications.model.js'

export const addPublication = async (req, res) => {
    try {
        
        const data = req.body;

        const category = await Category.findOne({nameCategory: data.nameCategory});
        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: ' User not found ',
                error: error.message
            })
        }if(!category){
            return res.status(404).json({
                succes: false,
                message: ' Category not found ',
                error: error.message
            })
        }

        const publication = new Publication({
            keeperCategory: category._id,
            ...data,
            keeperUser: user._id,
        });

        await publication.save();

        res.status(200).json({
            succes: true,
            publication
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: ' Error creating publication ',
            error: error.message
        })
    }
}

export const publicationsView = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state: true};

    try {
        

        const publications = await Publication.find(query)
            .populate('keeperCategory', 'nameCategory')
            .populate('keeperUser', 'username')
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Publication.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            publications
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting publications',
            error: error.message
        })
    }
} 

export const deletePublication = async (req, res) => {

    const { id } = req.params;

    try {
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                succes: false,
                message: 'Publication not found'
            });
        }

        if (publication.keeperUser.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'This post is not yours, so you cannot deleted it.'
            });
        }

        await Publication.findByIdAndUpdate(id, {state: false});

        res.status(200).json({
            succes: true,
            message: 'Publication deleted'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error deleting publication',
            error: error.message
        })
    }
}


export const updatePublication = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, email, ...data} = req.body;
        const publication1 = await Publication.findById(id);

        if (!publication1) {
            return res.status(404).json({
                succes: false,
                message: 'Publication not found'
            });
        }

        if (publication1.keeperUser.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'This post is not yours, so you cannot update it.'
            });
        }

        const publication = await Publication.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Publication updated successfully',
            publication
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating publication",
            error: error.message
        })
    }
} 