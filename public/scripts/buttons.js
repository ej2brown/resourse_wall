$(() => {
const $comments = $(".post")
$comments.on("click", (event) => {
  console.log('HERE')
  alert("You gave this resource a heart!")
  event.preventDefault();
  const star_rating = $(event.target).name;
  const resource_id = event.target.attributes[1].value;
})

})