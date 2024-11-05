/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully');

      // force page reload after 1.5 seconds to ensure user sees the logout message
      window.setTimeout(() => {
        location.reload(true); // force reload from server, not from browser cache
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out. Please try again');
  }
};
