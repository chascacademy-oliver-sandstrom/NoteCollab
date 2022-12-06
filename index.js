import App from "./app.js";

const root = document.getElementById("app");
const app = new App(root);



// Elements
const elements = document.querySelectorAll('.btn');

// Event
elements.forEach(element => {
    element.addEventListener('click', () => {
        let command = element.dataset['element'];

        if (command == 'createLink' || command == 'insertImage') {
            let url = prompt('Enter the link here:', 'http://')
            document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, null);
        }

      
    })
})

const printBtn = document.getElementById('print');
printBtn.addEventListener('click', function() {
    print();
})