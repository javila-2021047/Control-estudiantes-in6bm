const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Curso = require('../models/curso');
const Usuario = require('../models/usuario');

const getCursos = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query).populate('profesor','nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador Curso',
        listaCursos
    });

}

const postCurso = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const cursoDB = await Curso.findOne({ nombre : body.nombre });

    // Validacion si el curso ya existe
    if(cursoDB){
        return res.status(400).json({
            msg: `El curso ${cursoDB.nombre} ya existe en la DB`
        })
    }

    //Generar la data
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        profesor: req.usuario._id,
    }

    const curso = await Curso(data);

    //Guardar en la DB
    await curso.save();

    res.json({
        msg: 'Post Api - Agregar cursos',
        curso
    });
}


const putCurso = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    //Editar al Curso por el id
    const CursoEditado = await Curso.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'Editar Api - Editar cursos',
        CursoEditado
    });

}

const deleteCurso = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const CursoEliminado = await Curso.findByIdAndDelete( id );
    res.json({
        msg: 'Eliminar Api - Eliminar cursos',
        CursoEliminado
    });
}


module.exports = {
    getCursos,
    postCurso,
    putCurso,
    deleteCurso,
}


// CONTROLADOR