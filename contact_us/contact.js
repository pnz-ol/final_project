/* =====================================================
   contact.js (بخش اول)
   کارهای هدر، منوی موبایل و افکت‌ها (کد مستقل صفحه نرم‌افزار)
   هر کار داخل یک تابع جداست، پایین فایل صدایشان می‌زنیم.
   (داخل تابع نوشتیم تا اسم متغیرها با فایل‌های دیگر قاطی نشود)
   ===================================================== */


/* -----------------------------------------------------
   ۱) تایپ شدن متن کوچک بالای تیتر (eyebrow)
   ----------------------------------------------------- */
function startTyping() {
  const eyebrow = document.querySelector('.eyebrow');
  if (!eyebrow) return;   // اگر صفحه eyebrow نداشت، کاری نکن

  // کسی که انیمیشن را در سیستمش خاموش کرده، متن را یک‌جا می‌بیند
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fullText = eyebrow.textContent;   // متن کامل
  eyebrow.textContent = '';               // خالی می‌کنیم تا از اول تایپ شود
  eyebrow.classList.add('typing');        // مکان‌نمای چشمک‌زن

  let letterNumber = 0;

  function typeNextLetter() {
    if (letterNumber < fullText.length) {
      eyebrow.textContent = eyebrow.textContent + fullText[letterNumber];
      letterNumber = letterNumber + 1;
      setTimeout(typeNextLetter, 90);
    } else {
      // تایپ تمام شد؛ بعد از کمی صبر، مکان‌نما را برمی‌داریم
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
    if (total <= 0) return;   // صفحه کوتاه است و اسکرول ندارد

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

  // دکمه را می‌سازیم و کنار آیکن‌ها می‌گذاریم
  // (توی دسکتاپ با CSS مخفی است)
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

  // کلیک روی دکمه: اگر بسته بود باز کن، اگر باز بود ببند
  button.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    button.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  });

  // با کلیک روی هر لینک منو بسته شود
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // با کلید Escape بسته شود
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  // اگر صفحه بزرگ شد (مثلاً گوشی چرخید)، منو را ببند
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
}


/* -----------------------------------------------------
   ۴) لینک صفحه فعلی در نویگیشن مشخص شود
   ----------------------------------------------------- */
function markCurrentPage() {
  document.querySelectorAll('.site-header nav a').forEach(function (link) {
    // link.pathname آدرس کامل لینک است، window.location.pathname آدرس صفحه فعلی
    if (link.pathname === window.location.pathname) {
      link.classList.add('active');
    }
  });
}


/* -----------------------------------------------------
   ۵) لینک‌های خالی (href="") صفحه را رفرش نکنند
   خود آدرس‌ها دست نخورده‌اند؛ فقط جلوی رفرش شدن گرفته می‌شود.
   ----------------------------------------------------- */
function stopEmptyLinks() {
  document.querySelectorAll('a[href=""]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });
}


/* -----------------------------------------------------
   ۶) تابع کمکی: ظاهر شدن آرام عناصر موقع اسکرول
   در انتهای همین فایل صدا زده می‌شود، مثلاً:
   revealOnScroll('.game-card, .section-head');
   ----------------------------------------------------- */
function revealOnScroll(selector) {
  const items = document.querySelectorAll(selector);

  // مرورگرهای خیلی قدیمی: بی‌خیال افکت، همه چیز دیده شود
  if (!('IntersectionObserver' in window)) return;

  // مرورگر به ما می‌گوید کدام عنصر وارد صفحه شد
  const watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        watcher.unobserve(entry.target);   // دیگر لازم نیست نگاهش کنیم
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (item, index) {
    item.classList.add('reveal');
    // هر عنصر کمی دیرتر از قبلی ظاهر می‌شود
    item.style.setProperty('--delay', (index % 6) * 0.1 + 's');
    watcher.observe(item);
  });
}


