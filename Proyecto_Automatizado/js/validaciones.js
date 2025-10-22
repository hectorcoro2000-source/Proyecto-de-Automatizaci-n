// ===============================================
// 1. CONFIGURACIÓN Y DECLARACIÓN DE VARIABLES
// ===============================================

// Referencias a elementos del DOM (Login y Global)
const formulario = document.getElementById('loginFormulario');
const campoCorreo = document.getElementById('username');
const campoContrasena = document.getElementById('password');
const contenedorSugerencia = document.getElementById('contenedorSugerencia'); 
const toastContainer = document.getElementById('toast-container'); 

// Referencias a elementos del DOM (Registro Modal)
const btnRegistro = document.getElementById('btnRegistro');
const registroModal = document.getElementById('registroModal');
const btnCerrarRegistro = document.getElementById('cerrarRegistro');
const btnConfirmarRegistro = document.getElementById('btnConfirmarRegistro');
const regCampoCorreo = document.getElementById('reg_correo');
const regCampoContrasena = document.getElementById('reg_contrasena');

// Referencias a elementos del DOM (Cambiar Contraseña Modal - ACTUALIZADAS)
const btnCambiarPass = document.getElementById('btnCambiarPass');
const cambiarPassModal = document.getElementById('cambiarPassModal');
const btnCerrarCambiarPass = document.getElementById('cerrarCambiarPass');
const btnConfirmarCambio = document.getElementById('btnConfirmarCambio');
const passCampoCorreo = document.getElementById('pass_correo');
const passCampoActual = document.getElementById('pass_actual'); // NUEVO CAMPO
const passCampoNueva = document.getElementById('pass_nueva');

// Validaciones y datos
const DOMINIOS_COMUNES = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'uv.mx'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[._,@#$%&()!]).{12,}$/;


// ===============================================
// 2. LÓGICA DE SUGERENCIA DINÁMICA (Se mantiene)
// ===============================================

campoCorreo.addEventListener('input', function() {
    const valor = this.value;
    const arrobaIndex = valor.indexOf('@');
    
    contenedorSugerencia.innerHTML = '';
    contenedorSugerencia.style.display = 'none';

    if (arrobaIndex !== -1) {
        const subdominioIngresado = valor.substring(arrobaIndex + 1);
        
        const coincidencias = DOMINIOS_COMUNES.filter(dominio => 
            dominio.startsWith(subdominioIngresado)
        );

        if (coincidencias.length > 0) {
            
            const listaSugerencias = document.createElement('div');
            listaSugerencias.className = 'sugerencia-lista'; 
            
            coincidencias.forEach(dominio => {
                const elemento = document.createElement('div');
                elemento.className = 'sugerencia-item'; 
                
                const textoCompleto = valor.substring(0, arrobaIndex + 1) + dominio;
                elemento.textContent = textoCompleto;
                
                elemento.addEventListener('click', function() {
                    campoCorreo.value = textoCompleto;
                    contenedorSugerencia.innerHTML = '';
                    contenedorSugerencia.style.display = 'none';
                    campoCorreo.focus();
                });

                listaSugerencias.appendChild(elemento);
            });
            
            contenedorSugerencia.appendChild(listaSugerencias);
            contenedorSugerencia.style.display = 'block';
        }
    }
});

// ===============================================
// 3. FUNCIÓN PRINCIPAL: MANEJO DEL LOGIN (Se mantiene)
// ===============================================

formulario.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const correoIngresado = campoCorreo.value.trim();
    const contrasenaIngresada = campoContrasena.value.trim();

    // VALIDACIÓN 1: FORMATO DEL CORREO
    if (!emailRegex.test(correoIngresado)) {
        mostrarMensaje(
            "El correo debe ser válido (ej. usuario@dominio.com), incluyendo texto antes del '@' y un dominio completo.", 
            'error'
        );
        campoContrasena.value = ''; 
        return; 
    }

    // VALIDACIÓN 2: COMPLEJIDAD DE LA CONTRASEÑA
    if (!passwordRegex.test(contrasenaIngresada)) {
        mostrarMensaje(
            'La contraseña no cumple los requisitos de seguridad necesarios (12+ carac., 1 num., 1 letra, 1 símbolo).', 
            'error'
        );
        campoContrasena.value = ''; 
        return;
    }

    // Si ambas validaciones pasan, enviamos los datos al backend
    autenticarUsuario(correoIngresado, contrasenaIngresada);
    
    campoContrasena.value = '';
});

// ===============================================
// 3.1. FUNCIÓN DE CONEXIÓN LOGIN (FETCH API) (Se mantiene)
// ===============================================

async function autenticarUsuario(correo, contrasena) {
    const data = new URLSearchParams();
    data.append('action', 'login');
    data.append('correo', correo);
    data.append('contrasena', contrasena);

    try {
        const response = await fetch('php/alumnos.php', {
            method: 'POST',
            body: data,
        });

        const simularExito = (correo === 'test@uv.mx' && contrasena === '123456789012!'); // Simulacion

        if (simularExito) {
            mostrarMensaje(`Acceso concedido. ¡Bienvenido, ${correo}!`, 'success');
            
            setTimeout(() => {
                // Redireccion
            }, 1000);

        } else {
            mostrarMensaje('Error de credenciales: Usuario o Contraseña incorrectos.', 'error');
        }

    } catch (error) {
        console.error('Error fatal en la comunicación con el servidor:', error);
        mostrarMensaje('Error de conexión. El servidor no está respondiendo.', 'error');
    }
}


// ===============================================
// 4. FUNCIÓN UTILITARIA (Manejo de Notificaciones Toast) (Se mantiene)
// ===============================================

