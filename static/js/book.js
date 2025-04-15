document.addEventListener('DOMContentLoaded', function () {
    // References
    const welcomeScreen = document.getElementById('welcome-screen');
    const startBtn = document.getElementById('start-btn');
    const bookElement = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageCounter = document.getElementById('page-counter');
    const bookContainer = document.querySelector('.book-container');
    const homeBtn = document.getElementById('home-btn');

    // Initially hide the book container
    if (bookContainer) {
        bookContainer.style.visibility = 'hidden';
        bookContainer.style.opacity = '0';
    }

    // Book initialization and configuration
    let pageFlip = null;

    // Initialize PageFlip with hardcoded pages
    function initPageFlip() {
        // Configure StPageFlip according to documentation
        pageFlip = new St.PageFlip(bookElement, {
            width: 400, // Base page width
            height: 600, // Base page height
            size: "stretch", // Stretch to fit container
            minWidth: 250, // Smaller minimum width for mobile
            minHeight: 350, // Smaller minimum height for mobile
            maxWidth: 1500, // Larger maximum width for desktop
            maxHeight: 2000, // Larger maximum height for desktop
            showCover: false, // Changed to false to remove cover behavior
            usePortrait: true,
            autoSize: true, // Auto-size to container
            drawShadow: true,
            flippingTime: 1000,
            useMouseEvents: true,
            swipeDistance: 30,
            clickEventForward: true,
            mobileScrollSupport: true,
            maxShadowOpacity: 0.5,
            startPage: window.innerWidth > 768 ? 0 : 1 // Start showing blank page on desktop, title page on mobile
        });

        // Load pages from HTML as per documentation
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Fix for positioning issue on smaller screens when turning the cover
        if (window.innerWidth < 1003) {
            // Add a specific event handler for page flipping start
            pageFlip.on('flipping', (e) => {
                // Keep book container position stable during flipping
                bookContainer.style.transition = 'none';
                bookContainer.style.transform = 'translateY(0)';
            });

            // When flip is complete, ensure proper positioning
            pageFlip.on('flip', (e) => {
                // Reset any transform changes made during flipping
                bookContainer.style.transition = 'transform 0.3s ease-out';
                bookContainer.style.transform = '';

                const currentPage = e.data + 1;
                const totalPages = pageFlip.getPageCount();
                updatePageCounter(currentPage, totalPages);
            });
        } else {
            // Regular flip event handler for larger screens
            pageFlip.on('flip', (e) => {
                const currentPage = e.data + 1;
                const totalPages = pageFlip.getPageCount();
                updatePageCounter(currentPage, totalPages);
            });
        }

        // Listen for changes in orientation
        pageFlip.on('changeOrientation', (e) => {
            console.log('Orientation changed to:', e.data);
            // Force update after orientation change
            setTimeout(() => {
                pageFlip.update();
            }, 300);
        });

        // Listen for changes in state
        pageFlip.on('changeState', (e) => {
            console.log('State changed to:', e.data);
        });

        // Update initial page counter
        const initialPage = window.innerWidth > 768 ? 1 : 2; // First or second page depending on viewport
        updatePageCounter(initialPage, pageFlip.getPageCount());
    }

    // Update page counter text
    function updatePageCounter(currentPage, totalPages) {
        // Adjust page display for the blank page
        if (currentPage === 1) {
            pageCounter.textContent = `Portada`;
        } else {
            // Subtract 1 from current page for display to account for blank page
            const displayPage = currentPage - 1;
            pageCounter.textContent = `Página ${displayPage} de ${totalPages - 1}`;
        }
    }

    // Initialize StPageFlip
    initPageFlip();

    // Function to show the book and hide welcome screen
    function showBook() {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'translateY(-50px)';

        setTimeout(() => {
            welcomeScreen.style.display = 'none';

            // Show book container
            bookContainer.classList.remove('hidden');
            bookContainer.style.visibility = 'visible';
            bookContainer.style.opacity = '1';

            // Set initial position explicitly to prevent jumps
            if (window.innerWidth < 1003) {
                bookContainer.style.transform = 'translateY(0)';
            }

            // Show home button
            homeBtn.classList.remove('hidden');
            homeBtn.style.visibility = 'visible';
            homeBtn.style.opacity = '1';

            // Update page flip when becoming visible
            if (pageFlip) {
                setTimeout(() => {
                    pageFlip.update();
                    // Force redraw to ensure proper rendering on smaller screens
                    if (window.innerWidth < 1080) {
                        pageFlip.turnToCurrent();
                    }
                }, 100);
            }
        }, 800);
    }

    // Function to go back to welcome screen
    function showWelcomeScreen() {
        // Hide the book container and home button
        bookContainer.style.opacity = '0';
        homeBtn.style.opacity = '0';

        setTimeout(() => {
            bookContainer.style.visibility = 'hidden';
            bookContainer.classList.add('hidden');

            homeBtn.style.visibility = 'hidden';
            homeBtn.classList.add('hidden');

            // Show welcome screen
            welcomeScreen.style.display = 'flex';
            setTimeout(() => {
                welcomeScreen.style.opacity = '1';
                welcomeScreen.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    }

    // Start reading button click
    if (startBtn) {
        startBtn.addEventListener('click', showBook);
    } else {
        // If no start button, automatically show the book
        setTimeout(showBook, 1000);
    }

    // Home button click handler
    if (homeBtn) {
        homeBtn.addEventListener('click', showWelcomeScreen);
    }

    // Event listeners for navigation
    prevBtn.addEventListener('click', function () {
        if (pageFlip) pageFlip.flipPrev('top');
    });

    nextBtn.addEventListener('click', function () {
        if (pageFlip) pageFlip.flipNext('top');
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (pageFlip) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                pageFlip.flipNext('top');
            } else if (e.key === 'ArrowLeft') {
                pageFlip.flipPrev('top');
            } else if (e.key === 'Escape') {
                // ESC key to go back to welcome screen
                showWelcomeScreen();
            }
        }
    });

    // Handle window resize events to update the book dimensions
    window.addEventListener('resize', function () {
        if (pageFlip) {
            // Reset any transforms that might have been applied
            bookContainer.style.transition = 'none';
            bookContainer.style.transform = '';

            // Update StPageFlip to match the new screen size
            setTimeout(() => {
                pageFlip.update();

                // Check if we need to add/remove the specific event handlers based on current width
                if (window.innerWidth < 1003) {
                    // Reattach specific handlers for small screens if not already attached
                    const flippingListeners = pageFlip._events.flipping || [];
                    if (flippingListeners.length === 0) {
                        pageFlip.on('flipping', (e) => {
                            bookContainer.style.transition = 'none';
                            bookContainer.style.transform = 'translateY(0)';
                        });
                    }
                }

                // Force redraw on smaller screens to ensure proper centering
                if (window.innerWidth < 1080) {
                    pageFlip.turnToCurrent(); // Stay on current page but redraw
                }

                // Restore transition after update
                setTimeout(() => {
                    bookContainer.style.transition = 'transform 0.3s ease-out';
                }, 100);
            }, 100); // Small delay to ensure DOM updates
        }
    });

    // Handle orientation changes specifically
    window.addEventListener('orientationchange', function () {
        if (pageFlip) {
            // Wait for orientation change to complete
            setTimeout(() => {
                pageFlip.update();
            }, 200);
        }
    });
});