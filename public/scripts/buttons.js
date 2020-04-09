$( window ).on("click", (event) => {
  console.log('HERE')
  $(() => {
    const $comments = $("body")
    $comments.on("click", (event) => {
      alert("You gave this resource a heart!")
      event.preventDefault();
      const star_rating = $(event.target).name;
      const resource_id = event.target.attributes[1].value;
    })
  })
})
