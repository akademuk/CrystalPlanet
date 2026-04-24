// ─── Burger Menu ──────────────────────────────────────────────────────────────

(function () {
	const burger = document.querySelector('.burger');
	const mobileNav = document.querySelector('.mobile-nav');
	if (!burger || !mobileNav) return;

	function openMenu() {
		burger.classList.add('is-open');
		mobileNav.classList.add('is-open');
		burger.setAttribute('aria-expanded', 'true');
		mobileNav.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		if (lenis) lenis.stop();
	}

	function closeMenu() {
		burger.classList.remove('is-open');
		mobileNav.classList.remove('is-open');
		burger.setAttribute('aria-expanded', 'false');
		mobileNav.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		if (lenis) lenis.start();
	}

	burger.addEventListener('click', () => {
		burger.classList.contains('is-open') ? closeMenu() : openMenu();
	});

	// Close on nav link click
	mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta, .mobile-nav__close').forEach((link) => {
		link.addEventListener('click', closeMenu);
	});

	// Close on Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeMenu();
	});
})();

// ─── Commitment Horizontal Scroll ──────────────────────────────────────────────

(function () {
	const wrapper = document.querySelector('.commitment__sticky-wrapper');
	const track = document.querySelector('.commitment__track');
	const body = document.querySelector('.commitment__body');

	if (!wrapper || !track || !body) return;

	let totalScroll = 0;
	let wrapperTop = 0;

	function setup() {
		// getBoundingClientRect + scrollY = true document-absolute top (offsetTop breaks with positioned parents)
		wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
		totalScroll = body.scrollWidth - track.clientWidth;
		wrapper.style.height = (window.innerHeight + totalScroll) + 'px';
	}

	function onScroll(scrollY) {
		const scrolled = scrollY - wrapperTop;
		const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
		body.style.transform = `translateX(${-progress * totalScroll}px)`;
	}

	// Native scroll fallback
	window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
	window.addEventListener('resize', () => { setup(); onScroll(window.scrollY); });

	function init() {
		setup();
		onScroll(window.scrollY);

		// Hook into Lenis if available (initialized after this block)
		requestAnimationFrame(function hookLenis() {
			if (typeof lenis !== 'undefined' && lenis) {
				lenis.on('scroll', ({ scroll }) => onScroll(scroll));
			} else {
				requestAnimationFrame(hookLenis);
			}
		});
	}

	if (document.readyState === 'complete') {
		setTimeout(init, 150);
	} else {
		window.addEventListener('load', () => setTimeout(init, 150));
	}
})();
// ─── Team AOS (> 1280px only) ────────────────────────────────────────────────

(function () {
	function applyTeamAOS() {
		const images = document.querySelectorAll('.team__member-image');
		const infos = document.querySelectorAll('.team__member-info');

		if (window.innerWidth >= 1280) {
			images.forEach((el, i) => {
				el.setAttribute('data-aos', 'fade-up');
				el.setAttribute('data-aos-delay', String((i % 4) * 80));
				el.setAttribute('data-aos-duration', '500');
			});
			infos.forEach((el, i) => {
				el.setAttribute('data-aos', 'fade-up');
				el.setAttribute('data-aos-delay', String((i % 4) * 80 + 60));
				el.setAttribute('data-aos-duration', '500');
			});
		} else {
			[...images, ...infos].forEach((el) => {
				el.removeAttribute('data-aos');
				el.removeAttribute('data-aos-delay');
				el.removeAttribute('data-aos-duration');
			});
		}

		AOS.refreshHard();
	}

	document.addEventListener('DOMContentLoaded', applyTeamAOS);
	window.addEventListener('resize', applyTeamAOS);
})();

// ─── AOS Init ─────────────────────────────────────────────────────────────────

AOS.init({
	once: true,
	duration: 700,
	easing: 'ease-out-cubic',
	offset: 80,
});

// ─── Hero Parallax ───────────────────────────────────────────────────────────

(function () {
	const heroBg = document.querySelector('.hero__bg');
	if (!heroBg) return;

	function applyParallax() {
		const scrollY = window.scrollY;
		heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
	}

	window.addEventListener('scroll', applyParallax, { passive: true });
})();

