import { supabase } from '../src/utils/supabaseClient.js';
import { actualizarSaldo } from './saldo.js';

const formRegistro = document.getElementById('form-registro');
const btnIniciar = document.getElementById('btnIniciar');
const btnLogout = document.getElementById('btn-logout');

if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('txtnomb').value.trim();
    const mail = document.getElementById('txtmail').value.trim();
    const contraseña = document.getElementById('txtcontra').value;
    const dni = document.getElementById('txtdni').value.trim();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: mail,
      password: contraseña,
    });

    if (authError) {
      console.error('Error al registrar usuario:', authError.message);
      alert('Ocurrió un error al registrarte: ' + authError.message);
      return;
    }

    const { error: clienteError } = await supabase.from('Clientes').insert([
      {
        nombre,
        mail,
        contraseña,
        dni: parseInt(dni, 10),
      },
    ]);

    if (clienteError) {
      console.error('Error al guardar los datos del cliente:', clienteError.message);
      alert('La cuenta se creó, pero no se pudieron guardar tus datos: ' + clienteError.message);
      return;
    }

    alert(authData.session ? '¡Registro exitoso!' : '¡Registro exitoso! Revisa tu correo para confirmar la cuenta.');
    formRegistro.reset();
  });
}

if (btnIniciar) {
  btnIniciar.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('txtmail').value.trim();
    const password = document.getElementById('txtcontra').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      return;
    }

    alert('Sesión iniciada correctamente');
  });
}

async function comprobarEstadoUsuario(session) {
  if (typeof session === 'undefined') {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  const formulario = document.getElementById('formulario1');
  const formularioInicio = document.getElementById('formulario2');
  const vistaLogeado = document.getElementById('vistalogeado');
  const mensajeBienvenida = document.getElementById('mensaje-bienvenida');

  if (session) {
    if (formulario) formulario.style.display = 'none';
    if (formularioInicio) formularioInicio.style.display = 'none';
    if (vistaLogeado) vistaLogeado.style.display = 'block';

    if (mensajeBienvenida) {
      const { data: cliente, error } = await supabase
        .from('Clientes')
        .select('nombre')
        .eq('mail', session.user.email)
        .maybeSingle();

      if (error) {
        console.error('Error al cargar los datos del cliente:', error.message);
      }

      mensajeBienvenida.textContent = `Hola, ${cliente?.nombre || session.user.email}`;
    
      actualizarSaldo();
    }
  } else {
    if (formulario) formulario.style.display = 'block';
    if (formularioInicio) formularioInicio.style.display = 'block';
    if (vistaLogeado) vistaLogeado.style.display = 'none';

     console.log('saldo consultado:', data, error);
  }
}

supabase.auth.onAuthStateChange((_event, session) => {
  comprobarEstadoUsuario(session);
});

comprobarEstadoUsuario();

if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('No se pudo cerrar la sesión: ' + error.message);
      return;
    }

    alert('Sesión cerrada correctamente');
  });
}


async function mostrarSaldo() {
  const { data: { session } } = await supabase.auth.getSession();
  const saldoEl = document.getElementById('saldo-actual');
  if (!session || !saldoEl) return;

  const { data, error } = await supabase
    .from('saldo_usuario')
    .select('saldo')
    .eq('usuario_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener saldo:', error.message);
    return;
  }

  saldoEl.textContent = `$${(data?.saldo ?? 0).toFixed(2)}`;
}

const btnAgregarSaldo = document.getElementById('btnagregarsaldo');

if (btnAgregarSaldo) {
  btnAgregarSaldo.addEventListener('click', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Debes iniciar sesión para agregar saldo.');
      return;
    }

    const monto = parseFloat(document.getElementById('monto-agregar').value);
    if (!monto || monto <= 0) {
      alert('Ingresá un monto válido.');
      return;
    }

    const { data, error } = await supabase.rpc('agregar_saldo', {
      p_usuario_id: session.user.id,
      p_monto: monto,
    });

    if (error) {
      console.error('Error al agregar saldo:', error.message);
      alert('No se pudo agregar el saldo.');
      return;
    }

    alert(`¡Saldo agregado! Nuevo saldo: $${data.toFixed(2)}`);
    document.getElementById('monto-agregar').value = '';
    mostrarSaldo();
  });
}