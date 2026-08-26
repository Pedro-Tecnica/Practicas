let Usuario = [];
document.getElementById('btnRegis').addEventListener('click', () => {

    const nombre = document.getElementById('txtnomb').value.trim();
    const apellido = document.getElementById('txtmat').value.trim();
    const dni = document.getElementById('txtdni').value.trim();
    const direccion = document.getElementById('txtDir').value.trim();
    const telefono = document.getElementById('txttel').value.trim();

    
    if (!nombre || !apellido || !dni || !direccion || !telefono) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    
    const nuevoUsuario = {
    nombre: nombre,
    apellido: apellido,
    DNI: dni,                        
    direccion: direccion,
    telefono: telefono,
    
};

   Usuario.push(nuevoUsuario);

    
    document.getElementById('txtnomb').value = '';
    document.getElementById('txtmat').value = '';
    document.getElementById('txtdni').value = '';
    document.getElementById('txtDir').value = '';
    document.getElementById('txttel').value = '';

    alert('Usuario creado correctamente.');
});

document.getElementById('btnMostrar').addEventListener('click',()=> {
    let div =document.getElementById('alquileresPendientes');
    let tabla =document.createElement('Table');
    let thead =document.createElement('thead');
    let tbody =document.createElement('tbody');
    let filatitulo =document.createElement('tr');

    let thnombre =document.createElement('th');
    thnombre.textContent ='Nombre';

    let thapellido =document.createElement('th');
    thapellido.textContent ='Apellido';

    let thDNI =document.createElement('th');
    thDNI.textContent ='DNI';

    let thdireccion =document.createElement('th');
    thdireccion.textContent ='Dirección';

    let thtelefono =document.createElement('th');
    thtelefono.textContent ='Teléfono';

    let thdisfraz =document.createElement('th');
    thdisfraz.textContent ='Disfraz';

    let thfecha =document.createElement('th');
    thfecha.textContent ='Fecha de Alquiler';

    let thfechaSalida =document.createElement('th');
    thfechaSalida.textContent ='Fecha de Salida';   

    let thcantidad =document.createElement('th');
    thcantidad.textContent ='Cantidad';

    filatitulo.appendChild(thnombre);
    filatitulo.appendChild(thapellido);
    filatitulo.appendChild(thDNI);
    filatitulo.appendChild(thdireccion);
    filatitulo.appendChild(thtelefono);
    filatitulo.appendChild(thdisfraz);
    filatitulo.appendChild(thfecha);
    filatitulo.appendChild(thfechaSalida);
    filatitulo.appendChild(thcantidad);

    thead.appendChild(filatitulo);
    tabla.appendChild(thead);

    Alquilerespend.forEach (alqi =>{
        let filaDetalle =document.createElement('p');
        let tdnombre = document.createElement('th');
        let tdapellido = document.createElement('th');
        let tdDNI = document.createElement('th');
        let tddireccion = document.createElement('th');
        let tdtelefono = document.createElement('th');
        let tddisfraz = document.createElement('th');
        let tdfecha = document.createElement('th');
        let tdfechaSalida = document.createElement('th');
        let tdcantidad = document.createElement('th');

        tdnombre.textContent=alqi.nombre;
        tdapellido.textContent=alqi.apellido;
        tdDNI.textContent=alqi.DNI;
        tddireccion.textContent=alqi.direccion;
        tdtelefono.textContent=alqi.telefono;
        tddisfraz.textContent=alqi.disfraz;
        tdfecha.textContent=alqi.fechaDeAlquiler;
        tdfechaSalida.textContent=alqi.fechaDeSalida;
        tdcantidad.textContent=alqi.cantidad;

        filaDetalle.appendChild(tdnombre);
        filaDetalle.appendChild(tdapellido);
        filaDetalle.appendChild(tdDNI);
        filaDetalle.appendChild(tddireccion);
        filaDetalle.appendChild(tdtelefono);
        filaDetalle.appendChild(tddisfraz);
        filaDetalle.appendChild(tdfecha);
        filaDetalle.appendChild(tdfechaSalida);
        filaDetalle.appendChild(tdcantidad);

        tbody.appendChild(filaDetalle);
        tabla.appendChild(tbody);
        
    })
    div.appendChild(tabla);
});