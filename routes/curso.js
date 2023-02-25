//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getCursos, postCurso, putCurso, deleteCurso } = require('../controllers/cursos');
const { esRoleValido, emailExiste, existeUsuarioPorId, existeCursoPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar/cursos', getCursos);

router.post('/agregar/curso', [
    validarJWT,
    tieneRole('MAESTRO_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
] ,postCurso);

router.put('/editar/curso/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
] ,putCurso);


router.delete('/eliminar/curso/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('MAESTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
] ,deleteCurso);


module.exports = router;


// ROUTES