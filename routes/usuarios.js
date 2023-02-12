const {Router}=require('express');
const {check}=require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {tieneRole} =require('../middlewares/validar-roles')



const {esRoleValido, CorreoExiste, IdExiste} = require ('../helpers/db-validators')


const { usuariosGet, usuariosPatch, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');




const router = Router();

router.get('/',  usuariosGet);

router.put('/:id',[
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(IdExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);
  

router.post('/', [
    check('nombre', 'El nombre obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(CorreoExiste),
    check('rol').custom(esRoleValido),
    validarCampos   
], usuariosPost);

router.patch('/',  usuariosPatch);

router.delete('/:id',[
    
    validarJWT,
    //esAdminRole,
    tieneRole ('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(IdExiste),
    validarCampos


],  usuariosDelete);


module.exports = router;