document.addEventListener('DOMContentLoaded', function () {
    // References
    const welcomeScreen = document.getElementById('welcome-screen');
    const startBtn = document.getElementById('start-btn');
    const book = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageCounter = document.getElementById('page-counter');
    const pageTurnEffect = document.getElementById('page-turn-effect');
    const bookContainer = document.querySelector('.book-container');

    // Initially hide the book container
    if (bookContainer) {
        bookContainer.style.visibility = 'hidden';
        bookContainer.style.opacity = '0';
    }

    // Book state
    let currentPage = 0;
    let totalPages = 0;
    let isAnimating = false;
    let bookData = null;
    let currentPageElement = null;

    // Fetch book data from JSON file
    fetch('/static/data/poems.json')
        .then(response => response.json())
        .then(data => {
            bookData = data;
            console.log('Book data loaded:', bookData);
            totalPages = bookData.poems.length + 1; // Add 1 for title page

            // Create the single page element that will be reused
            createPageElement();

            // Initialize with the first page
            renderCurrentPage();
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });

    // Create the single page element that will be reused
    function createPageElement() {
        currentPageElement = document.createElement('div');
        currentPageElement.className = 'page';
        book.appendChild(currentPageElement);
    }

    // Add common decorative elements to a page
    function addDecorativeElements() {
        return `
            <div class="background-texture"></div>
            <div class="border-design"></div>
            <div class="inner-border"></div>
            <div class="decorative-line top-line"></div>
            <div class="decorative-line bottom-line"></div>
            <div class="corner-ornament corner-tl"></div>
            <div class="corner-ornament corner-tr"></div>
            <div class="corner-ornament corner-bl"></div>
            <div class="corner-ornament corner-br"></div>
        `;
    }

    // Render the current page content
    function renderCurrentPage() {
        if (currentPage === 0) {
            // Title page
            currentPageElement.innerHTML = `
                <div class="page-content page-front">
                    <div class="title-page">
                        <div class="title-ornament">❧</div>
                        <div class="title-frame">
                            <div class="title">${bookData.title}</div>
                        </div>
                        <div class="author">POR ${bookData.author}</div>
                        <div class="title-ornament">❦</div>
                    </div>
                    ${addDecorativeElements()}
                </div>
            `;
        } else {
            // Poem page
            const poem = bookData.poems[currentPage - 1];
            const formattedPhrase = `<span class="phrase-number">${poem.number}.</span> ${poem.text}`;

            currentPageElement.innerHTML = `
                <div class="page-content page-front">
                    <div class="phrase-container">
                        <div class="phrase">${formattedPhrase}</div>
                    </div>
                    <div class="page-number">${currentPage}</div>
                    ${addDecorativeElements()}
                </div>
            `;
        }

        updatePageCounter();
    }

    // Turn to next page
    function nextPage() {
        if (currentPage < totalPages - 1 && !isAnimating) {
            isAnimating = true;

            // Add turning animation
            currentPageElement.classList.add('turning');
            playPageTurnEffect();

            // Update content immediately but hide it
            currentPage++;
            renderCurrentPage();

            setTimeout(() => {
                // Remove turning animation
                currentPageElement.classList.remove('turning');
                isAnimating = false;
            }, 800); // Match CSS transition time (was 300ms)
        }
    }

    // Turn to previous page
    function prevPage() {
        if (currentPage > 0 && !isAnimating) {
            isAnimating = true;

            // Add reverse turning animation
            currentPageElement.classList.add('reverse-turning');
            playPageTurnEffect();

            // Update content immediately but hide it
            currentPage--;
            renderCurrentPage();

            setTimeout(() => {
                // Remove reverse turning animation
                currentPageElement.classList.remove('reverse-turning');
                isAnimating = false;
            }, 800); // Match CSS transition time (was 300ms)
        }
    }

    // Update page counter text
    function updatePageCounter() {
        pageCounter.textContent = `Página ${currentPage + 1} de ${totalPages}`;
    }

    // Play page turn effect animation
    function playPageTurnEffect() {
        if (pageTurnEffect) {
            pageTurnEffect.style.animation = 'none';
            void pageTurnEffect.offsetWidth; // Trigger reflow
            pageTurnEffect.style.animation = 'pageTurnEffect 0.8s ease-out forwards';

            // Add a subtle rotation to the book during page turns
            book.style.transform = 'rotateX(8deg) rotateZ(0.5deg)';

            // Return to normal position after animation
            setTimeout(() => {
                book.style.transform = 'rotateX(8deg)';
            }, 500);
        }
    }

    // Start reading button click
    if (startBtn) {
        startBtn.addEventListener('click', function () {
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.transform = 'translateY(-50px)';

            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                bookContainer.classList.remove('hidden');
                bookContainer.style.visibility = 'visible';
                bookContainer.style.opacity = '1';
            }, 800);
        });
    } else {
        // If no start button, automatically show the book
        setTimeout(() => {
            if (welcomeScreen) {
                welcomeScreen.style.opacity = '0';
                welcomeScreen.style.transform = 'translateY(-50px)';

                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    if (bookContainer) {
                        bookContainer.classList.remove('hidden');
                        bookContainer.style.visibility = 'visible';
                        bookContainer.style.opacity = '1';
                    }
                }, 800);
            }
        }, 1000);
    }

    // Event listeners for navigation
    nextBtn.addEventListener('click', nextPage);
    prevBtn.addEventListener('click', prevPage);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            prevPage();
        }
    });

    // Swipe gesture support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        // Calculate horizontal and vertical distance
        const horizontalDistance = Math.abs(touchEndX - touchStartX);
        const verticalDistance = Math.abs(touchEndY - touchStartY);

        // Only process as horizontal swipe if movement is more horizontal than vertical
        if (horizontalDistance > verticalDistance) {
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next page
                nextPage();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous page
                prevPage();
            }
        }
    }
}); 