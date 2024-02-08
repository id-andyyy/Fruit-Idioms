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

   let maxPoints = data.length, points = 0;
   for (let task in data) {
      let taskNum = data[task][0].substring(4);
      let groupNode = document.getElementById(`group${taskNum}`);
      let inputNode = document.getElementById(data[task][0]);
      let feedbackNode = document.getElementById(`feedback${taskNum}`);

      if (data[task][1].toLowerCase().replace(/\./g, "").replace(/\s/g, "") == feedbackNode.textContent.toLowerCase().replace(/\s/g, "")) {
         points++;

         groupNode.classList.remove("has-danger");
         inputNode.classList.remove("is-invalid");
         feedbackNode.classList.add("invisible", "position-absolute");
         feedbackNode.classList.remove("invalid-feedback");

         groupNode.classList.add("has-success");
         inputNode.classList.add("is-valid");
      } else {
         groupNode.classList.remove("has-success");
         inputNode.classList.remove("is-valid");

         groupNode.classList.add("has-danger");
         inputNode.classList.add("is-invalid");
         feedbackNode.classList.remove("invisible", "position-absolute");
         feedbackNode.classList.add("invalid-feedback");
      }
   }

   let result = Math.round((points / maxPoints) * 100);
   let tasksResultNode = document.getElementById("tasksResult");
   let tasksResultHeadingNode = document.getElementById("tasksResultHeading");
   let tasksResultProgressNode = document.getElementById("tasksResultProgress");

   tasksResultNode.classList.remove("invisible");
   tasksResultNode.classList.remove("position-absolute");
   tasksResultHeadingNode.textContent = `Your result: ${result}%`;
   tasksResultProgressNode.setAttribute("area-valuenow", result);
   tasksResultProgressNode.style.width = `${result}%`;

   tasksResultProgressNode.classList.remove("bg-danger", "bg-warning", "bg-success");
   if (result < 40) {
      tasksResultProgressNode.classList.add("bg-danger");
   } else if (result < 60) {
      tasksResultProgressNode.classList.add("bg-warning");
   } else {
      tasksResultProgressNode.classList.add("bg-success");
   }
}

const tasksForm = document.getElementById("tasks");
tasksForm.addEventListener("submit", handleFormSubmit);
