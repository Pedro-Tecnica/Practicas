import { supabase } from '../src/utils/supabaseClient.js';

const form = document.getElementById('form-vender');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        alert('Debes iniciar sesión para publicar un producto.');
        window.location.href = 'sesion.html';
        return;
    }

    const nombre = document.getElementById('vnombre').value.trim();
    const descripcion = document.getElementById('vdescripcion').value.trim();
    const precio = parseFloat(document.getElementById('vprecio').value);
    const cantidad = parseInt(document.getElementById('vcantidad').value, 10);
    const categoria = document.getElementById('vcategoria').value;
    const archivo = document.getElementById('vimagen').files[0];

    if (!nombre || !(precio > 0) || !(cantidad >= 1) || !archivo) {
        alert('Completá todos los campos correctamente.');
        return;
    }
    if (!archivo.type.startsWith('image/') || archivo.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser un archivo de imagen de hasta 2 MB.');
        return;
    }

    // 1. Subir la imagen a la carpeta del usuario
    const extension = archivo.name.split('.').pop();
    const ruta = `${session.user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: errorSubida } = await supabase.storage.from('productos').upload(ruta, archivo);
    if (errorSubida) {
        console.error('Error al subir la imagen:', errorSubida.message);
        alert('No se pudo subir la imagen.');
        return;
    }

    const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(ruta);

    // 2. Guardar el producto (vendedor_id se completa solo con auth.uid())
    const { error } = await supabase.from('Productos').insert([
        { nombre, descripcion, precio, cantidad, categoria, imagen: publicUrl }
    ]);

    if (error) {
        console.error('Error al publicar:', error.message);
        await supabase.storage.from('productos').remove([ruta]); // no dejar la imagen huérfana
        alert('No se pudo publicar el producto: ' + error.message);
        return;
    }

    alert('¡Producto publicado!');
    form.reset();
});