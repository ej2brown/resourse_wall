// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

$(() => {
  let resources = [];
  let ratings = [];
  //load all resources
  const loadResources = () => {
    $.ajax({
      url: '/resources',
      method: 'GET'
    })
      .then((res) => {
        renderResources(res);
        resources = res.resources;
        return loadLikeResources();
      })
      .then((res) => { 
        buildArray()
      })
      .catch((err) => console.log(err));
  };
  loadResources();

  //load all liked
  const loadLikeResources = () => {
    $.ajax({
      url: '/resources/likes',
      method: 'GET'
    })
      .done((res) => {
        renderLikes(res);
        return loadRatings();
      })
      .catch((err) => console.log(err));
  }
  loadLikeResources()

  const loadRatings = () => {
    $.ajax({
      url: "/resources/ratings",
      method: "GET"
    }).then((res) => {
      ratings = res;
      return res;
    })
    .catch((err) => console.log(err));
  }
  loadRatings()


  const buildArray = () => {

    // loadRatings()
    console.log(ratings)
    console.log(resources)

    for (const resource of resources) {
      for (const rating of ratings.resources) {
        if (rating.resource_id === resource.id) {
          console.log('FOUND')
          resource['rating'] = rating.star_rating;
          console.log(resource)
        }
      }
    }
  }
  // buildArray()

//star rating
  $('.stars').on('click', function (e) {
    const star_rating = $(e.target).name; 
    const resource_id = $('.stars').attr("data-id");
    alert(`You gave this resource ${star_rating} star(s)!`)
    // $('.stars').children().css("background-color", "red");
    postRating(star_rating, resource_id);
  })

  const postRating = function (star_rating, resource_id) {
    const data = {};
    data[resource_id] = star_rating;
    $.ajax({
      url: '/resources/ratings',
      method: 'POST',
      data: data
    }).then((res) => {
      console.log('finished ratings post request');
    });
  };

  // appends an formated array into the resource container
  const renderResources = function(result) {
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


  // inside $("") put where the button is
  $("").submit(function (event) {
    $.ajax({
      url: "/resources",
      method: "POST",
      data: $(this).serialize(),
      success: () => {
        loadResources();
      }
    });
  })

  //fetches resource object and renders it
  //TO DO: add time created
  //TO DO: add escape funtion to comments
  const createResourceElement = function (resource) {
    const {resource_id, title, description, name, image, likes_count, rating} = resource;
    console.log(resource)
    const renderedResource = `
    <div class="card p-3">
    <img src='${image}'>
    <div class="card-body">
          <h5 class="card-title"> ${title} </h5>
          <p class="card-text"> ${description} </p>
          <p class="card-text"> ${name} </p>
          <form method="POST" action="resources/comments" enctype="application/x-www-form-urlencoded" class="resource-comments">
              <div class="form-group">
                  <textarea class="form-control" id="comment" rows="3" placeholder="Add a comment" name="user-input" method="POST"></textarea>
              </div>
          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
              <a href="#" class="btn btn-primary">Post</a>
              <span>${likes_count} Likes</span>
              <i class="far fa-heart"></i>
              <div class="ratings">
              <span>${rating} Stars</span>
              <span class="star data-id="${resource_id}" name='1'>0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              </div>
          </div>
        </div>
      `;

    // appends the html to an article
    let $post = $('<article>').addClass('post');
    let resourceCard = $post.append(renderedResource);
    return resourceCard;
  };

  const createLikesElement = function(likes) {
    const { title, description, name, image, likes_count } = likes;
    const renderedLikes = `
    <div class="card p-3">
    <img src='${image}'>
    <div class="card-body">
          <h5 class="card-title"> ${title} </h5>
          <p class="card-text"> ${description} </p>
          <p class="card-text"> ${name} </p>
          <form method="POST" action="likes/comments" enctype="application/x-www-form-urlencoded" class="like-comments">
              <div class="form-group">
                  <textarea class="form-control" id="comment" rows="3" placeholder="Add a comment" name="user-input" method="POST"></textarea>
              </div>
          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
              <a href="#" class="btn btn-primary">Post</a>
              <span>${likes_count} Likes</span>
              <i class="far fa-heart"></i>
              <div class="stars">
              <span class="star">0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              <span class="star">0</span>
              </div>
          </div>
        </div>
      `;

    // appends the html to an article
    let $post = $('<article>').addClass('post');
    let likesCard = $post.append(renderedLikes);
    return likesCard;
  };

  //  prevent default submit
  $('.resource-comments').submit((event) => {
    event.preventDefault();
  });
});
