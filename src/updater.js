import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parser';

const updatePosts = (watchedState, proxyUrl, feedId) => axios.get(proxyUrl)
  .then((response) => {
    const { currentPosts: requestedPosts } = parseRSS(response.data.contents);
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
      post.id = _.uniqueId();
    });

    watchedState.data.posts.push(...newPosts);
  })
  .catch((err) => console.error('error', err.message))
  .finally(() => setTimeout(() => updatePosts(watchedState, proxyUrl, feedId), 5000));

export default updatePosts;
