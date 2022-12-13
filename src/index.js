import '../style.css';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import view from './view';

const schema = yup.string()
  .matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  ).required();

const state = {
  currentUrl: '',
  urls: [],
  isValid: 'valid',
};

const input = document.querySelector('input');

const watchedState = onChange(state, (path, value) => {
  schema
    .isValid(value)
    .then((valid) => {
      console.log(valid);
      if (valid === true && !state.urls.includes(value)) {
        state.urls.push(value);
        state.isValid = 'valid';
      } else if (state.urls.includes(value)) {
        state.isValid = 'loaded';
      } else {
        state.isValid = 'invalid';
      }

      view(state);
    });
});

input.addEventListener('change', (e) => {
  state.currentUrl = e.target.value;
  watchedState.value = e.target.value;
});
