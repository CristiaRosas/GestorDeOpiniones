import User from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const  login = async(req, res) => {
    const {email, password, username} = req.body;

    try {

        const user = await User.findOne({
            $or: [{email}, {username}]
        }) 

        if(!user){
            return res.status(400).json({
                msg: 'Incorrect credentials, Email does not exist in the database'
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: 'The user does not exist in the database'
            });
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'The password is incorrect'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Login successful',
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const registerUser = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User could not register",
            error: error.message
        })
    }
}

const createUserAdmin = async ( name, surname, userame, email, password, role ) => {
    try {

    if (role === "ADMIN_ROLE") {
        const existAdmin = await User.findOne({ role: "ADMIN_ROLE" });
        if (existAdmin) {
            return null;
        };
    };

    const encryptedPassword = await hash(password);

    const newUser = new User({ 
        name, 
        surname, 
        userame, 
        email, 
        password: encryptedPassword, 
        role });
        
        await newUser.save();
        console.log("User created successfully:", newUser);
        return newUser;
        
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

createUserAdmin("Cristian", "Rosas", "Crosas","crosas@gmail.com", "12345678", "ADMIN_ROLE");
