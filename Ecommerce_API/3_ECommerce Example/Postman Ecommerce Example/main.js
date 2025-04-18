const express = require('express');
const app = express();
app.use(express.json());

let products = [
    { id: 1, name: "Laptop", price: 1000, stock: 10, description: "High-performance laptop" },
    { id: 2, name: "Phone", price: 500, stock: 20, description: "Latest smartphone" }
];

let orders = [];
let users = [];

// Get all products
app.get('/products', (req, res) => {
    res.json(products);
});

// Get product details
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send("Product not found");
    }
});

// Add product to cart
let cart = [];
app.post('/cart', (req, res) => {
    const product = products.find(p => p.id === req.body.productId);
    if (product && product.stock >= req.body.quantity) {
        cart.push({ productId: product.id, quantity: req.body.quantity });
        product.stock -= req.body.quantity;
        res.status(201).json(cart);
    } else {
        res.status(400).send("Product unavailable or insufficient stock");
    }
});

// View cart
app.get('/cart', (req, res) => {
    const cartDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, productName: product.name, price: product.price };
    });
    res.json(cartDetails);
});

// Place an order
app.post('/orders', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        userId: req.body.userId,
        items: cart,
        totalAmount: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + product.price * item.quantity;
        }, 0)
    };
    orders.push(newOrder);
    cart = []; // Empty the cart after order placement
    res.status(201).json(newOrder);
});

// View orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

// Add a new user
app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(3001, () => console.log('E-commerce API is running on http://localhost:3001'));
