export const renderFeeds = (elements, values, i18nextInstance) => {
  const { feeds } = elements;

  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('card', 'border-0');

  const feedsTitle = document.createElement('div');
  feedsTitle.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t('content.feeds', { lng: 'ru' });

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

export const renderPosts = (elements, values, i18nextInstance, watchedState) => {
  const { posts } = elements;

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');

  const postsTitle = document.createElement('div');
  postsTitle.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t('content.posts', { lng: 'ru' });

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  values.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    li.addEventListener('click', (event) => {
      const { id } = event.target.dataset;
      watchedState.uiState.readPostsId.push(id);
    });

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
