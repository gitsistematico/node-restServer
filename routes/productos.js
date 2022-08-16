const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos } = require('../middlewares');

const { productosGet,productoGet, crearProducto, actualizarProducto, borrarProductoporId } = require('../controllers/productos');
const { existeProductoId, existeCategoriaporId, esRolValido } = require('../helpers/db-validators');

const router = Router();


/**
 *  Obtener todas las prodcuto - publico
 */
 router.get('/', productosGet);

 /**
 *  Obtener todas las categorias opr id- publico
 */
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos,
], productoGet)

/**
 *  Crear prodcuto - privado - Cualquier persona con un token válido
 */
router.post('/',[
                validarJWT,
                check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                check('idCategoria', 'No es un id valido').isMongoId(),
                check('idCategoria').custom( existeCategoriaporId ),
                validarCampos,
            ],
            crearProducto);

/**
 * actualizar prodcuto por id - privado - Cualquier persona con un token válido
 */
 router.put('/:id', [
    validarJWT,    
    // check('categoria', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos,
]
,actualizarProducto)            

/**
 * actualizar prodcuto por id - privado - Cualquier persona con un token válido
 */
 router.delete('/:id', [
    validarJWT,
    // esRolValido,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos,
]
,borrarProductoporId)   

module.exports = router;