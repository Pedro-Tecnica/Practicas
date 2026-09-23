import { supabase } from '../src/utils/supabaseClient.js';
import { activarBotonesCarrito } from './compra.js';

// Detecta automáticamente la categoría según el nombre del archivo HTML actual
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
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion || ''}</p>
            <h2>Precio: $${producto.precio}</h2>
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