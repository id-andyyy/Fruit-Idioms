function changeContentLocation() {
  let theoryContentNode = document.querySelector("#theoryContent");
  let theoryContentHeaderNode = document.querySelector("#theoryContentHeader");
  let theoryContentBodyNode = document.querySelector("#theoryContentBody");
  let theoryContentHeaderBtnNode = document.querySelector("#theoryContentHeaderBtn");

  let windowWidth = window.innerWidth;

  if (windowWidth < 992) {
    theoryContentNode.classList.toggle("offcanvas");
    theoryContentNode.classList.toggle("offcanvas-end");
    theoryContentNode.setAttribute("tabindex", "-1");
    theoryContentNode.setAttribute("aria-labelledby", "theoryContent");

    theoryContentHeaderNode.classList.toggle("offcanvas-header");

    theoryContentBodyNode.classList.toggle("offcanvas-body");

    theoryContentHeaderBtnNode.classList.toggle("d-none");
  } else {
    theoryContentNode.removeAttribute("tabindex");
    theoryContentNode.removeAttribute("aria-labelledby");
  }
}

function addArticles() {
  fetch("./data/articles.json")
    .then(response => response.json())
    .then(data => {
      let articlesData = data;

      let contentSource = document.querySelector("#contentTemplate").innerHTML;
      let contentTemplate = Handlebars.compile(contentSource);
      let theoryContentBodyList = document.querySelector("#theoryContentBodyList");

      let articleSource = document.querySelector("#articleTemplate").innerHTML;
      let articleTemplate = Handlebars.compile(articleSource);
      let theoryArticlesSummary = document.querySelector("#theoryArticlesSummary");

      let articleId = 1;

      articlesData.forEach((articleData) => {
        articleData.id = `article${articleId++}`

        theoryContentBodyList.innerHTML += contentTemplate(articleData);
        theoryArticlesSummary.innerHTML += articleTemplate(articleData);
      });
    });
}

function serializeForm(formNode) {
  return new FormData(formNode);
}

function handleFormSubmit(event) {
  event.preventDefault();

  let data = Array.from(serializeForm(tasksForm).entries());

  let maxPoints = data.length, points = 0;
  for (let task in data) {
    let taskNum = data[task][0].substring(3, 6);
    let taskType = data[task][0].substring(0, 2);

    let groupNode = document.querySelector(`#group-${taskNum}`);
    let feedbackNode = document.querySelector(`#feedback-${taskNum}`);

    if (data[task][1] == 0) {
      // pass
    } else {
      if (taskType == "ra") {
        let inputNode = document.querySelector(`#${data[task][1].substring(0, 8)}`);

        groupNode.classList.remove("has-danger", "has-success");
        inputNode.classList.remove("is-invalid", "is-valid");

        if (data[task][1][9] == "c") {
          points++;

          groupNode.classList.add("has-success");
          inputNode.classList.add("is-valid");
        } else {
          let chooseInputNode = document.querySelectorAll('#group-1-1 input');
          chooseInputNode.forEach((element) => {
            if (element.value.slice(-1) == "c") {
              element.classList.add("is-invalid");
            }
          });
        }
      } else {
        let inputNode = document.querySelector(`#${data[task][0]}`);
        groupNode.classList.remove("has-danger", "has-success");
        inputNode.classList.remove("is-invalid", "is-valid");


        if (data[task][1].toLowerCase().replace(/\./g, "").replace(/\s/g, "") == feedbackNode.textContent.toLowerCase().replace(/\s/g, "")) {
          points++;

          groupNode.classList.add("has-success");
          inputNode.classList.add("is-valid");

          feedbackNode.classList.add("d-none");
          feedbackNode.classList.remove("invalid-feedback");
        } else {
          groupNode.classList.add("has-danger");
          inputNode.classList.add("is-invalid");

          feedbackNode.classList.remove("d-none");
          feedbackNode.classList.add("invalid-feedback");
        }
      }
    }
  }

  let result = Math.round((points / maxPoints) * 100);
  let tasksResultNode = document.querySelector("#tasksResult");
  let tasksResultHeadingNode = document.querySelector("#tasksResultHeading");
  let tasksResultProgressNode = document.querySelector("#tasksResultProgress");

  tasksResultNode.classList.remove("d-none");
  tasksResultHeadingNode.textContent = `Your result: ${result}%`;
  tasksResultProgressNode.setAttribute("area-valuenow", result);
  tasksResultProgressNode.style.width = `${result}%`;

  tasksResultProgressNode.classList.remove("bg-danger", "bg-warning", "bg-success");
  if (result < 40) {
    tasksResultProgressNode.classList.add("bg-danger");
  } else if (result < 70) {
    tasksResultProgressNode.classList.add("bg-warning");
  } else {
    tasksResultProgressNode.classList.add("bg-success");
  }
}

function getHelp() {
  function showHelpButton(event) {
    let helpBtnId = this.id.substring(4);
    let groupNode = document.querySelector(`#group${helpBtnId}`);
    let inputNode = document.querySelector(`#te${helpBtnId}`);
    let feedbackNode = document.querySelector(`#feedback${helpBtnId}`);

    groupNode.classList.remove("has-success");
    inputNode.classList.remove("is-valid");

    groupNode.classList.add("has-danger");
    inputNode.classList.add("is-invalid");
    feedbackNode.classList.remove("d-none");
    feedbackNode.classList.add("invalid-feedback");
  }

  let taskHelpBtnNode = document.querySelectorAll(".task-help__btn");
  taskHelpBtnNode.forEach((element) => {
    element.addEventListener("click", showHelpButton, false);
  });
}

changeContentLocation();

addArticles();

const tasksForm = document.querySelector("#tasks");
tasksForm.addEventListener("submit", handleFormSubmit);

getHelp();
