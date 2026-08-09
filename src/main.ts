export { };
const addTaskBtn = document.querySelector("#addTaskBtn") as HTMLButtonElement;
const updateTaskBtn = document.querySelector("#updateTaskBtn") as HTMLButtonElement;
const taskModal = document.querySelector("#taskModal") as HTMLDivElement;
const cancelBtn = document.querySelector("#cancelBtn") as HTMLButtonElement;
const closeBtn = document.querySelector("#closeBtn") as HTMLButtonElement;

const taskTitle = document.querySelector("#title") as HTMLInputElement;

const taskPriority = document.querySelector("#priority") as HTMLSelectElement;

const taskDate = document.querySelector("#date") as HTMLInputElement;

const taskDescription = document.querySelector("#description") as HTMLTextAreaElement;

const saveTaskBtn = document.querySelector("#saveTaskBtn") as HTMLButtonElement;

const titleError = document.querySelector("#titleError") as HTMLParagraphElement;

const descCount = document.querySelector("#descCount") as HTMLParagraphElement;

const successToast = document.querySelector("#successToast") as HTMLDivElement;


function openModal() {
    taskModal.classList.remove("hidden");
    taskModal.classList.add("flex");
}

function closeModal() {
    taskModal.classList.remove("flex");
    taskModal.classList.add("hidden");
}

addTaskBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);



interface Task {
    title: string;
    priority: string;
    dueDate: string;
    description: string;
    status: string;
}

let allTasks: Task[] = [];

if (localStorage.getItem("tasks")) {
    allTasks = JSON.parse(localStorage.getItem("tasks")!);
    displayTasks();
}

function validTitle(): boolean {

    if (taskTitle.value.trim() === "") {

        titleError.classList.remove("hidden");
        return false;

    }

    titleError.classList.add("hidden");
    return true;

}
function showSuccessToast(message: string): void {
    successToast.querySelector("span")!.textContent = message;

    successToast.classList.remove("hidden");
    successToast.classList.add("flex");

    setTimeout(() => {

        successToast.classList.remove("flex");
        successToast.classList.add("hidden");

    }, 2500);

}
function addTask(): void {
    if (!validTitle()) {
        return;
    }
    const task: Task = {

        title: taskTitle.value,
        priority: taskPriority.value,
        dueDate: taskDate.value,
        description: taskDescription.value,
        status: "todo"

    };

    allTasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(allTasks));

    clearInputs();

    displayTasks();
    showSuccessToast("Task added successfully");

    closeModal();

}

function clearInputs(): void {

    taskTitle.value = "";

    taskPriority.value = "Medium";

    taskDate.value = "";

    taskDescription.value = "";

}


function getTaskButtons(status: string, index: number): string {

    if (status === "todo") {

        return `
            <div class="flex flex-row md:flex-col lg:flex-row gap-2">

                <button
                    data-index="${index}"
                    data-action="start"
                    class="flex-1 py-2 rounded-xl bg-amber-100 text-amber-700 font-medium hover:bg-amber-200 transition">

                    <i class="fa-solid fa-play mr-2"></i>
                    Start

                </button>

                <button
                    data-index="${index}"
                    data-action="complete"
                    class="flex-1 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition">

                    <i class="fa-solid fa-check mr-2"></i>
                    Complete

                </button>

            </div>
        `;
    }


    if (status === "in-progress") {
        return `
            <div class="flex flex-row md:flex-col lg:flex-row gap-2">

                <button
                    data-index="${index}"
                    data-action="todo"
                    class="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition">

                    <i class="fa-solid fa-rotate-left mr-2"></i>
                    To Do

                </button>

                <button
                    data-index="${index}"
                    data-action="complete"
                    class="flex-1 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition">

                    <i class="fa-solid fa-check mr-2"></i>
                    Complete

                </button>

            </div>
        `;
    }


    if (status === "completed") {

        return `
            <div class="flex flex-row md:flex-col lg:flex-row gap-2">

                <button
                    data-index="${index}"
                    data-action="todo"
                    class="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition">

                    <i class="fa-solid fa-rotate-left mr-2"></i>
                    To Do

                </button>

                <button
                    data-index="${index}"
                    data-action="start"
                    class="flex-1 py-2 rounded-xl bg-amber-100 text-amber-700 font-medium hover:bg-amber-200 transition">

                    <i class="fa-solid fa-play mr-2"></i>
                    Start

                </button>

            </div>
        `;
    }

    return "";
}


function createTaskCard(task: Task, index: number): string {
    const isCompleted: boolean = task.status === "completed";

    return `
        <div class="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">

            <div class="flex items-center justify-between">

                <p class="text-xs text-gray-400 font-semibold">
                    #${("00" + (index + 1)).slice(-3)}
                </p>

                <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                    <button
                        data-index="${index}"
                        data-action="edit"
                        class="text-gray-400 hover:text-blue-600 transition">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        data-index="${index}"
                        data-action="delete"
                        class="text-gray-400 hover:text-red-600 transition">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>


            <h3 class="mt-4 text-xl font-bold ${isCompleted
            ? "line-through text-gray-400"
            : "text-gray-800"
        }">

                ${task.title}

            </h3>


            <p class="mt-4 text-gray-500 break-words">
                ${task.description}
            </p>


            <div class="flex items-center gap-3 mt-5">

                <span class="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">

                    <i class="fa-solid fa-circle text-[8px] mr-2"></i>

                    ${task.priority.toUpperCase()}

                </span>


                ${isCompleted
            ? `
                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">

                                <i class="fa-solid fa-check"></i>

                                Done

                            </span>
                          `
            : ""
        }

            </div>


            <div class="flex items-center gap-5 mt-5 text-gray-400 text-sm">

                <span>
                    <i class="fa-regular fa-calendar mr-1"></i>
                    ${task.dueDate}
                </span>

                <span>
                    <i class="fa-regular fa-clock mr-1"></i>
                    Just now
                </span>

            </div>


            <hr class="my-5">


            ${getTaskButtons(task.status, index)}

        </div>
    `;
}

