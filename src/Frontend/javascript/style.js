// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Select all dropdown toggle elements
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            // Toggle the 'open' class on the parent .dropdown element
            const dropdown = this.parentElement;
            dropdown.classList.toggle('open');
        });
    });
});
