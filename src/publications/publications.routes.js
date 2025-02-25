import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";


import { addPublication, publicationsView, deletePublication, updatePublication } from './publications.controller.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'This is not a valid email').not().isEmpty(),
        validarCampos
    ],
    addPublication
);

router.get("/", publicationsView);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos  
    ],
    deletePublication
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos 
    ],
    updatePublication
);
    

export default router;