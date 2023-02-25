//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { postAlumno, putAlumno, getAlumno, deleteAlumno } = require('../controllers/alumno');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar/alumno', getAlumno);

router.post('/agregar/alumno', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol').custom(  esRoleValido ),
    validarCampos,
] ,postAlumno);

router.put('/editar/alumno/:id', [
    validarJWT,
    tieneRole('ALUMNO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    // check('rol').custom(  esRoleValido ),
    validarCampos
] ,putAlumno);


router.delete('/eliminar/alumno/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ALUMNO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteAlumno);


module.exports = router;


// ROUTES