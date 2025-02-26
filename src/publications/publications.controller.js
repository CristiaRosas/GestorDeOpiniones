import { response } from "express";
import Category from '../category/category.model.js';
import User from '../user/user.model.js';
import Publication from './publications.model.js';

export const addPublication = async (req, res) => {
    try {
        const { nameCategory, email, ...data } = req.body;
        const [category, user] = await Promise.all([
            Category.findOne({ nameCategory }),
            User.findOne({ email })
        ]);

        if (!user || !category) {
            return res.status(404).json({
                succes: false,
                message: user ? 'Categoría no encontrada' : 'Usuario no encontrado'
            });
        }

        const publication = await Publication.create({
            keeperCategory: category._id,
            keeperUser: user._id,
            ...data
        });

        res.status(200).json({ succes: true, publication });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al crear publicación', error: error.message });
    }
};

export const publicationsView = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };

        const [publications, total] = await Promise.all([
            Publication.find(query)
                .populate('keeperCategory', 'nameCategory')
                .populate('keeperUser', 'username')
                .skip(Number(desde))
                .limit(Number(limite)),
            Publication.countDocuments(query)
        ]);

        res.status(200).json({ succes: true, total, publications });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al obtener publicaciones', error: error.message });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        if (!publication) return res.status(404).json({ succes: false, message: 'Publicación no encontrada' });

        if (publication.keeperUser.toString() !== req.usuario.id) {
            return res.status(403).json({ succes: false, message: 'No puedes eliminar esta publicación' });
        }

        await Publication.findByIdAndUpdate(req.params.id, { state: false });
        res.status(200).json({ succes: true, message: 'Publicación eliminada' });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al eliminar publicación', error: error.message });
    }
};

export const updatePublication = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, ...data } = req.body;

        const publication = await Publication.findById(id);
        if (!publication) return res.status(404).json({ succes: false, message: 'Publicación no encontrada' });

        if (publication.keeperUser.toString() !== req.usuario.id) {
            return res.status(403).json({ succes: false, message: 'No puedes actualizar esta publicación' });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ succes: true, msg: 'Publicación actualizada exitosamente', updatedPublication });

    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al actualizar publicación', error: error.message });
    }
};
