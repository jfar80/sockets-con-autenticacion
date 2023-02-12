
const{response} = require ('express');

const {Producto} =require('../models/index');



//obtenerProductos - paginado - total - populate es me mongoouse

const obtenerProductos = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [productosEnBD, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        productosEnBD,
        productos
   });
}


//obtenerProducto - paginado - total - populate es me mongoouse {regresar el objeto de la categoria

const obtenerProducto = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    
    res.json(producto );
}

const crearProducto = async(req, res = response)=> {
   
    const {estado, usuario, ...body }= req.body;

    const productoDB = await Producto.findOne({nombre:body.nombre});

    if (productoDB){
        return res.status(400).json({
            msg:`El Producto ${productoDB.nombre}, ya existe`
        });
    }
        // Generar la data a guardar
        const data ={
            ...body,
            nombre: body.nombre.toUpperCase(), 
            usuario: req.usuario._id
        }
        
        const producto = new Producto(data);

        //guardar db
        await producto.save();

        res.status(201).json(producto);
    
}


// actualizar producto recibe el nombre y cambiarlo si no existe

const actualizarProducto = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    
    if (data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario =req.usuario._id;
    
    const producto=await Producto.findByIdAndUpdate(id, data, {new:true});


    res.json({producto});
}

// borrar producto (desabilitar en la base de datos estado:false)
const borrarProducto = async(req, res=response) => {

    const {id} =req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(productoBorrado);

}



module.exports ={crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto}