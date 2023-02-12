const { response, request} = require('express');


const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [RegistrosEnBd, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    
    ]);

    res.json({
        registrosConsultados,
        RegistrosEnBd,
        usuarios
   });
}
const usuariosPut = async(req, res=response)=> {
    const id =req.params.id;
    const {_id, password, google, ...resto} = req.body;

  
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password =bcryptjs.hashSync(password, salt);
    }

    const  usuario = await Usuario.findByIdAndUpdate(id, resto);
    
    res.json(usuario);
}
const usuariosPost = async (req, res=response)=> {

    const {nombre, correo, password, rol} =req.body;
    const usuario = new Usuario({nombre, correo, password,rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password =bcryptjs.hashSync(password, salt);

    //Guardar en base de datos
    await usuario.save();

    res.json({
       
       usuario
   });
}
const usuariosPatch = (req, res = response)=> {
    res.json({
       msg: 'Patch API - controlador'
   });
}
const usuariosDelete = async(req, res = response)=> {

    const {id} =req.params;

    
    
    //Delete cambiando el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false}, {new:true});

    

    res.json(usuario);
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
}