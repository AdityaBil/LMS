// Initialize data storage
let books = JSON.parse(localStorage.getItem('books')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];

// Book Management
const addBookForm = document.getElementById('addBookForm');
const booksListDiv = document.getElementById('booksList');

if (addBookForm) {
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        
        const book = {
            id: Date.now(),
            title,
            author,
            available: true
        };
        
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        addBookForm.reset();
        displayBooks();
    });
}

function displayBooks() {
    if (!booksListDiv) return;
    
    booksListDiv.innerHTML = '';
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        bookElement.innerHTML = `
            <div>
                <h6 class="mb-0">${book.title}</h6>
                <small class="text-muted">by ${book.author}</small>
            </div>
            <span class="badge ${book.available ? 'bg-success' : 'bg-warning'} rounded-pill">
                ${book.available ? 'Available' : 'Issued'}
            </span>
        `;
        booksListDiv.appendChild(bookElement);
    });
}

// User Management
const addUserForm = document.getElementById('addUserForm');
const usersListDiv = document.getElementById('usersList');

if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        
        const user = {
            id: Date.now(),
            name
        };
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        addUserForm.reset();
        displayUsers();
    });
}

function displayUsers() {
    if (!usersListDiv) return;
    
    usersListDiv.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        userElement.innerHTML = `
            <div>
                <h6 class="mb-0">${user.name}</h6>
                <small class="text-muted">Member ID: ${user.id}</small>
            </div>
        `;
        usersListDiv.appendChild(userElement);
    });
}

// Book Issue/Return Management
const issueBookForm = document.getElementById('issueBookForm');
const returnBookForm = document.getElementById('returnBookForm');
const issuedBooksListDiv = document.getElementById('issuedBooksList');

if (issueBookForm) {
    issueBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookId = parseInt(document.getElementById('issueBookId').value);
        const userName = document.getElementById('issueUserName').value;
        
        const book = books.find(b => b.id === bookId);
        const user = users.find(u => u.name === userName);
        
        if (!book || !user) {
            alert('Book or user not found!');
            return;
        }
        
        if (!book.available) {
            alert('Book is already issued!');
            return;
        }
        
        book.available = false;
        const issuedBook = {
            bookId,
            userId: user.id,
            userName: user.name,
            bookTitle: book.title,
            issueDate: new Date().toISOString()
        };
        
        issuedBooks.push(issuedBook);
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
        issueBookForm.reset();
        displayBooks();
        displayIssuedBooks();
    });
}

if (returnBookForm) {
    returnBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookId = parseInt(document.getElementById('returnBookId').value);
        
        const book = books.find(b => b.id === bookId);
        const issuedBookIndex = issuedBooks.findIndex(ib => ib.bookId === bookId);
        
        if (!book || issuedBookIndex === -1) {
            alert('Book not found or not issued!');
            return;
        }
        
        book.available = true;
        issuedBooks.splice(issuedBookIndex, 1);
        
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
        returnBookForm.reset();
        displayBooks();
        displayIssuedBooks();
    });
}

function displayIssuedBooks() {
    if (!issuedBooksListDiv) return;
    
    issuedBooksListDiv.innerHTML = '';
    issuedBooks.forEach(issuedBook => {
        const issuedBookElement = document.createElement('div');
        issuedBookElement.className = 'list-group-item';
        issuedBookElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${issuedBook.bookTitle}</h6>
                    <small class="text-muted">Issued to: ${issuedBook.userName}</small>
                </div>
                <small class="text-muted">
                    Issued on: ${new Date(issuedBook.issueDate).toLocaleDateString()}
                </small>
            </div>
        `;
        issuedBooksListDiv.appendChild(issuedBookElement);
    });
}

// Initialize displays if on dashboard page
if (document.querySelector('.dashboard')) {
    displayBooks();
    displayUsers();
    displayIssuedBooks();
}

// Add floating animation to hero image if on home page
const heroImage = document.querySelector('.hero-image img');
if (heroImage) {
    heroImage.style.animation = 'float 6s ease-in-out infinite';
} 