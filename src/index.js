/* eslint-disable quotes */
import '../style.css';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './lng/ru.js';
import en from './lng/en.js';
import view from './view';

i18next.init({
  lng: 'ru',
  resources: {
    ru,
    en,
  },
});

/* connection TextContent and i18next for ru-en traslation */
const header = document.querySelector('h1');
header.textContent = i18next.t('header', { lng: 'ru' });
const pAfterHeader = document.querySelector('.lead');
pAfterHeader.textContent = i18next.t('paragraph.afterHeader', { lng: 'ru' });
const pExample = document.querySelector('.example');
pExample.textContent = i18next.t('paragraph.example', { lng: 'ru' });
const label = document.querySelector('label');
label.textContent = i18next.t('form.input', { lng: 'ru' });
const btn = document.querySelector('button');
btn.textContent = i18next.t('form.btn', { lng: 'ru' });

/* work with form */
const form = document.querySelector('form');

const schema = yup.string()
  .matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  ).required();

const state = {
  currentUrl: '',
  urls: [],
  isValid: {
    result: '',
    feedback: '',
  },
};

const watchedState = onChange(state, (path, value) => {
  schema.isValid(value)
    .then((valid) => {
      if (valid === true && !state.urls.includes(value)) {
        state.urls.push(value);
        state.isValid.result = 'valid';
        state.isValid.feedback = i18next.t('feedback.valid', { lng: 'ru' });
      } else if (state.urls.includes(value)) {
        state.isValid.result = 'loaded';
        state.isValid.feedback = i18next.t('feedback.loaded', { lng: 'ru' });
      } else {
        state.isValid.result = 'invalid';
        state.isValid.feedback = i18next.t('feedback.invalid', { lng: 'ru' });
      }

      view(state);
    });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  state.currentUrl = formData.get('url');
  watchedState.value = formData.get('url');
});
