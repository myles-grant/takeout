<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);

/* 
   Note to self: Make sure to setup php security tips
   Maybe implement OOP style with classes
*/




define("ROOT_DIR", "/home/gnu40k7jawq7/takeout_app/");

//Add includes
//connections
require(ROOT_DIR . "logic.php");

$data = json_decode(file_get_contents('php://input'), true);


//Create Customer User
if(isset($data["add_customer_user"]))
{
  //NOTE: May need to add additional server side validation
  $name = validateInput($data["name"]);
  $email = validateInput($data["email"]);
  $password = $data["password"]; 
  $phoneNumber = validateInput($data["phone_number"]);
  $homeAddress = validateInput($data["home_address"]);
  $workAddress = validateInput($data["work_address"]);
  $paymentMethod = validateInput($data["payment_method"]);
  $profilePictureBase64 = validateInput($data["profile_picture_base_64"]);
  $lat = validateInput($data["home_address_lat"]);
  $lng = validateInput($data["home_address_lng"]);
  $workLat = validateInput($data["work_address_lat"]);
  $workLng = validateInput($data["work_address_lng"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);
  
  addCustomerUser($connect, array(
    "name" => $name,
    "email" => $email,
    "password" => $password,
    "phone_number" => $phoneNumber,
    "home_address" => $homeAddress,
    "work_address" => $workAddress,
    "work_lat" => $workLat,
    "work_lng" => $workLng,
    "lat" => $lat,
    "lng" => $lng,
    "payment_method" => $paymentMethod,
    "profile_picture_base_64" => $profilePictureBase64,
    "token" => $token
  ));
}

//Create Chef User
else if(isset($data["add_chef_user"]))
{
  //NOTE: May need to add additional server side validation
  $name = validateInput($data["name"]);
  $email = validateInput($data["email"]);
  $password = $data["password"];
  $phoneNumber = validateInput($data["phone_number"]);
  $address = validateInput($data["address"]);
  $city = validateInput($data["city"]);
  $provState = validateInput($data["province_state"]);
  $country = validateInput($data["country"]);
  $bankName = validateInput($data["bank_name"]);
  $bankInstitution = validateInput($data["bank_inst"]);
  $bankBranch = validateInput($data["bank_branch"]);
  $bankAccountNumber = validateInput($data["bank_account_number"]);
  $certDateIssued = validateInput($data["cert_date_issued"]);
  $certEspDate = validateInput($data["cert_esp_date"]);
  $certPlaceIssued = validateInput($data["cert_place_issued"]);
  $certImageBase64 = validateInput($data["cert_image_base_64"]); 
  $profilePictureBase64 = validateInput($data["profile_picture_base_64"]);
  $lat = validateInput($data["address_lat"]);
  $lng = validateInput($data["address_lng"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);
  

  addChefUser($connect, array(
    "name" => $name,
    "email" => $email,
    "password" => $password,
    "phone_number" => $phoneNumber,
    "home_address" => $address,
    "city" => $city,
    "province_state" => $provState,
    "country" => $country,
    "lat" => $lat,
    "lng" => $lng,
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
  ));
}


//login customer user
else if(isset($data["login_customer_user"]))
{
  //NOTE: May need to add additional server side validation
  $email = validateInput($data["email"]);
  $password = validateInput($data["password"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);

  loginCustomerUser($connect, array(
    "email" => $email,
    "password" => $password,
    "token" => $token
  ));
}


//login chef user
else if(isset($data["login_chef_user"]))
{
  //NOTE: May need to add additional server side validation
  $email = validateInput($data["email"]);
  $password = validateInput($data["password"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);
  
  loginChefUser($connect, array(
    "email" => $email,
    "password" => $password,
    "token" => $token
  ));
}


//Get all the data for user
else if(isset($data["get_user_data"]))
{
  //NOTE: May need to add additional server side validation
  $userId = validateInput($data["user_id"]);
  $userType = validateInput($data["get_user_data"]);
  
  getUserData($connect, array(
    "user_id" => $userId,
    "user_type" => $userType
  ));
}


//Update Customer User
else if(isset($data["update_customer_user"]))
{
  //NOTE: May need to add additional server side validation
  $id = validateInput($data["id"]);
  $name = validateInput($data["name"]);
  $oldEmail = validateInput($data["old_email"]);
  $email = validateInput($data["email"]);
  $password = $data["password"]; 
  $phoneNumber = validateInput($data["phone_number"]);
  $homeAddress = validateInput($data["home_address"]);
  $workAddress = validateInput($data["work_address"]);
  $workLat = validateInput($data["work_address_lat"]);
  $workLng = validateInput($data["work_address_lng"]);
  $paymentMethod = validateInput($data["payment_method"]);
  $profilePictureBase64 = validateInput($data["profile_picture_base_64"]);
  $lat = validateInput($data["home_address_lat"]);
  $lng = validateInput($data["home_address_lng"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);
  
  updateCustomerUser($connect, array(
    "id" => $id,
    "name" => $name,
    "old_email" => $oldEmail,
    "email" => $email,
    "password" => $password,
    "phone_number" => $phoneNumber,
    "home_address" => $homeAddress,
    "lat" => $lat,
    "lng" => $lng,
    "work_address" => $workAddress,
    "work_lat" => $workLat,
    "work_lng" => $workLng,
    "payment_method" => $paymentMethod,
    "profile_picture_base_64" => $profilePictureBase64,
    "token" => $token
  ));
}



//Update Chef User
else if(isset($data["update_chef_user"]))
{
  //NOTE: May need to add additional server side validation
  $id = validateInput($data["id"]);
  $name = validateInput($data["name"]);
  $oldEmail = validateInput($data["old_email"]);
  $email = validateInput($data["email"]);
  $password = $data["password"];
  $phoneNumber = validateInput($data["phone_number"]);
  $address = validateInput($data["address"]);
  $city = validateInput($data["city"]);
  $provState = validateInput($data["province_state"]);
  $country = validateInput($data["country"]);
  $bankName = validateInput($data["bank_name"]);
  $bankInstitution = validateInput($data["bank_inst"]);
  $bankBranch = validateInput($data["bank_branch"]);
  $bankAccountNumber = validateInput($data["bank_account_number"]);
  $certDateIssued = validateInput($data["cert_date_issued"]);
  $certEspDate = validateInput($data["cert_esp_date"]);
  $certPlaceIssued = validateInput($data["cert_place_issued"]);
  $certImageBase64 = validateInput($data["cert_image_base_64"]); 
  $profilePictureBase64 = validateInput($data["profile_picture_base_64"]);
  $lat = validateInput($data["address_lat"]);
  $lng = validateInput($data["address_lng"]);

  $token = str_replace("<", "", $data["token"]);
  $token = str_replace(">", "", $token);
  $token = str_replace(" ", "", $token);
  $token = validateInput($token);
  
  updateChefUser($connect, array(
    "id" => $id,
    "name" => $name,
    "old_email" => $oldEmail,
    "email" => $email,
    "password" => $password,
    "phone_number" => $phoneNumber,
    "home_address" => $address,
    "city" => $city,
    "province_state" => $provState,
    "country" => $country,
    "lat" => $lat,
    "lng" => $lng,
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
  ));
}


//Get Customers Redeem Points
else if(isset($data["get_redeem_points"]))
{
  $custId = validateInput($data["customer_id"]);

  getRedeemPoints($connect, array(
    "customer_id" => $custId,
  ));
}


//Add Customers Redeem Points
else if(isset($data["add_redeem_points"]))
{
  $custId = validateInput($data["customer_id"]);
  $orderId = validateInput($data["order_id"]);

  addRedeemPoints($connect, array(
    "customer_id" => $custId,
    "order_id" => $orderId
  ));
}


//Add User Rating
else if(isset($data["add_user_rating"]))
{
  $chefId = validateInput($data["user_id"]);
  $custId = validateInput($data["customer_id"]);
  $rating = validateInput($data["rating"]);
  $orderId = validateInput($data["order_id"]);
  $state = validateInput($data["state"]);

  addUserRating($connect, array(
    "chef_id" => $chefId,
    "customer_id" => $custId,
    "rating" => $rating,
    "order_id" => $orderId,
    "state" => $state
  ));
}


//add menu item
else if(isset($data["add_menu_item"]))
{
  //NOTE: May need to add additional server side validation
  $chefId = validateInput($data["chef_id"]);
  $menuItemName = validateInput($data["menu_item_name"]);
  $menuItemDesc = validateInput($data["menu_item_desc"]);
  $menuItemStartTime = validateInput($data["menu_item_start_time"]);
  $menuItemEndTime = validateInput($data["menu_item_end_time"]);
  $menuItemPrice = validateInput($data["menu_item_price"]);
  $menuItemQty = validateInput($data["menu_item_qty"]);
  $menuItemOrderPrepTime = validateInput($data["menu_item_order_prep_time"]);
  $menuItemTags = validateInput($data["menu_item_tags"]);
  $menuItemImageBase64 = validateInput($data["menu_item_picture_base_64"]);
  
  addMenuItem($connect, array(
    "chef_id" => $chefId,
    "menu_item_name" => $menuItemName,
    "menu_item_desc" => $menuItemDesc,
    "menu_item_start_time" => $menuItemStartTime,
    "menu_item_end_time" => $menuItemEndTime,
    "menu_item_price" => $menuItemPrice,
    "menu_item_qty" => $menuItemQty,
    "menu_item_order_prep_time" => $menuItemOrderPrepTime,
    "menu_item_tags" => $menuItemTags,
    "menu_item_picture_base_64" => $menuItemImageBase64
  ));
}

//update menu item
else if(isset($data["update_menu_item"]))
{
  //NOTE: May need to add additional server side validation
  $menuItemId = validateInput($data["menu_item_id"]);
  $chefId = validateInput($data["chef_id"]);
  $oldMenuItemName = validateInput($data["old_menu_item_name"]);
  $menuItemName = validateInput($data["menu_item_name"]);
  $menuItemDesc = validateInput($data["menu_item_desc"]);
  $menuItemStartTime = validateInput($data["menu_item_start_time"]);
  $menuItemEndTime = validateInput($data["menu_item_end_time"]);
  $menuItemPrice = validateInput($data["menu_item_price"]);
  $menuItemQty = validateInput($data["menu_item_qty"]);
  $menuItemOrderPrepTime = validateInput($data["menu_item_order_prep_time"]);
  $menuItemTags = validateInput($data["menu_item_tags"]);
  $menuItemImageBase64 = validateInput($data["menu_item_picture_base_64"]);
  
  updateMenuItem($connect, array(
    "menu_item_id" => $menuItemId,
    "chef_id" => $chefId,
    "old_menu_item_name" => $oldMenuItemName,
    "menu_item_name" => $menuItemName,
    "menu_item_desc" => $menuItemDesc,
    "menu_item_start_time" => $menuItemStartTime,
    "menu_item_end_time" => $menuItemEndTime,
    "menu_item_price" => $menuItemPrice,
    "menu_item_qty" => $menuItemQty,
    "menu_item_order_prep_time" => $menuItemOrderPrepTime,
    "menu_item_tags" => $menuItemTags,
    "menu_item_picture_base_64" => $menuItemImageBase64
  ));
}


//Remove menu item
else if(isset($data["remove_menu_item"]))
{
  $menuItemId = validateInput($data["menu_item_id"]);
  $chefId = validateInput($data["chef_id"]);
  
  removeMenuItem($connect, array(
    "menu_item_id" => $menuItemId,
    "chef_id" => $chefId
  ));
}




//Set drinks
else if(isset($data["set_drinks"]))
{
  $userId = validateInput($data["user_id"]);
  $drinks = $data["drinks"];
  
  setDrinks($connect, array(
    "user_id" => $userId,
    "drinks" => $drinks
  ));
}



//Add order to cart
else if(isset($data["add_cart_item"]))
{
  $menuItemId = validateInput($data["menu_item_id"]);
  $custId = validateInput($data["customer_id"]);
  $qty = validateInput($data["quantity"]);
  
  addItemToCart($connect, array(
    "customer_id" => $custId,
    "menu_item_id" => $menuItemId,
    "quantity" => $qty
  ));
}




//Remove cart item
else if(isset($data["remove_cart_item"]))
{
  $cartItemId = $data["cart_item_id"];
  $custId = validateInput($data["customer_id"]);

  removeCartItem($connect, array(
    "customer_id" => $custId,
    "cart_item_id" => $cartItemId
  ));
}




//Process order
else if(isset($data["process_order_add"]))
{
  $custId = validateInput($data["customer_id"]);
  $chefId =  validateInput($data["chef_id"]);
  $notes = validateInput($data["notes"]);
  $tip = validateInput($data["tip"]);
  $drinks = $data["drinks"];
  
  processOrderAdd($connect, array(
    "customer_id" => $custId,
    "chef_id" => $chefId,
    "notes" => $notes,
    "tip" => $tip,
    "drinks" => $drinks,
  ));
}


//Process order state change
else if(isset($data["process_order_state_change"]))
{
  $userId = validateInput($data["user_id"]);
  $orderId =  validateInput($data["order_id"]);
  $customerId = validateInput($data["customer_id"]);
  $state = validateInput($data["state"]);

  processOrderState($connect, array(
    "user_id" => $userId,
    "order_id" => $orderId,
    "customer_id" => $customerId,
    "state" => $state
  ));
}


//Update Device Token
else if(isset($data["update_apns_token"]))
{
  $userId = validateInput($data["user_id"]);
  $userType = validateInput($data["user_type"]);
  
  $token = null;
  $tokenColumn = "token";
  if(isset($data["token"]))
  {
    $token = str_replace("<", "", $data["token"]);
    $token = str_replace(">", "", $token);
    $token = str_replace(" ", "", $token);
    $token = validateInput($token);
    $tokenColumn = "token";
  }
  else if(isset($data["fcm_token"]))
  {
    $token = validateInput($data["fcm_token"]);
    $tokenColumn = "fcm_token";
  }
  

  updateAPNSToken($connect, array(
    "user_id" => $userId,
    "user_type" => $userType,
    "token" => $token,
    "token_column" => $tokenColumn
  ));
}


//Remove Device Token
else if(isset($data["remove_apns_token"]))
{
  $userId = validateInput($data["user_id"]);
  $userType = validateInput($data["user_type"]);


  removeAPNSToken($connect, array(
    "user_id" => $userId,
    "user_type" => $userType
  ));
}


//Load image
else if(isset($data["get_image"]))
{
  $imagePath = validateInput($data["path"]);

  getImage($connect, array(
    "image_path" => $imagePath,
  ));
}

//Search for menu item
else if(isset($data["search_query"]))
{
  $query = validateInput($data["query"]);

  searchQuery($connect, array(
    "query" => $query
  ));
}
//Get Ephemeral key (Session Key)
else if(isset($data["SS_ephemeral_key"]))
{

  require_once(ROOT_DIR . "vendor/autoload.php");

  $apiVersion = validateInput($data["api_version"]);
  $apiKey = validateInput($data["api_key"]);
  $customerId = validateInput($data["customer_id"]);
  
  \Stripe\Stripe::setApiKey($apiKey);

  SSEphemeralKey($connect, array(

    "api_version" => $apiVersion,
    "customer_id" => $customerId
  ));
}


?>


























