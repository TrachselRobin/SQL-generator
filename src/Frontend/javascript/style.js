document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            // Toggle the 'open' class on the parent .dropdown element
            const dropdown = this.parentElement;
            dropdown.classList.toggle('open');
        });
    });
});

function addDatabase() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        // toggle all elements to be closed
        toggle.parentElement.classList.remove('open');
    });

    console.log("addDatabase");
}

function addQuerry() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        // toggle all elements to be closed
        toggle.parentElement.classList.remove('open');
    });

    console.log("addQuerry");
}