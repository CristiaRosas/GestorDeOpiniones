import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";


import { addComment, commentsView, deleteComment, updateComment } from './comments.controller.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'This is not a valid email').not().isEmpty(),
        validarCampos
    ],
    addComment
);

router.get("/", commentsView);


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos  
    ],
    deleteComment
);


router.put(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos 
    ],
    updateComment
);

    

export default router;