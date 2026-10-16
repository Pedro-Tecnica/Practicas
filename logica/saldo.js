import { supabase } from '../src/utils/supabaseClient.js';

export async function actualizarSaldo() {
  const elementos = document.querySelectorAll('.saldo-actual');
  const contenedor = document.getElementById('saldo-cabecera');
  if (elementos.length === 0) return;

  const { data: { session } } = await supabase.auth.getSession();

  // Sin sesión, se oculta el saldo del encabezado
  if (!session) {
    if (contenedor) contenedor.hidden = true;
    return;
  }

  const { data, error } = await supabase
    .from('saldo_usuario')
    .select('saldo')
    .eq('usuario_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener saldo:', error.message);
    return;
  }

  const texto = `$${Number(data?.saldo ?? 0).toFixed(2)}`;
  elementos.forEach(el => { el.textContent = texto; });
  if (contenedor) contenedor.hidden = false;
}

actualizarSaldo();

// Se actualiza solo al iniciar o cerrar sesión
supabase.auth.onAuthStateChange(() => {
  setTimeout(actualizarSaldo, 0); // el setTimeout evita bloqueos dentro del listener de Supabase
});