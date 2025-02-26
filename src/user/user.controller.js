import { response } from "express";
import {hash, verify} from "argon2";
import User from './user.model.js';


export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
 
        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
    
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                succes: false,
                msg: 'Usuario no encontrado',
                error: error.message
            })
        }
        
        res.status(200).json({
            succes: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error al obtener el usuario',
            error: error.message
        })
    }
}


export const updateUser = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, password, email, ...data} = req.body;

        if(password){
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Usuario actualizado con éxito',
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error al actualizar el usuario',
            error: error.message
        })
    }
}

export const passwordUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { passwordOld, passwordNew } = req.body;
        const user = await User.findById(id);

        const validPassword = await verify(user.password, passwordOld);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'La contraseña actual es incorrecta',
                error: error.message
            });
        }

        if(passwordNew){
            const passwordUpdate = await hash(passwordNew)
            await User.findByIdAndUpdate(id, { password: passwordUpdate });
        };


        res.status(200).json({
            success: true,
            msg: 'La contraseña se actualizó correctamente',
            error: error.message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo actualizar la contraseña',
            error: error.message
        });
    }
};