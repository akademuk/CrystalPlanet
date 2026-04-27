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

// ─── Commitment Horizontal Scroll (GSAP ScrollTrigger) ────────────────────

window.addEventListener('load', () => {
	const section = document.querySelector('.commitment');
	const track = document.querySelector('.commitment__track');
	const body = document.querySelector('.commitment__body');

	if (!section || !track || !body || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

	gsap.registerPlugin(ScrollTrigger);

	// iOS Safari fix — normalize touch scroll behavior
	ScrollTrigger.normalizeScroll(true);
	ScrollTrigger.config({ ignoreMobileResize: true });

	const isTouch = ScrollTrigger.isTouch === 1;

	// Lenis ↔ ScrollTrigger sync (only when Lenis is active — desktop/non-Safari)
	if (typeof lenis !== 'undefined' && lenis) {
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);
	}

	const getScrollAmount = () => Math.max(0, body.scrollWidth - track.clientWidth);

	gsap.to(body, {
		x: () => -getScrollAmount(),
		ease: 'none',
		scrollTrigger: {
			trigger: section,
			start: 'top top',
			end: () => '+=' + getScrollAmount(),
			pin: true,
			pinType: isTouch ? 'fixed' : 'transform',
			scrub: 1,
			invalidateOnRefresh: true,
			anticipatePin: 1,
		},
	});

	// Refresh after AOS / images load
	setTimeout(() => ScrollTrigger.refresh(), 200);
	window.addEventListener('orientationchange', () => setTimeout(() => ScrollTrigger.refresh(), 300));
});

// ─── Team AOS (desktop only) ─────────────────────────────────────────────

(function () {
	function applyTeamAOS() {
		const members = document.querySelectorAll('.team__member');
		if (window.innerWidth >= 1280) {
			members.forEach((el) => {
				el.setAttribute('data-aos', 'fade-up');
				el.setAttribute('data-aos-duration', '500');
				el.setAttribute('data-aos-anchor-placement', 'top-center');
			});
		} else {
			members.forEach((el) => {
				el.removeAttribute('data-aos');
				el.removeAttribute('data-aos-duration');
				el.removeAttribute('data-aos-anchor-placement');
			});
		}
		if (typeof AOS !== 'undefined') AOS.refreshHard();
	}

	document.addEventListener('DOMContentLoaded', applyTeamAOS);
	window.addEventListener('load', applyTeamAOS);
	window.addEventListener('resize', applyTeamAOS);
})();

// ─── AOS Init ─────────────────────────────────────────────────────────────────

AOS.init({
	once: true,
	duration: 600,
	easing: 'ease-out-cubic',
	offset: 0,
	anchorPlacement: 'top-bottom',
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
// ─── Case Study Thumbs Slider ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	if (!document.querySelector('.case-study__thumbs')) return;
	new Swiper('.case-study__thumbs', {
		slidesPerView: 'auto',
		spaceBetween: 10,
		freeMode: true,
		grabCursor: true,
		navigation: {
			nextEl: '.case-study__slider-next',
			prevEl: '.case-study__slider-prev',
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

// ─── Contact Form — disable button on submit ────────────────────────────────

(function () {
	const form = document.getElementById('contacts-form');
	if (!form) return;

	form.addEventListener('submit', () => {
		const btn = form.querySelector('.contacts__form-btn');
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'Sending...';
		}
	});
})();
