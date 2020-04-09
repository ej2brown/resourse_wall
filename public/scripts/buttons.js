$(window).on("click", (event) => {
  console.log('HERE')

  //liking a post 
    $("#heart").on("click", (event) => {
      alert("You gave this resource a heart!")
      event.preventDefault();
      const resource_id = event.target.attributes[1].value;
      console.log(resource_id)
    })
  
  //rating a post
  $('.ratings').on('click', function (event) {
    const star_rating = event.target.attributes[1].value;
    const resource_id = event.currentTarget.id;
    alert(`You gave this resource ${star_rating} star(s)!`)
  })

})
