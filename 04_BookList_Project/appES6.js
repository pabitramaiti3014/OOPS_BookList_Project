class Book{
constructor(title,author,isbn){
this.title = title;
this.author = author;
this.isbn = isbn;
}
}

class UI{
  addBookToList(book){
    const list = document.getElementById('book-list');

    //create tr element
    const row = document.createElement('tr');
    
    //Insert cols
    row.innerHTML = `
      <td>${book.title}</td>  
      <td>${book.author}</td>  
      <td>${book.isbn}</td>  
      <td><a href ="#" class="delete"> X</a></td>  
    `;
    
    list.appendChild(row);
  }
  showAlert(message,className){
    //create div
    const div = document.createElement('div');
    //create className
    div.className = `alert ${className}`;
    //create Textnode
    div.appendChild(document.createTextNode(message));
    //get Parent
    const container = document.querySelector('.container');
    //get form
    const form = document.querySelector('#book-form');
    //insert Alert
    container.insertBefore(div,form);

    //timeout after 3sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    },3000);
  }
  deleteBook(target){
    if(target.className==='delete'){
      target.parentElement.parentElement.remove();
    }
  }
  clearFields(){
  document.getElementById('title').value='';
  document.getElementById('author').value='';
  document.getElementById('isbn').value='';
  }
}

//Local Storage Class
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books =[]; 
    }else{
      books =JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static displayBooks(){
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI;

      //Add book to UI
      ui.addBookToList(book);
    });
  }
  static addBook(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books',JSON.stringify(books));
  }
  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach(function(book,index){
      if(book.isbn === isbn){
        books.splice(index,1);
      }
    });

    localStorage.setItem('books',JSON.stringify(books));
  }
}

//DOM  Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

//Event Listener for add book
document.getElementById('book-form').addEventListener('submit',function(e){
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value
  
    //Instantiate book
    const book= new Book(title,author,isbn);
  
    //Instantiate UI
    const ui = new UI();
    
  
    //validate
    if(title ==='' || author === '' || isbn ===''){
      ui.showAlert('Please Fill In All Fields','error');
    }else{
    //Add book to list
    ui.addBookToList(book);

    //Add to Local Storage
    Store.addBook(book);
  
    //Show success
    ui.showAlert('Book Added!!','success')
    //clear fields
    ui.clearFields();
    }
  
    e.preventDefault();
  });
  
  //Event Listener for delete
  document.getElementById('book-list').addEventListener('click',function(e){
  
  const ui = new UI();
  
  //Delete book
  ui.deleteBook(e.target);

  //Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
  //show message
  ui.showAlert('Book Deleted!','success');
  
    e.preventDefault();
  })