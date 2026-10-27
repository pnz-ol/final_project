

const eyebrow = document.querySelector('.eyebrow');


const eyebrowText = eyebrow.textContent;


eyebrow.textContent = '';
eyebrow.classList.add('typing');   


let letterNumber = 0;


function typeNextLetter() {
  if (letterNumber < eyebrowText.length) {
    eyebrow.textContent = eyebrow.textContent + eyebrowText[letterNumber];
    letterNumber = letterNumber + 1;
    setTimeout(typeNextLetter, 90);   
  }
}

typeNextLetter();


const hero = document.querySelector('.hero');
const crosses = document.querySelectorAll('.deco-x');

hero.addEventListener('mousemove', function (event) {

  const box = hero.getBoundingClientRect();


  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;


  crosses.forEach(function (cross, index) {
    const power = (index + 1) * 20;
    cross.style.translate = x * power + 'px ' + y * power + 'px';
  });
});


hero.addEventListener('mouseleave', function () {
  crosses.forEach(function (cross) {
    cross.style.translate = '0px 0px';
  });
});



const gameCards = document.querySelectorAll('.game-card');

gameCards.forEach(function (card) {

  card.addEventListener('mousemove', function (event) {
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;

  
    card.style.transform =
      'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg) scale(1.03)';
  });

  card.addEventListener('mouseleave', function () {

    card.style.transform = '';
  });
});



const revealItems = document.querySelectorAll(
  '.category-item, .game-card, .section-head, .footer-col'
);


const watcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      watcher.unobserve(entry.target);  
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (item, index) {
  item.classList.add('reveal');

  item.style.setProperty('--delay', (index % 6) * 0.1 + 's');
  watcher.observe(item);
});


const searchInput = document.querySelector('.search-box input');

const gameNames = [
  'الدن رینگ',
  'مرد عنکبوتی ۲',
  'سایبرپانک ۲۰۷۷',
  'رد دد ریدمپشن ۲',
  'جی‌تی‌ای ۶'
];

let nameNumber = 0;

setInterval(function () {
  searchInput.placeholder = 'جستجوی ' + gameNames[nameNumber] + '...';
  nameNumber = nameNumber + 1;


  if (nameNumber === gameNames.length) {
    nameNumber = 0;
  }
}, 2500);


const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', function () {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (scrolled / total) * 100;

  progressBar.style.width = percent + '%';
});


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


/* -----------------------------------------------------
   منوی واکنش‌گرای صفحه اصلی
   ----------------------------------------------------- */
function startHomeMobileMenu() {
  const header = document.querySelector('body > header');
  const nav = header ? header.querySelector('nav') : null;

  if (!header || !nav || header.querySelector('.home-menu-toggle')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'home-menu-toggle';
  button.setAttribute('aria-label', 'باز و بسته کردن منو');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(button);

  function closeMenu() {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHomeMobileMenu);
} else {
  startHomeMobileMenu();
}
