<?php

/* Note to self: Make sure to setup php security tips
   Maybe implement OOP style with classes
 */



//Add includes
require("db/file_connect.php");
require("db/db_connect.php");
require("db/db_manager.php");
require("response.php");

//include("apns/apns.php");
define("CUSTOMER_USERS", "users");

//Validation
function validateInput($input) 
{
	$input = trim($input);
  	$input = stripslashes($input);
  	$input = htmlspecialchars($input);
  	return $input;
}


//Create Customer User Account
function addCustomerUser($connect, $params)
{
	//Check if user already exists
	$name = $params["name"];
	$email = strtolower($params["email"]);
	$password = $params["password"];
	$phoneNumber = $params["phone_number"];
	$homeAddress = $params["home_address"];
	$workAddress = $params["work_address"];
	$workLat = $params["work_lat"];
	$workLng = $params["work_lng"];
	$paymentMethod = $params["payment_method"];
	$profilePictureBase64 = $params["profile_picture_base_64"];
	$token = $params["token"];
	$date = date("Y-m-d H:i:s");
	$lat = $params["lat"];
	$lng = $params["lng"];

	//Check if user already exists
	if(db_check_value($connect, CUSTOMER_USERS, "email", $email, 1))
	{
		//This users' email address already exists in the database
		//Do not update user
		//Return response
		$returnData = array(
			"status" => "failed",
			"message" => "The provided email already exists.",
			"return_data" => null
		);
		respond($returnData);
	}
	else
	{
		//Hash password
		$options = [
	    	'cost' => 12
	 	];
		$passwordEncrypt = password_hash($password, PASSWORD_BCRYPT, $options);


		//Create customer user
		$columns = array("name", "email", "password", "phone_number", "home_address", "work_address", "work_latitude", "work_longitude", "payment_method", "profile_image_path", "fcm_token", "created_at", "latitude", "longitude");
		$values = array($name, $email, $passwordEncrypt, $phoneNumber, $homeAddress, $workAddress, $workLat, $workLng, $paymentMethod, $profilePictureBase64, $token, $date, $lat, $lng);
		$row = db_add_value($connect, CUSTOMER_USERS, $columns, $values);
		if($row > 0)
		{
			//Get user data
			$menuItemsArray = array();
			$menuItems = db_get_values($connect, null, null, null, "SELECT * FROM chef_users INNER JOIN menu_items ON menu_items.chef_id = chef_users.id");
			if($menuItems != null && count($menuItems) > 0)
			{
				for ($i=0; $i<count($menuItems); $i++)
				{
					//Group menu items by chef
					$item = array(

						"itm_id" => $menuItems[$i]["id"],
						"itm_name" => $menuItems[$i]["itm_name"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_desc" => $menuItems[$i]["itm_desc"],
						"itm_start_time" => $menuItems[$i]["itm_start_time"],
						"itm_end_time" => $menuItems[$i]["itm_end_time"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_qty" => $menuItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $menuItems[$i]["itm_order_prep_time"],
						"itm_tags" => $menuItems[$i]["itm_tags"],
						"itm_image_path" => $menuItems[$i]["itm_image_path"],
					);

					if(array_key_exists($menuItems[$i]["chef_id"], $menuItemsArray))
					{
						//Push item into chef's menu items
						array_push($menuItemsArray[$menuItems[$i]["chef_id"]]["menu_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $menuItems[$i]["chef_id"],
							"name" => $menuItems[$i]["name"],
							"email" => $menuItems[$i]["email"],
							"rating" => $menuItems[$i]["rating"],
							"profile_picture_base_64" => $menuItems[$i]["profile_image_path"],
							"phone_number" => $menuItems[$i]["phone_number"],
							"home_address" => $menuItems[$i]["home_address"],
							"lat" => $menuItems[$i]["latitude"],
							"lng" => $menuItems[$i]["longitude"],
							"city" => $menuItems[$i]["city"],
							"province_state" => $menuItems[$i]["province_state"],
							"country" => $menuItems[$i]["country"],
							"menu_items" => array($item),
						);
						$menuItemsArray[$menuItems[$i]["chef_id"]] = $user;
					}
				}
			}
			

			//
			$returnData = array(
				"status" => "success", 
				"message" => "User's account has been created.", 
				"return_data" => array(
					"id" => $row,
					"name" => $name,
					"email" => $email,
					"rating" => 0,
					"phone_number" => $phoneNumber,
					"home_address" => $homeAddress,
					"home_address_lat" => $lat,
					"home_address_lng" => $lng,
					"work_address" => $workAddress,
					"work_address_lat" => $workLat,
					"work_address_lng" => $workLng,
					"payment_method" => $paymentMethod,
					"profile_picture_base_64" => $profilePictureBase64,
					"token" => $token,
					"menu_items" => $menuItemsArray
				)
			);
			respond($returnData);
		}
		else
		{
			//Return the data
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed to create user's account", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
}


//Create Chef User Account
function addChefUser($connect, $params)
{
	//Check if user already exists
	$name = $params["name"];
	$email = strtolower($params["email"]);
	$password = $params["password"];
	$phoneNumber = $params["phone_number"];
	$address = $params["home_address"];
	$city = $params["city"];
	$provState = $params["province_state"];
	$country = $params["country"];
	$bankName = $params["bank_name"];
	$bankInstitution = $params["bank_inst"];
	$bankBranch = $params["bank_branch"];
	$bankAccountNumber = $params["bank_account_number"];
	$certDateIssued = $params["cert_date_issued"];
	$certEspDate = $params["cert_esp_date"];
	$certPlaceIssued = $params["cert_place_issued"];
	$certImageBase64 = $params["cert_image_base_64"]; 
	$profilePictureBase64 = $params["profile_picture_base_64"];
	$token = $params["token"];
	$date = date("Y-m-d H:i:s"); 
	$lat = $params["lat"];
	$lng = $params["lng"];

	//Check if user already exists
	if(db_check_value($connect, "chef_users", "email", $email, 1))
	{
		//This users' email address already exists in the database
		//Do not update user
		//Return response
		$returnData = array(
			"status" => "failed",
			"message" => "The provided email already exists.",
			"return_data" => null
		);
		respond($returnData);
	}
	else
	{
		//Hash password
		$options = [
	    	'cost' => 12
	 	];
		$passwordEncrypt = password_hash($password, PASSWORD_BCRYPT, $options);

		//Create customer user
		$columns = array("name", "email", "password", "phone_number", "home_address", "city", "province_state", "country",  "bank_name", "bank_institution", "bank_branch", "bank_account_number", "cert_date_issued", "cert_esp_date", "cert_place_issued", "cert_image_path", "profile_image_path", "fcm_token", "created_date", "latitude", "longitude");
		$values = array($name, $email, $passwordEncrypt, $phoneNumber, $address, $city, $provState, $country, $bankName, $bankInstitution, $bankBranch, $bankAccountNumber, $certDateIssued, $certEspDate, $certPlaceIssued, $certImageBase64, $profilePictureBase64, $token, $date, $lat, $lng);
		$row = db_add_value($connect, "chef_users", $columns, $values);
		if($row > 0)
		{
			//
			$returnData = array(
				"status" => "success", 
				"message" => "User's account has been created.", 
				"return_data" => array(
					"id" => $row,
					"name" => $name,
					"email" => $email,
					"rating" => 0,
					"phone_number" => $phoneNumber,
					"home_address" => $address,
					"home_address_lat" => $lat,
					"home_address_lng" => $lng,
					"city" => $city,
					"province_state" => $provState,
					"country" => $country,
					"bank_name" => $bankName,
					"bank_inst" => $bankInstitution,
					"bank_branch" => $bankBranch,
					"bank_account_number" => $bankAccountNumber,
					"cert_date_issued" => $certDateIssued,
					"cert_esp_date" => $certEspDate,
					"cert_place_issued" => $certPlaceIssued,
					"cert_image_base_64" => $certImageBase64,
					"profile_picture_base_64" => $profilePictureBase64,
					"token" => $token
				)
			);
			respond($returnData);
		}
		else
		{
			//Return the data
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed to create user's account", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
}


function loginCustomerUser($connect, $params)
{
	$email = strtolower($params["email"]);
	$password = $params["password"];
	$token = $params["token"];

	//Verify if creds match
	if(db_check_value($connect, CUSTOMER_USERS, "email", $email, 1))
	{
		//Creds match
		//Verify password
		$returnValue = db_get_value($connect, CUSTOMER_USERS, "email", $email, 1);
		$hash = $returnValue[0]["password"];

		if(password_verify($password, $hash))
		{
			//Update token
			$whereColumns = array("email");
			$whereValues = array($email);
			if(!db_update_value($connect, CUSTOMER_USERS, "fcm_token", $token, $whereColumns, $whereValues, 1) && $returnValue[0]["fcm_token"] != $token) {
				
				//Error updating token
				$returnData = array(
					 "status" => "failed",
					 "message" => "APNS token could not be updated, please contact us.",
					 "return_data" => null
				);
				respond($returnData);
				return;
			}

			//Get user data
			$menuItems = db_get_values($connect, null, null, null, "SELECT * FROM chef_users INNER JOIN menu_items ON menu_items.chef_id = chef_users.id");
			$cartItems = db_get_values($connect, array("customer_id"), array($returnValue[0]["id"]), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");
			$orders = db_get_values($connect, array("customer_id"), array($returnValue[0]["id"]), null, "SELECT * FROM menu_items INNER JOIN orders ON orders.menu_item_id = menu_items.id WHERE orders.customer_id = :customer_id");


			$menuItemsArray = array();
			if($menuItems != null && count($menuItems) > 0)
			{
				for ($i=0; $i<count($menuItems); $i++)
				{
					//Group menu items by chef
					$item = array(

						"itm_id" => $menuItems[$i]["id"],
						"itm_name" => $menuItems[$i]["itm_name"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_desc" => $menuItems[$i]["itm_desc"],
						"itm_start_time" => $menuItems[$i]["itm_start_time"],
						"itm_end_time" => $menuItems[$i]["itm_end_time"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_qty" => $menuItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $menuItems[$i]["itm_order_prep_time"],
						"itm_tags" => $menuItems[$i]["itm_tags"],
						"itm_image_path" => $menuItems[$i]["itm_image_path"],
					);

					if(array_key_exists($menuItems[$i]["chef_id"], $menuItemsArray))
					{
						//Push item into chef's menu items
						array_push($menuItemsArray[$menuItems[$i]["chef_id"]]["menu_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $menuItems[$i]["chef_id"],
							"name" => $menuItems[$i]["name"],
							"email" => $menuItems[$i]["email"],
							"rating" => $menuItems[$i]["rating"],
							"profile_picture_base_64" => $menuItems[$i]["profile_image_path"],
							"phone_number" => $menuItems[$i]["phone_number"],
							"home_address" => $menuItems[$i]["home_address"],
							"lat" => $menuItems[$i]["latitude"],
							"lng" => $menuItems[$i]["longitude"],
							"city" => $menuItems[$i]["city"],
							"province_state" => $menuItems[$i]["province_state"],
							"country" => $menuItems[$i]["country"],
							"menu_items" => array($item),
						);
						$menuItemsArray[$menuItems[$i]["chef_id"]] = $user;
					}
				}
			}


			$cartItemsArray = array();
			if($cartItems != null && count($cartItems) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($cartItems); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
					$cartItems[$i]["name"] = $chefInfo[0]["name"];
					$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
					$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
					$cartItems[$i]["city"] = $chefInfo[0]["city"];
					$cartItems[$i]["country"] = $chefInfo[0]["country"];
					$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];
					$cartItems[$i]["email"] = $chefInfo[0]["email"];
					$cartItems[$i]["phone_number"] = $chefInfo[0]["phone_number"];
					$cartItems[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
					$cartItems[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
					$cartItems[$i]["bank_name"] = $chefInfo[0]["bank_name"];
					$cartItems[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
					$cartItems[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
					$cartItems[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
					$cartItems[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
					$cartItems[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
					$cartItems[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
					$cartItems[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
					$cartItems[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
					$cartItems[$i]["token"] = $chefInfo[0]["fcm_token"];


					//Get cart orders... temp
					$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $returnValue[0]["id"], null), 1, array("qty"));
					$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

					//Get drinks... temp
					$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
					$cartItems[$i]["drinks"] = $drinks;
				}

				//Group cart items by chef
				for ($i=0; $i<count($cartItems); $i++)
				{
					$item = array(

						"cart_id" => $cartItems[$i]["id"],
						"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
						"itm_name" => $cartItems[$i]["itm_name"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_desc" => $cartItems[$i]["itm_desc"],
						"itm_start_time" => $cartItems[$i]["itm_start_time"],
						"itm_end_time" => $cartItems[$i]["itm_end_time"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_qty" => $cartItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
						"itm_tags" => $cartItems[$i]["itm_tags"],
						"itm_image_path" => $cartItems[$i]["itm_image_path"],
						"itm_order_id" => $cartItems[$i]["order_id"],
					);

					if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
					{
						//Push item into chef's menu items
						array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $cartItems[$i]["chef_id"],
							"name" => $cartItems[$i]["name"],
							"home_address" => $cartItems[$i]["home_address"],
							"city" => $cartItems[$i]["city"],
							"province_state" => $cartItems[$i]["province_state"],
							"country" => $cartItems[$i]["country"],

							"email" => $cartItems[$i]["email"],
							"phone_number" => $cartItems[$i]["phone_number"],
							"home_address_lat" => $cartItems[$i]["home_address_lat"],
							"home_address_lng" => $cartItems[$i]["home_address_lng"],
							"bank_name" => $cartItems[$i]["bank_name"],
							"bank_inst" => $cartItems[$i]["bank_inst"],
							"bank_branch" => $cartItems[$i]["bank_branch"],
							"bank_account_number" => $cartItems[$i]["bank_account_number"],
							"cert_date_issued" => $cartItems[$i]["cert_date_issued"],
							"cert_esp_date" => $cartItems[$i]["cert_esp_date"],
							"cert_place_issued" => $cartItems[$i]["cert_place_issued"],
							"cert_image_base_64" => $cartItems[$i]["cert_image_base_64"],
							"profile_picture_base_64" => $cartItems[$i]["profile_picture_base_64"],
							"token" => $cartItems[$i]["token"],

							"cart_items" => array($item),
							"drinks" => $cartItems[$i]["drinks"]
						);
						$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
					}
				}
			}

			//Orders
			//$orders = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN orders ON orders.menu_item_id = menu_items.id WHERE orders.customer_id = :customer_id");
			$orders = db_get_value($connect, "orders", array("customer_id"), array($returnValue[0]["id"]));

			$ordersArray = array();
			if($orders != null && count($orders) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($orders); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $orders[$i]["chef_id"], 1);
					$orders[$i]["name"] = $chefInfo[0]["name"];
					$orders[$i]["home_address"] = $chefInfo[0]["home_address"];
					$orders[$i]["province_state"] = $chefInfo[0]["province_state"];
					$orders[$i]["city"] = $chefInfo[0]["city"];
					$orders[$i]["country"] = $chefInfo[0]["country"];
					$orders[$i]["chef_id"] = $chefInfo[0]["id"];
					$orders[$i]["email"] = $chefInfo[0]["email"];
					$orders[$i]["phone_number"] = $chefInfo[0]["phone_number"];
					$orders[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
					$orders[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
					$orders[$i]["bank_name"] = $chefInfo[0]["bank_name"];
					$orders[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
					$orders[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
					$orders[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
					$orders[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
					$orders[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
					$orders[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
					$orders[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
					$orders[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
					$orders[$i]["token"] = $chefInfo[0]["fcm_token"];

					$orders[$i]["order_id"] = $orders[$i]["id"];
				}

				//Group orders by order id
				for ($i=0; $i<count($orders); $i++)
				{
					$cartOrders = json_decode($orders[$i]["cart_json"]);

					//Get cart orders
					for($x=0; $x<count($cartOrders); $x++)
					{
						$menuItem = db_get_value($connect, "menu_items", "id", $cartOrders[$x]->{"menu_item_id"}, 1);
						$cartItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($menuItem[0]["id"], $returnValue[0]["id"], NOT_NULL), 1, array("qty"));

						$item = array(

							"order_id" => $orders[$i]["id"],
							"dish_id" => $menuItem[0]["id"],
							"order_state" => $orders[$i]["state"],
							"itm_name" => $menuItem[0]["itm_name"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_desc" => $menuItem[0]["itm_desc"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_image_path" => $menuItem[0]["itm_image_path"],
							"cart_itm_qty" => $cartItem[0]["qty"]
						);

						if(array_key_exists($orders[$i]["order_id"], $ordersArray))
						{
							//Push item into chef's menu items
							array_push($ordersArray[$orders[$i]["order_id"]]["orders"], $item);
						}
						else
						{
							$user = array(

								"chef_id" => $orders[$i]["chef_id"],
								"name" => $orders[$i]["name"],
								"home_address" => $orders[$i]["home_address"],
								"city" => $orders[$i]["city"],
								"province_state" => $orders[$i]["province_state"],
								"country" => $orders[$i]["country"],
								"tip" => $orders[$i]["tip"],
								"notes" => $orders[$i]["notes"],
								"orders" => array($item),

								"email" => $orders[$i]["email"],
								"phone_number" => $orders[$i]["phone_number"],
								"home_address_lat" => $orders[$i]["home_address_lat"],
								"home_address_lng" => $orders[$i]["home_address_lng"],
								"bank_name" => $orders[$i]["bank_name"],
								"bank_inst" => $orders[$i]["bank_inst"],
								"bank_branch" => $orders[$i]["bank_branch"],
								"bank_account_number" => $orders[$i]["bank_account_number"],
								"cert_date_issued" => $orders[$i]["cert_date_issued"],
								"cert_esp_date" => $orders[$i]["cert_esp_date"],
								"cert_place_issued" => $orders[$i]["cert_place_issued"],
								"cert_image_base_64" => $orders[$i]["cert_image_base_64"],
								"profile_picture_base_64" => $orders[$i]["profile_picture_base_64"],
								"token" => $orders[$i]["token"],
							);
							$ordersArray[$orders[$i]["order_id"]] = $user;
						}
					}
				}
			}

			//Password is correct
			$returnData = array(
				"status" => "success", 
				"message" => "User is now logged in.", 
				"return_data" => array(
					"id" => $returnValue[0]["id"],
					"name" => $returnValue[0]["name"],
					"email" => $returnValue[0]["email"],
					"phone_number" => $returnValue[0]["phone_number"],
					"home_address" => $returnValue[0]["home_address"],
					"home_address_lat" => $returnValue[0]["latitude"],
					"home_address_lng" => $returnValue[0]["longitude"],
					"work_address" => $returnValue[0]["work_address"],
					"work_address_lat" => $returnValue[0]["work_latitude"],
					"work_address_lng" => $returnValue[0]["work_longitude"],
					"rating" => $returnValue[0]["rating"],
 					"payment_method" => $returnValue[0]["payment_method"],
					"profile_picture_base_64" => $returnValue[0]["profile_image_path"],
					"token" => $token,
					"menu_items" => $menuItemsArray,
					"cart_items" => $cartItemsArray,
					"orders" => $ordersArray
				)
			);
			respond($returnData);
		}
		else
		{
			//Creds don't match
			$returnData = array(
				"status" => "failed",
				"message" => "Incorrect Email or Password.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Creds don't match
		$returnData = array(
			 "status" => "failed",
			 "message" => "Incorrect Email or Password.",
			 "return_data" => null
		);
		respond($returnData);
	}
}



function loginChefUser($connect, $params)
{
	$email = strtolower($params["email"]);
	$password = $params["password"];
	$token = $params["token"];

	//Verify if creds match
	if(db_check_value($connect, "chef_users", "email", $email, 1))
	{
		//Verify password
		$returnValue = db_get_value($connect, "chef_users", "email", $email, 1);
		$hash = $returnValue[0]["password"];

		//Creds match
		if(password_verify($password, $hash))
		{
			//Update token
			$whereColumns = array("email");
			$whereValues = array($email);
			if(!db_update_value($connect, "chef_users", "fcm_token", $token, $whereColumns, $whereValues, 1) && $returnValue[0]["fcm_token"] != $token) {
				
				//Error updating token
				$returnData = array(
					 "status" => "failed",
					 "message" => "APNS token could not be updated, please contact us.",
					 "return_data" => null
				);
				respond($returnData);
				return;
			}


			//Get user data
			//TEMP//
			$menuItems = db_get_value($connect, "menu_items", "chef_id", $returnValue[0]["id"]);
			$drinksArray = array(

				"sprite" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"fanta" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"coke" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"icetea" => array(

					"qty" => 0,
					"price" => 0.00
				)
			);

			$drinks = db_get_value($connect, "drinks", "chef_id", $returnValue[0]["id"]);
			if(count($drinks))
			{
				for($i=0; $i<count($drinks); $i++)
				{
					$drinksArray[$drinks[$i]["drnk_name"]] = array(

						"qty" => $drinks[$i]["drnk_qty"],
						"price" => $drinks[$i]["drnk_price"]
					);
				}
			}


			$ordersArray = array();
			$selectedColumns = array("id", "chef_id", "customer_id", "menu_item_id", "state");
			$orders = db_get_values($connect, "chef_id", $returnValue[0]["id"], null, "SELECT * FROM orders WHERE orders.chef_id = :chef_id AND orders.state != 'declined' AND orders.state != 'complete' ");


			//Get customer profile data
			foreach ($orders as $order) 
			{
				$_returnValue = array();
				$_returnValue["id"] = $order["id"];
				//$_returnValue["order_id"] = $order["order_id"];
				$_returnValue["state"] = $order["state"];
				$_returnValue["notes"] = $order["notes"];
				$_returnValue["tip"] = $order["tip"];
				$_returnValue["drinks"] = json_decode($order["dcart_json"]);

				$customer = db_get_value($connect, CUSTOMER_USERS, "id", $order["customer_id"], 1);
				$_returnValue["profile_image_path"] = $customer[0]["profile_image_path"];
				$_returnValue["name"] = $customer[0]["name"];
				$_returnValue["customer_id"] = $customer[0]["id"];
				$_returnValue["rating"] = $customer[0]["rating"];
				$_returnValue["home_lat"] = $customer[0]["latitude"];
				$_returnValue["home_lng"] = $customer[0]["longitude"];
				$_returnValue["home_address"] = $customer[0]["home_address"];

				$cartItems = json_decode($order["cart_json"]);
				$_cartItems = array();

				$subtotal = 0;
				$grandTotal = 0;
				$taxHst = 0.13;
				for($i=0; $i<count($cartItems); $i++)
				{
					$__cartItems = array();
					$menuItem = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);
					$__cartItems["itm_name"] = $menuItem[0]["itm_name"];
					$__cartItems["itm_order_prep_time"] = $menuItem[0]["itm_order_prep_time"];
					$__cartItems["itm_image_path"] = $menuItem[0]["itm_image_path"];
					$__cartItems["itm_price"] = $menuItem[0]["itm_price"];


					$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($order["customer_id"], $cartItems[$i]->{"menu_item_id"}), 1);
					$__cartItems["qty"] = $cart[0]["qty"];
					
					//TEMP CALC TOTAL HERE
					$subtotal += $menuItem[0]["itm_price"] * $__cartItems["qty"];
					//

					array_push($_cartItems, $__cartItems);
				}

				$_returnValue["subtotal"] = $subtotal;
				$_returnValue["grand_total"] = $subtotal + ($subtotal * $taxHst);
				$_returnValue["tax_hst"] = ($subtotal * $taxHst);

				$_returnValue["items"] = $_cartItems;
				array_push($ordersArray, $_returnValue);
			}
			//TEMP//



			//Password is correct
			$returnData = array(
				"status" => "success", 
				"message" => "User is now logged in.", 
				"return_data" => array(
					"id" => $returnValue[0]["id"],
					"name" => $returnValue[0]["name"],
					"email" => $returnValue[0]["email"],
					"rating" => $returnValue[0]["rating"],
					"phone_number" => $returnValue[0]["phone_number"],
					"home_address" => $returnValue[0]["home_address"],
					"home_address_lat" => $returnValue[0]["latitude"],
					"home_address_lng" => $returnValue[0]["longitude"],
					"city" => $returnValue[0]["city"],
					"province_state" => $returnValue[0]["province_state"],
					"country" => $returnValue[0]["country"],
					"bank_name" => $returnValue[0]["bank_name"],
					"bank_inst" => $returnValue[0]["bank_institution"],
					"bank_branch" => $returnValue[0]["bank_branch"],
					"bank_account_number" => $returnValue[0]["bank_account_number"],
					"cert_date_issued" => $returnValue[0]["cert_date_issued"],
					"cert_esp_date" => $returnValue[0]["cert_esp_date"],
					"cert_place_issued" => $returnValue[0]["cert_place_issued"],
					"cert_image_base_64" => $returnValue[0]["cert_image_path"],
					"profile_picture_base_64" => $returnValue[0]["profile_image_path"],
					"wallet" => $returnValue[0]["wallet"],
					"total_revenew_to_date" => $returnValue[0]["total_revenew_to_date"],
					"deposit_cycle" => $returnValue[0]["deposit_cycle"],
					"token" => $token,
					"menu_items" => $menuItems,
					"orders" => $ordersArray,
					"drinks" => $drinksArray
				)
			);
			respond($returnData);
		}
		else
		{
			//Creds don't match
			$returnData = array(
				"status" => "failed",
				"message" => "Incorrect Email or Password.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Creds don't match
		$returnData = array(
			 "status" => "failed",
			 "message" => "Incorrect Email or Password.",
			 "return_data" => null
		);
		respond($returnData);
	}
}


//Get User data
function getUserData($connect, $params)
{
	//Check if user already exists
	$userId = $params["user_id"];
	$userType = $params["user_type"];
	$messageArray = array();
	
	$table = CUSTOMER_USERS;
	if($userType == "chef")
	{
		$table = "chef_users";
	}

	//Check if user exists
	if(db_check_value($connect, $table, "id", $userId, 1))
	{
		//Get user data
		if($userType == "customer")
		{
			$menuItems = db_get_values($connect, null, null, null, "SELECT * FROM chef_users INNER JOIN menu_items ON menu_items.chef_id = chef_users.id");
			$cartItems = db_get_values($connect, array("customer_id"), array($userId), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");
			$orders = db_get_values($connect, array("customer_id"), array($userId), null, "SELECT * FROM menu_items INNER JOIN orders ON orders.menu_item_id = menu_items.id WHERE orders.customer_id = :customer_id");


			$menuItemsArray = array();
			if($menuItems != null && count($menuItems) > 0)
			{
				for ($i=0; $i<count($menuItems); $i++)
				{
					//Group menu items by chef
					$item = array(

						"itm_id" => $menuItems[$i]["id"],
						"itm_name" => $menuItems[$i]["itm_name"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_desc" => $menuItems[$i]["itm_desc"],
						"itm_start_time" => $menuItems[$i]["itm_start_time"],
						"itm_end_time" => $menuItems[$i]["itm_end_time"],
						"itm_price" => $menuItems[$i]["itm_price"],
						"itm_qty" => $menuItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $menuItems[$i]["itm_order_prep_time"],
						"itm_tags" => $menuItems[$i]["itm_tags"],
						"itm_image_path" => $menuItems[$i]["itm_image_path"],
					);

					if(array_key_exists($menuItems[$i]["chef_id"], $menuItemsArray))
					{
						//Push item into chef's menu items
						array_push($menuItemsArray[$menuItems[$i]["chef_id"]]["menu_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $menuItems[$i]["chef_id"],
							"name" => $menuItems[$i]["name"],
							"email" => $menuItems[$i]["email"],
							"rating" => $menuItems[$i]["rating"],
							"profile_picture_base_64" => $menuItems[$i]["profile_image_path"],
							"phone_number" => $menuItems[$i]["phone_number"],
							"home_address" => $menuItems[$i]["home_address"],
							"lat" => $menuItems[$i]["latitude"],
							"lng" => $menuItems[$i]["longitude"],
							"city" => $menuItems[$i]["city"],
							"province_state" => $menuItems[$i]["province_state"],
							"country" => $menuItems[$i]["country"],
							"menu_items" => array($item),
						);
						$menuItemsArray[$menuItems[$i]["chef_id"]] = $user;
					}
				}
			}


			$cartItemsArray = array();
			if($cartItems != null && count($cartItems) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($cartItems); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
					$cartItems[$i]["name"] = $chefInfo[0]["name"];
					$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
					$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
					$cartItems[$i]["city"] = $chefInfo[0]["city"];
					$cartItems[$i]["country"] = $chefInfo[0]["country"];
					$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];
					$cartItems[$i]["email"] = $chefInfo[0]["email"];
					$cartItems[$i]["phone_number"] = $chefInfo[0]["phone_number"];
					$cartItems[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
					$cartItems[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
					$cartItems[$i]["bank_name"] = $chefInfo[0]["bank_name"];
					$cartItems[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
					$cartItems[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
					$cartItems[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
					$cartItems[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
					$cartItems[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
					$cartItems[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
					$cartItems[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
					$cartItems[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
					$cartItems[$i]["token"] = $chefInfo[0]["fcm_token"];


					//Get cart orders... temp
					$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $userId, null), 1, array("qty"));
					$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

					//Get drinks... temp
					$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
					$cartItems[$i]["drinks"] = $drinks;
				}

				//Group cart items by chef
				for ($i=0; $i<count($cartItems); $i++)
				{
					$item = array(

						"cart_id" => $cartItems[$i]["id"],
						"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
						"itm_name" => $cartItems[$i]["itm_name"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_desc" => $cartItems[$i]["itm_desc"],
						"itm_start_time" => $cartItems[$i]["itm_start_time"],
						"itm_end_time" => $cartItems[$i]["itm_end_time"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_qty" => $cartItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
						"itm_tags" => $cartItems[$i]["itm_tags"],
						"itm_image_path" => $cartItems[$i]["itm_image_path"],
					);

					if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
					{
						//Push item into chef's menu items
						array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $cartItems[$i]["chef_id"],
							"name" => $cartItems[$i]["name"],
							"home_address" => $cartItems[$i]["home_address"],
							"city" => $cartItems[$i]["city"],
							"province_state" => $cartItems[$i]["province_state"],
							"country" => $cartItems[$i]["country"],

							"email" => $cartItems[$i]["email"],
							"phone_number" => $cartItems[$i]["phone_number"],
							"home_address_lat" => $cartItems[$i]["home_address_lat"],
							"home_address_lng" => $cartItems[$i]["home_address_lng"],
							"bank_name" => $cartItems[$i]["bank_name"],
							"bank_inst" => $cartItems[$i]["bank_inst"],
							"bank_branch" => $cartItems[$i]["bank_branch"],
							"bank_account_number" => $cartItems[$i]["bank_account_number"],
							"cert_date_issued" => $cartItems[$i]["cert_date_issued"],
							"cert_esp_date" => $cartItems[$i]["cert_esp_date"],
							"cert_place_issued" => $cartItems[$i]["cert_place_issued"],
							"cert_image_base_64" => $cartItems[$i]["cert_image_base_64"],
							"profile_picture_base_64" => $cartItems[$i]["profile_picture_base_64"],
							"token" => $cartItems[$i]["token"],

							"cart_items" => array($item),
							"drinks" => $cartItems[$i]["drinks"]
						);
						$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
					}
				}
			}


			//Orders
			//$orders = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN orders ON orders.menu_item_id = menu_items.id WHERE orders.customer_id = :customer_id");
			$orders = db_get_value($connect, "orders", array("customer_id"), array($userId));

			$ordersArray = array();
			if($orders != null && count($orders) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($orders); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $orders[$i]["chef_id"], 1);
					$orders[$i]["name"] = $chefInfo[0]["name"];
					$orders[$i]["home_address"] = $chefInfo[0]["home_address"];
					$orders[$i]["province_state"] = $chefInfo[0]["province_state"];
					$orders[$i]["city"] = $chefInfo[0]["city"];
					$orders[$i]["country"] = $chefInfo[0]["country"];
					$orders[$i]["chef_id"] = $chefInfo[0]["id"];
					$orders[$i]["email"] = $chefInfo[0]["email"];
					$orders[$i]["phone_number"] = $chefInfo[0]["phone_number"];
					$orders[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
					$orders[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
					$orders[$i]["bank_name"] = $chefInfo[0]["bank_name"];
					$orders[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
					$orders[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
					$orders[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
					$orders[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
					$orders[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
					$orders[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
					$orders[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
					$orders[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
					$orders[$i]["token"] = $chefInfo[0]["fcm_token"];

					$orders[$i]["order_id"] = $orders[$i]["id"];
				}

				//Group orders by order id
				for ($i=0; $i<count($orders); $i++)
				{
					$cartOrders = json_decode($orders[$i]["cart_json"]);

					//Get cart orders
					for($x=0; $x<count($cartOrders); $x++)
					{
						$menuItem = db_get_value($connect, "menu_items", "id", $cartOrders[$x]->{"menu_item_id"}, 1);
						$cartItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($menuItem[0]["id"], $userId, NOT_NULL), 1, array("qty"));

						$item = array(

							"order_id" => $orders[$i]["id"],
							"dish_id" => $menuItem[0]["id"],
							"order_state" => $orders[$i]["state"],
							"itm_name" => $menuItem[0]["itm_name"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_desc" => $menuItem[0]["itm_desc"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_image_path" => $menuItem[0]["itm_image_path"],
							"cart_itm_qty" => $cartItem[0]["qty"]
						);

						if(array_key_exists($orders[$i]["order_id"], $ordersArray))
						{
							//Push item into chef's menu items
							array_push($ordersArray[$orders[$i]["order_id"]]["orders"], $item);
						}
						else
						{
							$user = array(

								"chef_id" => $orders[$i]["chef_id"],
								"name" => $orders[$i]["name"],
								"home_address" => $orders[$i]["home_address"],
								"city" => $orders[$i]["city"],
								"province_state" => $orders[$i]["province_state"],
								"country" => $orders[$i]["country"],
								"tip" => $orders[$i]["tip"],
								"notes" => $orders[$i]["notes"],
								"orders" => array($item),

								"email" => $orders[$i]["email"],
								"phone_number" => $orders[$i]["phone_number"],
								"home_address_lat" => $orders[$i]["home_address_lat"],
								"home_address_lng" => $orders[$i]["home_address_lng"],
								"bank_name" => $orders[$i]["bank_name"],
								"bank_inst" => $orders[$i]["bank_inst"],
								"bank_branch" => $orders[$i]["bank_branch"],
								"bank_account_number" => $orders[$i]["bank_account_number"],
								"cert_date_issued" => $orders[$i]["cert_date_issued"],
								"cert_esp_date" => $orders[$i]["cert_esp_date"],
								"cert_place_issued" => $orders[$i]["cert_place_issued"],
								"cert_image_base_64" => $orders[$i]["cert_image_base_64"],
								"profile_picture_base_64" => $orders[$i]["profile_picture_base_64"],
								"token" => $orders[$i]["token"],
							);
							$ordersArray[$orders[$i]["order_id"]] = $user;
						}
					}
				}
			}
				
			$returnData = array(
				"status" => "success", 
				"message" => $messageArray, 
				"return_data" => array(
					"menu_items" => $menuItemsArray,
					"cart_items" => $cartItemsArray,
					"orders" => $ordersArray
				)
			);
			respond($returnData);
		}
		else if($userType == "chef")
		{

			$menuItems = db_get_value($connect, "menu_items", "chef_id", $userId);
			$drinksArray = array(

				"sprite" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"fanta" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"coke" => array(

					"qty" => 0,
					"price" => 0.00
				),
				"icetea" => array(

					"qty" => 0,
					"price" => 0.00
				)
			);

			$drinks = db_get_value($connect, "drinks", "chef_id", $userId);
			if(count($drinks))
			{
				for($i=0; $i<count($drinks); $i++)
				{
					$drinksArray[$drinks[$i]["drnk_name"]] = array(

						"qty" => $drinks[$i]["drnk_qty"],
						"price" => $drinks[$i]["drnk_price"]
					);
				}
			}


			$ordersArray = array();
			$orders = db_get_values($connect, "chef_id", $userId, null, "SELECT * FROM orders WHERE orders.chef_id = :chef_id AND orders.state != 'declined' AND orders.state != 'complete' ");
			//TEMP//
			//Get customer profile data
			foreach ($orders as $order) 
			{
				$_returnValue = array();
				$_returnValue["id"] = $order["id"];
				//$_returnValue["order_id"] = $order["order_id"];
				$_returnValue["state"] = $order["state"];
				$_returnValue["notes"] = $order["notes"];
				$_returnValue["tip"] = $order["tip"];
				$_returnValue["drinks"] = json_decode($order["dcart_json"]);

				$customer = db_get_value($connect, CUSTOMER_USERS, "id", $order["customer_id"], 1);
				$_returnValue["profile_image_path"] = $customer[0]["profile_image_path"];
				$_returnValue["name"] = $customer[0]["name"];
				$_returnValue["customer_id"] = $customer[0]["id"];
				$_returnValue["rating"] = $customer[0]["rating"];
				$_returnValue["home_lat"] = $customer[0]["latitude"];
				$_returnValue["home_lng"] = $customer[0]["longitude"];
				$_returnValue["home_address"] = $customer[0]["home_address"];

				$cartItems = json_decode($order["cart_json"]);
				$_cartItems = array();

				$subtotal = 0;
				$grandTotal = 0;
				$taxHst = 0.13;
				for($i=0; $i<count($cartItems); $i++)
				{
					$__cartItems = array();
					$menuItem = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);
					$__cartItems["itm_name"] = $menuItem[0]["itm_name"];
					$__cartItems["itm_order_prep_time"] = $menuItem[0]["itm_order_prep_time"];
					$__cartItems["itm_image_path"] = $menuItem[0]["itm_image_path"];
					$__cartItems["itm_price"] = $menuItem[0]["itm_price"];


					$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($order["customer_id"], $cartItems[$i]->{"menu_item_id"}), 1);
					$__cartItems["qty"] = $cart[0]["qty"];
					
					//TEMP CALC TOTAL HERE
					$subtotal += $menuItem[0]["itm_price"] * $__cartItems["qty"];
					//

					array_push($_cartItems, $__cartItems);
				}

				$_returnValue["subtotal"] = $subtotal;
				$_returnValue["grand_total"] = $subtotal + ($subtotal * $taxHst);
				$_returnValue["tax_hst"] = ($subtotal * $taxHst);

				$_returnValue["items"] = $_cartItems;
				array_push($ordersArray, $_returnValue);
			}
			//TEMP//

			//
			$returnData = array(
				"status" => "success", 
				"message" => $messageArray, 
				"return_data" => array(
					"menu_items" => $menuItems,
					"orders" => $ordersArray,
					"drinks" => $drinksArray
				)
			);
			respond($returnData);
		}
	}
	else
	{
		//User does not exist
		$returnData = array(
			"status" => "failed",
			"message" => "User does not exist.",
			"return_data" => null
		);
		respond($returnData);
	}
}



//Update Customer User Account
function updateCustomerUser($connect, $params)
{
	//Check if user already exists
	$id = $params["id"];
	$name = $params["name"];
	$oldEmail = $params["old_email"];
	$email = $params["email"];
	$password = $params["password"];
	$phoneNumber = $params["phone_number"];
	$homeAddress = $params["home_address"];
	$workAddress = $params["work_address"];
	$workLat = $params["work_lat"];
	$workLng = $params["work_lng"];
	$paymentMethod = $params["payment_method"];
	$profilePictureBase64 = $params["profile_picture_base_64"];
	$token = $params["token"];
	$lat = $params["lat"];
	$lng = $params["lng"];

	//Check if user already exists
	if(db_check_value($connect, CUSTOMER_USERS, "email", $oldEmail, 1))
	{
		//Check if the updated email address already exists
		if(!db_check_value($connect, CUSTOMER_USERS, "email", $email, 1) || $oldEmail == $email)
		{
			//Update users' account
			//Hash password
			$options = [
		    	'cost' => 12
		 	];
			$passwordEncrypt = password_hash($password, PASSWORD_BCRYPT, $options);

			$columns = array("name", "email", "password", "phone_number", "home_address", "work_address", "work_latitude", "work_longitude", "profile_image_path", "payment_method", "token", "latitude", "longitude");
			$values = array($name, $email, $passwordEncrypt, $phoneNumber, $homeAddress, $workAddress, $workLat, $workLng, $profilePictureBase64, $paymentMethod, $token, $lat, $lng);
			$whereColumns = array("id");
			$whereValues = array($id);
			if(db_update_value($connect, CUSTOMER_USERS, $columns, $values, $whereColumns, $whereValues, 1))
			{
				//Account is updated
				$returnData = array(
					"status" => "success",
					"message" => "Account Updated.",
					"return_data" => array(
						"id" => $id,
						"name" => $name,
						"email" => $email,
						"phone_number" => $phoneNumber,
						"home_address" => $homeAddress,
						"home_address_lat" => $lat,
						"home_address_lng" => $lng,
						"work_address" => $workAddress,
						"work_address_lat" => $workLat,
						"work_address_lng" => $workLng,
						"payment_method" => $paymentMethod, 
						"profile_picture_base_64" => $profilePictureBase64,
						"token" => $token
					)
				);
				respond($returnData);
			}
			else
			{
				$returnData = array(
					"status" => "failed",
					"message" => "Unable to update your account, please try again or contact us.",
					"return_data" => null
				);
				respond($returnData);
			}
		}
		else
		{
			$returnData = array(
				"status" => "failed",
				"message" => "Email address is taken.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Error user does not exist...
		//Log the user out of the application
		$returnData = array(
			 "status" => "failed",
			 "message" => "Error: User cannot be found.",
			 "return_data" => array(
			 	"foo" => true
			 )
		);
		respond($returnData);
	}
}



//Update Customer User Account
function updateChefUser($connect, $params)
{
	//Check if user already exists
	$id = $params["id"];
	$name = $params["name"];
	$oldEmail = $params["old_email"];
	$email = $params["email"];
	$password = $params["password"];
	$phoneNumber = $params["phone_number"];
	$address = $params["home_address"];
	$city = $params["city"];
	$provState = $params["province_state"];
	$country = $params["country"];
	$bankName = $params["bank_name"];
	$bankInstitution = $params["bank_inst"];
	$bankBranch = $params["bank_branch"];
	$bankAccountNumber = $params["bank_account_number"];
	$certDateIssued = $params["cert_date_issued"];
	$certEspDate = $params["cert_esp_date"];
	$certPlaceIssued = $params["cert_place_issued"];
	$certImageBase64 = $params["cert_image_base_64"]; 
	$profilePictureBase64 = $params["profile_picture_base_64"];
	$token = $params["token"];
	$lat = $params["lat"];
	$lng = $params["lng"];

	//Check if user already exists
	if(db_check_value($connect, "chef_users", "email", $oldEmail, 1))
	{
		//Check of the updated email address already exists
		if(!db_check_value($connect, "chef_users", "email", $email, 1) || $oldEmail == $email)
		{
			//Update users' account
			//Hash password
			$options = [
		    	'cost' => 12
		 	];
			$passwordEncrypt = password_hash($password, PASSWORD_BCRYPT, $options);


			$columns = array("name", "email", "password", "phone_number", "home_address", "city", "province_state", "country",  "bank_name", "bank_institution", "bank_branch", "bank_account_number", "cert_date_issued", "cert_esp_date", "cert_place_issued", "cert_image_path", "profile_image_path", "token", "latitude", "longitude");
			$values = array($name, $email, $passwordEncrypt, $phoneNumber, $address, $city, $provState, $country, $bankName, $bankInstitution, $bankBranch, $bankAccountNumber, $certDateIssued, $certEspDate, $certPlaceIssued, $certImageBase64, $profilePictureBase64, $token, $lat, $lng);
			$whereColumns = array("id");
			$whereValues = array($id);
			if(db_update_value($connect, "chef_users", $columns, $values, $whereColumns, $whereValues, 1))
			{
				//Account is updated
				$returnData = array(
					"status" => "success",
					"message" => "Account Updated.",
					"return_data" => array(
						"id" => $id,
						"name" => $name,
						"email" => $email,
						"phone_number" => $phoneNumber,
						"home_address" => $address,
						"city" => $city,
						"province_state" => $provState,
						"country" => $country,
						"home_address_lat" => $lat,
						"home_address_lng" => $lng,
						"bank_name" => $bankName,
						"bank_inst" => $bankInstitution,
						"bank_branch" => $bankBranch,
						"bank_account_number" => $bankAccountNumber,
						"cert_date_issued" => $certDateIssued,
						"cert_esp_date" => $certEspDate,
						"cert_place_issued" => $certPlaceIssued,
						"cert_image_base_64" => $certImageBase64,
						"profile_picture_base_64" => $profilePictureBase64,
						"token" => $token
					)
				);
				respond($returnData);
			}
			else
			{
				$returnData = array(
					"status" => "failed",
					"message" => "Unable to update your account, please try again or contact us.",
					"return_data" => null
				);
				respond($returnData);
			}
		}
		else
		{
			$returnData = array(
				"status" => "failed",
				"message" => "Email address is taken.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Error user does not exist...
		//Log the user out of the application
		$returnData = array(
			 "status" => "failed",
			 "message" => "Error: User cannot be found.",
			 "return_data" => array(
			 	"foo" => true
			 )
		);
		respond($returnData);
	}
}



function getRedeemPoints($connect, $params)
{
	$custId = $params["customer_id"];

	//Check if user exists
	if(db_check_value($connect, CUSTOMER_USERS, "id", $custId, 1))
	{
		//Get redeem points
		$customer = db_get_value($connect, CUSTOMER_USERS, "id", $custId, 1);
		if($customer)
		{
			//Return points
			$returnData = array(
				"status" => "success",
				"message" => "",
				"return_data" => array(
				 	"redeem_points" => $customer[0]["points"]
				)
			);
			respond($returnData);
		}
		else
		{
			//Error user does not exist...
			//Log the user out of the application
			$returnData = array(
				"status" => "failed",
				"message" => "Error: User cannot be found.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Error user does not exist...
		//Log the user out of the application
		$returnData = array(
			 "status" => "failed",
			 "message" => "Error: User cannot be found.",
			 "return_data" => array(
			 	"foo" => true
			 )
		);
		respond($returnData);
	}
}



function addRedeemPoints($connect, $params)
{
	$custId = $params["customer_id"];
	$orderId = $params["order_id"];

	//Check if user exists
	if(db_check_value($connect, CUSTOMER_USERS, "id", $custId, 1))
	{
		//Get current redeem points
		$customer = db_get_value($connect, CUSTOMER_USERS, "id", $custId, 1);
		if($customer)
		{
			//Calculate redeem points
			$orders = db_get_value($connect, "orders", "id", $orderId, 1);
			$cartItems = json_decode($orders[0]["cart_json"]);
			for($i=0; $i<count($cartItems); $i++)
			{
				$newPoints = $customer[0]["points"];
				$price = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);

				$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($custId, $cartItems[$i]->{"menu_item_id"}), 1);
				$newPoints = ($price[0]["itm_price"] * 20 * $cart[0]["qty"]) + $customer[0]["points"];

				db_update_value($connect, CUSTOMER_USERS, "points", $newPoints, "id", $custId, 1);
			}

			
			
			//Update customers points
			if(true)
			{
				//Return points
				$returnData = array(
					"status" => "success",
					"message" => "",
					"return_data" => array(
					 	"redeem_points" => $newPoints
					)
				);
				respond($returnData);
			}
			else
			{
				//Return points
				$returnData = array(
					"status" => "failed",
					"message" => "Failed to update customers points, returning points owed.",
					"return_data" => array(
					 	"redeem_points" => $newPoints
					)
				);
				respond($returnData);
			}
		}
		else
		{
			//Error user does not exist...
			//Log the user out of the application
			$returnData = array(
				"status" => "failed",
				"message" => "Error: User cannot be found.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Error user does not exist...
		//Log the user out of the application
		$returnData = array(
			 "status" => "failed",
			 "message" => "Error: User cannot be found.",
			 "return_data" => array(
			 	"foo" => true
			 )
		);
		respond($returnData);
	}
}


function addUserRating($connect, $params)
{
	$chefId = $params["chef_id"];
	$custId = $params["customer_id"];
	$orderId = $params["order_id"];
	$rating = $params["rating"];
	$state = $params["state"];

	//Check if user exists
	if(db_check_value($connect, CUSTOMER_USERS, "id", $custId, 1))
	{
		//Get current rating
		$customer = db_get_value($connect, CUSTOMER_USERS, "id", $custId, 1);
		if($customer)
		{
			//Calculate rating
			$oldRating = $customer[0]["rating"];
			$currentRatingSum = $customer[0]["rating_sum"];
			$currentRatingCount = $customer[0]["rating_count"];

			$newRatingSum = $currentRatingSum + $rating;
			$newRatingCount = $currentRatingCount + 1;

			$newRating = $newRatingSum / $newRatingCount;

			//Update user's rating
			$columns = array("rating", "rating_count", "rating_sum");
			$values = array($newRating, $newRatingCount, $newRatingSum);
			if((db_update_value($connect, CUSTOMER_USERS, $columns, $values, "id", $custId, 1) && db_update_value($connect, "orders", "state", $state, array("id", "chef_id"), array($orderId, $chefId), 1))|| $newRating == $oldRating)
			{
				$ordersArray = array();
				$orders = db_get_values($connect, "chef_id", $chefId, null, "SELECT * FROM orders WHERE orders.chef_id = :chef_id AND orders.state != 'declined' AND orders.state != 'complete' ");
				//TEMP//
				//Get customer profile data
				foreach ($orders as $order) 
				{
					$_returnValue = array();
					$_returnValue["id"] = $order["id"];
					//$_returnValue["order_id"] = $order["order_id"];
					$_returnValue["state"] = $order["state"];

					$customer = db_get_value($connect, CUSTOMER_USERS, "id", $order["customer_id"], 1);
					$_returnValue["profile_image_path"] = $customer[0]["profile_image_path"];
					$_returnValue["name"] = $customer[0]["name"];
					$_returnValue["customer_id"] = $customer[0]["id"];
					$_returnValue["rating"] = $customer[0]["rating"];
					$_returnValue["home_lat"] = $customer[0]["latitude"];
					$_returnValue["home_lng"] = $customer[0]["longitude"];
					$_returnValue["home_address"] = $customer[0]["home_address"];

					$cartItems = json_decode($order["cart_json"]);
					$_cartItems = array();

					$subtotal = 0;
					$grandTotal = 0;
					$taxHst = 0.13;
					for($i=0; $i<count($cartItems); $i++)
					{
						$__cartItems = array();
						$menuItem = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);
						$__cartItems["itm_name"] = $menuItem[0]["itm_name"];
						$__cartItems["itm_order_prep_time"] = $menuItem[0]["itm_order_prep_time"];
						$__cartItems["itm_image_path"] = $menuItem[0]["itm_image_path"];
						$__cartItems["itm_price"] = $menuItem[0]["itm_price"];


						$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($order["customer_id"], $cartItems[$i]->{"menu_item_id"}), 1);
						$__cartItems["qty"] = $cart[0]["qty"];
						
						//TEMP CALC TOTAL HERE
						$subtotal += $menuItem[0]["itm_price"] * $__cartItems["qty"];
						//

						array_push($_cartItems, $__cartItems);
					}

					$_returnValue["subtotal"] = $subtotal;
					$_returnValue["grand_total"] = $subtotal + ($subtotal * $taxHst);
					$_returnValue["tax_hst"] = ($subtotal * $taxHst);

					$_returnValue["items"] = $_cartItems;
					array_push($ordersArray, $_returnValue);
				}
				//TEMP//

				$returnData = array(
					"status" => "success",
					"message" => "User's rating has been updated.",
					"return_data" => array(
						"old_rating" => $oldRating,
						"new_rating" => $newRating,
						"orders" => $ordersArray
					)
				);
				respond($returnData);
			}
			else
			{
				$returnData = array(
					"status" => "failed",
					"message" => "Failed to update user's rating.",
					"return_data" => array(
						"old_rating" => $oldRating,
						"new_rating" => $newRating
					)
				);
				respond($returnData);
			}

			//Return points
			$returnData = array(
				"status" => "success",
				"message" => "",
				"return_data" => array(
				 	"redeem_points" => $customer[0]["points"]
				)
			);
			respond($returnData);
		}
		else
		{
			//Error user does not exist...
			//Log the user out of the application
			$returnData = array(
				"status" => "failed",
				"message" => "Error: User cannot be found.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Error user does not exist...
		//Log the user out of the application
		$returnData = array(
			 "status" => "failed",
			 "message" => "Error: User cannot be found.",
			 "return_data" => null
		);
		respond($returnData);
	}
}


//Add menu item on chefs menu
function addMenuItem($connect, $params)
{
	$chefId = $params["chef_id"];
	$menuItemName = $params["menu_item_name"];
	$menuItemDesc = $params["menu_item_desc"];
	$menuItemStartTime = $params["menu_item_start_time"];
	$menuItemEndTime = $params["menu_item_end_time"];
	$menuItemPrice = $params["menu_item_price"];
	$menuItemQty = $params["menu_item_qty"];
	$menuItemOrderPrepTime = $params["menu_item_order_prep_time"];
	$menuItemTags = $params["menu_item_tags"];
	$menuItemImageBase64 = $params["menu_item_picture_base_64"];
	$date = date("Y-m-d H:i:s"); 

	//Check if item already exists
	$columns = array("itm_name", "chef_id");
	$values = array($menuItemName, $chefId);
	if(db_check_value($connect, "menu_items", $columns, $values, 1))
	{
		//Menu item already exists
		//Return response
		$returnData = array(
			"status" => "failed",
			"message" => "It appears that you are already serving this dish?",
			"return_data" => null
		);
		respond($returnData);
	}
	else
	{
		//
		//Add menu item
		$columns = array("chef_id", "itm_name", "itm_desc", "itm_start_time", "itm_end_time", "itm_price", "itm_inventory", "itm_order_prep_time", "itm_tags", "itm_image_path", "created_date");
		$values = array($chefId, $menuItemName, $menuItemDesc, $menuItemStartTime, $menuItemEndTime, $menuItemPrice, $menuItemQty, $menuItemOrderPrepTime, $menuItemTags, $menuItemImageBase64, $date);
		$row = db_add_value($connect, "menu_items", $columns, $values);
		if($row > 0)
		{
			//Return chef's menu items
			$menuItems = db_get_value($connect, "menu_items", "chef_id", $chefId);

			//
			$returnData = array(
				"status" => "success", 
				"message" => "Menu item added.", 
				"return_data" => array(
					"id" => $row, 
					"menu_items" => $menuItems
				)
			);
			respond($returnData);
		}
		else
		{
			//Return the data
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed to add menu item", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
}


//Update chefs menu item
function updateMenuItem($connect, $params)
{
	$menuItemId = $params["menu_item_id"];
	$chefId = $params["chef_id"];
	$oldMenuItemName = $params["old_menu_item_name"];
	$menuItemName = $params["menu_item_name"];
	$menuItemDesc = $params["menu_item_desc"];
	$menuItemStartTime = $params["menu_item_start_time"];
	$menuItemEndTime = $params["menu_item_end_time"];
	$menuItemPrice = $params["menu_item_price"];
	$menuItemQty = $params["menu_item_qty"];
	$menuItemOrderPrepTime = $params["menu_item_order_prep_time"];
	$menuItemTags = $params["menu_item_tags"];
	$menuItemImageBase64 = $params["menu_item_picture_base_64"];

	//Check if item exists
	if(db_check_value($connect, "menu_items", "id", $menuItemId, 1))
	{
		//Update menu item
		$columns = array("itm_name", "itm_desc", "itm_start_time", "itm_end_time", "itm_price", "itm_inventory", "itm_order_prep_time", "itm_tags", "itm_image_path");
		$values = array($menuItemName, $menuItemDesc, $menuItemStartTime, $menuItemEndTime, $menuItemPrice, $menuItemQty, $menuItemOrderPrepTime, $menuItemTags, $menuItemImageBase64);
		$whereColumns = array("id");
		$whereValues = array($menuItemId);
		if(db_update_value($connect, "menu_items", $columns, $values, $whereColumns, $whereValues, 1))
		{
			//Return chef's menu items
			$menuItems = db_get_value($connect, "menu_items", "chef_id", $chefId);
			$returnData = array(
				"status" => "success",
				"message" => "Menu Item Updated",
				"return_data" => array(
					"menu_items" => $menuItems
				)
			);
			respond($returnData);
		}
		else
		{

			//Check if menu item changed only
			if($menuItemImageBase64 != "") 
			{
				$itmImageFile = fopen(ROOT_DIR . "assets". $menuItemImageFileName, "r");
				$itmImage = "";
				if($itmImageFile)
				{
					while(!feof($itmImageFile)) 
					{
						$itmImage .= fgets($itmImageFile);
					}
					fclose($itmImageFile);
				}

				if($itmImage != $menuItemImageBase64)
				{
					$menuItemImageUpload = false;
					$menu_itm_file = fopen(ROOT_DIR . "assets" . $menuItemImageFileName, "w");
					if($menu_itm_file)
					{
						$bytes = fwrite($menu_itm_file, $menuItemImageBase64);
						if($bytes)
						{
							$menuItemImageUpload = $menuItemImageBase64;
						}
						fclose($menu_itm_file);
					}

					//Return chef's menu items
					$menuItems = db_get_value($connect, "menu_items", "chef_id", $chefId);
					$returnData = array(
						"status" => "success",
						"message" => "Menu Item Updated",
						"return_data" => array(
							"menu_items" => $menuItems
						)
					);
					respond($returnData);
				}
				else
				{
					$returnData = array(
						"status" => "failed",
						"message" => "Could not update menu item",
						"return_data" => null
					);
					respond($returnData);
				}
			}
			else
			{
				$returnData = array(
					"status" => "failed",
					"message" => "Could not update menu item",
					"return_data" => null
				);
				respond($returnData);
			}			
		}
	}
	else
	{
		//Error could not locate menu item
		$returnData = array(
			"status" => "failed",
			"message" => "Error: Menu item does not exist",
			"return_data" => null
		);
		respond($returnData);
	}
}


//Remove chef menu item
function removeMenuItem($connect, $params)
{
	$menuItemId = $params["menu_item_id"];
	$chefId = $params["chef_id"];
	$columns = array("chef_id", "id");
	$values = array($chefId, $menuItemId);
	$returnValue = db_delete_row($connect, "menu_items", $columns, $values, 1);
	
	if($returnValue) {

		//Remove menu item image
		//..

		$menuItems = db_get_value($connect, "menu_items", "chef_id", $chefId);
		$returnData = array(
			"status" => "success", 
			"message" => "Menu item has been removed.", 
			"return_data" => array(
				"menu_items" => $menuItems
			)
		);
		respond($returnData);
	}
	else
	{
		//Creds don't match
		$returnData = array(
			 "status" => "failed",
			 "message" => "Failed to remove this menu item.",
			 "return_data" => null
		);
		respond($returnData);
	}
}




//Set drinks
function setDrinks($connect, $params)
{
	$userId = $params["user_id"];
	$drinks = $params["drinks"];
	
	//Get separate drinks from params
	//Update drinks
	$columns = array("drnk_price", "drnk_qty");
	$whereColumns = array("chef_id", "drnk_name");

	foreach($drinks as $key => $value)
	{
		if(db_check_value($connect, "drinks", $whereColumns, array($userId, $key), 1))
		{
			//Update drink
			db_update_value($connect, "drinks", $columns, array($value["price"], $value["qty"]), $whereColumns, array($userId, $key));
		}
		else
		{
			//Add drink
			db_add_value($connect, "drinks", array("drnk_name", "drnk_qty", "drnk_price", "chef_id"), array($key, $value["qty"], $value["price"], $userId));
		}
		
	}

	//..
	if(true)
	{

		//Get updated drinks
		$_drinks = db_get_value($connect, "drinks", "chef_id", $userId);

		$returnData = array(
			"status" => "success",
			"message" => "Drinks have been updated.",
			"return_data" => array(
				"drinks" => $_drinks,
			)
		);
		respond($returnData);
	}
	else
	{
		//Chef does not have their drinks set


		$returnData = array(
			"status" => "failed",
			"message" => "Failed to update drinks.",
			"return_data" => null
		);
		respond($returnData);		
	}
}






//Load image
function getImage($connect, $params)
{
	$path = $params["image_path"];

	//Get base64 image
	$itmImageFile = fopen(ROOT_DIR . "assets" . $path, "r");
	$itmImage = "";
	if($itmImageFile)
	{
		while(!feof($itmImageFile)) 
		{
			$itmImage .= fgets($itmImageFile);
		}
		fclose($itmImageFile);
	}

	if(!empty($itmImage))
	{
		//
		$returnData = array(
			 "status" => "success",
			 "message" => "",
			 "return_data" => array(
			 	"image_path" => $itmImage
			 )
		);
		respond($returnData);
	}
	else
	{
		$returnData = array(
			 "status" => "failed",
			 "message" => "Could not located image from path.",
			 "return_data" => null
		);
		respond($returnData);
	}
}


//Add menu item to cart table
function addItemToCart($connect, $params)
{
	$custId = $params["customer_id"];
	$menuItemId = $params["menu_item_id"];
	$qty = $params["quantity"];
	$date = date("Y-m-d H:i:s"); 

	//Check if menu item is still for sale
	//..

	//Check if menu item is available
	//..

	$columns = array("menu_item_id", "customer_id", "order_id");
	$values = array($menuItemId, $custId, null);
	if(db_check_value($connect, "cart", $columns, $values, 1))
	{
		//This customer already has this item in their cart
		//Update order quantity
		$selectedColumns = array("qty");
		$row = db_get_value($connect, "cart", $columns, $values, 1, $selectedColumns);
		if($row > 0)
		{
			$newQty = intval($row[0]["qty"]) + intval($qty);
			$whereColumns = array("menu_item_id", "customer_id", "order_id");
			$whereValues = array($menuItemId, $custId, null);
			$columns = array("qty");
			$values = array($newQty);
			if(db_update_value($connect, "cart", $columns, $values, $whereColumns, $whereValues, 1))
			{
				//Return all user's cart items 
				$cartItems = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");

				$cartItemsArray = array();
				if($cartItems != null && count($cartItems) > 0)
				{
					//Get order item images
					for ($i=0; $i<count($cartItems); $i++)
					{
						//Temp
						//Get chef name
						$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
						$cartItems[$i]["name"] = $chefInfo[0]["name"];
						$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
						$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
						$cartItems[$i]["city"] = $chefInfo[0]["city"];
						$cartItems[$i]["country"] = $chefInfo[0]["country"];
						$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];
						$cartItems[$i]["email"] = $chefInfo[0]["email"];
						$cartItems[$i]["phone_number"] = $chefInfo[0]["phone_number"];
						$cartItems[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
						$cartItems[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
						$cartItems[$i]["bank_name"] = $chefInfo[0]["bank_name"];
						$cartItems[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
						$cartItems[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
						$cartItems[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
						$cartItems[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
						$cartItems[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
						$cartItems[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
						$cartItems[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
						$cartItems[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
						$cartItems[$i]["token"] = $chefInfo[0]["fcm_token"];
						

						//Get cart items... temp
						$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $custId, null), 1, array("qty"));
						$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

						//Get drinks... temp
						$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
						$cartItems[$i]["drinks"] = $drinks;
					}

					//Group cart items by chef
					for ($i=0; $i<count($cartItems); $i++)
					{
						$item = array(

							"cart_id" => $cartItems[$i]["id"],
							"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
							"itm_name" => $cartItems[$i]["itm_name"],
							"itm_price" => $cartItems[$i]["itm_price"],
							"itm_desc" => $cartItems[$i]["itm_desc"],
							"itm_start_time" => $cartItems[$i]["itm_start_time"],
							"itm_end_time" => $cartItems[$i]["itm_end_time"],
							"itm_price" => $cartItems[$i]["itm_price"],
							"itm_qty" => $cartItems[$i]["itm_inventory"],
							"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
							"itm_tags" => $cartItems[$i]["itm_tags"],
							"itm_image_path" => $cartItems[$i]["itm_image_path"],
						);

						if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
						{
							//Push item into chef's menu items
							array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
						}
						else
						{
							$user = array(

								"chef_id" => $cartItems[$i]["chef_id"],
								"name" => $cartItems[$i]["name"],
								"home_address" => $cartItems[$i]["home_address"],
								"city" => $cartItems[$i]["city"],
								"province_state" => $cartItems[$i]["province_state"],
								"country" => $cartItems[$i]["country"],
								"email" => $cartItems[$i]["email"],
								"phone_number" => $cartItems[$i]["phone_number"],
								"home_address_lat" => $cartItems[$i]["home_address_lat"],
								"home_address_lng" => $cartItems[$i]["home_address_lng"],
								"bank_name" => $cartItems[$i]["bank_inst"],
								"bank_inst" => $cartItems[$i]["bank_inst"],
								"bank_branch" => $cartItems[$i]["bank_branch"],
								"bank_account_number" => $cartItems[$i]["bank_account_number"],
								"cert_date_issued" => $cartItems[$i]["cert_date_issued"],
								"cert_esp_date" => $cartItems[$i]["cert_esp_date"],
								"cert_place_issued" => $cartItems[$i]["cert_place_issued"],
								"cert_image_base_64" => $cartItems[$i]["cert_image_base_64"],
								"profile_picture_base_64" => $cartItems[$i]["profile_picture_base_64"],
								"token" => $cartItems[$i]["token"],

								"cart_items" => array($item),
								"drinks" => $cartItems[$i]["drinks"]
							);
							$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
						}
					}
				}

				//Return response
				$returnData = array(
					"status" => "success",
					"message" => "Order item already exists, order quantity has been updated.",
					"return_data" => array(
						"cart_items" => $cartItemsArray
					)
				);
				respond($returnData);
			}
			else
			{
				//Return response
				$returnData = array(
					"status" => "failed",
					"message" => "Failed to add order to cart.",
					"return_data" => null
				);
				respond($returnData);
			}
		}
		else
		{
			//Return response
			$returnData = array(
				"status" => "failed",
				"message" => "Failed to add order to cart.",
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Add order to cart
		$columns = array("menu_item_id", "customer_id", "qty", "created_date");
		$values = array($menuItemId, $custId, $qty, $date);
		$row = db_add_value($connect, "cart", $columns, $values);
		if($row > 0)
		{
			//Return all user's cart items 
			$cartItems = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");

			$cartItemsArray = array();
			if($cartItems != null && count($cartItems) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($cartItems); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
					$cartItems[$i]["name"] = $chefInfo[0]["name"];
					$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
					$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
					$cartItems[$i]["city"] = $chefInfo[0]["city"];
					$cartItems[$i]["country"] = $chefInfo[0]["country"];
					$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];
					$cartItems[$i]["email"] = $chefInfo[0]["email"];
					$cartItems[$i]["phone_number"] = $chefInfo[0]["phone_number"];
					$cartItems[$i]["home_address_lat"] = $chefInfo[0]["latitude"];
					$cartItems[$i]["home_address_lng"] = $chefInfo[0]["longitude"];
					$cartItems[$i]["bank_name"] = $chefInfo[0]["bank_name"];
					$cartItems[$i]["bank_inst"] = $chefInfo[0]["bank_institution"];
					$cartItems[$i]["bank_branch"] = $chefInfo[0]["bank_branch"];
					$cartItems[$i]["bank_account_number"] = $chefInfo[0]["bank_account_number"];
					$cartItems[$i]["cert_date_issued"] = $chefInfo[0]["cert_date_issued"];
					$cartItems[$i]["cert_esp_date"] = $chefInfo[0]["cert_esp_date"];
					$cartItems[$i]["cert_place_issued"] = $chefInfo[0]["cert_place_issued"];
					$cartItems[$i]["cert_image_base_64"] = $chefInfo[0]["cert_image_path"];
					$cartItems[$i]["profile_picture_base_64"] = $chefInfo[0]["profile_image_path"];
					$cartItems[$i]["token"] = $chefInfo[0]["fcm_token"];

					//Get cart items... temp
					$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $custId, null), 1, array("qty"));
					$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

					//Get drinks... temp
					$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
					$cartItems[$i]["drinks"] = $drinks;

				}

				//Group cart items by chef
				for ($i=0; $i<count($cartItems); $i++)
				{
					$item = array(

						"cart_id" => $cartItems[$i]["id"],
						"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
						"itm_name" => $cartItems[$i]["itm_name"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_desc" => $cartItems[$i]["itm_desc"],
						"itm_start_time" => $cartItems[$i]["itm_start_time"],
						"itm_end_time" => $cartItems[$i]["itm_end_time"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_qty" => $cartItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
						"itm_tags" => $cartItems[$i]["itm_tags"],
						"itm_image_path" => $cartItems[$i]["itm_image_path"],
					);

					if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
					{
						//Push item into chef's menu items
						array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $cartItems[$i]["chef_id"],
							"name" => $cartItems[$i]["name"],
							"home_address" => $cartItems[$i]["home_address"],
							"city" => $cartItems[$i]["city"],
							"province_state" => $cartItems[$i]["province_state"],
							"country" => $cartItems[$i]["country"],
							"email" => $cartItems[$i]["email"],
							"phone_number" => $cartItems[$i]["phone_number"],
							"home_address_lat" => $cartItems[$i]["home_address_lat"],
							"home_address_lng" => $cartItems[$i]["home_address_lng"],
							"bank_name" => $cartItems[$i]["bank_inst"],
							"bank_inst" => $cartItems[$i]["bank_inst"],
							"bank_branch" => $cartItems[$i]["bank_branch"],
							"bank_account_number" => $cartItems[$i]["bank_account_number"],
							"cert_date_issued" => $cartItems[$i]["cert_date_issued"],
							"cert_esp_date" => $cartItems[$i]["cert_esp_date"],
							"cert_place_issued" => $cartItems[$i]["cert_place_issued"],
							"cert_image_base_64" => $cartItems[$i]["cert_image_base_64"],
							"profile_picture_base_64" => $cartItems[$i]["profile_picture_base_64"],
							"token" => $cartItems[$i]["token"],

							"cart_items" => array($item),
							"drinks" => $cartItems[$i]["drinks"]
						);
						$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
					}
				}
			}

			//
			$returnData = array(
				"status" => "success", 
				"message" => "Order has been added to cart.", 
				"return_data" => array(
					"cart_items" => $cartItemsArray
				)
			);
			respond($returnData);
		}
		else
		{
			//Return the data
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed to add order to cart", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
}





//Remove cart order
function removeCartItem($connect, $params)
{
	$cartId = $params["cart_item_id"];
	$customerId = $params["customer_id"];
	$columns = array("customer_id", "id");
	
	foreach ($cartId as $id) {

		$returnValue = db_delete_row($connect, "cart", $columns, array($customerId, $id), 1);
	}
	
	
	if($returnValue) {

		//Return all user's cart items 
		$cartItems = db_get_values($connect, array("customer_id"), array($customerId), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");

		$cartItemsArray = array();
		if($cartItems != null && count($cartItems) > 0)
		{
			//Get order item images
			for ($i=0; $i<count($cartItems); $i++)
			{
				//Temp
				//Get chef name
				$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
				$cartItems[$i]["name"] = $chefInfo[0]["name"];
				$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
				$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
				$cartItems[$i]["city"] = $chefInfo[0]["city"];
				$cartItems[$i]["country"] = $chefInfo[0]["country"];
				$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];

				//Get cart items... temp
				$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $customerId, null), 1, array("qty"));
				$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

				//Get drinks... temp
				$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
				$cartItems[$i]["drinks"] = $drinks;
			}

			//Group cart items by chef
			for ($i=0; $i<count($cartItems); $i++)
			{
				$item = array(

					"cart_id" => $cartItems[$i]["id"],
					"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
					"itm_name" => $cartItems[$i]["itm_name"],
					"itm_price" => $cartItems[$i]["itm_price"],
					"itm_desc" => $cartItems[$i]["itm_desc"],
					"itm_start_time" => $cartItems[$i]["itm_start_time"],
					"itm_end_time" => $cartItems[$i]["itm_end_time"],
					"itm_price" => $cartItems[$i]["itm_price"],
					"itm_qty" => $cartItems[$i]["itm_inventory"],
					"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
					"itm_tags" => $cartItems[$i]["itm_tags"],
					"itm_image_path" => $cartItems[$i]["itm_image_path"],
				);

				if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
				{
					//Push item into chef's menu items
					array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
				}
				else
				{
					$user = array(

						"chef_id" => $cartItems[$i]["chef_id"],
						"name" => $cartItems[$i]["name"],
						"home_address" => $cartItems[$i]["home_address"],
						"city" => $cartItems[$i]["city"],
						"province_state" => $cartItems[$i]["province_state"],
						"country" => $cartItems[$i]["country"],
						"cart_items" => array($item),
						"drinks" => $cartItems[$i]["drinks"]
					);
					$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
				}
			}
		}

		$returnData = array(
			"status" => "success", 
			"message" => "Order has been removed", 
			"return_data" => array(
				"cart_items" => $cartItemsArray
			)
		);
		respond($returnData);
	}
	else
	{
		//Creds don't match
		$returnData = array(
			 "status" => "failed",
			 "message" => "Failed to remove this order.",
			 "return_data" => null
		);
		respond($returnData);
	}
}


//Add order
function processOrderAdd($connect, $params)
{
	//Check if user already exists
	$chefId = $params["chef_id"];
	$custId = $params["customer_id"];
	$state = "pending";
	$notes = $params["notes"];
	$tip = $params["tip"];
	$drinks = $params["drinks"];
	$date = date("Y-m-d H:i:s");

	//Check if menu item is still for sale
	//..

	//Check if menu item is available
	//..

	//Check if order already exists
	//..

	//Get cart items
	$cartItems = db_get_values($connect, array("customer_id", "chef_id"), array($custId, $chefId), null, "SELECT menu_item_id FROM (SELECT cart.menu_item_id, menu_items.id, cart.customer_id, cart.order_id, menu_items.chef_id FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL) AS orders WHERE orders.chef_id = :chef_id");

	if(!empty($cartItems))
	{
		$characters = '0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ-';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i<32; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
		$orderId = $randomString;


		//Add order 
		$columns = array("customer_id", "chef_id", "created_at", "state", "cart_json", "dcart_json", "isActive", "notes", "tip");
		$values = array($custId, $chefId, $date, $state, json_encode($cartItems), json_encode($drinks), true, $notes, $tip);
		$row = db_add_value($connect, "orders", $columns, $values);
		foreach ($cartItems as $item) 
		{
			//Update cart with order id
			$whereColumns = array("menu_item_id", "customer_id", "order_id");
			$whereValues = array($item["menu_item_id"], $custId, null);
			db_update_value($connect, "cart", "order_id", $orderId, $whereColumns, $whereValues, 1);
		}
		

		if($row)
		{
			//Token
			$token = db_get_value($connect, "chef_users", "id", $chefId, 1, array("fcm_token"))[0]["fcm_token"];

			//Cart items 
			$cartItems = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN cart ON cart.menu_item_id = menu_items.id WHERE cart.customer_id = :customer_id AND cart.order_id IS NULL");

			$cartItemsArray = array();
			if($cartItems != null && count($cartItems) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($cartItems); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $cartItems[$i]["chef_id"], 1);
					$cartItems[$i]["name"] = $chefInfo[0]["name"];
					$cartItems[$i]["home_address"] = $chefInfo[0]["home_address"];
					$cartItems[$i]["province_state"] = $chefInfo[0]["province_state"];
					$cartItems[$i]["city"] = $chefInfo[0]["city"];
					$cartItems[$i]["country"] = $chefInfo[0]["country"];
					$cartItems[$i]["chef_id"] = $chefInfo[0]["id"];

					//Get cart orders... temp
					$menuItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($cartItems[$i]["menu_item_id"], $custId, null), 1, array("qty"));
					$cartItems[$i]["cart_itm_qty"] = $menuItem[0]["qty"];

					//Get drinks... temp
					$drinks = db_get_value($connect, "drinks", "chef_id", $chefInfo[0]["id"]);
					$cartItems[$i]["drinks"] = $drinks;
				}

				//Group cart items by chef
				for ($i=0; $i<count($cartItems); $i++)
				{
					$item = array(

						"cart_id" => $cartItems[$i]["id"],
						"cart_itm_qty" => $cartItems[$i]["cart_itm_qty"],
						"itm_name" => $cartItems[$i]["itm_name"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_desc" => $cartItems[$i]["itm_desc"],
						"itm_start_time" => $cartItems[$i]["itm_start_time"],
						"itm_end_time" => $cartItems[$i]["itm_end_time"],
						"itm_price" => $cartItems[$i]["itm_price"],
						"itm_qty" => $cartItems[$i]["itm_inventory"],
						"itm_order_prep_time" => $cartItems[$i]["itm_order_prep_time"],
						"itm_tags" => $cartItems[$i]["itm_tags"],
						"itm_image_path" => $cartItems[$i]["itm_image_path"],
					);

					if(array_key_exists($cartItems[$i]["chef_id"], $cartItemsArray))
					{
						//Push item into chef's menu items
						array_push($cartItemsArray[$cartItems[$i]["chef_id"]]["cart_items"], $item);
					}
					else
					{
						$user = array(

							"chef_id" => $cartItems[$i]["chef_id"],
							"name" => $cartItems[$i]["name"],
							"home_address" => $cartItems[$i]["home_address"],
							"city" => $cartItems[$i]["city"],
							"province_state" => $cartItems[$i]["province_state"],
							"country" => $cartItems[$i]["country"],
							"drinks" => $cartItems[$i]["drinks"],
							"cart_items" => array($item),
						);
						$cartItemsArray[$cartItems[$i]["chef_id"]] = $user;
					}
				}
			}

			//Orders
			//$orders = db_get_values($connect, array("customer_id"), array($custId), null, "SELECT * FROM menu_items INNER JOIN orders ON orders.menu_item_id = menu_items.id WHERE orders.customer_id = :customer_id");
			$orders = db_get_value($connect, "orders", array("customer_id"), array($custId));

			$ordersArray = array();
			if($orders != null && count($orders) > 0)
			{
				//Get order item images
				for ($i=0; $i<count($orders); $i++)
				{
					//Temp
					//Get chef name
					$chefInfo = db_get_value($connect, "chef_users", "id", $orders[$i]["chef_id"], 1);
					$orders[$i]["name"] = $chefInfo[0]["name"];
					$orders[$i]["home_address"] = $chefInfo[0]["home_address"];
					$orders[$i]["province_state"] = $chefInfo[0]["province_state"];
					$orders[$i]["city"] = $chefInfo[0]["city"];
					$orders[$i]["country"] = $chefInfo[0]["country"];
					$orders[$i]["chef_id"] = $chefInfo[0]["id"];

					$orders[$i]["order_id"] = $orders[$i]["id"];
				}

				//Group orders by order id
				for ($i=0; $i<count($orders); $i++)
				{
					$cartOrders = json_decode($orders[$i]["cart_json"]);

					//Get cart orders
					for($x=0; $x<count($cartOrders); $x++)
					{
						$menuItem = db_get_value($connect, "menu_items", "id", $cartOrders[$x]->{"menu_item_id"}, 1);
						$cartItem = db_get_value($connect, "cart", array("menu_item_id", "customer_id", "order_id"), array($menuItem[0]["id"], $custId, NOT_NULL), 1, array("qty"));

						$item = array(

							"order_id" => $orders[$i]["id"],
							"order_state" => $orders[$i]["state"],
							"itm_name" => $menuItem[0]["itm_name"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_desc" => $menuItem[0]["itm_desc"],
							"itm_price" => $menuItem[0]["itm_price"],
							"itm_image_path" => $menuItem[0]["itm_image_path"],
							"cart_itm_qty" => $cartItem[0]["qty"],
						);

						if(array_key_exists($orders[$i]["order_id"], $ordersArray))
						{
							//Push item into chef's menu items
							array_push($ordersArray[$orders[$i]["order_id"]]["orders"], $item);
						}
						else
						{
							$user = array(

								"chef_id" => $orders[$i]["chef_id"],
								"name" => $orders[$i]["name"],
								"home_address" => $orders[$i]["home_address"],
								"city" => $orders[$i]["city"],
								"province_state" => $orders[$i]["province_state"],
								"country" => $orders[$i]["country"],
								"tip" => $orders[$i]["tip"],
								"notes" => $orders[$i]["notes"],
								"orders" => array($item),
							);
							$ordersArray[$orders[$i]["order_id"]] = $user;
						}
					}
				}
			}

			$returnData = array(
				"status" => "success", 
				"message" => "Order has been processed and delivered to chef.", 
				"return_data" => array(
					"token" => $token,
					"id" => $row,
					"cart_items" => $cartItemsArray,
					"orders" => $ordersArray
				)
			);
			respond($returnData);
		}
		else
		{
			$returnData = array(
				"status" => "failed", 
				"message" => "Order failed to process.", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//Return the data
		$returnData = array(
			"status" => "failed", 
			"message" => "Failed to process order.", 
			"return_data" => null
		);
		respond($returnData);
	}
	
}



//Update order state
function processOrderState($connect, $params)
{
	//Check if user already exists
	$userId = $params["user_id"];
	$orderId = $params["order_id"];
	$customerId = $params["customer_id"];
	$state = $params["state"];
	$date = date("Y-m-d H:i:s");

	//Check if menu item is still for sale
	//..

	//Check if menu item is available
	//..

	//Check if order exists
	$columns = array("id", "chef_id");
	$values = array($orderId, $userId);
	if(db_check_value($connect, "orders", $columns, $values, 1))
	{
		//
		if(db_update_value($connect, "orders", "state", $state, $columns, $values, 1))
		{
			//Get customer token
			$token = db_get_value($connect, CUSTOMER_USERS, "id", $customerId, 1, array("fcm_token"))[0]["fcm_token"];

			//Get orders
			$ordersArray = array();
			$orders = db_get_values($connect, "chef_id", $userId, null, "SELECT * FROM orders WHERE orders.chef_id = :chef_id AND orders.state != 'declined' AND orders.state != 'complete' ");
			//TEMP//
			//Get customer profile data
			foreach ($orders as $order) 
			{
				$_returnValue = array();
				$_returnValue["id"] = $order["id"];
				//$_returnValue["order_id"] = $order["order_id"];
				$_returnValue["state"] = $order["state"];
				$_returnValue["notes"] = $order["notes"];
				$_returnValue["tip"] = $order["tip"];
				$_returnValue["drinks"] = json_decode($order["dcart_json"]);

				$customer = db_get_value($connect, CUSTOMER_USERS, "id", $order["customer_id"], 1);
				$_returnValue["profile_image_path"] = $customer[0]["profile_image_path"];
				$_returnValue["name"] = $customer[0]["name"];
				$_returnValue["customer_id"] = $customer[0]["id"];
				$_returnValue["rating"] = $customer[0]["rating"];
				$_returnValue["home_lat"] = $customer[0]["latitude"];
				$_returnValue["home_lng"] = $customer[0]["longitude"];
				$_returnValue["home_address"] = $customer[0]["home_address"];

				$cartItems = json_decode($order["cart_json"]);
				$_cartItems = array();

				$subtotal = 0;
				$grandTotal = 0;
				$taxHst = 0.13;
				for($i=0; $i<count($cartItems); $i++)
				{
					$__cartItems = array();
					$menuItem = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);
					$__cartItems["itm_name"] = $menuItem[0]["itm_name"];
					$__cartItems["itm_order_prep_time"] = $menuItem[0]["itm_order_prep_time"];
					$__cartItems["itm_image_path"] = $menuItem[0]["itm_image_path"];
					$__cartItems["itm_price"] = $menuItem[0]["itm_price"];


					$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($order["customer_id"], $cartItems[$i]->{"menu_item_id"}), 1);
					$__cartItems["qty"] = $cart[0]["qty"];
					
					//TEMP CALC TOTAL HERE
					$subtotal += $menuItem[0]["itm_price"] * $__cartItems["qty"];
					//

					array_push($_cartItems, $__cartItems);
				}

				$_returnValue["subtotal"] = $subtotal;
				$_returnValue["grand_total"] = $subtotal + ($subtotal * $taxHst);
				$_returnValue["tax_hst"] = ($subtotal * $taxHst);

				$_returnValue["items"] = $_cartItems;
				array_push($ordersArray, $_returnValue);

			}
			//TEMP//

			//State has been changed
			$returnData = array(
				"status" => "success", 
				"message" => "Order state has been updated.", 
				"return_data" => array(
					"update" => true,
					"token" => $token,
					"orders" => $ordersArray
				)
			);
			respond($returnData);
		}
		else
		{
			//Failed to update state
			//check if state is already in state to be changed
			$columns = array("id", "chef_id", "state");
			$values = array($orderId, $userId, $state);
			if(db_check_value($connect, "orders", $columns, $values, 1))
			{
				//Get orders
				$ordersArray = array();
				$orders = db_get_values($connect, "chef_id", $userId, null, "SELECT * FROM orders WHERE orders.chef_id = :chef_id AND orders.state != 'declined' AND orders.state != 'complete' ");
				//TEMP//
				//Get customer profile data
				foreach ($orders as $order) 
				{
					$_returnValue = array();
					$_returnValue["id"] = $order["id"];
					//$_returnValue["order_id"] = $order["order_id"];
					$_returnValue["state"] = $order["state"];
					$_returnValue["notes"] = $order["notes"];
					$_returnValue["tip"] = $order["tip"];
					$_returnValue["drinks"] = json_decode($order["dcart_json"]);

					$customer = db_get_value($connect, CUSTOMER_USERS, "id", $order["customer_id"], 1);
					$_returnValue["profile_image_path"] = $customer[0]["profile_image_path"];
					$_returnValue["name"] = $customer[0]["name"];
					$_returnValue["customer_id"] = $customer[0]["id"];
					$_returnValue["rating"] = $customer[0]["rating"];
					$_returnValue["home_lat"] = $customer[0]["latitude"];
					$_returnValue["home_lng"] = $customer[0]["longitude"];
					$_returnValue["home_address"] = $customer[0]["home_address"];

					$cartItems = json_decode($order["cart_json"]);
					$_cartItems = array();

					$subtotal = 0;
					$grandTotal = 0;
					$taxHst = 0.13;
					for($i=0; $i<count($cartItems); $i++)
					{
						$__cartItems = array();
						$menuItem = db_get_value($connect, "menu_items", "id", $cartItems[$i]->{"menu_item_id"}, 1);
						$__cartItems["itm_name"] = $menuItem[0]["itm_name"];
						$__cartItems["itm_order_prep_time"] = $menuItem[0]["itm_order_prep_time"];
						$__cartItems["itm_image_path"] = $menuItem[0]["itm_image_path"];
						$__cartItems["itm_price"] = $menuItem[0]["itm_price"];


						$cart = db_get_value($connect, "cart", array("customer_id", "menu_item_id"), array($order["customer_id"], $cartItems[$i]->{"menu_item_id"}), 1);
						$__cartItems["qty"] = $cart[0]["qty"];
						
						//TEMP CALC TOTAL HERE
						$subtotal += $menuItem[0]["itm_price"] * $__cartItems["qty"];
						//

						array_push($_cartItems, $__cartItems);
					}

					$_returnValue["subtotal"] = $subtotal;
					$_returnValue["grand_total"] = $subtotal + ($subtotal * $taxHst);
					$_returnValue["tax_hst"] = ($subtotal * $taxHst);

					$_returnValue["items"] = $_cartItems;
					array_push($ordersArray, $_returnValue);
				}
				//TEMP//

				//State is already in state to be changed
				$returnData = array(
					"status" => "success", 
					"message" => "Order state is already in state.", 
					"return_data" => array(
						"update" => false,
						"orders" => $ordersArray
					)
				);
				respond($returnData);
			}	
			else
			{
				//Order failed to update state
				$returnData = array(
					"status" => "failed", 
					"message" => "Failed to update order state.", 
					"return_data" => null
				);
				respond($returnData);
			}
		}
	}
	else
	{
		//Order does not exist
		$returnData = array(
			"status" => "failed", 
			"message" => "Order does not exist.", 
			"return_data" => null
		);
		respond($returnData);
	}	
}

//Update device apns token
function updateAPNSToken($connect, $params)
{
	//Check if user already exists
	$id = $params["user_id"];
	$type = $params["user_type"];
	$token = $params["token"];
	$tokenColumn = $params["token_column"]; 
	$table = "chef_users";

	//Check if user exits
	if($type == "customer")
	{
		//Proceed with customer table
		$table = CUSTOMER_USERS;
	}

	if(db_check_value($connect, $table, "id", $id, 1))
	{
		//Update user token
		$whereColumns = array("id");
		$whereValues = array($id);
		if(db_update_value($connect, $table, $tokenColumn, $token, $whereColumns, $whereValues, 1))
		{
			$returnData = array(
				"status" => "success", 
				"message" => "User's token has been updated.", 
				"return_data" => null
			);
			respond($returnData);
		}
		else
		{
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed update user's APNS device token", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//User does not exist
		$returnData = array(
			"status" => "failed", 
			"message" => "Failed update user's APNS device token", 
			"return_data" => null
		);
		respond($returnData);
	}
}



//Remove device apns token
function removeAPNSToken($connect, $params)
{
	//Check if user already exists
	$id = $params["user_id"];
	$type = $params["user_type"];
	$table = "chef_users";

	//Check if user exits
	if($type == "customer")
	{
		//Proceed with customer table
		$table = CUSTOMER_USERS;
	}

	if(db_check_value($connect, $table, "id", $id, 1))
	{
		//Update user token
		$whereColumns = array("id");
		$whereValues = array($id);
		$columns = array("token", "fcm_token");
		$values = array(null, null);
		$token = db_get_value($connect, $table, $whereColumns, $whereColumns, 1);
		if(db_update_value($connect, $table, $columns, $values, $whereColumns, $whereValues, 1))
		{
			$returnData = array(
				"status" => "success", 
				"message" => "User's token has been removed.", 
				"return_data" => null
			);
			respond($returnData);
		}
		else
		{
			$returnData = array(
				"status" => "failed", 
				"message" => "Failed remove user's APNS device token", 
				"return_data" => null
			);
			respond($returnData);
		}
	}
	else
	{
		//User does not exist
		$returnData = array(
			"status" => "failed", 
			"message" => "Failed remove user's APNS device token", 
			"return_data" => null
		);
		respond($returnData);
	}
}




//Search query
function searchQuery($connect, $params)
{
	//
	$query = "%" . $params["query"] . "%";
	
	$menuItems = db_get_values($connect, array("itm_name", "itm_desc", "itm_tags"), array($query, $query, $query), null, "SELECT * FROM chef_users INNER JOIN menu_items ON menu_items.chef_id = chef_users.id WHERE itm_name LIKE :itm_name OR itm_desc OR :itm_desc OR itm_tags LIKE :itm_tags");

	$menuItemsArray = array();
	if($menuItems != null && count($menuItems) > 0)
	{
		for ($i=0; $i<count($menuItems); $i++)
		{
			//Group menu items by chef
			$item = array(

				"itm_id" => $menuItems[$i]["id"],
				"itm_name" => $menuItems[$i]["itm_name"],
				"itm_price" => $menuItems[$i]["itm_price"],
				"itm_desc" => $menuItems[$i]["itm_desc"],
				"itm_start_time" => $menuItems[$i]["itm_start_time"],
				"itm_end_time" => $menuItems[$i]["itm_end_time"],
				"itm_price" => $menuItems[$i]["itm_price"],
				"itm_qty" => $menuItems[$i]["itm_inventory"],
				"itm_order_prep_time" => $menuItems[$i]["itm_order_prep_time"],
				"itm_tags" => $menuItems[$i]["itm_tags"],
				"itm_image_path" => $menuItems[$i]["itm_image_path"]
			);

			if(array_key_exists($menuItems[$i]["chef_id"], $menuItemsArray))
			{
				//Push item into chef's menu items
				array_push($menuItemsArray[$menuItems[$i]["chef_id"]]["menu_items"], $item);
			}
			else
			{
				$user = array(

					"chef_id" => $menuItems[$i]["chef_id"],
					"name" => $menuItems[$i]["name"],
					"email" => $menuItems[$i]["email"],
					"phone_number" => $menuItems[$i]["phone_number"],
					"home_address" => $menuItems[$i]["home_address"],
					"city" => $menuItems[$i]["city"],
					"province_state" => $menuItems[$i]["province_state"],
					"country" => $menuItems[$i]["country"],
					"refresh" => true,
					"menu_items" => array($item),
				);
				$menuItemsArray[$menuItems[$i]["chef_id"]] = $user;
			}
		}

		$returnData = array(
			"status" => "success", 
			"message" => count($menuItems) . " item(s) found.", 
			"return_data" => array(
				"menu_items" => $menuItemsArray
			)
		);
		respond($returnData);
	}
	else
	{
		$returnData = array(
			"status" => "failed", 
			"message" => "No menu items found.", 
			"return_data" => null
		);
		respond($returnData);
	}
}
	


function SSEphemeralKey($connect, $params)
{
	$apiVersion = $params["api_version"];
	$customerId = $params["customer_id"];

	try 
	{
	    $key = \Stripe\EphemeralKey::create(
	      array("customer" => $customerId),
	      array("stripe_version" => $apiVersion)
	    );

	    $returnData = array(
			"status_code" => 200,
			"status" => "success", 
			"message" => "", 

			"header" => array(
				"Content-Type: application/json"
			),
			
			"return_data" => array(
				"response" => $key
			)
		);
		respond($returnData);
	} 
	catch (Exception $e) 
	{
		$returnData = array(
			"status_code" => 500,
			"status" => "failed", 
			"message" => "No menu items found." . $e, 
			"header" => null,
			"return_data" => null
		);
		respond($returnData);
	}
}




?>





