/* -----------------------------------------------------
   ۷) متن کادر جستجو هر چند ثانیه عوض می‌شود
   اسم‌ها از ویژگی data-hints خود input خوانده می‌شود (با | جدا شده)
   ----------------------------------------------------- */
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


/* -----------------------------------------------------
   ۸) آیکون پشتیبانی فقط یک بار در صفحه باشد
   ----------------------------------------------------- */
function keepOneSupportIcon() {
  document.querySelectorAll('.fixed-icon-final').forEach(function (icon, index) {
    if (index > 0) icon.remove();
  });
}


/* -----------------------------------------------------
   ۹) تابع کمکی: کارت‌ها با ماوس کمی کج می‌شوند
   هر صفحه صدایش می‌زند، مثلاً: tiltCards('.game-card');
   اگر کارت در حالت hover بالا می‌آید، عدد liftPx را بده.
   ----------------------------------------------------- */
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
      card.style.transform = '';   // برمی‌گردد به افکت hover خود CSS
    });
  });
}


/* ---------- اجرای کارها ---------- */
// startTyping();   // در این صفحه خاموش است: برچسب هیرو یک خط تزئینی دارد که تایپ آن را پاک می‌کرد
startScrollBar();
startMobileMenu();
markCurrentPage();
stopEmptyLinks();
startSearchHints();
keepOneSupportIcon();


/* =====================================================
   بخش مخصوص صفحه تماس با ما: فرم پیام، شمارنده حروف، کپی ایمیل و تلفن
   قدم‌به‌قدم بخوان؛ هر بخش یک کار ساده انجام می‌دهد.
   ===================================================== */

/* ---------- پیدا کردن عناصر فرم ---------- */
const contactForm = document.getElementById('contactForm');
const nameInput = contactForm.querySelector('input[type="text"]');
const emailInput = contactForm.querySelector('input[type="email"]');
const subjectSelect = contactForm.querySelector('select');
const messageInput = contactForm.querySelector('textarea');
const sendButton = contactForm.querySelector('.btn-filled');

const MAX_LENGTH = 500;   // حداکثر طول پیام
messageInput.maxLength = MAX_LENGTH;

// کادر پیام (قرمز یا سبز) قبل از دکمه ارسال
const formMessage = document.createElement('div');
formMessage.className = 'form-message';
contactForm.querySelector('.form-bottom').before(formMessage);

// شمارنده حروف زیر کادر پیام
const charCounter = document.createElement('div');
charCounter.className = 'char-counter';
messageInput.after(charCounter);

function updateCounter() {
  charCounter.textContent =
    messageInput.value.length.toLocaleString('fa-IR') + ' / ' + MAX_LENGTH.toLocaleString('fa-IR');
}
updateCounter();
messageInput.addEventListener('input', updateCounter);


/* ---------- پیام قرمز (error) یا سبز (success) را نشان بده ---------- */
function showMessage(type, text) {
  formMessage.className = 'form-message ' + type;
  formMessage.textContent = text;
}


/* ---------- بررسی فرم موقع ارسال ---------- */
contactForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nameInput.value.trim().length < 3) {
    showMessage('error', 'نام و نام خانوادگی را کامل وارد کن.');
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showMessage('error', 'آدرس ایمیل معتبر نیست.');
  } else if (subjectSelect.selectedIndex === 0) {
    showMessage('error', 'موضوع پیام را انتخاب کن.');
  } else if (messageInput.value.trim().length < 10) {
    showMessage('error', 'پیامت باید حداقل ۱۰ حرف باشد.');
  } else {
    showMessage('success', 'پیامت ارسال شد! تا ۲۴ ساعت دیگر پاسخ می‌دهیم.');
    contactForm.reset();
    updateCounter();

    // دکمه برای دو ثانیه «ارسال شد» را نشان می‌دهد
    const oldText = sendButton.textContent;
    sendButton.textContent = '✔ ارسال شد';
    setTimeout(function () { sendButton.textContent = oldText; }, 2000);
  }
});


