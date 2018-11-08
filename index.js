let allBooks = []
document.addEventListener("DOMContentLoaded", function() {
  const listContainer = document.getElementById('list')
  const showPanel = document.getElementById('show-panel')

  fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(jsonBooks => {
      allBooks = jsonBooks
      listContainer.innerHTML = renderAllBooks(jsonBooks)
    })

  listContainer.addEventListener('click', (event) => {
    if (event.target.dataset.id !== undefined) {
      let foundBook = findBook(event.target.dataset.id)
      showPanel.innerHTML = renderFullBook(foundBook)
      renderUserList(foundBook)
    }
  })

  showPanel.addEventListener('click', (event) => {
    if(event.target.innerText === "Read Book") {
      foundBook = findBook(event.target.dataset.id)
      foundBook.users.push({"id":1, "username":"pouros"})
      fetch(`http://localhost:3000/books/${foundBook.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          users: foundBook.users
        })
      })
      .then(response => response.json())
      .then(json => {
        renderUserList(json)
      })
      event.target.innerText = "Un-Read Book"
    } else if (event.target.innerText === "Un-Read Book") {
      alert("You have already liked this book")
    }
  })

}) // End of DOMContentLoaded

// ---------- HELPERS -----------------
function renderAllBooks(booksArray) {
  return booksArray.map(book =>
    `
      <li class="ind-book" data-id="${book.id}"> ${book.title}</li>
    `
  ).join("")
}

function renderFullBook(bookObj) {
  return `
    <h2 class="title" data-id=${bookObj.id}>${bookObj.title}</h2>
    <img src="${bookObj.img_url}">
    <p class="description">${bookObj.description}</p>
    <div id="users-list-container">USERS:

    </div>
    <button data-id="${bookObj.id}" type="button" name="Read Book">Read Book</button>
    `
}

function renderUserList(bookObj) {
  let usersContainer = document.getElementById('users-list-container')
  usersContainer.innerHTML = listReaders(bookObj)
}

function listReaders(bookObj) {
  return bookObj.users.map(user =>
  `
  <p>${user.username}</p>
  `).join("")
}

function findBook(id) {
  return allBooks.find(book => book.id == id)
}
