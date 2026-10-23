// JS FOR HEADER COMPLETE STARTS

const toggleButton = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".nav__list");
const overlay = document.querySelector(".nav-overlay");
const header = document.querySelector(".header-wrapper");

let lastScrollY = window.scrollY;
let scrollPosition = 0;

toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = primaryNav.getAttribute("aria-expanded") === "true";
    primaryNav.setAttribute("aria-expanded", String(!isExpanded));
    toggleButton.classList.toggle("active", !isExpanded);
});

overlay.addEventListener("click", () => {
    primaryNav.setAttribute("aria-expanded", "false");
    toggleButton.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (
        primaryNav.getAttribute("aria-expanded") === "true" &&
        !primaryNav.contains(e.target) &&
        !toggleButton.contains(e.target)
    ) {
        primaryNav.setAttribute("aria-expanded", "false");
        toggleButton.classList.remove("active");
    }
});

window.addEventListener(
    "scroll",
    () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add("header--hidden");
        } else if (currentScrollY < lastScrollY) {
            header.classList.remove("header--hidden");
        }
        lastScrollY = currentScrollY;
    },
    { passive: true }
);

const observer = new MutationObserver(() => {
    const isOpen = primaryNav.getAttribute("aria-expanded") === "true";
    overlay.classList.toggle("active", isOpen);

    if (isOpen) {
        scrollPosition = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = "100%";
    } else {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
        });
    }
});

observer.observe(primaryNav, {
    attributes: true,
    attributeFilter: ["aria-expanded"]
});



// JS FOR HEADER COMPLETE ENDS


// JS FOR STACKING CARDS STARTS

const { ScrollObserver, valueAtPercentage } = aat;

const cardsContainer = document.querySelector('.cards');
const cards = document.querySelectorAll('.card');

cardsContainer.style.setProperty('--cards-count', cards.length);
cardsContainer.style.setProperty(
    '--card-height',
    `${cards[0].clientHeight}px`
);

Array.from(cards).forEach((card, index) => {
    const offsetTop = 20 + index * 20;
    card.style.paddingTop = `${offsetTop}px`;

    if (index === cards.length - 1) {
        return;
    }

    const toScale = 1 - (cards.length - 1 - index) * 0.1;
    const nextCard = cards[index + 1];
    const cardInner = card.querySelector('.card__inner');

    ScrollObserver.Element(nextCard, {
        offsetTop,
        offsetBottom: window.innerHeight - card.clientHeight
    }).onScroll(({ percentageY }) => {
        cardInner.style.scale = valueAtPercentage({
            from: 1,
            to: toScale,
            percentage: percentageY
        });

        // cardInner.style.filter = `brightness(${valueAtPercentage({
        //     from: 1,
        //     to: 0.6,
        //     percentage: percentageY
        // })})`;
    });
});

cards.forEach((card, index) => {
    if (index < cards.length - 1) {
        const cardInner = card.querySelector('.card__inner');
        const toScale = 1 - (cards.length - 1 - index) * 0.1;
        cardInner.style.scale = "1";
        // cardInner.style.filter = "brightness(1)";
    }
});


// JS FOR STACKING CARDS END

// JS FOR CLIENTS REVIEWS

const track = document.querySelector('.slider-track')
const slides = document.querySelectorAll('.slide')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

let index = 0

const slideWidth = slides[0].offsetWidth

next.onclick = () => {
    index = (index + 1) % slides.length
    track.style.transform = `translateX(-${index * slideWidth}px)`
}

prev.onclick = () => {
    index = (index - 1 + slides.length) % slides.length
    track.style.transform = `translateX(-${index * slideWidth}px)`
}



// JS FOR CLIENT REVIEWS ENDS


// on scroll cards moving section starts

const scrollingSection = document.querySelector('.scrolling-section')
const scrollingTrack = document.querySelector('.scrolling-track')

function handleScroll() {
    if (window.innerWidth < 768) {
        scrollingTrack.style.transform = 'translateX(0)'
        return
    }

    const sectionTop = scrollingSection.offsetTop
    const scrollY = window.scrollY

    const trackWidth = scrollingTrack.scrollWidth
    const viewportWidth = window.innerWidth
    const maxTranslate = Math.max(trackWidth - viewportWidth, 0)

    const scrollStart = sectionTop
    const scrollEnd = sectionTop + maxTranslate

    let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart)
    progress = Math.min(Math.max(progress, 0), 1)

    scrollingTrack.style.transform =
        `translateX(${-progress * maxTranslate}px)`
}