// ─── Economics Counter Animation ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	const econCounters = document.querySelectorAll('.econ-counter');
	if (!econCounters.length) return;

	const duration = 2000;
	const easeOut = (t) => 1 - Math.pow(1 - t, 3);

	function animateEcon(el) {
		const target = parseFloat(el.dataset.target);
		const prefix = el.dataset.prefix || '';
		const suffix = el.dataset.suffix || '';
		const decimals = parseInt(el.dataset.decimals ?? 0);
		const valEl = el.querySelector('.econ-val');
		if (!valEl) return;

		const start = performance.now();

		function update(now) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const value = easeOut(progress) * target;
			valEl.textContent = prefix + value.toFixed(decimals) + suffix;
			if (progress < 1) requestAnimationFrame(update);
			else valEl.textContent = prefix + target.toFixed(decimals) + suffix;
		}

		requestAnimationFrame(update);
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateEcon(entry.target);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 }
	);

	econCounters.forEach((el) => observer.observe(el));
});

// ─── Counter Animation ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	const counters = document.querySelectorAll('.counter__value[data-target]');
	if (!counters.length) return;

	const duration = 2000;
	const easeOut = (t) => 1 - Math.pow(1 - t, 3);

	function animateCounter(el) {
		const target = parseFloat(el.dataset.target);
		const prefix = el.dataset.prefix || '';
		const suffix = el.dataset.suffix || '';
		const start = performance.now();

		function update(now) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const value = Math.round(easeOut(progress) * target);
			el.textContent = prefix + value + suffix;
			if (progress < 1) requestAnimationFrame(update);
		}

		requestAnimationFrame(update);
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 }
	);

	counters.forEach((el) => observer.observe(el));
});

// ─── Typewriter Effect ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	const el = document.querySelector('.typewriter');
	if (!el) return;

	const text = el.dataset.text || '';
	const typingSpeed = 120;
	const startDelay = 400;
	let index = 0;

	function type() {
		if (index <= text.length) {
			el.textContent = text.slice(0, index);
			index++;
			setTimeout(type, typingSpeed);
		}
	}

	setTimeout(type, startDelay);
});

// ─── Smooth Anchor Scroll ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if (!href || href === '#') return;

			const target = document.querySelector(href);
			if (!target) return;

			e.preventDefault();

			if (lenis) {
				lenis.scrollTo(target, { offset: 0, duration: 1.4 });
			} else {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});
});

// ─── Team Slider (< 1280px) ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	let teamSwiper = null;

	function initTeamSlider() {
		if (window.innerWidth < 1280) {
			if (!teamSwiper) {
				teamSwiper = new Swiper('.team__slider', {
					slidesPerView: 'auto',
					spaceBetween: 16,
					navigation: {
						nextEl: '.team__nav-btn--next',
						prevEl: '.team__nav-btn--prev',
					},
				});
			}
		} else {
			if (teamSwiper) {
				teamSwiper.destroy(true, true);
				teamSwiper = null;
			}
		}
	}

	initTeamSlider();

	window.addEventListener('resize', initTeamSlider);
});
// ─── Case Study Slider ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	const thumbsSwiper = new Swiper('.case-study__thumbs', {
		slidesPerView: 'auto',
		spaceBetween: 10,
		watchSlidesProgress: true,
	});

	new Swiper('.case-study__slider', {
		loop: true,
		spaceBetween: 0,
		navigation: {
			nextEl: '.case-study__slider-next',
			prevEl: '.case-study__slider-prev',
		},
		thumbs: {
			swiper: thumbsSwiper,
		},
	});
});

// ─── Why Invest — scroll highlight ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	const items = document.querySelectorAll('.why-invest__item');
	if (!items.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-active');
				} else {
					entry.target.classList.remove('is-active');
				}
			});
		},
		{
			threshold: 0.3,
			rootMargin: '0px 0px -20% 0px',
		}
	);

	items.forEach((item) => observer.observe(item));
});

// ─── Lenis Smooth Scroll ────────────────────────────────────────────────────

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let lenis;

if (!isSafari) {
	lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		smoothWheel: true,
		syncTouch: false,
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

	// Prevent conflicts: pause Lenis when native scroll elements are focused
	document.querySelectorAll("select, textarea, input[type='range']").forEach((el) => {
		el.addEventListener("mouseenter", () => lenis.stop());
		el.addEventListener("mouseleave", () => lenis.start());
	});
}
