document.addEventListener('DOMContentLoaded', async () => {
    const subjectList = document.querySelector('#subject');
    const form = document.querySelector('form');
    const tbody = document.querySelector('tbody');
    const status = document.querySelector('#status');
    const searchButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );
    const availableCheckbox = form.querySelector(
        'input[name="available"]'
    );

    
    try {
        const response = await fetch('subjects.php');

        if (!response.ok) {
            throw new Error('Could not load subjects.');
        }

        const subjects = await response.json();
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;

            subjectList.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }

    async function loadBooks() {
        const params = new URLSearchParams(new FormData(form));
        searchButton.disabled = true;
        status.textContent = 'Searching…';

        try {
            const response = await fetch(`books.php?${params}`);

            if (!response.ok) {
                throw new Error('Could not load books.');
            }

            const books = await response.json();

            tbody.replaceChildren();
            
            books.forEach(book => {
                const row = document.createElement('tr');

                const titleCell = document.createElement('td');
                titleCell.textContent = book.title;
                row.appendChild(titleCell);

                const authorCell = document.createElement('td');
                authorCell.textContent = book.author;
                row.appendChild(authorCell);

                const yearCell = document.createElement('td');
                yearCell.textContent = book.year;
                row.appendChild(yearCell);

                const subjectCell = document.createElement('td');
                subjectCell.textContent = book.subject;
                row.appendChild(subjectCell);

                const copiesCell = document.createElement('td');
                copiesCell.textContent = `${book.available} of ${book.copies}`;

                if (Number(book.available) === 0) {
                    copiesCell.classList.add('out');
                }

                row.appendChild(copiesCell);
                tbody.appendChild(row);
            });

            if (books.length === 0) {
                status.textContent = 'No books match your search.';
            } else if (books.length === 1) {
                status.textContent = '1 book found.';
            } else {
                status.textContent = `${books.length} books found.`;
            }

        } catch (error) {
            console.error(error);
            tbody.replaceChildren();
            status.textContent = "Couldn't load the books. Please try again.";

        } finally {
            searchButton.disabled = false;
        }
    }

    loadBooks();    
    form.addEventListener('submit', event => {
        event.preventDefault();
        loadBooks();
    });

    subjectList.addEventListener('change', loadBooks);
    availableCheckbox.addEventListener('change', loadBooks);
});
