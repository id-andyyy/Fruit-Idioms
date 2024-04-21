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
    theoryContentNode.setAttribute("aria-labelledby", "theoryContentHeaderTitle");

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
        articleData.id = `article${articleId++}`;

        theoryContentBodyList.innerHTML += contentTemplate(articleData);
        theoryArticlesSummary.innerHTML += articleTemplate(articleData);
      });
    });
}

function addTasks() {
  fetch("./data/tasks.json")
    .then(response => response.json())
    .then(data => {
      let tasksData = data;

      let tasks = document.querySelector("#tasksWrapper");

      let taskChooseSource = document.querySelector("#taskChooseTemplate").innerHTML;
      let taskChooseTemplate = Handlebars.compile(taskChooseSource);

      let taskConnectSource = document.querySelector("#taskConnectTemplate").innerHTML;
      let taskConnectTemplate = Handlebars.compile(taskConnectSource);

      let taskTextSource = document.querySelector("#taskTextTemplate").innerHTML;
      let taskTextTemplate = Handlebars.compile(taskTextSource);

      let taskTranslateSource = document.querySelector("#taskTranslateTemplate").innerHTML;
      let taskTranslateTemplate = Handlebars.compile(taskTranslateSource);

      let taskId = 1;

      tasksData.forEach((taskData) => {
        taskData.id = String(taskId++);

        if (taskData.type == "choose") {
          tasks.innerHTML += taskChooseTemplate(taskData);
        } else if (taskData.type == "connect") {
          tasks.innerHTML += taskConnectTemplate(taskData);
        } else if (taskData.type == "text") {
          tasks.innerHTML += taskTextTemplate(taskData);
        } else if (taskData.type == "translate") {
          tasks.innerHTML += taskTranslateTemplate(taskData);

          let taskHelpBtnNode = document.querySelectorAll(".task-item-help__btn");
          taskHelpBtnNode.forEach((element) => {
            element.addEventListener("click", showHelpButton, false);
          });
        }
      });
    });
}

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

function serializeForm(formNode) {
  return new FormData(formNode);
}

function handleFormSubmit(event) {
  event.preventDefault();

  let formData = Array.from(serializeForm(tasksForm).entries());

  let maxPoints = formData.length, points = 0;
  formData.forEach((task) => {
    let taskNum = task[0].substring(3, 6);
    let taskType = task[0].substring(0, 2);

    let groupNode = document.querySelector(`#group-${taskNum}`);

    if (task[1] == 0) {
      //pass
    } else {
      if (taskType == "ch") {
        let inputNode = document.querySelector(`#${task[1].substring(0, 8)}`);

        groupNode.classList.remove("has-danger", "has-success");
        inputNode.classList.remove("is-invalid", "is-valid");

        if (task[1].slice(-1) == "c") {
          points++;

          groupNode.classList.add("has-success");
          inputNode.classList.add("is-valid");
        } else {
          let chooseInputNode = document.querySelectorAll(`#group-${taskNum} input`);
          chooseInputNode.forEach((element) => {
            if (element.value.slice(-1) == "c") {
              element.classList.add("is-invalid");
            }
          });
        }
      } else {
        let inputNode = document.querySelector(`#${task[0]}`);
        let feedbackNode = document.querySelector(`#feedback-${taskNum}`);

        groupNode.classList.remove("has-danger", "has-success");
        inputNode.classList.remove("is-invalid", "is-valid");

        if (task[1].toLowerCase().replace(/\./g, "").replace(/\s/g, "") == feedbackNode.textContent.toLowerCase().replace(/\s/g, "")) {
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
  });

  let result = Math.round((points / maxPoints) * 100);
  let tasksResultNode = document.querySelector("#tasksResult");
  let tasksResultHeadingNode = document.querySelector("#tasksResultHeading");
  let tasksResultProgressNode = document.querySelector("#tasksResultProgress");

  tasksResultNode.classList.remove("d-none");
  tasksResultHeadingNode.textContent = `Результат: ${result}%`;
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

changeContentLocation();
addArticles();
addTasks();

const tasksForm = document.querySelector("#tasksForm");
tasksForm.addEventListener("submit", handleFormSubmit);
