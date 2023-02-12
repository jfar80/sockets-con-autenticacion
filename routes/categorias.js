const {Router}=require('express');
const {check}=require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');



const router = Router();

//optener todas las categorias - publico
router.get('/', obtenerCategorias);

//optener una categoria por id - publico 

router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos], obtenerCategoria);
   

//crear una categoria - privado - cualquier rol, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    validarCampos 
    ], crearCategoria); 


//actualizar un registro por este id
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('id').custom(existeCategoriaPorId),
    validarCampos
    ], actualizarCategoria);


//Eliminar un registro por este id - cualquiera con token valido


//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
    ], borrarCategoria);


module.exports = router;