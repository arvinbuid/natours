/* eslint-disable */

import { displayMap } from './mapBox';
import { login } from './userLogin';
import { logout } from './userLogout';
import { signup } from './userSignup';
import { updateSettings } from './updateSettings';
import { bookTour } from './paymongo';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userFormPassword = document.querySelector('.form-user-password');
const userFormData = document.querySelector('.form-user-data');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    signup(name, email, password, passwordConfirm);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userFormData)
  userFormData.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userFormPassword) {
  userFormPassword.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...'; // set button text to 'Updating...'
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    // Reset form inputs and set button text to 'Save Password'
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'Save Password'; // set button text to 'Save Password'
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
