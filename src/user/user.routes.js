import {Router} from "express";
import {check} from "express-validator";
import { updateUser, passwordUpdate, getUserById, getUsers} from './user.controller.js';
import {existeUsuarioById} from '../helpers/db.validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';

const router = Router();

router.get("/", getUsers);

router.get(
    "/BuscarUser/:id",
    [
        check("id", "No es un id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        check("id", "No es valido el Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/passwordUpdate/:id",
    [
        check("id", "No es un id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    passwordUpdate
) 

export default router;