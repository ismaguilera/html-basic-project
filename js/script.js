 // --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --- Close mobile menu when a nav link is clicked ---
// Combined with smooth scroll logic below

// --- Intersection Observer for section animations and active nav link ---
const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-link'); // Get all nav links (desktop, mobile, and others like the hero arrow)

const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '0px', // No margin
    threshold: 0.4 // Trigger when 40% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        const targetId = entry.target.id;

        if (entry.isIntersecting) {
            // Add visibility class for animation
            entry.target.classList.add('visible');

            // Update active nav link for the corresponding section
            allNavLinks.forEach(link => {
                // Check if the link's href ends with the intersecting section's ID
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('nav-active');
                } else {
                    link.classList.remove('nav-active'); // Remove from others
                }
            });
        } else {
                // Optional: Remove visibility class if you want animation on scroll up too
                // entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// --- Smooth Scroll using JavaScript for all nav links ---
allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Check if it's an internal anchor link
        if (href && href.startsWith('#')) {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = href.substring(1); // Get the target ID (remove #)
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('nav')?.offsetHeight || 64; // Get navbar height or default
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                // Use scrollIntoView for smooth scroll (alternative to window.scrollTo)
                // targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Or use window.scrollTo for potentially better cross-browser offset handling
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });


                // Close mobile menu if open after clicking a link
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        }
        // If it's not an internal anchor link (e.g., external link), let the default behavior happen
    });
});


// --- Initial state setup on load ---
window.addEventListener('load', () => {
    // Ensure sections initially visible in the viewport get animated
        sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Check if section is within the viewport bounds
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
                section.classList.add('visible'); // Trigger animation
        }
        });

    // Highlight the correct nav link based on initial scroll position
    let initialActiveFound = false;
    // Iterate sections from bottom to top to find the last one visible enough
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
            // Check if the top of the section is within the top 60% of the viewport
        if (rect.top <= window.innerHeight * 0.6) {
                allNavLinks.forEach(link => {
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('nav-active');
                    initialActiveFound = true;
                } else {
                    link.classList.remove('nav-active');
                }
                });
                break; // Stop after finding the first matching section from the bottom up
        }
    }
        // Fallback: If scrolled to the very top or no section met the criteria above, activate the first link
    if (!initialActiveFound) {
            const firstNavLink = document.querySelector('.nav-link[href="#bienvenida"]'); // Target the 'bienvenida' link
            if (firstNavLink) {
            allNavLinks.forEach(link => link.classList.remove('nav-active')); // Clear others
            firstNavLink.classList.add('nav-active');
            }
    }
});