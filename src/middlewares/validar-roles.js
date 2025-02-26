export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'Se debe verificar un rol sin validar primero el token'
            })
        }
        if (!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                msg: `Usuario no autorizado, tiene un rol ${req.usuario.role}, Los roles autorizados son ${roles}`
            })
        }
        next();
    };
};