window.addEventListener('scroll', handleScroll)
window.addEventListener('resize', handleScroll)


// on scroll cards moving section ends


// JS FOR SMOOTH SCROLLING EFFECT STARTS

gsap.registerPlugin(ScrollToPlugin);

let currentScroll = window.scrollY;
let targetScroll = currentScroll;
let isTicking = false;
const ease = 0.05;

function updateScroll() {
    currentScroll += (targetScroll - currentScroll) * ease;

    window.scrollTo(0, currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(updateScroll);
        isTicking = true;
    } else {
        isTicking = false;
    }
}

window.addEventListener("wheel", (e) => {
    e.preventDefault();
    targetScroll += e.deltaY;
    targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));

    if (!isTicking) updateScroll();
}, { passive: false });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href").substring(1);
        const targetElem = document.getElementById(targetId);
        if (!targetElem) return;

        targetScroll = targetElem.getBoundingClientRect().top + window.scrollY;

        if (!isTicking) updateScroll();
    });
});

window.addEventListener("resize", () => {
    currentScroll = window.scrollY;
    targetScroll = currentScroll;
});


// JS FOR SMOOTH SCROLLING EFFECT ENDS


// GSAP ANIMATIONS STARTS

// gsap for paragraph animations

gsap.registerPlugin(ScrollTrigger, SplitText);

window.addEventListener("load", () => {
    document.querySelectorAll(".scrolling-paragraph").forEach((el) => {
        const split = new SplitText(el, { type: "words" });

        gsap.set(split.words, { opacity: 0 });

        gsap.to(split.words, {
            opacity: 1,
            duration: 0.1,
            stagger: 0.1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reset"
            }
        });
    });
});


// gsap for fade up animation

gsap.to(".fade-up", {
    opacity: 1,
    y: 0,
    stagger: 0.5,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".fade-up",
        start: "top 100%",
        toggleActions: "play none none reverse"
    }
});


//gsap animation for fade right-left

const fadeRows = document.querySelectorAll("#main-header li.list-item");
let animated = false;

toggleButton.addEventListener("click", () => {
    const isOpen = primaryNav.getAttribute("aria-expanded") === "true";

    if (isOpen && window.innerWidth <= 768 && !animated) {
        fadeRows.forEach(row => {
            gsap.fromTo(row,
                { opacity: 0 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.5,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        animated = true;
        ScrollTrigger.refresh();
    }
});



gsap.utils.toArray(".fade-right").forEach((el) => {
  gsap.fromTo(el, 
    { opacity: 0}, 
    {
      opacity: 1,
      x: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%", 
        toggleActions: "play none none reverse"
      }
    }
  );
});


// parallex animation

document.querySelectorAll(".on-page-buttons").forEach(container => {
    const items = container.querySelectorAll(".button-1");

    items.forEach(item => {
        const style = getComputedStyle(item);
        const matrix = new DOMMatrixReadOnly(style.transform);
        item.dataset.baseX = matrix.m41;
        item.dataset.baseY = matrix.m42;
    });

    container.addEventListener("mousemove", e => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        items.forEach((item, index) => {
            const strength = (index + 1) * 30;

            const moveX = (x / rect.width) * strength;
            const moveY = (y / rect.height) * strength;

            const baseX = parseFloat(item.dataset.baseX);
            const baseY = parseFloat(item.dataset.baseY);

            item.style.transform = `translate(${baseX + moveX}px, ${baseY + moveY}px)`;
        });
    });

    container.addEventListener("mouseleave", () => {
        items.forEach(item => {
            item.style.transform = `translate(${item.dataset.baseX}px, ${item.dataset.baseY}px)`;
        });
    });
});


// js parallax for hero banner

const parallaxItems = document.querySelectorAll(".parallax");

parallaxItems.forEach(item => {
    const speed = parseFloat(item.dataset.speed) || 0.01;

    const rect = item.getBoundingClientRect();
    item.dataset.origX = rect.left + window.scrollX;
    item.dataset.origY = rect.top + window.scrollY;

    item.style.transition = "transform 0.1s ease-out";
});

document.addEventListener("mousemove", e => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    parallaxItems.forEach((item, index) => {
        const speed = parseFloat(item.dataset.speed) || 0.01;
        const moveX = (mouseX - centerX) * speed * (index + 1);
        const moveY = (mouseY - centerY) * speed * (index + 1);

        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

document.addEventListener("mouseleave", () => {
    parallaxItems.forEach(item => {
        item.style.transform = `translate(0, 0)`;
    });
});
