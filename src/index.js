import '../style.css';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import view from './view';

const schema = yup.string()
  .matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    'Enter correct url!',
  ).required();

const state = {
  currentUrl: '',
  urls: [],
  isValid: true,
};

const input = document.querySelector('input');

const watchedState = onChange(state, (value) => {
  schema
    .isValid(value)
    .then((valid) => {
      if (valid === true && !state.urls.includes(value)) {
        state.urls.push(value);
        state.isValid = true;
      } else {
        state.isValid = false;
      }

      view(state);
    });
});

input.addEventListener('change', (e) => {
  state.currentUrl = e.target.value;
  watchedState.value = e.target.value;
});
