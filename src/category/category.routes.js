import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

import { addCategory, categoryView, deleteCategory, updateCategory } from './category.controller.js'

const router = Router();

router.post(
    "/",
    [

        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('email', 'Este no es un correo válido').not().isEmpty(),
        validarCampos

    ],
    addCategory
)

router.get("/", categoryView)

router.delete(
    "/:id",
    [

        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos      

    ],
    deleteCategory
)

router.put(
    "/:id",
    [

        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
        
    ],
    updateCategory
)

export default router;