function displayTasks(): void {

    let todoCartona = "";
    let progressCartona = "";
    let completedCartona = "";

    const todoTasks = document.querySelector("#todoTasks") as HTMLDivElement;
    const progressTasks = document.querySelector("#progressTasks") as HTMLDivElement;
    const completedTasks = document.querySelector("#completedTasks") as HTMLDivElement;

    const todoEmpty = document.querySelector("#todoEmpty") as HTMLDivElement;
    const progressEmpty = document.querySelector("#progressEmpty") as HTMLDivElement;
    const completedEmpty = document.querySelector("#completedEmpty") as HTMLDivElement;

    const todoCount = document.querySelector("#todoCount") as HTMLParagraphElement;
    const progressCount = document.querySelector("#progressCount") as HTMLParagraphElement;
    const completedCount = document.querySelector("#completedCount") as HTMLParagraphElement;



    for (let i = 0; i < allTasks.length; i++) {

        if (allTasks[i].status === "todo") {

            todoCartona += createTaskCard(allTasks[i], i);

        }

        if (allTasks[i].status === "in-progress") {

            progressCartona += createTaskCard(allTasks[i], i);

        }

        if (allTasks[i].status === "completed") {

            completedCartona += createTaskCard(allTasks[i], i);

        }

    }


    todoTasks.innerHTML = todoCartona;

    progressTasks.innerHTML = progressCartona;

    completedTasks.innerHTML = completedCartona;


    if (todoCartona === "") {

        todoEmpty.classList.remove("hidden");

    } else {

        todoEmpty.classList.add("hidden");

    }


    if (progressCartona === "") {

        progressEmpty.classList.remove("hidden");

    } else {

        progressEmpty.classList.add("hidden");

    }


    if (completedCartona === "") {

        completedEmpty.classList.remove("hidden");

    } else {

        completedEmpty.classList.add("hidden");

    }


    const todoNumber =
        allTasks.filter(task => task.status === "todo").length;

    const progressNumber =
        allTasks.filter(task => task.status === "in-progress").length;

    const completedNumber =
        allTasks.filter(task => task.status === "completed").length;

    todoCount.textContent =
        `${todoNumber} ${todoNumber === 1 ? "Task" : "Tasks"}`;

    progressCount.textContent =
        `${progressNumber} ${progressNumber === 1 ? "Task" : "Tasks"}`;

    completedCount.textContent =
        `${completedNumber} ${completedNumber === 1 ? "Task" : "Tasks"}`;

}
function changeTaskStatus(index: number, newStatus: string): void {

    allTasks[index].status = newStatus;

    localStorage.setItem("tasks", JSON.stringify(allTasks));

    displayTasks();
}


function deleteTask(index: number): void {

    allTasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(allTasks));

    displayTasks();
}

let currentIndex: number = -1;

function preUpdate(index: number): void {
    currentIndex = index;
    taskTitle.value = allTasks[index].title;
    taskPriority.value = allTasks[index].priority;
    taskDate.value = allTasks[index].dueDate;
    taskDescription.value = allTasks[index].description;
    saveTaskBtn.classList.add("hidden");
    updateTaskBtn.classList.remove("hidden");
    taskModal.classList.remove("hidden");
}

function updateTask(): void {

    const task: Task = {
        title: taskTitle.value,
        priority: taskPriority.value,
        dueDate: taskDate.value,
        description: taskDescription.value,
        status: allTasks[currentIndex].status

    };

    allTasks.splice(currentIndex, 1, task);

    localStorage.setItem("tasks", JSON.stringify(allTasks));

    clearInputs();

    displayTasks();

    updateTaskBtn.classList.add("hidden");
    saveTaskBtn.classList.remove("hidden");

    closeModal();

    showSuccessToast("Task updated successfully");
}
const kanbanBoard = document.querySelector("#kanbanBoard") as HTMLDivElement;

kanbanBoard.addEventListener("click", function (e) {
    const target = e.target as HTMLElement;

    const button = target.closest("button") as HTMLButtonElement;

    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    if (action === "start") {

        changeTaskStatus(index, "in-progress");

    }

    else if (action === "complete") {

        changeTaskStatus(index, "completed");

    }

    else if (action === "todo") {

        changeTaskStatus(index, "todo");

    }

    else if (action === "delete") {

        deleteTask(index);

    }
    else if (action === "edit") {

        preUpdate(index);

    }

});


saveTaskBtn.addEventListener("click", addTask);

taskDescription.addEventListener("input", function () {
    descCount.textContent = `${taskDescription.value.length}/500`;

});

updateTaskBtn.addEventListener("click", function () {

    updateTask();

});


