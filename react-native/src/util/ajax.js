const apiHost = 'https://www.ihearttakeout.ca/Live_site/connection.php';

export default {

  async fetchRequest(param) {
    try {
      const response = await fetch(apiHost + param.endpoint, {
        method: param.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param.body),
      });

      console.log('**| FetchRequest');
      console.log('**| EndPoint: ', param.endpoint);
      console.log('**| Method: ', param.method);
      console.log('**| Body: ', param.body);
      console.log('**| Raw Response: ', response);
      console.log('************');

      let responseJson = await response.json();
      responseJson = JSON.stringify(responseJson);

      console.log('**| Response: ', responseJson);

      return JSON.parse(responseJson);
    } catch (error) {
      console.log('Fetch Failed: ', error);
      return null;
    }
  },


  checkResponse(response) {
    try {
      if (response != null && response.status != null && response.status == 'success') {
        return true;
      }

      return false;
    } catch (error) {
      console.log('Error checking response: ', error);
      return false;
    }
  },

};
