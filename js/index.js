let theoryContentNode = document.getElementById("theoryContent");
let theoryContentHeaderNode = document.getElementById("theoryContentHeader");
let theoryContentBodyNode = document.getElementById("theoryContentBody");
let theoryContentHeaderBtnNode = document.getElementById("theoryContentHeaderBtn");

function changeElementClasses() {
   let windowWidth = window.innerWidth;

   if (windowWidth < 992) {
      theoryContentNode.classList.toggle("offcanvas");
      theoryContentNode.classList.toggle("offcanvas-end");
      theoryContentNode.setAttribute("tabindex", "-1");
      theoryContentNode.setAttribute("aria-labelledby", "theoryContent");

      theoryContentHeaderNode.classList.toggle("offcanvas-header");

      theoryContentBodyNode.classList.toggle("offcanvas-body");

      theoryContentHeaderBtnNode.classList.toggle("invisible");
   } else {
      theoryContentNode.removeAttribute("tabindex");
      theoryContentNode.removeAttribute("aria-labelledby");
   }
}

changeElementClasses();
window.addEventListener("resize", changeElementClasses);

function serializeForm(formNode) {
   return new FormData(formNode);
}

function handleFormSubmit(event) {
   event.preventDefault();

   let data = Array.from(serializeForm(tasksForm).entries());

   let points = 0;
   for (let task in data) {
      let taskNum = data[task][0].substring(4);
      let groupNode = document.getElementById(`group${taskNum}`);
      let inputNode = document.getElementById(data[task][0]);
      let feedbackNode = document.getElementById(`feedback${taskNum}`);

      feedbackNode.classList.remove("invisible", "position-absolute");
      if (data[task][1].toLowerCase().replace(".", "") == feedbackNode.textContent.toLowerCase()) {
         points++;
         groupNode.classList.add("has-success");
         inputNode.classList.add("is-valid");
         feedbackNode.classList.add("valid-feedback");
      } else {
         groupNode.classList.add("has-danger");
         inputNode.classList.add("is-invalid");
         feedbackNode.classList.add("invalid-feedback");
      }
   }
}

const tasksForm = document.getElementById("tasks");
tasksForm.addEventListener("submit", handleFormSubmit);
