import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        succes: false,
        msg: 'Demasiadas solicitudes desde esta IP, inténtelo nuevamente después de 15 minutos'
    }
})
export default limiter;