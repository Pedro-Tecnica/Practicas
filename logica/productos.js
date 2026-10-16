import { supabase } from '../src/utils/supabaseClient.js';
import { activarBotonesCarrito } from './compra.js';


function esc(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// Detecta la categoría según el nombre del archivo HTML
const pagina = window.location.pathname.split('/').pop();
const categoriasPorPagina = {
    'cocina.html': 'cocina',
    'gaming.html': 'gaming',
    'deportes.html': 'deportes',
};
const categoriaActual = categoriasPorPagina[pagina] || null;

async function cargarProductos(categoria = categoriaActual, textoBusqueda = '') {
    let query = supabase.from('Productos').select('*');

    if (categoria) query = query.eq('categoria', categoria);
    if (textoBusqueda.trim() !== '') {
        query = query.ilike('nombre', `%${textoBusqueda.trim()}%`);
    }

    const { data: productos, error } = await query;

    if (error) {
        console.error('Error al cargar productos:', error.message);
        return;
    }

    const contenedor = document.getElementById('productos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3 class="nombre-producto">${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion || ''}</p>
            <h2 class="precio">Precio: $${producto.precio}</h2>
            <h3 class="stock">Stock: ${producto.cantidad}</h3>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>`;
        contenedor.appendChild(div);
    });

    activarBotonesCarrito();
}

cargarProductos();

const inputBuscador = document.getElementById('buscador');

if (inputBuscador) {
    let temporizador;

    inputBuscador.addEventListener('input', (e) => {
        clearTimeout(temporizador);
        const texto = e.target.value;

        temporizador = setTimeout(() => {
            cargarProductos(categoriaActual, texto);
        }, 300);
    });
}