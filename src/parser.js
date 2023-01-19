const parseRSS = (linkContent, watchedState) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(linkContent, 'text/xml');

  let currentFeed;
  const feedTitleEl = doc.querySelector('channel > title');
  const feedDescriptionEl = doc.querySelector('channel > description');

  if (!feedTitleEl || !feedDescriptionEl) {
    currentFeed = null;
  } else {
    const feedTitle = feedTitleEl.textContent;
    const feedDescription = feedDescriptionEl.textContent;
    currentFeed = { feedTitle, feedDescription };
  }

  let currentPosts;
  const items = doc.querySelectorAll('channel > item');

  if (!items) {
    currentFeed = null;
  } else {
    const posts = Array.from(items)
      .map((item) => {
        const postTitleEl = item.querySelector('title');
        const postDescriptionEl = item.querySelector('description');
        const postLinkEl = item.querySelector('link');
        const postGuidEl = item.querySelector('guid');

        const title = postTitleEl.textContent;
        const description = postDescriptionEl.textContent;
        const link = postLinkEl.textContent;
        const guid = postGuidEl.textContent;

        return {
          title, description, link, guid,
        };
      });

    currentPosts = posts;
  }

  if (!currentFeed || !currentPosts) {
    watchedState.parserProcess = 'parserErr';
    watchedState.uiState.feedback = 'feedback.errors.parser';
    throw new Error('Parser Error');
  }

  return { currentFeed, currentPosts };
};

export default parseRSS;
