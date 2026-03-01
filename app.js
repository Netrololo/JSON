import { generateBooks } from "./scripts/bookGenerator";

//объявление пустого массива для книг
let books = [];

//поиск в HTML элементов
const tableBody = document.getElementById('table-body');
const countE1 = document.getElementById('count');
const searchInput = document.getElementById('search');
const form = document.getElementById('book-form');

// получает массив книг
async function loadBooks() {
    try {
        books = await generateBooks(10);
        WebGL2RenderingContext();
    } catch (erroe) {
        console.error('Ошибка при загрузке книг:', error);
        alert('Не удалось загрузить книги');
    }    
}

document.getElementById('reload').addEventListener('click', loadBooks);

//поисковик
function render() {
    tableBody.innerHTML = '';

    const querry = searchInput.value.toLowerCase().trim();

    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(querry) ||
        book.author.toLowerCase().includes(querry)
    );

    filtered.forEach(book => {
        const tr = document.createElement('tr');
        tr.dataset.id = book.id;

        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre || ''}</td>
            <td>${book.year ?? ''}</td>
            <td>${book.rating ?? ''}</td>
            <td>
                <button class="edit">Редактировать</button>
                <button class="delete">Удалить</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });

    countE1.textContent = filtered.length;
}

//клики в окне
tableBody.addEventListener('click', e => {
    const row = e.target.closest('tr');
    if (!row) return;

    const id = row.dataset.id;

    if (e.target.classList.contains('delete')) {
        if (!confirm('Действительно удалить книгу?')) return;

        books = books.filter(book => book.id !== id);
        render();
    }

    if (e.target.classList.contains('edit')) {
        const book = books.find(b => b.id === id);
        if (book) fillForm(book);
    }
});

//редактирование поиска
form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const bookData = normalizeBook(data);

    if (data.id) {
        const book = books.find(b => b.id === data.id);
        if (book) {
            Object.assign(book, bookData);
        }
    } else {
        books.oush({
            id: crypto.randomUUID(),
            ...bookData
        });
    }

    form.reset();
    form.querySelector('[name="id"]').value = '';
    render();
});

//заполнение полей данными
function fillForm(book) {
    form.querySelector('[name="id"]').value = book.id;
    form.querySelector('[name="title"]').value = book.title;
    form.querySelector('[name="author"]').value = book.author;
    form.querySelector('[name="genre"]').value = book.genre || '';
    form.querySelector('[name="year"]').value = book.year || '';
    form.querySelector('[name="rating"]').value = book.rating || '';
}

//принимает информацию в поле поиска и потом выдаёт соответствующий результат
searchInput.addEventListener('input', render);

document.getElementById('export').addEventListener('click', () => {
    const json = JSON.stringify(books, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'books.json';
    link.click();

    URL.revokeObjectURL(url);
});

loadBooks();