
    // let togglebtn = document.querySelector('.toggle-btn');
    // let navbar = document.querySelector('.navbar');
    // let navItems = document.querySelectorAll('.nav-list ul li');

    // // Toggle mobile navigation
    // togglebtn.addEventListener('click', (event) => {
    //     navbar.classList.toggle('mobile-nav');
    //     event.stopPropagation(); // Prevent this click from propagating to the document
    // });

    // // Close the navbar when a nav item is clicked
    // navItems.forEach(item => {
    //     item.addEventListener('click', () => {
    //         if (navbar.classList.contains('mobile-nav')) {
    //             navbar.classList.remove('mobile-nav');
    //         }
    //     });
    // });

    // // Close the navbar when clicking on the navbar area other than <li> items
    // navbar.addEventListener('click', (event) => {
    //     const clickedElement = event.target;
    //     if (!clickedElement.matches('ul li') && navbar.classList.contains('mobile-nav')) {
    //         navbar.classList.remove('mobile-nav');
    //     }
    // });

    // // Close the navbar when clicking outside of it
    // document.addEventListener('click', (event) => {
    //     if (!navbar.contains(event.target) && !togglebtn.contains(event.target)) {
    //         navbar.classList.remove('mobile-nav');
    //     }
    // });


    let togglebtn = document.querySelector('.toggle-btn');
let navbar = document.querySelector('.navbar');
let navItems = document.querySelectorAll('.nav-list ul li');

// Toggle mobile navigation
togglebtn.addEventListener('click', (event) => {
    navbar.classList.toggle('mobile-nav');
    event.stopPropagation(); // Prevent propagation to the document
});

// Close the navbar when a nav item is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navbar.classList.remove('mobile-nav');
    });
});

// Close the navbar when clicking on the navbar area other than <li> items
navbar.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (!clickedElement.matches('ul li') && navbar.classList.contains('mobile-nav')) {
        navbar.classList.remove('mobile-nav');
    }
});

// Close the navbar when clicking outside of it
document.addEventListener('click', (event) => {
    if (!navbar.contains(event.target) && !togglebtn.contains(event.target)) {
        navbar.classList.remove('mobile-nav');
    }
});




    // load more
    document.addEventListener('DOMContentLoaded', function () {
        const seeMoreButton = document.querySelector('.see-more');
        const hiddenBoxes = document.querySelectorAll('.grid-box.hidden');
        let currentIndex = 0;
        const boxesPerClick = 3;

        seeMoreButton.addEventListener('click', function () {
            console.log('See More button clicked');
            for (let i = 0; i < boxesPerClick; i++) {
                if (currentIndex < hiddenBoxes.length) {
                    console.log('Showing box index:', currentIndex);
                    hiddenBoxes[currentIndex].classList.remove('hidden');
                    currentIndex++;
                }
            }
            // Hide the "See More" button if all boxes are shown
            if (currentIndex >= hiddenBoxes.length) {
                console.log('All boxes shown, hiding button');
                seeMoreButton.style.display = 'none';
            }
        });
    });
    


    





    function handleFormSubmit(event) {
        // Prevent form from submitting normally
        event.preventDefault();

        // Show popup
        document.getElementById("popup").style.display = "block";
        
        // Simulate form submission (you can replace this with actual email sending logic if needed)
        setTimeout(function() {
            // Clear form after "Sending message" popup
            document.getElementById("contactForm").reset();

            // Hide popup after 2 seconds
            document.getElementById("popup").style.display = "none";
        }, 2000); // The popup stays visible for 2 seconds before the form is cleared
    }


// mainpage pop js
function togglePopup1() {
    document.getElementById("popup-1").classList.toggle("active");
}
// mainpage pop js
function togglePopup2() {
    document.getElementById("popup-2").classList.toggle("active");
}

function togglePopup3() {
    document.getElementById("popup-3").classList.toggle("active");
}

function togglePopup4() {
    document.getElementById("popup-4").classList.toggle("active");
}
function togglePopup5() {
    document.getElementById("popup-5").classList.toggle("active");
}
