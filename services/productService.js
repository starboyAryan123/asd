const productDatabase = require("../database/productDatabase");

async function getProducts() {
    return productDatabase.readProducts();
}

async function getProductById(id) {
    const products = await productDatabase.readProducts();
    return products.find((product) => product.id === Number(id));
}

async function createProduct(productData) {
    const products = await productDatabase.readProducts();
    const nextId = products.reduce((highestId, product) => Math.max(highestId, product.id), 0) + 1;
    const product = { id: nextId, ...productData };
    await productDatabase.writeProducts([...products, product]);
    return product;
}

async function replaceProduct(id, productData) {
    const products = await productDatabase.readProducts();
    const index = products.findIndex((product) => product.id === Number(id));
    if (index === -1) return undefined;
    const product = { id: Number(id), ...productData };
    products[index] = product;
    await productDatabase.writeProducts(products);
    return product;
}

async function updateProduct(id, productData) {
    const products = await productDatabase.readProducts();
    const index = products.findIndex((product) => product.id === Number(id));
    if (index === -1) return undefined;
    products[index] = { ...products[index], ...productData, id: Number(id) };
    await productDatabase.writeProducts(products);
    return products[index];
}

async function deleteProduct(id) {
    const products = await productDatabase.readProducts();
    const filteredProducts = products.filter((product) => product.id !== Number(id));
    if (filteredProducts.length === products.length) return false;
    await productDatabase.writeProducts(filteredProducts);
    return true;
}

module.exports = { getProducts, getProductById, createProduct, replaceProduct, updateProduct, deleteProduct };