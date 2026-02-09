const API_URL = 'https://fakestoreapi.com/products';


const productList = document.getElementById('productList');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');
const form = document.getElementById('productForm');
const searchInput = document.getElementById('search');
const formTitle = document.getElementById('formTitle');


let products = [];


async function fetchProducts() {
loading.style.display = 'block';
try {
const res = await fetch(API_URL);
products = await res.json();
renderProducts(products);
} catch (err) {
errorBox.textContent = 'Failed to load products';
} finally {
loading.style.display = 'none';
}
}

function renderProducts(data) {
productList.innerHTML = '';
data.forEach(p => {
const card = document.createElement('div');
card.className = 'card';
card.innerHTML = `
<img src="${p.image}" />
<h3>${p.title}</h3>
<p>₹${p.price}</p>
<p>${p.category}</p>
<div class="actions">
<button class="edit">Edit</button>
<button class="delete">Delete</button>
</div>`;
card.querySelector('.edit').onclick = () => loadForEdit(p);
card.querySelector('.delete').onclick = () => deleteProduct(p.id, card);
productList.appendChild(card);
});
}


form.addEventListener('submit', async (e) => {
e.preventDefault();
const id = productId.value;


const product = {
title: title.value,
price: price.value,
category: category.value,
image: image.value,
description: description.value
};


if (id) {
await fetch(`${API_URL}/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(product)
});
products = products.map(p => p.id == id ? { ...p, ...product } : p);
} else {
const res = await fetch(API_URL, {
    method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(product)
});
const newProduct = await res.json();
products.push(newProduct);
}   
form.reset();
productId.value = '';
formTitle.textContent = 'Add New Product';
renderProducts(products);
});


function loadForEdit(p) {
formTitle.textContent = 'Update Product';
productId.value = p.id;
title.value = p.title;
price.value = p.price;
category.value = p.category;
image.value = p.image;
description.value = p.description;
}


async function deleteProduct(id, card) {
await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
products = products.filter(p => p.id !== id);
card.remove();
}
searchInput.addEventListener('input', (e) => {
const query = e.target.value.toLowerCase();
const filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
renderProducts(filtered);
});

fetchProducts();