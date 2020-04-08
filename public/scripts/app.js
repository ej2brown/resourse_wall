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
  //load all resources
  const loadResources = () => {
    $.ajax({
      url: '/resources',
      method: 'GET'
    })
      .then((res) => {
        renderResources(res);
      })
      // .then(() => {
      //   $.ajax({
      //     url: '/resources/likes',
      //     method: 'GET'
      //   })
      //   .then((res) => {
      //     renderResources(res);
      //   })
      // })
      .catch((err) => console.log(err));
  };
  loadResources();

<<<<<<< HEAD
  //load all liked
  const loadLikesCount = () => {
=======
  //load all liked 
  const loadLikeResources = () => {
>>>>>>> f2b675a385bcc7da126cce13defc5c98e387a6eb
    $.ajax({
      url: '/resources/likes',
      method: 'GET'
    })
      .done((res) => {
        console.log('res',res)
        renderLikes(res);
      })
      .catch((err) => console.log(err));
<<<<<<< HEAD
  };
  loadLikesCount();

  // appends an formated array into the resource container
  const renderResources = function(result) {
    // console.log('RESULT', result)
=======
  }
  loadLikeResources();

const loadRatings = () => {
  $.ajax({
    url: "/resources/ratings",
    method: "GET"
  }).then((res) => {
    return res;
  })
    .catch((err) => console.log(err));
  }
  loadRatings();

  $('.stars').on('click', function (e) {
    const star_rating = $(e.target).length; //try value?
    console.log(star_rating)
    alert(`You gave this resourse ${star_rating} star(s)!`)
    $('.stars').children().css("background-color", "red");
    postRating();
  })

  const postRating = function (rate, resource_id) {
    const data = {};
    data[resource_id] = rate;
    $.ajax({
      url: "/resources/ratings",
      method: "POST",
      data: data
    }).then((res) => {
      console.log('finished ratings post request')
    })
  }

  // appends an formated array into the resource container
  const renderResources = function (result) {
>>>>>>> f2b675a385bcc7da126cce13defc5c98e387a6eb
    const resources = result.resources;
    const markupArray = [];
    // loops through resources
    for (const resource of resources) {
      // calls createResourceElement for each resource
      markupArray.push(createResourceElement(resource));
    }
    let posts = $('.resource-container').html(markupArray);
    return posts;
  };

  // appends an formated array into the resource container
  const renderLikes = function (result) {
    console.log(result)
    const Likes = result.resources;
    const markupArray = [];
    // loops through Likes
    for (const like of Likes) {
      // calls createLikeElement for each like
      markupArray.push(createLikesElement(like));
    }
    let posts = $('.likes-container').html(markupArray);
    return posts;
  };


  //inside $("") put where the button is
  // $("").submit(function (event) {
  //   $.ajax({
  //     url: "",
  //     method: "POST",
  //     data: $(this).serialize(),
  //     success: () => {
  //       loadResources();
  //     }
  //   });
  // })

  //fetches resource object and renders it
<<<<<<< HEAD
  const createResourceElement = function(resource) {
    const { title, description, name, image, like_count } = resource;
=======
  const createResourceElement = function (resource) {
    console.log('in createResourceElement',resource)
    const {
      title,
      description,
      name,
      image,
      like_count
    } = resource;
>>>>>>> f2b675a385bcc7da126cce13defc5c98e387a6eb
    //TO DO: add time created
    //TO DO: add escape funtion to comments
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
              <span>${like_count} Likes</span>
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
  $(".resource-comments").submit((event) => {
    event.preventDefault();
  })
});
