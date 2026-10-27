/* -----------------------------------------------------
   ۱) تایپ شدن متن کوچک بالای تیتر (eyebrow)
   ----------------------------------------------------- */
function startTyping() {
  const eyebrow = document.querySelector('.eyebrow');
  if (!eyebrow) return;   


  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fullText = eyebrow.textContent;  
  eyebrow.textContent = '';              
  eyebrow.classList.add('typing');        

  let letterNumber = 0;

  function typeNextLetter() {
    if (letterNumber < fullText.length) {
      eyebrow.textContent = eyebrow.textContent + fullText[letterNumber];
      letterNumber = letterNumber + 1;
      setTimeout(typeNextLetter, 90);
    } else {

      setTimeout(function () {
        eyebrow.classList.remove('typing');
      }, 1500);
    }
  }

  typeNextLetter();
}


/* -----------------------------------------------------
   ۲) نوار پیشرفت اسکرول بالای صفحه
   ----------------------------------------------------- */
function startScrollBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    const percent = (window.scrollY / total) * 100;
    bar.style.width = percent + '%';
  });
}


/* -----------------------------------------------------
   ۳) منوی موبایل (دکمه همبرگری)
   ----------------------------------------------------- */
function startMobileMenu() {
  const nav = document.querySelector('.site-header nav');
  const actions = document.querySelector('.site-header .header-actions');
  if (!nav || !actions) return;


  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'menu-toggle';
  button.setAttribute('aria-label', 'منو');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';
  actions.appendChild(button);

  function closeMenu() {
    nav.classList.remove('open');
    button.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }


  button.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    button.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  });


  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
}

function markCurrentPage() {
  document.querySelectorAll('.site-header nav a').forEach(function (link) {

    if (link.pathname === window.location.pathname) {
      link.classList.add('active');
    }
  });
}

function stopEmptyLinks() {
  document.querySelectorAll('a[href=""]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });
}

function revealOnScroll(selector) {
  const items = document.querySelectorAll(selector);

  
  if (!('IntersectionObserver' in window)) return;


  const watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        watcher.unobserve(entry.target);  
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (item, index) {
    item.classList.add('reveal');
    item.style.setProperty('--delay', (index % 6) * 0.1 + 's');
    watcher.observe(item);
  });
}

function startSearchHints() {
  document.querySelectorAll('.search-box input').forEach(function (input) {
    if (!input.dataset.hints) return;

    const hints = input.dataset.hints.split('|');
    let hintNumber = 0;

    setInterval(function () {
      input.placeholder = 'جستجوی ' + hints[hintNumber] + '...';
      hintNumber = (hintNumber + 1) % hints.length;
    }, 2500);
  });
}

function keepOneSupportIcon() {
  document.querySelectorAll('.fixed-icon-final').forEach(function (icon, index) {
    if (index > 0) icon.remove();
  });
}
function tiltCards(selector, liftPx) {
  const lift = liftPx ? ' translateY(-' + liftPx + 'px)' : '';

  document.querySelectorAll(selector).forEach(function (card) {
    card.addEventListener('mousemove', function (event) {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform =
        'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg) scale(1.03)' + lift;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';   
    });
  });
}


/* ---------- اجرای کارها ---------- */
// startTyping(); 
startScrollBar();
startMobileMenu();
markCurrentPage();
stopEmptyLinks();
startSearchHints();
keepOneSupportIcon();

/* ---------- نرخ تبدیل دلار به ریال ---------- */
const USD_TO_RIAL = 1500000;

function formatRial(usd) {
  if (usd === 0) {
    return 'رایگان';
  }
  const rial = Math.round((usd * USD_TO_RIAL) / 10000) * 10000;
  return rial.toLocaleString('fa-IR') + ' ریال';
}

document.querySelectorAll('[data-usd]').forEach(function (price) {
  price.textContent = formatRial(Number(price.dataset.usd));
});



document.querySelectorAll('header nav a').forEach(function (link) {
  if (link.getAttribute('href').endsWith('games/games.html')) {
    link.classList.add('active');
  }
});


/* ---------- گالری عکس و ویدیو ---------- */
const radios = Array.from(document.querySelectorAll('.gallery-radio'));
const mainFrame = document.querySelector('.main-frame');

function currentSlide() {
  return radios.findIndex(function (radio) { return radio.checked; });
}

function goToSlide(index) {
  const next = (index + radios.length) % radios.length;
  radios[next].checked = true;
  stopVideos();
}

function stopVideos() {
  document.querySelectorAll('.main-video').forEach(function (video) { video.pause(); });
}

if (radios.length > 0 && mainFrame) {
  const prevButton = document.createElement('button');
  prevButton.className = 'gallery-arrow arrow-right';
  prevButton.setAttribute('aria-label', 'تصویر قبلی');
  prevButton.textContent = '›';

  const nextButton = document.createElement('button');
  nextButton.className = 'gallery-arrow arrow-left';
  nextButton.setAttribute('aria-label', 'تصویر بعدی');
  nextButton.textContent = '‹';

  mainFrame.appendChild(prevButton);
  mainFrame.appendChild(nextButton);

  prevButton.addEventListener('click', function () { goToSlide(currentSlide() - 1); });
  nextButton.addEventListener('click', function () { goToSlide(currentSlide() + 1); });

  radios.forEach(function (radio) { radio.addEventListener('change', stopVideos); });

  document.addEventListener('keydown', function (event) {
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (typing) { return; }
    if (event.key === 'ArrowLeft') { goToSlide(currentSlide() + 1); }
    if (event.key === 'ArrowRight') { goToSlide(currentSlide() - 1); }
  });
}


