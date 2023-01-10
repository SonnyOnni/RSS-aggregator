/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import axios from 'axios';
import parseRSS from './parser';

const updatePosts = (watchedState, proxyUrl, feedId, getIdFn) => axios.get(proxyUrl)
  .then((response) => response.data.contents)
  .then((content) => {
    const { currentPosts: requestedPosts } = parseRSS(content);
    if (!requestedPosts) {
      throw new Error('Parser Error');
    }

    return requestedPosts;
  })
  .then((requestedPosts) => {
    const loadedPosts = watchedState.data.posts.filter((post) => post.feedId === feedId);
    const loadedPostsGuids = loadedPosts.map((post) => post.guid);
    const coll = new Set(loadedPostsGuids);
    const newPosts = requestedPosts.filter(({ guid }) => !coll.has(guid));

    if (newPosts.length === 0) {
      return;
    }

    newPosts.forEach((post) => {
      post.feedId = feedId;
      post.id = getIdFn();
    });

    watchedState.data.posts.push(...newPosts);
    return newPosts;
  })
  .catch((err) => console.error(err.message))
  .finally(() => setTimeout(() => updatePosts(watchedState, proxyUrl, feedId, getIdFn), 5000));

export default updatePosts;
