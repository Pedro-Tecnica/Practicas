import { supabase } from '../src/utils/supabaseClient.js';

async function cargarCarrito() {
    const { data: { session } } = await supabase.auth.getSession();
    const contenedor = document.getElementById('lista-carrito');

    if (!contenedor) return;

    if (!session) {
        contenedor.innerHTML = '<p>Debes iniciar sesión para ver tu carrito.</p>';
        return;
    }

    const { data: items, error } = await supabase
        .from('carrito')
        .select(`
            id,
            cantidad,
            producto_id,
            Productos ( nombre, precio, imagen )
        `)
        .eq('usuario_id', session.user.id);

    if (error) {
        console.error('Error al cargar el carrito:', error.message);
        contenedor.innerHTML = '<p>Hubo un error al cargar tu carrito.</p>';
        return;
    }

    contenedor.innerHTML = '';

    if (!items || items.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    let total = 0;

    items.forEach(item => {
        const producto = item.Productos;
        if (!producto) return; // por si el producto fue borrado

        total += producto.precio * item.cantidad;

        const div = document.createElement('div');
        div.classList.add('item-carrito');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info-item">
                <h3>${producto.nombre}</h3>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Precio: $${producto.precio}</p>
            </div>
            <button data-id="${item.id}" class="btn-quitar">Quitar</button>
        `;
        contenedor.appendChild(div);
    });

    const totalEl = document.getElementById('total-carrito');
    if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', async () => {
            await supabase.from('carrito').delete().eq('id', btn.dataset.id);
            cargarCarrito();
        });
    });
}

cargarCarrito();