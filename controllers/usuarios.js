const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
           .skip(Number(desde))
           .limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();
  res.json({
    usuario,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const uid = req.uid;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  // Usuario Autenticado
  // const usuarioAutentucado = req.usuarioAuth;

  res.json({
    usuario,
  });
};

const usuariosPatch = (req = request, res = response) => {
  res.json({
    msg: "get Patch *- controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
