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
            message: "Error getting user",
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
                msg: 'User not found',
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
            msj: 'Error getting user',
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
            msj: 'User updated successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error updating user',
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
                msg: 'The current password is incorrect',
                error: error.message
            });
        }

        if(passwordNew){
            const passwordUpdate = await hash(passwordNew)
            await User.findByIdAndUpdate(id, { password: passwordUpdate });
        };


        res.status(200).json({
            success: true,
            msg: 'Password updating successfully',
            error: error.message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Failed to update password',
            error: error.message
        });
    }
};