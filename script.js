const article = document.getElementsByTagName('article')[0];
const loading = document.getElementsByClassName('loading')[0];
const footer = document.getElementById('footer');

const date = new Date(2020, 4, 25, 0, 0, 0, 0);

let dataLoading = false;
let postCount = 0;
let new_posts = '';

const createCard = () => {
  let new_post = '';
  const cardPromise = new Promise((resolve, reject) => {
    const postReq = new XMLHttpRequest();

    postReq.open(
      'GET',
      `https://dummyapi.io/data/v1/post?page=${postCount++}&limit=5`
    );
    postReq.onload = () => {
      if (postReq.status === 200) {
        const response = JSON.parse(postReq.response);
        resolve(response);
      } else {
        reject('Data not found');
      }
    };

    postReq.setRequestHeader('app-id', window.API_KEY);
    postReq.send();
  });

  cardPromise.then((postResponse) => {
    const commentsPromise = [];
    for (let i = 0; i < 5; i++) {
      commentsPromise[i] = new Promise((resolve, reject) => {
        const commentsReq = new XMLHttpRequest();
        commentsReq.open(
          'GET',
          `https://dummyapi.io/data/v1/post/${postResponse.data[i].id}/comment`
        );
        commentsReq.onload = () => {
          if (commentsReq.status === 200) {
            const response = JSON.parse(commentsReq.response);
            resolve(response);
          } else {
            reject('Data not found');
          }
        };
        commentsReq.setRequestHeader('app-id', window.API_KEY);
        commentsReq.send();
      });
    }

    const allPromises = Promise.all(commentsPromise);

    allPromises.then((commentsResponse) => {
      for (let i = 0; i < 5; i++) {
        const timestamp = new Date(postResponse.data[i].publishDate);
        const msDiff = date.getTime() - timestamp.getTime();
        const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor(
          (msDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        new_post = `<div class="card" id="postCard">
                <div class="upvoteBar">
                  <div class="upvotes">
                    <button class="upvoteButton">
                      <i class="fa-solid fa-up-long" id="arrowUp"></i>
                    </button>
                    ${postResponse.data[i].likes}
                  <button class="downvoteButton">
                    <i class="fa-solid fa-down-long" id="arrowDown"></i>
                  </button>
                    
                  </div>
                </div>
                <div class="post">
                  <div class="postDetails">
                    <img src="https://picsum.photos/seed/${
                      postResponse.data[i].tags[2]
                    }/200" class="subredditImage"></img>
                    <div class="subredditName">r/${postResponse.data[
                      i
                    ].tags[2].replaceAll(' ', '_')}</div>
                    <i class="fa-solid fa-circle"></i>
                    <div class="postedBy">Posted by u/${
                      postResponse.data[i].owner.firstName
                    }_${postResponse.data[i].owner.lastName}</div>
                    <div class="timePosted">${
                      Math.abs(daysDiff) > 0
                        ? daysDiff === 1
                          ? daysDiff + ' day ago'
                          : daysDiff + ' days ago'
                        : hoursDiff === 1
                        ? hoursDiff + ' hour ago'
                        : hoursDiff + ' hours ago'
                    }</div>
                  </div>
                  <div class="postTitle">${postResponse.data[i].text}</div>
                  <img src=${
                    postResponse.data[i].image
                  } class="postImage"></img>
                  <div class="postInteractionBar">
                    <button class="postButton">
                      <i class="fa-regular fa-comment" id="icon"></i>
                      ${
                        commentsResponse[i].total === 1
                          ? commentsResponse[i].total + ' Comment'
                          : commentsResponse[i].total + ' Comments'
                      }
                    </button>
                    <button class="postButton">
                      <i class="fa-solid fa-gift" id="icon"></i>
                      Award
                    </button>
                    <button class="postButton">
                      <i class="fa-solid fa-share" id="icon"></i>
                      Share
                    </button>
                    <button class="postButton">
                      <i class="fa-regular fa-bookmark" id="icon"></i>
                      Save
                    </button>
                    <button class="postButton" >
                      <i class="fa-solid fa-ellipsis"></i>
                    </button>
                  </div>
                </div>
              </div>`;
        new_posts = new_posts + new_post;
      }
      loading.insertAdjacentHTML('beforebegin', new_posts);
      new_posts = '';
      dataLoading = false;
    });
  });
};

const handleInfiniteScroll = () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= article.clientHeight;

  if (endOfPage) {
    if (!dataLoading) {
      dataLoading = true;
      createCard();
    }
  }
};

const handleSticky = () => {
  if (window.pageYOffset > 403) {
    footer.style.position = 'fixed';
    footer.style.top = '64px';
    footer.style.width = '310px';
  } else {
    footer.style.position = 'static';
  }
};

const goToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

window.addEventListener('scroll', handleInfiniteScroll);
window.addEventListener('scroll', handleSticky);
window.onload = () => {
  createCard();
};
