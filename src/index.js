import '../style.css';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import view from './view';

i18next.init({
  lng: 'ru',
  resourses: {
    ru: {
      translation: {
        header: 'RSS агрегатор',
        paragraph: {
          afterHeader: 'Начните читать RSS сегодня! Это легко, это красиво.',
          example: 'Пример: https://ru.hexlet.io/lessons.rss',
        },
        form: {
          input: 'Ссылка RSS',
          btn: 'Добавить',
        },
        feedback: {
          valid: 'RSS успешно загружен',
          loaded: 'RSS уже существует',
          invalid: 'Ссылка должна быть валидным URL',
        },
      },
    },
  },
});

console.log(i18next.t('header'));

const schema = yup.string()
  .matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  ).required();

const state = {
  currentUrl: '',
  urls: [],
  isValid: {
    result: 'valid',
    feedback: '',
  },
};

const input = document.querySelector('input');

const watchedState = onChange(state, (path, value) => {
  schema
    .isValid(value)
    .then((valid) => {
      console.log(valid);
      if (valid === true && !state.urls.includes(value)) {
        console.log(state.isValid.feedback);
        state.urls.push(value);
        state.isValid.result = 'valid';
        state.isValid.feedback = i18next.t('feedback.valid');
      } else if (state.urls.includes(value)) {
        console.log(state.isValid.feedback);
        state.isValid.result = 'loaded';
        state.isValid.feedback = i18next.t('feedback.loaded');
      } else {
        console.log(state.isValid.feedback);
        state.isValid.result = 'invalid';
        state.isValid.feedback = i18next.t('feedback.invalid');
      }

      view(state);
    });
});

input.addEventListener('change', (e) => {
  state.currentUrl = e.target.value;
  watchedState.value = e.target.value;
});
