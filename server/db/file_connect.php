<?php


//Connect to config file
$file_count = 0;
$credentials = array();
$file = fopen("/home/gnu40k7jawq7/takeout_app/db/keys.config", "r") or die("Unable to open file");

while(!feof($file)) 
{
	$credentials[$file_count] = trim(fgets($file));
	$file_count++;
}
fclose($file);




?>