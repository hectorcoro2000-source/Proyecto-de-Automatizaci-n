<?php
function conexionBD_Localhost($bd){
	$server = 'localhost';
	$user = 'postgres';
	$pass = '1';
	$bd = $bd;
	$connec = pg_connect("host=$server dbname=$bd user=$user password=$pass") or die ("Error de conexion servidor ".$server);
	return $connec;    
}
?>