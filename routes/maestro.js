//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { postMaestro, putMaestro, deleteMaestro, getMaestro } = require('../controllers/maestro');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar/maestro', getMaestro);

router.post('/agregar/maestro', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'PROFESOR_ROLE']),
    // check('rol').custom(  esRoleValido ),
    validarCampos,
] ,postMaestro);

router.put('/editar/maestro/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    // check('rol').custom(  esRoleValido ),
    validarCampos
] ,putMaestro);


router.delete('/eliminar/maestro/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('MAESTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteMaestro);


module.exports = router;


// ROUTES