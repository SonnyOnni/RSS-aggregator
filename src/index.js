/* eslint-disable no-param-reassign */
/* eslint-disable quotes */
import '../style.css';
import 'bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import ru from './lng/ru.js';
import en from './lng/en.js';
import parseRSS from './parser';
import updatePosts from './updater';
import view from './view';

const defaultLanguage = 'ru';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: defaultLanguage,
  debug: false,
  resources: {
    ru,
    en,
  },
});

yup.setLocale({
  mixed: {
    notOneOf: 'feedback.errors.loaded',
  },
  string: {
    required: 'feedback.errors.empty_field',
    url: 'feedback.errors.invalid',
  },
});

/* Connection textContent and i18next for ru-en traslation */
const header = document.querySelector('h1');
header.textContent = i18nextInstance.t('header', { lng: `${defaultLanguage}` });
const pAfterHeader = document.querySelector('.lead');
pAfterHeader.textContent = i18nextInstance.t('paragraph.afterHeader', { lng: `${defaultLanguage}` });
const pExample = document.querySelector('.example');
pExample.textContent = i18nextInstance.t('paragraph.example', { lng: `${defaultLanguage}` });
const label = document.querySelector('label');
label.textContent = i18nextInstance.t('form.input', { lng: `${defaultLanguage}` });
const btn = document.querySelector('.btn-submit');
btn.textContent = i18nextInstance.t('form.btn', { lng: `${defaultLanguage}` });

/* Validation & proxy */
const getYupSchema = (urls) => yup.string().required().url().notOneOf(urls);

const createProxy = (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;

const generatorId = () => {
  let currentId = 0;

  return () => {
    currentId += 1;
    const newId = currentId;
    return newId;
  };
};

const getId = generatorId();

/* State */
const state = {
  processState: 'initialized',
  rssForm: {
    processState: 'filling',
    currentUrl: null,
  },
  uiState: {
    readPostsId: [],
    feedback: null,
  },
  urls: [],
  data: {
    feeds: [],
    posts: [],
  },
};

/* RSS form */
const form = document.querySelector('form');
const input = document.querySelector('input');

const watchedState = view(state, i18nextInstance);

input.addEventListener('change', (e) => {
  watchedState.rssForm.currentUrl = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  watchedState.rssForm.processState = 'validating';
  const schema = getYupSchema(watchedState.urls);
  let proxyUrl;

  schema.validate(watchedState.rssForm.currentUrl)
    .then((link) => {
      watchedState.rssForm.processState = 'valid';
      watchedState.processState = 'loading';
      proxyUrl = createProxy(link);
      return axios.get(proxyUrl);
    })
    .then((response) => response.data.contents)
    .then((content) => {
      const parsedContent = parseRSS(content);
      const { currentFeed, currentPosts } = parsedContent;

      if (!currentFeed || !currentPosts) {
        throw new Error('Parser Error');
      }

      currentFeed.id = getId();
      currentPosts.forEach((post) => {
        post.feedId = currentFeed.id;
        post.id = getId();
      });

      watchedState.data.feeds.push(currentFeed);
      watchedState.data.posts.push(...currentPosts);
      watchedState.urls.push(watchedState.rssForm.currentUrl);

      watchedState.processState = 'loadedSuccess';
      watchedState.uiState.feedback = 'feedback.valid';
      watchedState.rssForm.processState = 'filling';
      return currentFeed.id;
    })
    .then((feedId) => {
      watchedState.processState = 'updating';
      return setTimeout(() => updatePosts(watchedState, proxyUrl, feedId, getId), 5000);
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': {
          const [errorCode] = err.errors;
          watchedState.rssForm.processState = 'invalid';
          watchedState.uiState.feedback = errorCode;
          break;
        }

        case 'AxiosError':
          if (err.message === 'Network Error') {
            watchedState.processState = 'networkErr';
            watchedState.uiState.feedback = 'feedback.errors.network';
          }
          break;

        case 'Error':
          if (err.message === 'Parser Error') {
            watchedState.processState = 'parserErr';
            watchedState.uiState.feedback = 'feedback.errors.parser';
          }
          break;

        default:
          throw new Error(`Unknown error ${err}`);
      }

      console.error(err);
    });
});
