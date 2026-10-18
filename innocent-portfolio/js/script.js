
document.addEventListener("DOMContentLoaded", function () {
    // Automatically update the footer year.
    document.querySelectorAll(".current-year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    // PROFILE IMAGE: keep the placeholder if no photo has been added.
    const profilePhoto = document.getElementById("profile-photo");
    const profilePlaceholder = document.getElementById("profile-placeholder");

    if (profilePhoto && profilePlaceholder) {
        profilePhoto.addEventListener("load", function () {
            profilePhoto.hidden = false;
            profilePhoto.style.width = "100%";
            profilePhoto.style.height = "100%";
            profilePhoto.style.objectFit = "cover";
            profilePhoto.style.borderRadius = "20px";
            profilePlaceholder.style.display = "none";
        });

        profilePhoto.addEventListener("error", function () {
            profilePhoto.hidden = true;
            profilePlaceholder.style.display = "flex";
        });

        if (profilePhoto.complete && profilePhoto.naturalWidth > 0) {
            profilePhoto.hidden = false;
            profilePhoto.style.width = "100%";
            profilePhoto.style.height = "100%";
            profilePhoto.style.objectFit = "cover";
            profilePhoto.style.borderRadius = "20px";
            profilePlaceholder.style.display = "none";
        }
    }

    // STUDY PLANNER
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const taskSummary = document.getElementById("task-summary");
    const clearCompletedButton = document.getElementById("clear-completed");
    const quoteElement = document.getElementById("study-quote");
    const newQuoteButton = document.getElementById("new-quote");

    let tasks = [];

    try {
        tasks = JSON.parse(localStorage.getItem("innocentPortfolioTasks")) || [];
        if (!Array.isArray(tasks)) tasks = [];
    } catch (error) {
        tasks = [];
    }

    function saveTasks() {
        try {
            localStorage.setItem("innocentPortfolioTasks", JSON.stringify(tasks));
        } catch (error) {
            console.warn("Tasks could not be saved in this browser.");
        }
    }

    function renderTasks() {
        if (!taskList || !taskSummary) return;

        taskList.replaceChildren();

        if (tasks.length === 0) {
            const empty = document.createElement("li");
            empty.className = "empty-message";
            empty.textContent = "Your tasks will appear here.";
            taskList.appendChild(empty);
            taskSummary.textContent = "No tasks added yet.";
            return;
        }

        const completedCount = tasks.filter(function (task) {
            return task.completed;
        }).length;

        taskSummary.textContent =
            completedCount + " of " + tasks.length + " tasks completed.";

        tasks.forEach(function (task) {
            const item = document.createElement("li");
            item.className = "task-item" + (task.completed ? " completed" : "");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", "Mark " + task.title + " as completed");

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const content = document.createElement("div");
            content.className = "task-content";

            const title = document.createElement("strong");
            title.textContent = task.title;
            content.appendChild(title);

            if (task.subject) {
                const subject = document.createElement("small");
                subject.textContent = "Category: " + task.subject;
                content.appendChild(subject);
            }

            if (task.date) {
                const dueDate = document.createElement("small");
                dueDate.textContent = "Due: " + task.date;
                content.appendChild(dueDate);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("aria-label", "Delete " + task.title);

            deleteButton.addEventListener("click", function () {
                tasks = tasks.filter(function (savedTask) {
                    return savedTask.id !== task.id;
                });
                saveTasks();
                renderTasks();
            });

            item.append(checkbox, content, deleteButton);
            taskList.appendChild(item);
        });
    }

    if (taskForm) {
        taskForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const titleInput = document.getElementById("task-title");
            const subjectInput = document.getElementById("task-subject");
            const dateInput = document.getElementById("task-date");

            const title = titleInput.value.trim();

            if (!title) {
                titleInput.focus();
                return;
            }

            tasks.push({
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                title: title,
                subject: subjectInput.value.trim(),
                date: dateInput.value,
                completed: false
            });

            saveTasks();
            renderTasks();
            taskForm.reset();
            titleInput.focus();
        });
    }

    if (clearCompletedButton) {
        clearCompletedButton.addEventListener("click", function () {
            tasks = tasks.filter(function (task) {
                return !task.completed;
            });
            saveTasks();
            renderTasks();
        });
    }

    const quotes = [
        "Small, consistent efforts can lead to great results.",
        "Every expert was once a beginner.",
        "Focus on progress, not perfection.",
        "One focused study session is a step forward.",
        "Your future benefits from the effort you make today.",
        "Keep learning, keep practising and keep improving."
    ];

    if (newQuoteButton && quoteElement) {
        newQuoteButton.addEventListener("click", function () {
            const currentQuote = quoteElement.textContent;
            let nextQuote = currentQuote;

            while (quotes.length > 1 && nextQuote === currentQuote) {
                nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
            }

            quoteElement.textContent = nextQuote;
        });
    }

    renderTasks();

    // CONTACT FORM: validate locally without claiming to send a message.
    const contactForm = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");

    if (contactForm && feedback) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            feedback.textContent =
                "Your entries are valid. This demo has not sent your message. Please use the email link to contact me.";
            feedback.style.color = "#1d4ed8";
        });
    }
});
