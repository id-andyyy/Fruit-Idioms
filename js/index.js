let theoryContent = document.getElementById("theoryContent");
let theoryContentHeader = document.getElementById("theoryContentHeader");
let theoryContentBody = document.getElementById("theoryContentBody");
let theoryContentHeaderBtn = document.getElementById("theoryContentHeaderBtn");

function changeElementClasses() {
   let windowWidth = window.innerWidth;

   if (windowWidth < 992) {
      theoryContent.classList.toggle("offcanvas");
      theoryContent.classList.toggle("offcanvas-end");
      theoryContent.setAttribute("tabindex", "-1");
      theoryContent.setAttribute("aria-labelledby", "theoryContent");

      theoryContentHeader.classList.toggle("offcanvas-header");

      theoryContentBody.classList.toggle("offcanvas-body");

      theoryContentHeaderBtn.classList.toggle("invisible");
   } else {
      theoryContent.removeAttribute("tabindex");
      theoryContent.removeAttribute("aria-labelledby");
   }
}

changeElementClasses();
window.addEventListener("resize", changeElementClasses);

function serializeForm(formNode) {
   return new FormData(formNode)
}

function handleFormSubmit(event) {
   event.preventDefault();
   console.log(Array.from(serializeForm(tasksForm).entries()))
}

const tasksForm = document.getElementById("tasks");
tasksForm.addEventListener("submit", handleFormSubmit);
