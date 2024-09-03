document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDropdown(this);
        });
    });
});

function toggleDropdown(element) {
    const dropdown = element.parentElement;
    dropdown.classList.toggle('open');

    const arrow = element.querySelector('.arrow');
    arrow.classList.toggle('open-arrow');
}

function toggleDropdownPlus(element) {
    element.parentElement.classList.remove('open');
    element.querySelector('.arrow').classList.remove('open-arrow');
}
