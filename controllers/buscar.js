const { response } = require("express");
const {ObjectId} = require("mongoose").Types;

const { Usuario, Categoria, Producto} = require('../models');



const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]


const buscarUsuarios = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino); //true

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:(usuario) ? [ usuario ] : []
        })
    }  

    const regex = new RegExp(termino, 'i');

    const total = await Usuario.count({ 
        $or:[{nombre:regex}, {correo:regex}],
        $and:[{estado: true}]
        
    });
    const usuarios = await Usuario.find({ 
        $or:[{nombre:regex}, {correo:regex}],
        $and:[{estado: true}]
        
    });

    res.json({
        results: total, usuarios
    })
};

const buscarCategorias = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino); //true

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results:(categoria) ? [ usuario ] : []
        })
    }  

    const regex = new RegExp(termino, 'i');

    const total = await Categoria.count({ 
        $or:[{nombre:regex}],
        $and:[{estado: true}]
        
    });
    const categorias = await Categoria.find({nombre:regex})
       
        
    

    res.json({
        results: total, categorias
    });
}

const buscarProductos = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid(termino); //true

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results:(producto) ? [ producto ] : []
        });
    }  

    const regex = new RegExp(termino, 'i');

    const total = await Producto.count({nombre:regex, disponible: true})
        
    const productos = await Producto.find({nombre:regex, disponible:true})
                                    .populate('categoria', 'nombre')
    res.json({
        results: total, productos
    });
}

const buscar = (req, res = response)=>{

    const {coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }


    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
        default:
            res.status(500).json({
                msg:'Se me olvido hacer la busqyeda'
            });
    }
}; 
   

module.exports = {buscar};