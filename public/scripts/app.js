

$(() => {
  loadResources();
})


let resources = [];
let ratings = [];

const loadResources = () => {
  $.ajax({
    url: '/resources',
    method: 'GET'
  })
    .then((res) => {
      resources = res.resources;
      loadRatings((r) => {
        ratings = r;
        buildArray();
        renderResources(res)

        const $comments = $('.resource-comments')
        $comments.submit((event) => {
          event.preventDefault(); //  prevent default submit
          // console.log($comments.serialize())
          const resource_id = event.target.attributes[1].value;
          // const resource_id = $('#comment').attr("data-id");
          const data = {};
          data[resource_id] = $(`[data-id="${resource_id}"]`).val();
          // alert('HELLO')

          $.ajax({
            url: "/resources/comments",
            method: "POST",
            data: $.param(data),
            success: (data) => {
              const loadComments = () => {
                $.ajax({
                  url: '/resources/comments',
                  method: 'GET'
                })
                  .then((res) => {
                    let resource_id = 0;
                    let user_id = '';
                    let content = '';
                    let comments = res.comments;
                    for (comment of comments) {
                      user_id = comment.user_id;
                      content = comment.content;
                      resource_id = comment.resource_id;
                      comment = `"<p>${user_id} says: ${content}</p>"`
                      // debugger
                      let commentResourceCard = `#view-comments-${resource_id}`
                      $(commentResourceCard).append(comment)
                      // $("<p>${user_id} says: ${content}</p>").appendTo("#view-comments-1"); //${resource_id}
                      console.log('sent')
                    }
                  })
              }
              loadComments()
            }
          }).then(() => {

          })
            .catch((err) => console.log(err));
        });
      })

      return loadLikeResources();
    })
    .then((res) => {
    })
    .catch((err) => console.log(err));
};

//load all liked
const loadLikeResources = () => {
  $.ajax({
    url: '/resources/likes',
    method: 'GET'
  })
    .done((res) => {
      renderLikes(res);
      return
    })
    .catch((err) => console.log(err));
}

const loadRatings = (cb) => {
  $.ajax({
    url: "/resources/ratings",
    method: "GET"
  }).then((res) => {
    ratings = res.resources;
    cb(res.resources);
    return res;
  })
    .catch((err) => console.log(err));
}

//adds star ratings to the resource object
const buildArray = () => {
  for (const resource of resources) {
    for (const rating of ratings) {
      if (rating.resource_id === resource.id) {
        resource.rating = rating.star_rating;
      }
    }
  }
}

// appends an formated array into the resource container
const renderResources = function (result) {
  const resources = result.resources;
  const markupArray = [];
  for (const resource of resources) {
    markupArray.push(createResourceElement(resource));
  }
  let posts = $('.resource-container').html(markupArray);
  return posts;
};

// appends an formated array into the resource container
const renderLikes = function (result) {
  const Likes = result.resources;
  const markupArray = [];
  for (const like of Likes) {
    markupArray.push(createLikesElement(like));
  }
  let posts = $('.likes-container').html(markupArray);
  return posts;
};



//fetches resource object and renders it
//TO DO: add time created
//TO DO: add escape funtion to comments
const createResourceElement = function (resource) {
  const {
    id,
    title,
    description,
    name,
    image,
    likes_count,
    rating
  } = resource;
  const renderedResource = `
    <div class="card p-3">
      <img src='${image}'>
      <div class="card-body">
        <header>
          <h5 class="card-title"> ${title} </h5>
          <p class="card-text"> ${description} </p>
          <p class="card-text"> ${name} </p>
        </header>
        <form class="resource-comments" id="${id}">
          <div class="form-group">
              <textarea class="form-control" id="comment" data-id="${id}" rows="3" 
              placeholder="Add a comment" name="user-input"></textarea>
              <button class="btn btn-primary" type="submit">Post</button>
          </div>
          <button type ="button" data-toggle="collapse" data-target="#view-comments-${id}">Comments</button>
          <div id="view-comments-${id}">
              <p>test</p>
          </div>
        </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
            <div id="heart">
              <span data-id="${id}">${likes_count} Likes</span>
              <i class="far fa-heart" id="${id}"></i>
            </div>
            <div class="ratings" id ="${id}">
              <span data-id="${id}">${rating} Stars</span>
                <span class="star" value = "1"></span>
                <span class="star" value = "2"></span>
                <span class="star" value = "3"></span>
                <span class="star" value = "4"></span>
                <span class="star" value = "5"></span>
            </div>
          </div>
        </div>
      </div>
      `;

  // appends the html to an article
  let $post = $('<article>').addClass('post');
  let resourceCard = $post.append(renderedResource);
  return resourceCard;
};

const createLikesElement = function (likes) {
  const {
    title,
    description,
    name,
    image,
    likes_count
  } = likes;
  const renderedLikes = `
    <div class="card">
    <img src='${image}'>
    <div class="card-body">
    <header>
          <h5 class="card-title"> ${title} </h5>
          <p class="card-text"> ${description} </p>
          <p class="card-text"> ${name} </p>
          </header>
          <form class="like-comments">
              <div class="form-group">
                  <textarea class="form-control" id="comment" rows="3" placeholder="Add a comment" name="user-input"></textarea>
              </div>
              <button class="btn btn-primary" type="submit">Post</button>
          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
          <form>
          <span>${likes_count} Likes</span>
          <i class="far fa-heart"></i>
          </form>
          <form>
              <span class="icon star"></span>
              <span class="icon star"></span>
              <span class="icon star"></span>
              <span class="icon star"></span>
              <span class="icon star"></span>
              </div>
          </form>
          </div>
      `;
  // appends the html to an article
  let $post = $('<article>').addClass('post');
  let likesCard = $post.append(renderedLikes);
  return likesCard;
};

// //  prevent default submit
// $('.resource-comments').submit((event) => {
//   event.preventDefault();
// });
