<?php
// Incluye el archivo que contiene la función de conexión a la BD
require_once 'conexion.php'; 
const DB_NAME = "alumnos_db_ufnj"; 

// ==========================================================
// 1. MANEJO DE PETICIONES POST DESDE JAVASCRIPT
// ==========================================================

require_once 'conexion.php'; 
const DB_NAME = "alumnos_db_ufnj"; 

// ==========================================================
// 1. MANEJO DE PETICIONES POST DESDE JAVASCRIPT
// ==========================================================

require_once 'conexion.php'; 
const DB_NAME = "alumnos_db_ufnj"; 

// ==========================================================
// 1. MANEJO DE PETICIONES POST DESDE JAVASCRIPT (SIMPLIFICADO)
// ==========================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    
    $response = ['success' => false, 'message' => 'Acción no reconocida.'];
    
    // Captura de parámetros
    $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL);
    $contrasena = $_POST['contrasena'] ?? ''; 
    $contrasena_actual = $_POST['contrasena_actual'] ?? '';
    $contrasena_nueva = $_POST['contrasena_nueva'] ?? '';

    // Llama a la conexión de forma limpia
    $conn = conexionBD_Localhost(DB_NAME); 

    if (!$conn) {
        // La conexión falló, devolvemos un JSON de error de conexión limpio.
        $response['message'] = "❌ Fallo de conexión al servidor de base de datos. Verifique credenciales.";
        
    } else {
        // La conexión fue exitosa, procedemos con el switch

        switch ($_POST['action']) {
            case 'login':
                if (empty($correo) || empty($contrasena)) {
                    $response['message'] = "⚠️ Ambos campos son obligatorios.";
                } else {
                    $response = verificarCredenciales($correo, $contrasena, $conn);
                }
                break;
                
            case 'register':
                if (empty($correo) || empty($contrasena)) {
                    $response['message'] = "⚠️ Correo y contraseña son obligatorios.";
                } else {
                    $response = registrarUsuario($correo, $contrasena, $conn);
                }
                break;
                
            case 'change_password': 
                if (empty($correo) || empty($contrasena_actual) || empty($contrasena_nueva)) {
                    $response['message'] = "⚠️ Todos los campos son obligatorios para cambiar la contraseña.";
                } else {
                    $response = cambiarContrasena($correo, $contrasena_actual, $contrasena_nueva, $conn);
                }
                break;

            default:
                $response['message'] = "Acción no válida."; 
                break;
        }
        
        pg_close($conn); // Cerrar la conexión aquí
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}


// ==========================================================
// 2. FUNCIÓN DE REGISTRO DE USUARIO (Se mantiene)
// ==========================================================

function registrarUsuario($correo, $contrasena, $conn) {
    
    $contrasena_hashed = password_hash($contrasena, PASSWORD_DEFAULT);
    $correo_seguro = pg_escape_string($conn, $correo);
    $hash_seguro = pg_escape_string($conn, $contrasena_hashed);

    $sql = "INSERT INTO catalogo_alumnos (correo, contrasena) 
            VALUES ('$correo_seguro', '$hash_seguro') RETURNING id_alumno";

    $result = @pg_query($conn, $sql);
    
    if ($result) {
        $response = ['success' => true, 'message' => '¡Registro completado! Ya puedes iniciar sesión.'];
    } else {
        $error_message = pg_last_error($conn);
        
        if (strpos($error_message, 'duplicate key value violates unique constraint') !== false) {
             $response = ['success' => false, 'message' => 'El correo electrónico ya se encuentra registrado.'];
        } else {
             $response = ['success' => false, 'message' => "Error de BD: " . $error_message]; 
        }
    }

    return $response;
}


// ==========================================================
// 3. FUNCIÓN DE LOGIN (Se mantiene)
// ==========================================================

function verificarCredenciales($correo, $contrasena, $conn) {
    
    $response = ['success' => false, 'message' => 'Error de autenticación.'];
    $correo_seguro = pg_escape_string($conn, $correo);

    $sql = "SELECT contrasena FROM catalogo_alumnos WHERE correo = '$correo_seguro'"; 
    $result = @pg_query($conn, $sql);

    if ($result && ($usuario = pg_fetch_assoc($result))) {
        if (password_verify($contrasena, $usuario['contrasena'])) { 
            $response['success'] = true;
            $response['message'] = "Bienvenido al sistema.";
        } else {
            $response['message'] = "Usuario o Contraseña incorrectos."; 
        }

    } else {
        $response['message'] = "Usuario o Contraseña incorrectos."; 
    }

    return $response;
}


// ==========================================================
// 4. FUNCIÓN DE CAMBIAR CONTRASEÑA (RESTAURADA Y CORREGIDA)
// ==========================================================

function cambiarContrasena($correo, $contrasena_actual, $contrasena_nueva, $conn) {
    
    $response = ['success' => false, 'message' => ''];
    $correo_seguro = pg_escape_string($conn, $correo);

    // 1. Buscar el hash actual
    $sql_select = "SELECT contrasena FROM catalogo_alumnos WHERE correo = '$correo_seguro'"; 
    $result = @pg_query($conn, $sql_select);

    if (!$result || pg_num_rows($result) == 0) {
        $response['message'] = "El correo electrónico no está registrado.";
        return $response;
    }

    $usuario = pg_fetch_assoc($result);
    $hash_actual_db = $usuario['contrasena'];

    // 2. CRÍTICO: Verificar la Contraseña Actual
    if (!password_verify($contrasena_actual, $hash_actual_db)) { 
        $response['message'] = "La contraseña actual es incorrecta.";
        return $response;
    }

    // 3. Generar el nuevo hash
    $nuevo_hash = password_hash($contrasena_nueva, PASSWORD_DEFAULT);
    $hash_nuevo_seguro = pg_escape_string($conn, $nuevo_hash);

    // 4. Actualizar la contraseña en la base de datos
    $sql_update = "UPDATE catalogo_alumnos SET contrasena = '$hash_nuevo_seguro' WHERE correo = '$correo_seguro'";

    $result_update = @pg_query($conn, $sql_update);

    if ($result_update) {
        $response['success'] = true;
        $response['message'] = "✅ Contraseña actualizada con éxito. ¡Ya puedes iniciar sesión!";
    } else {
        $response['message'] = "Error de base de datos al intentar actualizar la contraseña.";
    }
    
    return $response;

}