/* ---------- کپی کردن ایمیل و شماره تلفن با یک کلیک ---------- */
function copyText(text, onDone) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onDone);
    return;
  }
  // روش قدیمی‌تر، برای وقتی که صفحه از روی کامپیوتر باز شده (file://)
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();
  onDone();
}

document.querySelectorAll('.contact-item p').forEach(function (item) {
  item.title = 'برای کپی کلیک کن';

  item.addEventListener('click', function () {
    const oldText = item.textContent;
    copyText(oldText, function () {
      item.textContent = '✔ کپی شد';
      setTimeout(function () { item.textContent = oldText; }, 1200);
    });
  });
});


/* ---------- ثبت‌نام داخل مودال ---------- */
(function () {
  const formSide = document.querySelector('.modal-form-side');
  const signupBox = document.getElementById('signupBox');
  if (!formSide || !signupBox) { return; }   // صفحه‌ای که بخش ثبت‌نام ندارد
  if (signupBox.dataset.ready) { return; }   // اگر یک بار وصل شده، دوباره وصل نکن
  signupBox.dataset.ready = '1';

  const signupForm = document.getElementById('signupForm');
  const errorBox = document.getElementById('signupError');
  const successBox = document.getElementById('signupSuccess');

  // پیام خطا یا موفقیت را نشان می‌دهد (box خالی = هر دو پیام مخفی)
  function showMessage(box, text) {
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    if (box) {
      box.textContent = text;
      box.style.display = 'block';
    }
  }

  // فرم ثبت‌نام را نشان بده و بقیه مودال (فرم ورود) را مخفی کن
  function showSignup() {
    Array.from(formSide.children).forEach(function (element) {
      if (element !== signupBox) { element.style.display = 'none'; }
    });
    signupBox.style.display = 'block';
  }

  // برگرد به فرم ورود
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

  // هر بار مودال باز یا بسته می‌شود، دوباره فرم ورود را نشان بده
  document.querySelectorAll('.js-open-login').forEach(function (button) {
    button.addEventListener('click', showLogin);
  });
  const closeButton = document.getElementById('loginClose');
  if (closeButton) { closeButton.addEventListener('click', showLogin); }

  // بررسی فرم ثبت‌نام
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // اگر کد ثبت‌نام login-modal.js هم همین فرم را همین الان با موفقیت ثبت کرده، دوباره بررسی نکن
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
      setTimeout(showLogin, 1500);   // بعد از ۱.۵ ثانیه برگرد به فرم ورود
    }
  });
})();


/* ---------- افکت‌های مشترک (توابع بخش اول همین فایل) ---------- */
revealOnScroll('.hero-content, .contact-info-card, .contact-form-card');


/* ---------- پیام‌های قرمز و سبز فرم ورود به فارسی ----------
   متن‌های انگلیسی که login-modal.js می‌نویسد، همین‌جا به فارسی عوض می‌شوند. */
(function () {
  const errorBox = document.getElementById('loginError');
  const successBox = document.getElementById('loginSuccess');

  // متن انگلیسی را می‌گیرد و جمله فارسی مناسب را برمی‌گرداند
  function toPersian(text, isSuccess) {
    const t = text.toLowerCase();

    if (isSuccess) { return 'با موفقیت وارد شدی!'; }

    const hasEmail = t.includes('email');
    const hasPassword = t.includes('password');

    // ایمیل یا رمز اشتباه است
    if ((hasEmail && hasPassword && (t.includes('invalid') || t.includes('incorrect') || t.includes('wrong') || t.includes('match')))
        || t.includes('credential') || t.includes('incorrect') || t.includes('wrong')) {
      return 'ایمیل یا رمز عبور اشتباه است.';
    }
    // فرمت ایمیل
    if (hasEmail && (t.includes('valid') || t.includes('format'))) {
      return 'آدرس ایمیل معتبر نیست.';
    }
    // فیلد خالی
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

  // هر بار متن یکی از دو کادر عوض شد، اگر انگلیسی بود به فارسی برش گردان
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
