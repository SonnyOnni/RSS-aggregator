import onChange from 'on-change';

/* HTML elements */
const htmlElements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  btn: document.querySelector('button'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};

const checkProcessState = (elements, processState) => {
  const { form, input, btn } = elements;

  switch (processState) {
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
      throw new Error(`Unknown process state "${processState}"`);
  }
};

const checkFormProcessState = (elements, formProcessState) => {
  const { input, btn } = elements;

  switch (formProcessState) {
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
      throw new Error(`Unknown form process state "${formProcessState}"`);
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

/* Render feeds and posts */
const renderFeeds = (elements, values) => {
  const { feeds } = elements;

  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('card', 'border-0');

  const feedsTitle = document.createElement('div');
  feedsTitle.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Фиды';

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  values.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.feedTitle;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.feedDescription;

    li.append(h3, p);
    ul.prepend(li);
  });

  feedsTitle.append(h2);
  feedsContainer.append(feedsTitle, ul);

  feeds.innerHTML = '';
  feeds.append(feedsContainer);
};

const renderPosts = (elements, values) => {
  const { posts } = elements;

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');

  const postsTitle = document.createElement('div');
  postsTitle.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Посты';

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  values.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');

    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.dataset.id = post.id;
    a.textContent = post.title;

    /* Button trigger modal */
    const modalBtn = document.createElement('button');
    modalBtn.setAttribute('type', 'button');
    modalBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalBtn.dataset.id = post.id;
    modalBtn.dataset.bsToggle = 'modal';
    modalBtn.dataset.bsTarget = '#modal';
    modalBtn.textContent = 'Просмотр';

    /* Modal */
    modalBtn.addEventListener('click', (e) => {
      const { bsTarget } = e.target.dataset;
      const modal = document.querySelector(bsTarget);
      const modalTitle = modal.querySelector('.modal-title');
      modalTitle.textContent = post.title;
      const modalBody = modal.querySelector('.modal-body');
      modalBody.textContent = post.description;
      const modalLinkBtn = document.querySelector('.modal-footer a.full-article');
      modalLinkBtn.setAttribute('href', post.link);
      modalLinkBtn.textContent = 'Читать полностью';
      const modalCloseBtn = document.querySelector('.modal-footer button');
      modalCloseBtn.textContent = 'Закрыть';
    });

    li.append(a, modalBtn);
    ul.prepend(li);
  });

  postsTitle.append(h2);
  postsContainer.append(postsTitle, ul);

  posts.innerHTML = '';
  posts.append(postsContainer);
};

/* View */
const view = (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'processState':
        checkProcessState(htmlElements, value);
        break;

      case 'rssForm.processState':
        checkFormProcessState(htmlElements, value);
        break;

      case 'uiState.feedback':
        renderFeedback(htmlElements, value, i18nInstance);
        break;

      case 'uiState.readPostsId':
        checkLinkStatus(value);
        break;

      case 'data.feeds':
        renderFeeds(htmlElements, value);
        break;

      case 'data.posts':
        renderPosts(htmlElements, value);
        checkLinkStatus(watchedState.uiState.readPostsId);
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
