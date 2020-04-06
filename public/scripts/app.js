$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


const createResourceElement = (resource) => {
// display resources
  let markup = `
  <div class="card p-3">
  <div class="card-body">
    <h5 class="card-title"><${resource.title}></h5>
    <p class="card-text"><${resource.description}></p>
    <img style='height:100px; width: 100px' src='< ${resource.url}>' >
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
</div>
  `
}

const renderResource = (resources) => {
  const arr = [];
  for (let resource of resources) {
    arr.push(createResourceElement(resource));
  }
  let posts = $('.resources-container').html(arr);
  return posts;
};




// THIS WILL GET RENDERED ON THE PAGE
$(document).ready(function () {

  // API REQUEST
  var target = "https://www.google.com";
  var key = "be57be359a6fbbf623c589b88e58fa26";
  $.ajax({
    url: "https://api.linkpreview.net",
    dataType: "jsonp",
    data: {
      q: target,
      key: key
    },
    success: function (response) {
      console.log(response);
    }
  });
})
