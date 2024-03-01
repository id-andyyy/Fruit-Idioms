let theoryContentNode = document.querySelector("#theoryContent");
let theoryContentHeaderNode = document.querySelector("#theoryContentHeader");
let theoryContentBodyNode = document.querySelector("#theoryContentBody");
let theoryContentHeaderBtnNode = document.querySelector("#theoryContentHeaderBtn");

function changeElementClasses() {
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
   let articlesFragment = document.createDocumentFragment();
   let contentFragment = document.createDocumentFragment();

   fetch("..\\data\\articles.json")
      .then(response => response.json())
      .then(data => {
         let articlesData = data;

         articlesData.forEach((articleData) => {
            let titleString = articleData.title.replace(/\b\w/g, (c) => c.toUpperCase()).split(" ").join("");

            let contentItemElement = document.createElement("li");
            contentItemElement.classList.add("theory-content-body-list-one", "list-group-item", `list-group-item-${articleData.color}`, "d-flex", "justify-content-between", "align-items-center");

            let contentItemElementLink = document.createElement("a");
            contentItemElementLink.classList.add("theory-content-body-list-one__link");
            contentItemElementLink.href = `#${titleString}`;
            contentItemElementLink.textContent = articleData.title;
            contentItemElement.appendChild(contentItemElementLink);

            contentFragment.appendChild(contentItemElement);

            let articleElement = document.createElement("article");
            articleElement.classList.add("summary-one", "card", `border-${articleData.color}`, "mb-3");

            let titleElement = document.createElement("h5");
            titleElement.classList.add("summary-one__heading", "card-header");
            titleElement.id = titleString;
            titleElement.textContent = articleData.title;
            articleElement.appendChild(titleElement);

            let bodyElement = document.createElement("div");
            bodyElement.classList.add("card-body");
            articleElement.appendChild(bodyElement);

            let meaningElement = document.createElement("p");
            meaningElement.classList.add("summary-one__meaning", "article-point", "article-point__big");
            meaningElement.textContent = `Значение: ${articleData.meaning}`;
            bodyElement.appendChild(meaningElement);

            let literallyElement = document.createElement("p");
            literallyElement.classList.add("summary-one__literally", "article-point", "article-point__small");
            literallyElement.textContent = `Дословно: ${articleData.literally}`;
            bodyElement.appendChild(literallyElement);

            let synonymsElement = document.createElement("p");
            synonymsElement.classList.add("summary-one__synonyms", "article-point", "article-point__small");
            synonymsElement.textContent = `Синонимы: ${articleData.meaning}`;
            bodyElement.appendChild(synonymsElement);

            let examplesElement = document.createElement("div");
            examplesElement.classList.add("summary-one-examples", "examples");
            bodyElement.appendChild(examplesElement);

            let examplesHeadingElement = document.createElement("p");
            examplesHeadingElement.classList.add("examples-heading", "article-point", "article-point__small");
            examplesHeadingElement.textContent = "Примеры:";
            examplesElement.appendChild(examplesHeadingElement);

            let examplesListElement = document.createElement("ul");
            examplesListElement.classList.add("examples-list", "list-group", "list-group-flush");
            examplesElement.appendChild(examplesListElement);

            articleData.examples.forEach((exampleData) => {
               let examplesListItemElement = document.createElement("li");
               examplesListItemElement.classList.add("examples-list-item", "list-group-item");
               examplesListElement.appendChild(examplesListItemElement);

               let examplesListItemEngElement = document.createElement("div");
               examplesListItemEngElement.classList.add("examples-list-item__eng");
               examplesListItemEngElement.textContent = exampleData.eng;
               examplesListItemElement.appendChild(examplesListItemEngElement);

               let examplesListItemRusElement = document.createElement("div");
               examplesListItemRusElement.classList.add("examples-list-item__rus");
               examplesListItemRusElement.textContent = exampleData.rus;
               examplesListItemElement.appendChild(examplesListItemRusElement);
            });

            let originElement = document.createElement("div");
            originElement.classList.add("summary-one-origin", "accordion");
            originElement.id = `origin${titleString}`;
            bodyElement.appendChild(originElement);

            let originItemElement = document.createElement("div");
            originItemElement.classList.add("accordion-item");
            originElement.appendChild(originItemElement);

            let originHeadingElement = document.createElement("h6");
            originHeadingElement.classList.add("accordion-header");
            originHeadingElement.id = `heading${titleString}`;
            originItemElement.appendChild(originHeadingElement);

            let originButtonElement = document.createElement("button");
            originButtonElement.classList.add("accordion-button", "collapsed");
            originButtonElement.type = "button";
            originButtonElement.dataset.bsToggle = "collapse";
            originButtonElement.dataset.bsTarget = `#collapse${titleString}`;
            originButtonElement.ariaExpanded = "true";
            originButtonElement.textContent = "Происхождение";
            originHeadingElement.appendChild(originButtonElement);

            let originCollapseElement = document.createElement("div");
            originCollapseElement.classList.add("accordion-collapse", "collapse");
            originCollapseElement.id = `collapse${titleString}`;
            originCollapseElement.setAttribute("aria-labelledby", `heading${titleString}`);
            originCollapseElement.dataset.bsParent = `#origin${titleString}`;
            originItemElement.appendChild(originCollapseElement);

            let originBodyElement = document.createElement("div");
            originBodyElement.classList.add("accordion-body");
            originCollapseElement.appendChild(originBodyElement);

            articleData.origin.forEach((origin) => {
               let originBodyItemElement = document.createElement("p");
               originBodyItemElement.textContent = origin;
               originBodyElement.appendChild(originBodyItemElement);
            });

            articlesFragment.appendChild(articleElement);
         });

         let theoryContentBodyList = document.querySelector("#theoryContentBodyList");
         theoryContentBodyList.appendChild(contentFragment);

         let theoryArticlesSummary = document.querySelector("#theoryArticlesSummary");
         theoryArticlesSummary.appendChild(articlesFragment);
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

changeElementClasses();

addArticles();

const tasksForm = document.querySelector("#tasks");
tasksForm.addEventListener("submit", handleFormSubmit);

getHelp();
