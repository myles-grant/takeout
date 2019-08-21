<?php

$connect = new Pdo("mysql:host=$credentials[0]; dbname=$credentials[1]; charset=$credentials[2]", $credentials[3], $credentials[4]);
$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>