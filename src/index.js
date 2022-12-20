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

/* validation */

const schema = yup.string()
  .matches(
    /((https|http):\/\/)?rss$/,
  ).required();

/* state */

const state = {
  currentUrl: '',
  isValid: {
    result: '',
    feedback: '',
  },
  urls: [],
  feeds: [],
  posts: [],
};

/* RSS parse */

const getRandomID = (max) => Math.floor(Math.random() * max);

const parseRSS = (url) => {
  const parser = new DOMParser();

  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(`${url}`)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const htmlString = data.contents;
      const createFeedId = getRandomID(1000);
      const doc = parser.parseFromString(htmlString, "application/xml");
      const feedTitleEl = doc.querySelector('channel title');
      const feedTitle = feedTitleEl.textContent;
      const feedDescEl = doc.querySelector('channel description');
      const feedDesc = feedDescEl.textContent;

      state.feeds.push({ feedID: createFeedId, feedTitle: `${feedTitle}`, feedDesc: `${feedDesc}` });

      const items = doc.querySelectorAll('item');

      items.forEach((item) => {
        const postTitleEl = item.querySelector('title');
        const postTitle = postTitleEl.textContent;
        const postDescEl = item.querySelector('description');

        let postDesc;
        if (postDescEl === null) {
          postDesc = '';
        } else {
          postDesc = postDescEl.textContent;
        }

        const postLinkEl = item.querySelector('link');
        const postLink = postLinkEl.textContent;

        state.posts.push({
          feedId: createFeedId, postTitle: `${postTitle}`, postDesc: `${postDesc}`, postLink: `${postLink}`, postID: getRandomID(1000),
        });
      });

      console.log(state.feeds);
      console.log(state.posts);
    });

  /* axios.get(`${url}`)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
      throw (e);
    }); */
};

const watchedState = onChange(state, (path, value) => {
  schema.isValid(value)
    .then((valid) => {
      if (valid === true && !state.urls.includes(value)) {
        state.urls.push(value);
        state.isValid.result = 'valid';
        state.isValid.feedback = i18next.t('feedback.valid', { lng: 'ru' });

        parseRSS(value);
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

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  state.currentUrl = formData.get('url');
  watchedState.value = formData.get('url');
});
