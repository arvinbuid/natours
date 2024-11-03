/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    // 1) Send a POST request to the backend to create a checkout session
    const response = await axios.post(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Get the checkout URL from the backend response
    const checkoutUrl = response.data.session.url;

    // 3) Redirect the user to the PayMongo checkout page
    window.location.href = checkoutUrl;
  } catch (err) {
    console.log(err);
    showAlert('error', 'Failed to book tour. Please try again later.');
  }
};