/* ---------- سبد خرید: عدد کوچک روی آیکون سبد بالای صفحه ---------- */
const cartIcon = document.querySelectorAll('.header-actions .icon-btn')[0];  
const cartBadge = document.createElement('span');
cartBadge.className = 'cart-badge';
cartIcon.appendChild(cartBadge);

let cartCount = 0;

const addToCartButton = document.querySelector('.add-to-cart-btn');
if (addToCartButton) {
  addToCartButton.addEventListener('click', function () {
    cartCount = cartCount + 1;
    cartBadge.textContent = cartCount.toLocaleString('fa-IR');
    cartBadge.style.display = 'flex';

    cartBadge.classList.remove('pop');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('pop');

    const oldText = addToCartButton.textContent;
    addToCartButton.textContent = '✔ به سبد اضافه شد';
    setTimeout(function () { addToCartButton.textContent = oldText; }, 1000);
  });
}


/* ---------- قلب علاقه‌مندی‌ها ---------- */
const wishlistButton = document.querySelector('.wishlist-btn');
if (wishlistButton) {
  wishlistButton.addEventListener('click', function () {
    wishlistButton.classList.toggle('active');
    wishlistButton.textContent = wishlistButton.classList.contains('active') ? '♥' : '♡';
  });
}


/* ---------- ثبت‌نام داخل مودال ---------- */
(function () {
  const formSide = document.querySelector('.modal-form-side');
  const signupBox = document.getElementById('signupBox');
  if (!formSide || !signupBox) { return; }  
  if (signupBox.dataset.ready) { return; }  
  signupBox.dataset.ready = '1';

  const signupForm = document.getElementById('signupForm');
  const errorBox = document.getElementById('signupError');
  const successBox = document.getElementById('signupSuccess');

  function showMessage(box, text) {
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    if (box) {
      box.textContent = text;
      box.style.display = 'block';
    }
  }

  function showSignup() {
    Array.from(formSide.children).forEach(function (element) {
      if (element !== signupBox) { element.style.display = 'none'; }
    });
    signupBox.style.display = 'block';
  }

  function showLogin() {
    Array.from(formSide.children).forEach(function (element) {
      if (element !== signupBox) { element.style.display = ''; }
    });
    signupBox.style.display = 'none';
    showMessage(null);
  }

  document.getElementById('showSignup').addEventListener('click', function (event) {
    event.preventDefault();
    showSignup();
  });
  document.getElementById('showLogin').addEventListener('click', function (event) {
    event.preventDefault();
    showLogin();
  });

  document.querySelectorAll('.js-open-login').forEach(function (button) {
    button.addEventListener('click', showLogin);
  });
  const closeButton = document.getElementById('loginClose');
  if (closeButton) { closeButton.addEventListener('click', showLogin); }

  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (successBox.style.display === 'block') { return; }

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 3) {
      showMessage(errorBox, 'نام و نام خانوادگی را کامل وارد کن.');
    } else if (!emailPattern.test(email)) {
      showMessage(errorBox, 'آدرس ایمیل معتبر نیست.');
    } else if (password.length < 6) {
      showMessage(errorBox, 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
    } else if (password !== confirm) {
      showMessage(errorBox, 'رمز عبور و تکرار آن یکسان نیست.');
    } else {
      showMessage(successBox, 'ثبت‌نام انجام شد! حالا وارد شو.');
      signupForm.reset();
      setTimeout(showLogin, 1500);  
    }
  });
})();


/* ---------- افکت‌های مشترک (توابع بخش اول همین فایل) ---------- */
revealOnScroll('.game-info, .about-section h2, .feature-tag, .related-card');
tiltCards('.related-card', 6);   // کارت در hover ۶ پیکسل بالا می‌آید


/* ---------- پیام‌های قرمز و سبز فرم ورود به فارسی ---------- */
(function () {
  const errorBox = document.getElementById('loginError');
  const successBox = document.getElementById('loginSuccess');


  function toPersian(text, isSuccess) {
    const t = text.toLowerCase();

    if (isSuccess) { return 'با موفقیت وارد شدی!'; }

    const hasEmail = t.includes('email');
    const hasPassword = t.includes('password');

   
    if ((hasEmail && hasPassword && (t.includes('invalid') || t.includes('incorrect') || t.includes('wrong') || t.includes('match')))
        || t.includes('credential') || t.includes('incorrect') || t.includes('wrong')) {
      return 'ایمیل یا رمز عبور اشتباه است.';
    }

    if (hasEmail && (t.includes('valid') || t.includes('format'))) {
      return 'آدرس ایمیل معتبر نیست.';
    }
 
    if (t.includes('fill') || t.includes('required') || t.includes('empty') || t.includes('enter')) {
      return 'لطفاً ایمیل و رمز عبور را وارد کن.';
    }
    if (hasEmail) { return 'آدرس ایمیل معتبر نیست.'; }
    if (hasPassword) { return 'رمز عبور باید حداقل ۶ کاراکتر باشد.'; }
    if (t.includes('network') || t.includes('server') || t.includes('connect')) {
      return 'ارتباط با سرور برقرار نشد. دوباره تلاش کن.';
    }
    return 'خطایی رخ داد. دوباره تلاش کن.';
  }


  function watch(box, isSuccess) {
    if (!box) { return; }
    new MutationObserver(function () {
      const text = box.textContent.trim();
      if (text !== '' && /[A-Za-z]/.test(text)) {
        box.textContent = toPersian(text, isSuccess);
      }
    }).observe(box, { childList: true, characterData: true, subtree: true });
  }

  watch(errorBox, false);
  watch(successBox, true);
})();

