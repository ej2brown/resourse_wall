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
      .done((res) => {
        console.log(res);
        renderResources(res);
      })
      .catch((err) => console.log(err));
  };
  loadResources();

  //load all liked
  const loadLikesCount = () => {
    $.ajax({
        url: '/resources/likes',
        method: 'GET'
      })
      .done((res) => {
        console.log('==LOAD LIKES COUNT===', res)
      })
      .catch((err) => console.log(err));
  }
  loadLikesCount();


  // appends an formated array into the resource container
  const renderResources = function (result) {
    const resources = result.resources;
    const markupArray = [];
    // loops through resources
    for (const resource of resources) {
      // calls createResourceElement for each resource

      markupArray.push(createResourceElement(resource));
    }
    // appends value to the resources container reverse chronological order
    // $('.card').empty();
    // $('.card').html(markupArray.reverse().join(''));

    let posts = $('.resource-container').html(markupArray);
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
  const createResourceElement = function (resource) {
    const {
      title,
      description,
      name,
      image
    } = resource;
    // const likesCount = loadLikesCount(resource);
    console.log('RESOURCE', resource);
    // console.log('LIKES COUNT', likesCount)
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
              <div class="card-buttons d-flex justify-content-between align-items-center">
                  <button class="btn btn-primary">Post</button>
                  <i class="far fa-heart"></i>
              </div>
          </form>
        </div>
        </div>

      `;

    // appends the html to an article
    let $post = $('<article>').addClass('post');
    let resourceCard = $post.append(renderedResource);
    return resourceCard;

  };

  //  prevent default submit
  $(".resource-comments").submit((event) => {
    event.preventDefault();
  })
});
