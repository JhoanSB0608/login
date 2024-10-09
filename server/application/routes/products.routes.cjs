const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN'
    if (!token) return res.status(403).send('Token es requerido');

    jwt.verify(token, process.env.KEY_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user; // Almacena la información del usuario en la solicitud
        next();
    });
};

// Rutas de productos

// Agregar un nuevo producto
router.post('/', verifyToken, (req, res) => {
    const { name, description, price, image } = req.body;
    // Lógica para agregar un producto en la base de datos
    // Ejemplo: Product.create({ name, description, price, image })
    res.status(201).json({ message: 'Producto creado exitosamente' });
});

// Obtener todos los productos
router.get('/', (req, res) => {
    // Lógica para obtener todos los productos de la base de datos
    // Ejemplo: const products = await Product.find();
    res.json({ message: 'Lista de productos' });
});

// Actualizar un producto por ID
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    // Lógica para actualizar el producto en la base de datos
    // Ejemplo: await Product.updateOne({ _id: id }, { name, description, price, image })
    res.json({ message: 'Producto actualizado exitosamente' });
});

// Eliminar un producto por ID
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    // Lógica para eliminar el producto de la base de datos
    // Ejemplo: await Product.deleteOne({ _id: id })
    res.json({ message: 'Producto eliminado exitosamente' });
});

module.exports = router;
