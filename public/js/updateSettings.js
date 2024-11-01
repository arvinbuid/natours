/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  // check if url is to update user password
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.replace(type[0], type[0].toUpperCase())} updated successfully`
      );
      // reload the window after user is updated
      window.setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
