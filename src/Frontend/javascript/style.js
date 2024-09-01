document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('open');
    });
});