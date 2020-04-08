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
        renderResources(res);
      })
      .catch((err) => console.log(err));
  };
  loadLikesCount();

  // appends an formated array into the resource container
  const renderResources = function(result) {
    // console.log('RESULT', result)
    const resources = result.resources;
    const markupArray = [];
    // loops through resources
    for (const resource of resources) {
      // calls createResourceElement for each resource
      markupArray.push(createResourceElement(resource));
    }
    // appends value to the resources container reverse chronological order
    // $('.card').empty();
    $('.card').append(markupArray.reverse().join(''));
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
  const createResourceElement = function(resource) {
    const { title, description, name, image, like_count } = resource;
    //TO DO: add time created
    //TO DO: add escape funtion to comments
    const renderedResource = `
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
          <p class="card-text">${name}</p>
          <img style='height:100px; width: 100px' src='${image}'>
          <form action="">
              <div class="form-group">
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Add a comment"></textarea>
              </div>
          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
              <a href="#" class="btn btn-primary">Post</a>
              <span>${like_count}</span>
              <i class="far fa-heart"></i>
          </div>
        </div>
      `;
    return renderedResource;
  };
});
