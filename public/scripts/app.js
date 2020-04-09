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

        //  prevent default submit
        const $comments = $('.post-comment') //toggle button to view comments
        console.log($comments)
        $comments.on('click', (event) => {
          event.preventDefault();
          const resource_id = $('#ratings').attr("data-id");
          console.log('resource_id', resource_id)
          alert('HELLO')
          console.log(event.target.form.elements)
          $.ajax({
            url: "/resources/comments",
            method: "POST",
            data: $(this).serialize(),
            success: () => {
              console.log(this)
              loadResources();
            }
          }).catch((err) => console.log(err));
        });


        // star rating
        $('.stars-form').on('click', function (e) {
          const star_rating = $(e.target).name;
          const resource_id = $('.stars-form').attr("data-id");
          alert(`You gave this resource ${star_rating} star(s)!`)
          // $('.stars').children().css("background-color", "red");
          postRating(star_rating, resource_id);
        })

        // 5-stars icon
        const $star_rating = $('.stars-form .fa');

        const SetRatingStar = function () {
          return $star_rating.each(function () {
            if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating-form'))) {
              return $(this).removeClass('fa-star-o').addClass('fa-star');
            } else {
              return $(this).removeClass('fa-star').addClass('fa-star-o');
            }
          });
        };
        SetRatingStar();

        $star_rating.on('click', function () {
          const star_rating = $(e.target).name;
          const resource_id = $('.stars-form').attr("data-id");
          alert(`You gave this resource ${star_rating} star(s)!`)
          postRating(star_rating, resource_id);
          $star_rating.siblings('input.rating-value').val($(this).data('rating-form'));
          return SetRatingStar();
        });


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
  // loadLikeResources()

  const loadRatings = () => {
    $.ajax({
        url: "/resources/ratings",
        method: "GET"
      }).then((res) => {
        ratings = res.resources;
        buildArray()
        return res;
      })
      .catch((err) => console.log(err));
  }
  // loadRatings()

  //adds star ratings to the resource object
  const buildArray = () => {
    // loadRatings()
    console.log(resources)
    console.log(ratings)

    for (const resource of resources) {
      for (const rating of ratings) {
        if (rating.resource_id === resource.id) {
          resource.rating = rating.star_rating;
          console.log('FOUND')
          //TO DO display avg rating in resource

          // $("<div>").text(rating.star_rating).appendTo($('.ratings').attr("data-id")) //;(`.${resource.id}`))
          // $('.ratings').attr("data-id").html(rating.star_rating);
          // let HTMLRating = $post.append(rating.star_rating)
          // let HTMLRating = $post.append(posts);
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


  //  prevent default submit
  const $comments = $('.post-comment') //toggle button to view comments
  console.log($comments)
  $comments.submit((event) => {
    event.preventDefault();
    const resource_id = $('#ratings').attr("data-id");
    console.log('resource_id', resource_id)
    alert('HELLO')
    $.ajax({
      url: "/resources/comments",
      method: "POST",
      data: $(this).serialize(),
      success: () => {
        loadResources();
      }
    }).catch((err) => console.log(err));
  });

  //fetches resource object and renders it
  //TO DO: add time created
  //TO DO: add escape funtion to comments
  //TO DO: get ratings to not be unefined
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
          <form class="resource-comments">
              <div class="form-group">
                  <textarea class="form-control" id="comment" rows="3" placeholder="Add a comment" name="user-input"></textarea>
                  <button class="btn btn-primary" type="submit">Post</button>
              </div>
              <button type ="button" data-toggle="collapse" data-target="#comments">Comments</button>
              <div id="comments">
                <p>test</p>
              </div>

          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
          <div>
          <span>${likes_count} Likes</span>
          <i class="far fa-heart"></i>
          </div>
              <div class="ratings">
              <span>${rating} Stars</span>
              <span class="star data-id="${id}" name='1'></span>
              <span class="star"></span>
              <span class="star"></span>
              <span class="star"></span>
              <span class="star"></span>
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

  //  prevent default submit
  $('.resource-comments').submit((event) => {
    event.preventDefault();
  });


});
