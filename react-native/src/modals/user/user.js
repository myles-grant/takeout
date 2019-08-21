import { AsyncStorage } from 'react-native';
import Global from '../../../src/global.js';
import Ajax from '../../../src/util/ajax.js';

const asyncStorageModalId_user = '@TakeoutModal:user';

const parseUserJSON = (role) => {

  let user = null;
  if (role == 'customer') {
    user = {
      id: parseInt(returnData.id),
      rating: parseFloat(returnData.rating),
      role: this.props.navigation.state.params.role,
      name: returnData.name,
      email: returnData.email,
      phoneNumber: returnData.phone_number,
      profile: { uri: returnData.profile_picture_base_64 },
      token: returnData.token,
      location: {
        home: {
          name: returnData.home_address,
          lat: returnData.home_address_lat,
          lon: returnData.home_address_lng,
        },
        work: {
          name: returnData.work_address,
          lat: returnData.work_address_lat,
          lon: returnData.work_address_lng,
        },
      },
      bank: {
        name: '',
        institution: '',
        branch: '',
        account: '',
      },
      certificate: {
        dateIssued: '',
        espDate: '',
        certImgSrc: '',
        location: {
          name: 'Place Certificate Signed',
          lat: 0.00,
          lon: 0.00,
        },
      },
      wallet: {
        depositCycle: '',
        amount: 0.00,
        cps: 0.00,
        rtd: 0.00,
      },
    };
  } else if (role == 'chef') {
    user = {
      id: parseInt(returnData.id),
      rating: 0,
      role: this.props.navigation.state.params.role,
      name: returnData.name,
      email: returnData.email,
      phoneNumber: returnData.phone_number,
      profile: { uri: returnData.profile_picture_base_64 },
      token: returnData.token,
      location: {
        home: {
          name: returnData.home_address,
          lat: parseFloat(returnData.home_address_lat),
          lon: parseFloat(returnData.home_address_lng),
        },
        work: {
          name: returnData.work_address,
          lat: parseFloat(returnData.work_address_lat),
          lon: parseFloat(returnData.work_address_lng),
        },
      },
      bank: {
        name: returnData.bank_name,
        institution: returnData.bank_inst,
        branch: returnData.bank_branch,
        account: returnData.bank_account_number,
      },
      certificate: {
        dateIssued: returnData.cert_date_issued,
        espDate: returnData.cert_esp_date,
        certImgSrc: { uri: returnData.cert_image_base_64 },
        location: {
          name: 'Place Certificate Signed',
          lat: 0.00,
          lon: 0.00,
        },
      },
      wallet: {
        depositCycle: returnData.deposit_cycle,
        amount: parseFloat(returnData.wallet).toFixed(2),
        cps: 0.00,
        rtd: 0.00,
      },
    };
  }

  return user
}


export default {

  async getUser(logout, _user) {
    //console.log('Fetch User...');
    let user = _user;
    if (user == null) {
      // Check store
      try {
        let data = await AsyncStorage.getItem(asyncStorageModalId_user);
        data = JSON.parse(data);
        if (data != undefined && data != null && data !== null) {
          //console.log('User retrieved: Item stored in asyncStore');
          return data;
        }

        // Failed to retrieve user data..
        // Logout user.. user required
        // ..
        //console.log('No User Found');

        return null;
      } catch (error) {
        //console.log('Failed to fetch User: ', error);
        return null;
      }
    } else {
      //console.log('User retrieved: Item stored in state');
      return user;
    }
  },

  setUser(user) {
    //console.log('Saving User');
    try {
      AsyncStorage.setItem(asyncStorageModalId_user, JSON.stringify(user));
      return user;
    } catch (error) {
      //console.log('Error saving user: ', error);
      return null;
    }
  },


  getEmptyUserObject() {
    return {
      id: Global.emptyUser(),
      rating: 0,
      role: '',
      name: '',
      email: '',
      oldEmail: '',
      password: '',
      phoneNumber: '',
      profile: require('../../../assets/images/profile-placeholder-icon/profile-placeholder-icon.png'),
      profileUri: '',
      token: '',
      location: {
        home: {
          name: 'Home Address',
          long_name: 'Home Address Toronto ON M9V 3R3',
          lat: 0.00,
          lon: 0.00,
        },
        work: {
          name: 'Work Address',
          lat: 0.00,
          lon: 0.00,
        },
      },
      bank: {
        name: '',
        institution: '',
        branch: '',
        account: '',
      },
      certificate: {
        dateIssued: 'Date Issued',
        espDate: 'Esp Issued',
        certImgSrc: '',
        location: {
          name: 'Place Certificate Signed',
          lat: 0.00,
          lon: 0.00,
        },
      },
      wallet: {
        depositCycle: '',
        amount: 0.00,
        cps: 0.00,
        rtd: 0.00,
      },
    };
  },

  /* user = {
    id: 1,
    rating: 5,
    role: 'customer',
    name: 'Myles',
    email: 'pineconegrant@gmail.com',
    phoneNumber: '6479933920',
    profile: require('../../../assets/images/profile-placeholder-icon/profile-placeholder-icon.png'),
    location: {
      home: {
        name: 'Home Address',
        lat: 123.132323,
        lon: 23.232343,
      },
      work: {
        name: 'Work Address',
        lat: 123.132323,
        lon: 23.232343,
      },
    },
    bank: {
      name: 'TD Canada Trust',
      institution: 'TD Inst.',
      branch: 'TD Branch',
      account: '12345467890',
    },
    certificate: {
      dateIssed: '01/10/1993',
      espIssed: '01/11/1993',
      certImgSrc: require('../../../assets/images/profile-placeholder-icon/profile-placeholder-icon.png'),
      location: {
        name: 'Toronto',
        lat: 232.24353,
        lon: 43.434332,
      },
    },
    wallet: {
      depositCycle: 'Weekly',
      amount: 0.00,
      cps: 0.00,
      rtd: 0.00,
    },
  }; */
};
