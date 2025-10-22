<?php

// function conexionBD_Localhost($bd){
// 	$server = 'localhost';
// 	$user = 'postgres';
// 	$pass = '1';
// 	$bd = $bd;
// 	$connec = pg_connect("host=$server dbname=$bd user=$user password=$pass") or die ("Error de conexion servidor ".$server);
// 	return $connec;    
// }

function conexionBD_Localhost($bd){
	$server = 'dpg-d3sgeoi4d50c738r9j00-a.oregon-postgres.render.com';
	$user = 'alumnos_user';
	$pass = 'eOrXm9DVTwpzWxpvLI1P9bj6tyRFpRCp';
	$bd = $bd;
	
	$connec = @pg_connect("host=$server dbname=$bd user=$user password=$pass");
	
    if (!$connec) {
        return false; 
    }
    
	return $connec;    
}


