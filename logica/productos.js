import { supabase } from '../src/utils/supabaseClient.js';
import { activarBotonesCarrito } from './compra.js';

async function cargarProductos(categoria = null) {
    let query = supabase.from('Productos').select('*');
    if (categoria) query = query.eq('categoria', categoria);

    const { data: productos, error } = await query;

    if (error) {
        console.error('Error al cargar productos:', error.message);
        return;
    }

    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    productos.forEach(async producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion || ''}</p>
            <h2>Precio: $${producto.precio}</h2>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>`;
        contenedor.appendChild(div);
    
    const { data: productos, error } = await query;

console.log('Productos recibidos:', productos); 

if (error) {
    console.error('Error al cargar productos:', error.message);
    return;
}

    });

    


    activarBotonesCarrito();
}

cargarProductos(); 