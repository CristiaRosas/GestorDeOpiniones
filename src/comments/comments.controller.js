import { response } from "express";
import User from '../user/user.model.js';
import Publication from '../publications/publications.model.js';
import Comment from './comments.model.js'

export const addComment = async (req, res) => {
    try {
        
        const data = req.body;

        const plubication = await Publication.findOne({namePublication: data.namePublication});
        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'User not found',
                error: error.message
            })
        }if(!plubication){
            return res.status(404).json({
                succes: false,
                message: 'plubication not found',
                error: error.message
            })
        }

        const comment = new Comment({
            keeperPublication: plubication._id,
            ...data,
            keeperUser: user._id,
        });

        await comment.save();

        res.status(200).json({
            succes: true,
            comment
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating comment',
            error: error.message
        })
    }
}

export const commentsView = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state: true};

    try {
        

        const comment = await Comment.find(query)
            .populate({path: 'keeperPublication', match: { state: true }, select: 'namePublication' })
            .populate({path: 'keeperUser', match: { state: true }, select: 'username' })
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Comment.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            comment
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting somment',
            error: error.message
        })
    }
} 

export const deleteComment = async (req, res) => {

    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                succes: false,
                message: 'Comment not found'
            });
        }

        if (comment.keeperUser.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'This comment is not yours, so you cannot deleted it.'
            });
        }

        await Comment.findByIdAndUpdate(id, {state: false});

        res.status(200).json({
            succes: true,
            message: 'Comment deleted'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error deleting comment',
            error: error.message
        })
    }
}


export const updateComment = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, email, namePublication, ...data} = req.body;
        const comment1 = await Comment.findById(id);

        if (!comment1) {
            return res.status(404).json({
                succes: false,
                message: 'Comment not found'
            });
        }

        if (comment1.keeperUser.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'This comment is not yours, so you cannot update it.'
            });
        }

        const comment = await Comment.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Comment updated successfully',
            comment
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating comment",
            error: error.message
        })
    }
}  