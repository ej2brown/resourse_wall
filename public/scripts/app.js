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
