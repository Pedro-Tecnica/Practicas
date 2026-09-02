import { supabase } from '../src/utils/supabaseClient.js';

document.querySelectorAll('.btn-agregar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            window.location.href = 'sesion.html';
            return;
        }

      
        const productoId = session.productoId; // Asegúrate de que el productoId esté disponible en el contexto adecuado
        const usuarioId = session.user.id;


        const { data, error } = await supabase.from('Productos').insert([
            { producto_id: productoId, usuario_id: usuarioId }
        ]); 

        if (error) {
            console.error('Error al agregar al carrito:', error.message);
            alert('Hubo un error al guardar el producto.');
        } else {
            alert('¡Producto agregado al carrito exitosamente!');
        }
    });
});