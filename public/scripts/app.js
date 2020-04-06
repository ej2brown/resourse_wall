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
<<<<<<< HEAD
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
=======
  const loadResources = () => {
    $.ajax({
      url: "/",
      method: "GET",
      dataType: "JSON",
    }).done((users) => {
      for (user of users) {
        $("<div>").text(user.name).appendTo($("body"));
      }
    });
  };
  loadResources();
});

// $(() => {
//   // takes places rendered resources the page by calling itself right after
//   const loadResources = () => {
//       $.ajax({
//           url: '/api/users',
//           type: 'GET',
//           dataType: 'JSON',
//       })
//           .then((response) => {
//               formatRenderResources(response);
//           })
//           .catch(() => {
//               $('#error').show().text('Whoops, something went wrong!');
//           });
//   };

//   loadResources();


//   // appends an formated array into the resource container
//   const formatRenderResources = function (resources) {
//       const markupArray = [];
//       // loops through resources
//       for (const resource of resources) {
//           // calls createResourceElement for each resource
//           markupArray.push(createResourceElement(resource));
//       }

//       // appends value to the resources container reverse chronological order
//       $('#resources-container').empty();
//       $('#resource-container').html(markupArray.reverse().join(''));
//   };


//   // fetches resource object and renders it
//   const createResourceElement = function (objresource) {
//       const { title, description, url } = objresource;

//       //TO DO: add time created 
//       //TO DO: add escape funtion to comments
//       const renderedResource = `
//       <div class="card p-3">
//           <div class="card-body">
//           <h5 class="card-title"> ${resources.title} </h5>
//           <p class="card-text"> ${resources.description} </p>
//           <img style='height:100px; width: 100px' src='${resources.url}' >
//           <form action="">
//               <div class="form-group">
//                   <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Add a comment"></textarea>
//               </div>
//           </form>
//           <div class="card-buttons d-flex justify-content-between align-items-center">
//               <a href="#" class="btn btn-primary">Post</a>
//               <i class="far fa-heart"></i>
//               </div>
//       </div>
//       `;
//       return renderedResource;
//   };

//   const resourceIsValid = () => {
//       //TO DO: write valiation tests
//       return true;
//   };

//   $('.new-resource-form').submit(function (event) {
//       event.preventDefault();
//       if (resourceIsValid()) {
//           $.ajax({
//               url: '/resources/',
//               type: 'POST',
//               data: $(this).serialize(),
//           })
//               .then(() => loadresources()
//               )
//               .catch(() => $('#error').show().text('Whoops, something went wrong!')
//               );
//       }
//   })
// });
>>>>>>> 27d3760419701d49c4513649417da7d20c82abac
