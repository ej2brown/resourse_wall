// const timeOut = $(() => {
$(() => {
  console.log('click')

  //liking a post 
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
    })
  })

  //rating a post
  $('body').on('click', '.ratings', function (event) {
    const star_rating = event.target.attributes[1].value;
    const resource_id = event.currentTarget.id;
    alert(`You gave this resource ${star_rating} star(s)!`);
    $.ajax({
      url: "/resources/addRating",
      method: "POST",
      data: $.param(data),
      success: (data) => {
        $.ajax({
          url: '/resources/ratings',
          method: 'GET'
        })
      }
    })
  })
})
// })
  // setTimeout(timeOut, 1000);
