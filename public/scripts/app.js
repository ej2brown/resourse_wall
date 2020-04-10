

$(() => {
  loadResources();
  $("body").on("click", ".heart", (event) => {
    const resource_id = event.target.attributes[1].value;
    const data = resource_id;
    console.log(data)
    alert("You gave this resource a heart!");
    $.ajax({
      url: "/resources/addLikes",
      method: "POST",
      data: $.param(data),
      success: (data) => {
        $.ajax({
          url: '/resources/likes',
          method: 'GET'
        })
      }
    }).then(() => { loadResources(); })
  })

  //rating a post
  $('body').on('click', '.ratings', function (event) {
    const data = {};
    const star_rating = event.target.attributes[1].value;
    const resource_id = event.currentTarget.id;
    data[resource_id] = star_rating;
    alert(`You gave this resource ${star_rating} star(s)!`);
    $.ajax({
      url: "/resources/addRatings",
      method: "POST",
      data: $.param(data),
      success: (data) => {
        $.ajax({
          url: '/resources/ratings',
          method: 'GET'
        })
      }
    }).then(() => { loadResources(); })
  })

})

const escape = function (str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
                    let name = '';
                    let content = '';
                    let comments = res.comments;
                    for (comment of comments) {
                      name = comment.name;
                      content = comment.content;
                      resource_id = comment.resource_id;
                      comment = `"<p>${name} says: ${content}</p>"`
                      let commentResourceCard = `#view-comments-${resource_id}`
                      $(commentResourceCard).append(comment)
                      // $("<p>${name} says: ${content}</p>").appendTo("#view-comments-1"); //${resource_id}
                      console.log('sent')
                    }
                  })
              }
              loadComments()
            }
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
const createResourceElement = function (resource) {
  const {
    id,
    title,
    description,
    name,
    image,
    likes_count,
    rating,
    url
  } = resource;
  const renderedResource = `
    <div class="card p-3">
      <img src='${image}'>
      <div class="card-body">
        <header>
          <h5 class="card-title"> ${escape(title)} </h5>
          <p class="card-text"> ${escape(description)} </p>
          <p class="card-text"> ${escape(name)} </p>
          <a href="${escape(url)}" target="_blank">Go to resource</a>
        </header>
        <form class="resource-comments" id="${id}">
          <div class="form-group">
              <textarea class="form-control" id="comment" data-id="${id}" rows="3"
              placeholder="Add a comment" name="user-input"></textarea>
              <button class="btn btn-primary" type="submit">Post</button>
          </div>
          <button type ="button" data-toggle="collapse" data-target="#view-comments-${id}">Comments</button>
          <div id="view-comments-${id}">
          </div>
        </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
            <div class="heart">
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
    id,
    title,
    description,
    name,
    image,
    likes_count,
    rating,
    url
  } = resource;
  const renderedLikes = `
  <div class="card p-3">
  <img src='${image}'>
  <div class="card-body">
    <header>
      <h5 class="card-title"> ${escape(title)} </h5>
      <p class="card-text"> ${escape(description)} </p>
      <p class="card-text"> ${escape(name)} </p>
      <a href="${escape(url)}" target="_blank">Go to resource</a>
    </header>
    <form class="resource-comments" id="${id}">
      <div class="form-group">
          <textarea class="form-control" id="comment" data-id="${id}" rows="3"
          placeholder="Add a comment" name="user-input"></textarea>
          <button class="btn btn-primary" type="submit">Post</button>
      </div>
      <button type ="button" data-toggle="collapse" data-target="#view-comments-${id}">Comments</button>
      <div id="view-comments-${id}">
      </div>
    </form>
      <div class="card-buttons d-flex justify-content-between align-items-center">
        <div class="heart">
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
  let likesCard = $post.append(renderedLikes);
  return likesCard;
};

$('span').click(() => {
  alert('test')
  $('.star1').addClass('.star-rating')
})

//  prevent default submit
$('.resource-comments').submit((event) => {
  event.preventDefault();
});