function mostrarMensaje(texto, tipo) {
    if (!toastContainer) return; 

    if (tipo !== 'success' && tipo !== 'error') return;

    const cssClass = tipo === 'success' ? 'toast-success' : 'toast-error';
    const icon = tipo === 'success' ? '✔' : '❌'; 

    const toast = document.createElement('div');
    toast.className = `toast-notification ${cssClass}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${texto}</span>
    `;

    toastContainer.prepend(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10); 

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 5000); 
}

// ===============================================
// 5. MANEJO DE VENTANAS MODALES
// ===============================================

// --- Modal REGISTRO (Se mantiene) ---
btnRegistro.addEventListener('click', function() {
    registroModal.classList.add('visible'); 
});
btnCerrarRegistro.addEventListener('click', function() {
    registroModal.classList.remove('visible');
    regCampoCorreo.value = '';
    regCampoContrasena.value = '';
});
btnConfirmarRegistro.addEventListener('click', function() {
    const nuevoCorreo = regCampoCorreo.value.trim();
    const nuevaContrasena = regCampoContrasena.value.trim();
    
    if (!emailRegex.test(nuevoCorreo)) {
        mostrarMensaje("El formato del correo es inválido.", 'error');
        return;
    }
    if (!passwordRegex.test(nuevaContrasena)) {
        mostrarMensaje(
            'La contraseña NO cumple los requisitos de seguridad.', 
            'error'
        );
        return;
    }
    
    registrarNuevoUsuario(nuevoCorreo, nuevaContrasena);
});

async function registrarNuevoUsuario(correo, contrasena) {
    const data = new URLSearchParams();
    data.append('action', 'register');
    data.append('correo', correo);
    data.append('contrasena', contrasena);
    
    mostrarMensaje('⏳ Registrando usuario...', 'success'); 

    try {
        const response = await fetch('php/alumnos.php', {
            method: 'POST',
            body: data,
        });
        
        const result = await response.json();

        if (result.success) {
            setTimeout(() => {
                registroModal.classList.remove('visible');
                regCampoCorreo.value = '';
                regCampoContrasena.value = '';
                mostrarMensaje(result.message, 'success');
            }, 500);
            
        } else {
            mostrarMensaje(result.message, 'error');
        }

    } catch (error) {
        console.error('Error de comunicación durante el registro:', error);
        mostrarMensaje('Error de conexión con el servidor. Intente más tarde.', 'error');
    }
}


// --- Modal CAMBIAR CONTRASEÑA (ACTUALIZADO con Contraseña Actual) ---

btnCambiarPass.addEventListener('click', function() {
    cambiarPassModal.classList.add('visible'); 
});

btnCerrarCambiarPass.addEventListener('click', function() {
    cambiarPassModal.classList.remove('visible');
    passCampoCorreo.value = '';
    passCampoActual.value = ''; // LIMPIEZA AÑADIDA
    passCampoNueva.value = '';
});

btnConfirmarCambio.addEventListener('click', function() {
    const correoCambio = passCampoCorreo.value.trim();
    const contrasenaActual = passCampoActual.value.trim(); // NUEVO VALOR
    const nuevaContrasena = passCampoNueva.value.trim();
    
    // VALIDACIÓN 1: CORREO
    if (!emailRegex.test(correoCambio)) {
        mostrarMensaje("El formato del correo es inválido.", 'error');
        return;
    }

    // VALIDACIÓN 2: CONTRASEÑA NUEVA
    if (!passwordRegex.test(nuevaContrasena)) {
        mostrarMensaje(
            'La nueva contraseña NO cumple los requisitos de seguridad.', 
            'error'
        );
        return;
    }

    // VALIDACIÓN 3: CONTRASEÑA ACTUAL NO PUEDE ESTAR VACÍA (aunque el input es 'required')
    if (contrasenaActual.length === 0) {
        mostrarMensaje('Debe ingresar su contraseña actual para verificar su identidad.', 'error');
        return;
    }
    
    // Llamada a la función de cambio con los tres parámetros
    cambiarContrasena(correoCambio, contrasenaActual, nuevaContrasena);
});

async function cambiarContrasena(correo, contrasenaActual, nuevaContrasena) { // FIRMA ACTUALIZADA
    const data = new URLSearchParams();
    data.append('action', 'change_password'); 
    data.append('correo', correo);
    data.append('contrasena_actual', contrasenaActual); // NUEVO PARÁMETRO
    data.append('contrasena_nueva', nuevaContrasena); // NUEVO PARÁMETRO
    
    mostrarMensaje('⏳ Solicitando cambio de contraseña...', 'success');

    try {
        const response = await fetch('php/alumnos.php', {
            method: 'POST',
            body: data,
        });
        
        const result = await response.json(); 

        if (result.success) {
            
            setTimeout(() => {
                cambiarPassModal.classList.remove('visible');
                passCampoCorreo.value = '';
                passCampoActual.value = '';
                passCampoNueva.value = '';
                mostrarMensaje(result.message, 'success');
            }, 500);
            
        } else {
            mostrarMensaje(result.message, 'error');
        }

    } catch (error) {
        console.error('Error de comunicación durante el cambio de contraseña:', error);
        mostrarMensaje('Error de conexión con el servidor. Intente más tarde.', 'error');
    }
}


// --- Cierre Genérico de Modales (ACTUALIZADO) ---
window.addEventListener('click', function(event) {
    if (event.target == registroModal) {
        registroModal.classList.remove('visible');
        regCampoCorreo.value = '';
        regCampoContrasena.value = '';
    }
    if (event.target == cambiarPassModal) {
        cambiarPassModal.classList.remove('visible');
        passCampoCorreo.value = '';
        passCampoActual.value = '';
        passCampoNueva.value = '';
    }
});