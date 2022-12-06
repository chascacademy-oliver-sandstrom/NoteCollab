export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onNoteStared } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteStared = onNoteStared;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes__sidebar">
            <a id="quireLogo" href="index.html">QUIRE</a>

                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="preview">
            <h1>Welcome!</h1>
            <h2>Quire is a web-based notebook</h2><br>
            <h3>Getting started</h3>
            <p>Click on "add note" to open a new note.<br>
            Double tap on your note to delete it.</p>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="Untitled">
                <div class="main-content">

                <!--Text editor toolbar-->
                <div class="notes__body">
                    <button type="button" class="btn" data-element="bold">
                        <i class="fa-solid fa-bold"></i>
                    </button>
                    <button type="button" class="btn" data-element="italic">
                        <i class="fa fa-italic"></i>
                    </button>
                    <button type="button" class="btn" data-element="underline">
                        <i class="fa fa-underline"></i>
                    </button>
                    <button type="button" class="btn" data-element="insertUnorderedList">
                        <i class="fa fa-list-ul"></i>
                    </button>
                    <button type="button" class="btn" data-element="insertOrderedList">
                        <i class="fa fa-list-ol"></i>
                    </button>
                    <button type="button" class="btn" data-element="createLink">
                        <i class="fa fa-link"></i>
                    </button>
                    <button type="button" class="btn" data-element="justifyLeft">
                        <i class="fa fa-align-left"></i>
                    </button>
                    <button type="button" class="btn" data-element="justifyCenter">
                        <i class="fa fa-align-center"></i>
                    </button>
                    <button type="button" class="btn" data-element="justifyRight">
                        <i class="fa fa-align-right"></i>
                    </button>
                    <button type="button" class="btn" data-element="justifyFull">
                        <i class="fa fa-align-justify"></i>
                    </button>
                    <button type="button" class="btn" data-element="insertImage">
                        <i class="fa fa-image"></i>
                    </button>
                    <!--End of text editor toolbar-->
                
                    <!-- Content -->
                    <div class="content" contenteditable="true"></div>
                    
                    <!--End of content-->
                    <button id="print">Print</button>

                </div> 
                
        
            </div>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body .content");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
            this.root.querySelector(".preview").style.display = "none";
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.innerHTML.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });



        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, stared, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
                <div id="favorite-div">
                <span class="favorite ${stared ? "make-favorite":""}">&#9734;</span>
                </div>
            </div>
        `;
    }

    

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes)
        {
            const html = this._createListItemHTML(note.id, note.title, note.body, note.stared, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
            const favBtn = noteListItem.querySelector('.favorite');
            favBtn.addEventListener('click', () => {
                this.onNoteStared(noteListItem.dataset.noteId, !favBtn.classList.contains("make-favorite"));

            });
        });

    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body .content").innerHTML = note.body;
        this.root.querySelector(".preview").style.display = "none";

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}


