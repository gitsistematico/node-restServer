const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        categoriasGet, 
        categoriaGet,
        actualizarCategoria,
        borrarCategoriporId } = require('../controllers/categorias');
const { existeCategoriaporId } = require('../helpers/db-validators');

const { validarCampos,  validarJWT} = require('../middlewares');

const router = Router();
/**
 * 
 * {{url}}/api/categorias
 */

/**
 *  Obtener todas las categorias - publico
 */
router.get('/', categoriasGet)

/**
 *  Obtener todas las categorias opr id- publico
 */
 router.get('/:id',[
            check('id', 'No es un id valido').isMongoId(),
            check('id').custom( existeCategoriaporId ),
            validarCampos,
        ], categoriaGet)

/**
 *  Crear categoria - privado - Cualquier persona con un token válido
 */
 router.post('/', 
            [
                validarJWT,
                check('nombre', 'El nombre es obligatorio por params').not().isEmpty(),
                validarCampos
            ]
            ,crearCategoria)

/**
 * actualizar categoria por id - privado - Cualquier persona con un token válido
 */
 router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio por params').not().isEmpty(),
        check('id').custom( existeCategoriaporId ),
        validarCampos,
    ]
    ,actualizarCategoria)

/**
 * actualizar categoria por id - privado - Cualquier persona con un token válido
 */
 router.delete('/:id', [
        validarJWT,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeCategoriaporId ),
        validarCampos,
    ]
    ,borrarCategoriporId)   

module.exports = router;