import { response } from "express";
import User from '../user/user.model.js';
import Publication from '../publications/publications.model.js';
import Comment from './comments.model.js';

export const addComment = async (req, res) => {
    try {
        const { namePublication, email, comment } = req.body;

        const publication = await Publication.findOne({ namePublication });
        const user = await User.findOne({ email });

        if (!user || !publication) {
            return res.status(404).json({
                succes: false,
                message: user ? 'Publicación no encontrada' : 'Usuario no encontrado'
            });
        }

        const newComment = await Comment.create({
            keeperPublication: publication._id,
            comment,
            keeperUser: user._id,
        });

        await Publication.findByIdAndUpdate(publication._id, {
            $push: { keeperComment: newComment._id }
        });

        res.status(200).json({
            message: "Comentario registrado exitosamente",
            succes: true,
            comment: newComment
        });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al crear comentario', error: error.message });
    }
};

export const commentsView = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    try {
        const comments = await Comment.find(query)
            .populate({ path: 'keeperPublication', match: { state: true }, select: 'namePublication' })
            .populate({ path: 'keeperUser', match: { state: true }, select: 'username' })
            .skip(Number(desde))
            .limit(Number(limite));

        res.status(200).json({ succes: true, total: await Comment.countDocuments(query), comments });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al obtener comentarios', error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ succes: false, message: 'Comentario no encontrado' });

        if (comment.keeperUser.toString() !== req.usuario.id) {
            return res.status(403).json({ succes: false, message: 'No puedes eliminar este comentario' });
        }

        await Comment.findByIdAndUpdate(req.params.id, { state: false });
        res.status(200).json({ succes: true, message: 'Comentario eliminado' });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al eliminar comentario', error: error.message });
    }
};

export const updateComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, namePublication, ...data } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ succes: false, message: 'Comentario no encontrado' });

        if (comment.keeperUser.toString() !== req.usuario.id) {
            return res.status(403).json({ succes: false, message: 'No puedes actualizar este comentario' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ succes: true, msj: 'Comentario actualizado exitosamente', updatedComment });

    } catch (error) {
        res.status(500).json({ succes: false, msj: "Error al actualizar comentario", error: error.message });
    }
};
