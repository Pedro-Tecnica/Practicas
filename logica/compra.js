import { supabase } from '../src/utils/supabaseClient.js';

export function activarBotonesCarrito() {
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert('Debes iniciar sesión para agregar productos al carrito.');
                window.location.href = 'sesion.html';
                return;
            }

            const productoId = e.currentTarget.dataset.id;
            const usuarioId = session.user.id;

            const { error } = await supabase.from('carrito').insert([
                { producto_id: productoId, usuario_id: usuarioId, cantidad: 1 }
            ]);

            if (error) {
                console.error('Error al agregar al carrito:', error.message);
                alert('Hubo un error al guardar el producto.');
            } else {
                alert('¡Producto agregado al carrito exitosamente!');
            }
        });
    });
}