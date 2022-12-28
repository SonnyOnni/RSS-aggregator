const posts = document.querySelector('.posts');
const feeds = document.querySelector('.feeds');

const feedsContainer = document.createElement('div');
feedsContainer.classList.add('card', 'border-0', 'rss-container');
feeds.append(feedsContainer);
const feedsTitle = document.createElement('div');
feedsTitle.classList.add('card-body');
feedsContainer.append(feedsTitle);
const feedsH2 = document.createElement('h2');
feedsH2.classList.add('card-title', 'h4');
feedsTitle.append(feedsH2);
const feedsUl = document.createElement('ul');
feedsUl.classList.add('list-group', 'border-0', 'rounded-0');

const postsContainer = document.createElement('div');
postsContainer.classList.add('card', 'border-0', 'rss-container');
posts.append(postsContainer);
const postsTitle = document.createElement('div');
postsTitle.classList.add('card-body');
postsContainer.append(postsTitle);
const postsH2 = document.createElement('h2');
postsH2.classList.add('card-title', 'h4');
postsTitle.append(postsH2);
const postsUl = document.createElement('ul');
postsUl.classList.add('list-group', 'border-0', 'rounded-0');

const newView = (newFeeds, newPosts) => {
  /* Feeds */
  feedsH2.textContent = 'Фиды';

  const lastFeedIndex = newFeeds.length - 1;
  const currentFeed = newFeeds[lastFeedIndex];
  const currentFeedId = newFeeds[lastFeedIndex].feedID;

  const liFeed = document.createElement('li');
  liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = currentFeed.feedTitle;
  liFeed.append(h3);
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = currentFeed.feedDesc;
  liFeed.append(p);
  feedsUl.prepend(liFeed);

  feedsContainer.append(feedsUl);

  /* Posts */
  postsH2.textContent = 'Посты';

  const suitabePosts = newPosts.filter(({ feedId }) => feedId === currentFeedId);

  suitabePosts.map(({ postTitle, postLink }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    link.setAttribute('href', `${postLink}`);
    link.setAttribute('data-id', '2');
    link.setAttribute('target', '_black');
    link.setAttribute('rel', 'noopener noreferrer');
    link.classList.add('fw-bold');
    link.textContent = postTitle;
    li.append(link);
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-id', '2');
    btn.setAttribute('data-bs-toggle', 'madal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.textContent = 'Просмотр';
    li.append(btn);
    postsUl.prepend(li);

    postsContainer.append(postsUl);
    return true;
  });
};

export default newView;
