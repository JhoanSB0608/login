import React, { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom'; // Asegúrate de incluir useLoaderData aquí también
import axios from 'axios';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', price: '', image: null });
    const [editIndex, setEditIndex] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Captura el token de la URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Guarda el token en localStorage
            localStorage.setItem('authToken', token);
            fetchUser(token);
        } else {
            const savedToken = localStorage.getItem('authToken');
            if (savedToken) {
                fetchUser(savedToken);
            } else {
                navigate('/'); // Redirige si no hay token
            }
        }
    }, [location, navigate]);

    const fetchUser = async (token) => {
        try {
            const res = await axios.get('http://localhost:3000/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.authenticated) {
                setUser(res.data.user);
            } else {
                console.log(res);
                //navigate('/');
            }
        } catch (error) {
            //console.log(res)
            console.error('Error en la autenticación:', error);
            navigate('/');
        }
    }; // Añadir navigate en el array de dependencias

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editIndex !== null) {
            const updatedProducts = products.map((prod, index) =>
                index === editIndex ? { ...product, image: URL.createObjectURL(product.image) } : prod
            );
            setProducts(updatedProducts);
            setEditIndex(null);
        } else {
            const newProduct = { ...product, image: URL.createObjectURL(product.image) };
            setProducts((prev) => [...prev, newProduct]);
        }
        setProduct({ name: '', price: '', image: null });
    };

    const handleEdit = (index) => {
        setProduct(products[index]);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        setProducts((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="product-manager">
            <h1>Product Manager</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit">{editIndex !== null ? 'Update Product' : 'Add Product'}</button>
            </form>

            <div className="product-list">
                <h2>Product List</h2>
                <ul>
                    {products.map((prod, index) => (
                        <li key={index}>
                            <img src={prod.image} alt={prod.name} width="50" />
                            <p>{prod.name} - ${prod.price}</p>
                            <button onClick={() => handleEdit(index)}>Edit</button>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ... (estilos) */}
        </div>
    );
};

export default ProductManager;
