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
  const loadResources = () => {
    $.ajax({
      url: "/resources",
      method: "GET",
    })
      .done((res) => {
        console.log(res)
        renderResources(res)
      })
      .catch((err) => console.log(err));
  }
  loadResources();

  // appends an formated array into the resource container
  const renderResources = function(result) {
    const resources = result.resources;
    const markupArray = [];
    // loops through resources
    for (const resource of resources) {
      // calls createResourceElement for each resource  

      markupArray.push(createResourceElement(resource));
    }
    // appends value to the resources container reverse chronological order
    $('.card').empty();
    $('.card').html(markupArray.reverse().join(''));
  };
});

//fetches resource object and renders it
const createResourceElement = function(resource) {
  const { title, description, url } = resource;
  //TO DO: add time created 
  //TO DO: add escape funtion to comments
  const renderedResource = `
        <div class="card-body">
          <h5 class="card-title"> ${title} </h5>
          <p class="card-text"> ${description} </p>
          <img style='height:100px; width: 100px' src='${url}' >
          <form action="">
              <div class="form-group">
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Add a comment"></textarea>
              </div>
          </form>
          <div class="card-buttons d-flex justify-content-between align-items-center">
              <a href="#" class="btn btn-primary">Post</a>
              <i class="far fa-heart"></i>
          </div>
        </div>
      `;
  return renderedResource;
};
