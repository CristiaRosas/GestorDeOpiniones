import { response } from "express";
import Category from './category.model.js';
import User from '../user/user.model.js';
import Publication from '../publications/publications.model.js';

const createCategory = async (nameCategory, descriptionCategory, state) => {
    try {
        if (nameCategory === "Noticias" && await Category.exists({ nameCategory: "Noticias" })) {
            console.log(`The named category ${nameCategory} already exists. New one cannot be created.`);
            return null;
        }

        const newCategory = new Category({ nameCategory, descriptionCategory, state });
        await newCategory.save();
        console.log("Category created successfully:", newCategory);
        return newCategory;
    } catch (error) {
        console.error("Error creating category:", error);
        return null;
    }
};

export const addCategory = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({ succes: false, message: 'User not found', error: error.message });
        }

        const category = new Category({ ...data, keeper: user._id });
        await category.save();

        res.status(200).json({ succes: true, category });
    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error creating category', error: error.message });
    }
};

export const categoryView = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    try {
        const category = await Category.find(query)
    .populate('keeper', 'name email _id') 
    .skip(Number(desde))
    .limit(Number(limite));


    const total = await Category.countDocuments(query);

    res.status(200).json({ succes: true, total, category });
    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al obtener las categorías', error: error.message });
    }
    };
    
    export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndUpdate(id, { state: false });
        res.status(200).json({ succes: true, message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ succes: false, msg: 'Error al eliminar la categoría', error: error.message });
    }
    };
    

export const updateCategory = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, ...data} = req.body;

        const category = await Category.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Curso actualizado con exito',
            category
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error al actualizar el curso",
            error: error.message
        })
    }
} 
