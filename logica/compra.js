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

            // 1. Traer el stock disponible del producto
            const { data: producto, error: errorProducto } = await supabase
                .from('Productos')
                .select('cantidad')
                .eq('id', productoId)
                .single();

            if (errorProducto || !producto) {
                console.error('Error al consultar stock:', errorProducto?.message);
                alert('No se pudo verificar el stock del producto.');
                return;
            }

            // 2. Ver si el usuario ya tiene este producto en su carrito
            const { data: itemExistente, error: errorItem } = await supabase
                .from('carrito')
                .select('id, cantidad')
                .eq('usuario_id', usuarioId)
                .eq('producto_id', productoId)
                .maybeSingle();

            if (errorItem) {
                console.error('Error al revisar el carrito:', errorItem.message);
                return;
            }

            const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
            const nuevaCantidad = cantidadActualEnCarrito + 1;

            // 3. Verificar contra el stock disponible
            if (nuevaCantidad > producto.cantidad) {
                alert(`Solo hay ${producto.cantidad} unidades disponibles de este producto.`);
                return;
            }

            // 4. Insertar si no existía, o actualizar la cantidad si ya estaba
            let error;
            if (itemExistente) {
                ({ error } = await supabase
                    .from('carrito')
                    .update({ cantidad: nuevaCantidad })
                    .eq('id', itemExistente.id));
            } else {
                ({ error } = await supabase
                    .from('carrito')
                    .insert([{ producto_id: productoId, usuario_id: usuarioId, cantidad: 1 }]));
            }

            if (error) {
                console.error('Error al agregar al carrito:', error.message);
                alert('Hubo un error al guardar el producto.');
            } else {
                alert('¡Producto agregado al carrito exitosamente!');
            }
        });
    });
}