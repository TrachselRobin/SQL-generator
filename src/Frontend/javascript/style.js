/*
<a href="#" class="dropdown-toggle">
    <div>
        <button onclick="addDatabase()"><img src="./images/plus.png" alt="plus"></button>
        <img src="./images/arrow.png" alt="arrow">
    </div>
    <p>Databases</p>
</a>

spin the arrow to with adding the class open-arrow
*/

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            toggleDropdown(this);
        });
    });
});

function addDatabase() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggleDropdownPlus(toggle);
    });

    console.log("addDatabase");
}

function addQuerry() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggleDropdownPlus(toggle);
    });

    console.log("addQuerry");
}

function toggleDropdown(element) {
    // Toggle the 'open' class on the parent .dropdown element
    const dropdown = element.parentElement;
    dropdown.classList.toggle('open');

    // Toggle the 'open-arrow' class on the arrow
    const arrow = element.querySelector('.arrow');
    arrow.classList.toggle('open-arrow');
}

function toggleDropdownPlus(element) {
    // toggle all elements to be closed
    element.parentElement.classList.remove('open');
    element.querySelector('.arrow').classList.remove('open-arrow');
}