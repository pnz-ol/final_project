
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
startTyping();
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
  const usd = Number(price.dataset.usd);
  price.textContent = formatRial(usd);


  if (usd === 0 && price.classList.contains('price-old')) {
    price.style.display = 'none';
  }
});


/* ---------- پیدا کردن عناصر صفحه ---------- */
const hotGrid = document.querySelector('.products .deals-grid');   
const allCards = Array.from(document.querySelectorAll('.deal-card'));
const categoryItems = document.querySelectorAll('.category-list li');
const filterRows = document.querySelectorAll('.checkbox-row');
const searchInput = document.querySelector('.search-box input');

let activeCategory = 'all';  


const emptyMessages = [];
document.querySelectorAll('.deals-grid').forEach(function (grid) {
  const message = document.createElement('div');
  message.className = 'empty-message';
  message.textContent = 'تخفیفی با این مشخصات پیدا نشد 😕';
  grid.appendChild(message);
  emptyMessages.push({ grid: grid, message: message });
});


/* ---------- قیمت دلاری و درصد تخفیف یک کارت ---------- */
function getPrice(card) {
  return Number(card.querySelector('.price-new').dataset.usd);
}

function getDiscount(card) {

  const text = card.querySelector('.discount-badge').textContent;
  return Number(text.replace(/[^0-9]/g, ''));
}


/* ---------- آیا مقدار با تیک‌های یک گروه جور است؟ ----------. */
function matchesGroup(groupName, value) {
  let anyChecked = false;
  let matched = false;

  filterRows.forEach(function (row) {
    if (row.dataset.group === groupName && row.querySelector('input').checked) {
      anyChecked = true;
      if (value > Number(row.dataset.min) && value <= Number(row.dataset.max)) {
        matched = true;
      }
    }
  });

  return anyChecked ? matched : true;
}


/* ---------- مهم‌ترین تابع: هر کارت را نشان بده یا مخفی کن ---------- */
function updateDeals() {
  const searchText = searchInput.value.trim().toLowerCase();

  allCards.forEach(function (card) {
    const okSearch = card.querySelector('h4').textContent.toLowerCase().includes(searchText);


    let okSidebar = true;
    if (hotGrid.contains(card)) {
      const okCategory = activeCategory === 'all' || card.dataset.cat === activeCategory;
      const okDiscount = matchesGroup('discount', getDiscount(card));
      const okPrice = matchesGroup('price', getPrice(card));
      okSidebar = okCategory && okDiscount && okPrice;
    }

    card.style.display = (okSearch && okSidebar) ? '' : 'none';
  });

 
  emptyMessages.forEach(function (item) {
    let visible = 0;
    item.grid.querySelectorAll('.deal-card').forEach(function (card) {
      if (card.style.display !== 'none') { visible = visible + 1; }
    });
    item.message.style.display = visible === 0 ? 'block' : 'none';
  });
}


/* ---------- وصل کردن رویدادها ---------- */
searchInput.addEventListener('input', updateDeals);

filterRows.forEach(function (row) {
  row.querySelector('input').addEventListener('change', updateDeals);
});


categoryItems.forEach(function (item) {
  item.addEventListener('click', function () {
    categoryItems.forEach(function (other) {
      other.classList.remove('active');
      other.querySelector('.count').classList.remove('count-active');
    });

    item.classList.add('active');
    item.querySelector('.count').classList.add('count-active');
    activeCategory = item.dataset.cat;
    updateDeals();
  });
});


/* ---------- سبد خرید: عدد کوچک روی آیکون سبد بالای صفحه ---------- */
const cartIcon = document.querySelectorAll('.header-actions .icon-btn')[0];  
const cartBadge = document.createElement('span');
cartBadge.className = 'cart-badge';
cartIcon.appendChild(cartBadge);

let cartCount = 0;

document.querySelectorAll('.mini-cart-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    cartCount = cartCount + 1;
    cartBadge.textContent = cartCount.toLocaleString('fa-IR');
    cartBadge.style.display = 'flex';

  
    cartBadge.classList.remove('pop');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('pop');
  });
});


/* ---------- شمارش معکوس بنر «تخفیف‌های زمان‌دار» ---------- */
const bannerText = document.querySelector('.limited-content > div');
const countdown = document.createElement('div');
countdown.className = 'countdown';
bannerText.appendChild(countdown);


function twoDigits(number) {
  return number.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
}

function updateCountdown() {
  const now = new Date();
  const end = new Date();
  end.setHours(24, 0, 0, 0);  

  const secondsLeft = Math.floor((end - now) / 1000);
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  countdown.textContent =
    '⏳ پایان پیشنهاد: ' + twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ---------- دکمه «فیلترها» برای موبایل ---------- */
const sidebar = document.querySelector('.sidebar');
const filterButton = document.createElement('button');
filterButton.className = 'filter-toggle';
filterButton.textContent = 'فیلترها ▾';
sidebar.before(filterButton);  

filterButton.addEventListener('click', function () {
  sidebar.classList.toggle('open');
  filterButton.textContent = sidebar.classList.contains('open') ? 'فیلترها ▴' : 'فیلترها ▾';
});


/* ---------- افکت‌های مشترک (توابع بخش اول همین فایل) ---------- */
revealOnScroll('.deal-card, .sidebar, .section-head, .limited-banner');
tiltCards('.deal-card', 6);   


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

const featuresRow = document.querySelector('.hero-features');
const textBox = document.querySelector('.hero-content, .hero-text');
if (featuresRow && textBox && !textBox.contains(featuresRow)) {
  textBox.appendChild(featuresRow);  
}
