import { supabase } from './src/utils/supabaseClient.js';

const formRegistro = document.getElementById('form-registro');


if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue
  

  // 1. Obtener los valores ingresados por el usuario
  const nombre = document.getElementById('txtnomb').value;
  const mail = document.getElementById('txtmail').value;
  const contraseña = document.getElementById('txtcontra').value;
  const dni = document.getElementById('txtdni').value;

  // 2. Insertar los datos en la tabla de Supabase
  const { data, error } = await supabase
    .from('Clientes') // Reemplaza 'usuarios' por el nombre exacto de tu tabla en Supabase
    .insert([
      { 
        nombre: nombre,
        mail: mail,
        contraseña: contraseña,
        dni: parseInt(dni) // Si la columna 'dni' en Supabase es de tipo número (int8)
      }
    ]);

  // 3. Manejar la respuesta
  if (error) {
    console.error('Error al registrar usuario:', error.message);
    alert('Ocurrió un error al registrarte: ' + error.message);
  } else {
    alert('¡Registro exitoso!');
    formRegistro.reset(); // Limpia el formulario
    // Opcional: Redirigir al usuario al inicio de sesión
    // window.location.href = './sesion.html';
  }
}
  )};