const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


//Set onWrite listener on path
//Listen for new orders & order state changes
exports.orders = functions.database.ref('orders/{userId}/{orderId}/').onWrite((snapshot, context) => 
{

	if(snapshot.after.exists())
	{
		const orderObj = snapshot.after.val();


		//Send FCM APNS to device
		const token = orderObj.token;
		const state = orderObj.state;

		let title = "Order Update";
		let mesg = "Check on your order!";
		if(state == "pending")
		{
			title = "New Order";
			msg = "You have a new order. Please choose to accept or decline!";
		}
		else if(state == "preparing")
		{
			title = "Order";
			msg = "Your order is being prepared!";
		}
		else if(state == "declined")
		{
			title = "Order";
			msg = "Your order has been declined";
		}
		else if(state == "RFD")
		{
			title = "Order";
			msg = "Your order is prepared and for delivery.";
		}
		else if(state == "RFP")
		{
			title = "Order";
			msg = "Your order is ready for pickup!";
		}

		const payload = {
			notification: {
				title: title,
				body: msg,
				sound: 'default'
			}
		};

		if(token) {
			admin.messaging().sendToDevice(token, payload);
		}
	}

	return null;
});