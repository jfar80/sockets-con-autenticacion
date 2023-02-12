const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { DefaultTransporter } = require('google-auth-library');

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try{

        //verificar si el Email existe
        const usuario = await Usuario.findOne({correo});
        
        if ( !usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Verificar usuario Activo
        if ( !usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if ( !validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id );



        res.json({
            usuario,
            token
        })

    } catch (error){
        console.log(error);
        return res.status(500).json({
            msg:' Hable con el Administrador'
        })
    }

   
}

const googleSignIn =async(req, res=response)=>{
    const {id_token} = req.body;

    try{
        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if(!usuario){
            const data = {
                nombre,
                correo,
                rol:"USER_ROLE",
                password:':p',
                
                img,
                google:true
                
            };
            usuario = new Usuario (data);
            await usuario.save();

        }

        // Si el usuario en BD
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token        
        });
        
    }catch (error){
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }

    
    
}
module.exports ={
    login,
    googleSignIn

};