document.addEventListener('DOMContentLoaded', async () => {
    const subjectList = document.querySelector('#subject');

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
});
