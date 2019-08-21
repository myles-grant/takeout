<?php


/* Note to self: Make sure to setup php security tips
   Maybe implement OOP style with classes
 */


//JSON RESPONSE STRUCTURE
//Add this structure globally
/*

{
	"status": "success", //Code
	"message": "Successfully added user", //MEessage
	"return_data": 
	{
		"data1": Type
		"data2": Type
	}
}

*/


function respond($returnData)
{
	//Setup response structure
	$response = json_encode($returnData);
	echo $response;
	exit();
}






?>