// MODEL

class Book {
    constructor(title, author, isbn, id) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = id;
    }
}

class Form {
    static formValidate(title, author, isbn) {
        return new Promise((resolve, reject) => {
            if (title === '' || author === '' || isbn === '') {
                reject('Please Fill Up The Form Properly');
            }else {
                resolve('Successfully Added!');
            }
        });
    }
}


let submitMessage;
let books = [];
let edit = false;

const formBook = (e) => {
    e.preventDefault();
    const formTitle = document.querySelector('#book-title');
    const formTitleVal = document.querySelector('#book-title').value;
    const formAuthor = document.querySelector('#book-author').value;
    const formIsbn = document.querySelector('#book-isbn').value;

    if (edit == false) {
        const id = new Date().valueOf();
        Form.formValidate(formTitleVal, formAuthor, formIsbn)
            .then((data) => submitMessage = data)
            .then(() => addBooks(formTitleVal, formAuthor, formIsbn, id))
            .catch((err) => submitMessage = err)
            .finally(()=> render() );
    }else {
        const formTitleId = formTitle.dataset.id;
        Form.formValidate(formTitleVal, formAuthor, formIsbn)
        .then(() => submitMessage = 'Successfully Updated!')
        .then(() => updateBooksFinally(formTitleVal, formAuthor, formIsbn, formTitleId))
        .then(() => clearInput())
        .then(() => edit = false)
        .catch((err) => submitMessage = err)
        .finally(() => render());
    }

}

const updateBooksFinally = (formTitleVal, formAuthor, formIsbn, formTitleId) => {
    books.forEach((books) => {
        if (books.id == formTitleId) {
            books.title = formTitleVal;
            books.author = formAuthor;
            books.isbn = formIsbn;
        }
    })
}

const addBooks = (formTitle, formAuthor, formIsbn, id) => {
    books.push(new Book(formTitle, formAuthor, formIsbn, id));
    insertLocalStorage();
}

const fadeMessage = (message) => {
    return new Promise((resolve, reject) => {
        if (message != '') {
            resolve();
        }else {
            reject();
        }
    });
}
const clearInput = () => {
    const formTitle = document.querySelector('#book-title');
    const formAuthor = document.querySelector('#book-author');
    const formIsbn = document.querySelector('#book-isbn');

    formTitle.value = '';
    formAuthor.value = '';
    formIsbn.value = '';

    formTitle.focus();
}

const deleteBook = (e) => {
    confirmDelete()
    .then(() => deleteBookFinally(e.id))
    .then(() => submitMessage = 'Successfully Deleted!')
    .then(() => checkBookEmpty())
    .then(() => insertLocalStorage())
    .then(() => render())
    .catch((err) => '')
}

const confirmDelete = () => {
    return new Promise((resolve, reject) => {
        if (confirm('Are You Sure You Want To Delete?')) {
            resolve();
        } else {
            reject();
        }
    })
}

const deleteBookFinally = (id) => {
    books = books.filter((book) => {
        if (book.id == id) {
            return false;
        }else {
            return true;
        }
    })
}

const updateBooks = (e) => {
    const formTitle = document.querySelector('#book-title');
    const formAuthor = document.querySelector('#book-author');
    const formIsbn = document.querySelector('#book-isbn');
    formTitle.dataset.id = e.id;
    books.forEach((books) => {
        if (books.id == e.id) {
            formTitle.value = books.title;
            formAuthor.value = books.author;
            formIsbn.value = books.isbn;
        }
    })
    edit = true;
}

const checkBookEmpty = () => {
    const bookTable = document.querySelector('#book-table');
    (books.length == 0) ? bookTable.classList.add('d-none'): '';
}

const loadLocalStorage = () => {
    const bookTable = document.querySelector('#book-table');
    if (localStorage.getItem('books')) {
        books = JSON.parse(localStorage.getItem('books'));
        (books.length > 0) ? bookTable.classList.remove('d-none'): '';
        render();
    }
}

const insertLocalStorage = () => {
    localStorage.setItem("books", JSON.stringify(books));
}












// VIEW
const render = () => {
    if (submitMessage !== '' && submitMessage !== undefined) {
        const message = document.querySelector('#submit-message');
        const bookTable = document.querySelector('#book-table');
        let messageClass;

        if (submitMessage === 'Successfully Added!' || submitMessage === 'Successfully Updated!') {
            messageClass = 'alert alert-success alert-dismissible text-center';
            clearInput();
            (bookTable.classList.contains('d-none')) ? bookTable.classList.remove('d-none') : '';
        }else {
            messageClass = 'alert alert-danger alert-dismissible text-center';
        }

        message.innerHTML = `
            <p class='${messageClass}'>${submitMessage}</p>
        `;

        fadeMessage(message)
        .then(() => setTimeout(() => { message.firstElementChild.classList.add('fade') }, 1000))
        .then(() => setTimeout(() => { message.firstElementChild.classList.add('d-none') }, 1500))
        .catch((err) => console.log(err));

    }
    if (books != undefined) {
        bookBody = document.querySelector('#book-body');
        bookBody.innerHTML = '';
        books.forEach((book) => {
            bookBody.innerHTML += `
                <tr>
                    <td class="align-middle">${book.title}</td>
                    <td class="align-middle">${book.author}</td>
                    <td class="align-middle">${book.isbn}</td>
                    <td class="pr-0 text-right"><button type="button" class="btn btn-outline-danger" id="${book.id}" onclick="deleteBook(this)">Delete</button></td>
                    <td><button type="button" class="btn btn-outline-success" id="${book.id}" onclick="updateBooks(this)">Update</button></td>
                </tr>
            `
        })
    }
}
















// CONTROLLER

document.querySelector('#form-book').addEventListener('submit',formBook);
window.addEventListener('DOMContentLoaded', loadLocalStorage);