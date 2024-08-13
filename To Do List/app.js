// Function to add a task
function addTask() {
    let input = document.querySelector('input');
    let inputValue = input.value.trim(); // Trim any leading/trailing whitespace

    if (inputValue === "") return; // Prevent adding empty tasks

    // Clear the input field and set focus back to it
    input.value = '';
    input.focus();

    let li = document.createElement('li');
    let dltButton = document.createElement('button');
    let ul = document.querySelector('ul');

    dltButton.innerText = "Delete";
    li.classList.add("clas");
    li.innerText = inputValue;

    li.appendChild(dltButton);
    ul.appendChild(li);

    dltButton.addEventListener("click", function() {
        ul.removeChild(li);
    });
}

// Add task when the button is clicked
let button = document.querySelector('button');
button.addEventListener('click', addTask);

// Add task when the "Enter" key is pressed
let input = document.querySelector('input');
input.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
