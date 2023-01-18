import onChange from 'on-change';
import { renderFeeds, renderPosts } from './render';

const checkParserProcess = (elements, parserProcess) => {
  const { form, input, btn } = elements;

  switch (parserProcess) {
    case 'loading':
      btn.disabled = true;
      break;

    case 'loadedSuccess':
      form.reset();
      input.focus();
      break;

    case 'initialized':
      break;

    case 'updating':
      break;

    case 'parserErr':
      btn.disabled = false;
      break;

    case 'networkErr':
      btn.disabled = false;
      break;

    default:
      throw new Error(`Unknown process state "${parserProcess}"`);
  }
};

const checkValidationProcess = (elements, validationProcess) => {
  const { input, btn } = elements;

  switch (validationProcess) {
    case 'filling':
      btn.disabled = false;
      break;

    case 'validating':
      btn.disabled = true;
      break;

    case 'valid':
      btn.disabled = false;
      input.classList.remove('is-invalid');
      break;

    case 'invalid':
      btn.disabled = false;
      input.classList.add('is-invalid');
      break;

    default:
      throw new Error(`Unknown form process state "${validationProcess}"`);
  }
};

const renderFeedback = (elements, value, i18nInstance) => {
  const { feedback } = elements;

  feedback.textContent = i18nInstance.t(value);

  switch (value) {
    case 'feedback.valid':
      feedback.classList.replace('text-danger', 'text-success');
      break;

    case 'feedback.errors.empty_field':
    case 'feedback.errors.loaded':
    case 'feedback.errors.invalid':
    case 'feedback.errors.network':
    case 'feedback.errors.parser':
    case 'feedback.errors.type':
      feedback.classList.replace('text-success', 'text-danger');
      break;

    default:
      throw new Error(`Unknown feedback code "${value}"`);
  }
};

const checkLinkStatus = (readPostsId) => {
  const linksArr = document.querySelectorAll('.posts ul .list-group-item a');
  const readPostsIdColl = new Set(readPostsId);

  linksArr.forEach((a) => {
    if (readPostsIdColl.has(a.dataset.id)) {
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    }
  });
};

/* View */
const view = (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'parserProcess':
        checkParserProcess(elements, value);
        break;

      case 'rssForm.validationProcess':
        checkValidationProcess(elements, value);
        break;

      case 'uiState.feedback':
        renderFeedback(elements, value, i18nInstance);
        break;

      case 'uiState.readPostsId':
        checkLinkStatus(value);
        break;

      case 'data.feeds':
        renderFeeds(elements, value, i18nInstance);
        break;

      case 'data.posts':
        renderPosts(elements, value, i18nInstance, watchedState);
        break;

      case 'lng':
        break;

      case 'rssForm.currentUrl':
      case 'urls':
        break;

      default:
        throw new Error(`Unwatched path ${path}`);
    }
  });

  return watchedState;
};

export default view;
