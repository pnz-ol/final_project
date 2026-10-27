/*
  این فایل رو هم مثل login-modal.css توی هر صفحه‌ای که مودال لاگین
  لازم داری لینک کن. لازمه بعد از HTML مودال (توی صفحه) لود بشه.

  ⚠️ نکته‌ی خیلی مهم امنیتی:
  چک‌کردن ایمیل/رمز اینجا (پایین همین فایل) فقط یه دمو برای تست ظاهر
  سایته. هیچ‌وقت رمز واقعی کاربرها رو توی جاوااسکریپت سمت کاربر چک نکن —
  چون هرکسی با Inspect می‌تونه این فایل رو بخونه. وقتی سایت واقعی شد،
  این بخش باید با یه درخواست به سرور (fetch) جایگزین بشه که سرور
  خودش (با رمز هش‌شده توی دیتابیس) چک می‌کنه، نه خود مرورگر.
*/

// فقط برای تست ظاهر — بعداً حتماً با یه سرور واقعی جایگزینش کن
const DEMO_EMAIL = "you@example.com";
const DEMO_PASSWORD = "123456";

const overlay = document.getElementById("loginOverlay");
const openButtons = document.querySelectorAll(".js-open-login");
const closeButton = document.getElementById("loginClose");
const loginForm = document.getElementById("loginForm");
const errorBanner = document.getElementById("loginError");
const successBanner = document.getElementById("loginSuccess");
const togglePasswordBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("loginPassword");

// ------- باز کردن مودال -------
openButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        // جلوگیری از اسکرول پشت مودال، تا وقتی بازه
    });
});

// ------- بستن مودال -------
function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    errorBanner.classList.remove("show");
    successBanner.classList.remove("show");
}

closeButton.addEventListener("click", closeModal);

// کلیک روی خودِ پس‌زمینه‌ی تیره (نه روی خود کادر مودال) هم ببندتش
overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
        closeModal();
    }
});

// دکمه‌ی Escape روی کیبورد هم ببندتش
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
        closeModal();
    }
});

// ------- نمایش/مخفی‌کردن رمز عبور -------
togglePasswordBtn.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordBtn.textContent = isHidden ? "🙈" : "👁️";
});

// ------- ارسال فرم -------
loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // جلوگیری از رفرش‌شدن صفحه (چون سرور واقعی نداریم)

    errorBanner.classList.remove("show");
    successBanner.classList.remove("show");

    const email = document.getElementById("loginEmail").value.trim();
    const password = passwordInput.value;

    // یه اعتبارسنجی ساده‌ی فرمت ایمیل (برای تجربه‌ی کاربری، نه امنیت)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email) || password.length === 0) {
        errorBanner.textContent = "Please enter a valid email and password.";
        errorBanner.classList.add("show");
        return;
    }

    // فقط برای دمو: مقایسه با مقدار ثابت بالا
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        successBanner.textContent = "Signed in successfully!";
        successBanner.classList.add("show");
        setTimeout(closeModal, 1200);
    } else {
        // عمداً نمی‌گیم "ایمیل" یا "رمز" کدومش غلطه — این خودش یه
        // استاندارد امنیتیه که جلوی حدس‌زدن حساب‌های واقعی رو می‌گیره
        errorBanner.textContent = "Incorrect email or password.";
        errorBanner.classList.add("show");
    }
});


/* =====================================================
   جستجوی هوشمند: پیشنهاد با عکس کوچک + تاریخچه جستجو
   این کد را آخر فایل جاوا اسکریپت هر صفحه بگذار.
   روی همه صفحه‌ها یکسان کار می‌کند (همه در یک پوشه بالاتر از ../img هستند).
   ===================================================== */
(function () {

  /* ---------- تنظیمات ---------- */
  const USD_TO_RIAL = 1500000;        // نرخ تبدیل دلار به ریال (مثل بقیه صفحه‌ها)
  const HISTORY_KEY = 'gv_search_history';
  const MAX_HISTORY = 6;              // حداکثر چند جستجوی اخیر ذخیره شود
  const MAX_RESULTS = 6;              // حداکثر چند پیشنهاد نشان داده شود

  /* ---------- همه محصولات سایت ----------
     هر محصول جدیدی که اضافه کردی، یک خط شبیه این‌ها به لیست اضافه کن.
     fa: اسم فارسی یا نوشتن فارسیِ اسم (برای وقتی که کاربر فارسی تایپ می‌کند)
     usd: قیمت به دلار (به ریال تبدیل می‌شود)     from: true یعنی «از این قیمت» */
  const ITEMS = [
    { type: 'game', name: 'Elden Ring', fa: 'الدن رینگ', usd: 59.99, img: '../img/elder_ring/elder_ring__game.jpg', link: '../game-detail/game-detail-elden-ring.html' },
    { type: 'game', name: 'Cyberpunk 2077', fa: 'سایبرپانک', usd: 49.99, img: '../img/cyber_punk_2077/cyberpunk_game.jfif', link: '../game-detail/game-detail-cyber-punk-2077.html' },
    { type: 'game', name: 'Red Dead Redemption 2', fa: 'رد دد ریدمپشن', usd: 59.99, img: '../img/red_dead_redmption/redDeadRedemption.jfif', link: '../game-detail/game-detail-red-dead-redemption.html' },
    { type: 'game', name: 'Call of Duty: Modern Warfare III', fa: 'کال آو دیوتی مدرن وارفار', usd: 69.99, img: '../img/games/call_of_duty_3.jpg', link: '../games/games.html' },
    { type: 'game', name: 'Hogwarts Legacy', fa: 'هاگوارتز لگسی', usd: 49.99, img: '../img/hogwarts/Hogwarts_legacyboxart.png', link: '../games/games.html' },
    { type: 'game', name: 'Forza Horizon 5', fa: 'فورزا هورایزن', usd: 59.99, img: '../img/games/forza_5.jfif', link: '../games/games.html' },
    { type: 'game', name: 'Spider-Man 2', fa: 'اسپایدرمن مرد عنکبوتی', usd: 59.99, img: '../img/spider_man_2/spi_2_game.jpg', link: '../game-detail/game-detail-spider-man-2.html' },
    { type: 'game', name: 'God of War Ragnarök', fa: 'گاد آو وار راگناروک خدای جنگ', usd: 59.99, img: '../img/games/god_of_war_regnarok.jpg', link: '../games/games.html' },
    { type: 'game', name: 'Horizon Forbidden West', fa: 'هورایزن فوربیدن وست', usd: 49.99, img: '../img/games/horizon.jpg', link: '../games/games.html' },
    { type: 'game', name: 'Starfield', fa: 'استارفیلد', usd: 69.99, img: '../img/games/starfield.jfif', link: '../games/games.html' },
    { type: 'game', name: 'Resident Evil 4 Remake', fa: 'رزیدنت اویل', usd: 49.99, img: '../img/games/Resident-Evil-4-2023.jpg', link: '../games/games.html' },
    { type: 'game', name: 'The Last of Us Part I', fa: 'لست آو آس', usd: 49.99, img: '../img/games/the_last_of_us.jpg', link: '../games/games.html' },
    { type: 'game', name: 'Grand Theft Auto V', fa: 'گراند تفت اتو جی تی ای', usd: 29.99, img: '../img/gtav/Grand_Theft_Auto_V.png', link: '../games/games.html' },
    { type: 'game', name: 'Minecraft', fa: 'ماینکرفت', usd: 19.99, img: '../img/games/minecraft.jfif', link: '../games/games.html' },
    { type: 'game', name: 'Fortnite', fa: 'فورتنایت', usd: 0, img: '../img/games/fortnite.jfif', link: '../games/games.html' },
    { type: 'game', name: 'The Witcher 3: Wild Hunt', fa: 'ویچر', usd: 39.99, img: '../img/the_witcher_3/the_witcher_3_game.jfif', link: '../games/games.html' },
    { type: 'software', name: 'Microsoft Windows 11 Pro', fa: 'ویندوز', usd: 159.99, img: '../img/soft_wear/windows-11_logo.png', link: '../software/software.html' },
    { type: 'software', name: 'Microsoft Office 365 (1 Year)', fa: 'آفیس ورد اکسل', usd: 81.99, img: '../img/soft_wear/Microsoft_365.png', link: '../software/software.html' },
    { type: 'software', name: 'Adobe Photoshop CC', fa: 'فتوشاپ', usd: 179.99, img: '../img/soft_wear/Adobe_Photoshop.png', link: '../software/software.html' },
    { type: 'software', name: 'Adobe Illustrator CC', fa: 'ایلاستریتور', usd: 155.99, img: '../img/soft_wear/Adobe Illustrator Logo.png', link: '../software/software.html' },
    { type: 'software', name: 'Avast Premium Security', fa: 'اواست آنتی ویروس', usd: 41.99, img: '../img/soft_wear/Avast.png', link: '../software/software.html' },
    { type: 'software', name: 'AutoCAD 2024', fa: 'اتوکد', usd: 183.99, img: '../img/soft_wear/AutoCAD.png', link: '../software/software.html' },
    { type: 'software', name: 'JetBrains IntelliJ IDEA', fa: 'اینتلیج آیدیا', usd: 127.49, img: '../img/soft_wear/IntelliJ IDEA.png', link: '../software/software.html' },
    { type: 'software', name: 'Adobe After Effects CC', fa: 'افتر افکتس', usd: 179.99, img: '../img/soft_wear/Adobe After Effects.png', link: '../software/software.html' },
    { type: 'software', name: 'Malwarebytes Premium', fa: 'مالویربایتس آنتی ویروس', usd: 32.49, img: '../img/soft_wear/Malwarebytes.png', link: '../software/software.html' },
    { type: 'software', name: 'Microsoft Visual Studio Code', fa: 'ویژوال استودیو کد', usd: 39.99, img: '../img/soft_wear/Visual Studio_Code_Logo.png', link: '../software/software.html' },
    { type: 'gift', name: 'PlayStation Store', fa: 'پلی استیشن', usd: 10, from: true, img: '../img/gift_cards/ps.png', bg: '#1d5fd6', link: '../gift-cards/gift-cards.html' },
    { type: 'gift', name: 'Xbox Gift Card', fa: 'ایکس باکس', usd: 10, from: true, img: '../img/gift_cards/xbox.png', bg: '#3fae4a', link: '../gift-cards/gift-cards.html' },
    { type: 'gift', name: 'Nintendo eShop', fa: 'نینتندو', usd: 10, from: true, img: '../img/gift_cards/nintendo.png', bg: '#d6392f', link: '../gift-cards/gift-cards.html' },
    { type: 'gift', name: 'Steam Gift Card', fa: 'استیم', usd: 10, from: true, img: '../img/gift_cards/steam.png', bg: '#16171d', link: '../gift-cards/gift-cards.html' },
  ];

  const TYPE_LABEL = { game: 'بازی', software: 'نرم‌افزار', gift: 'گیفت کارت' };
  // کلمه‌هایی که با آن‌ها هم می‌شود پیدا کرد؛ مثلا تایپ «بازی» همه بازی‌ها را نشان می‌دهد
  const TYPE_WORDS = {
    game: 'بازی game gaming گیم',
    software: 'نرم افزار software برنامه',
    gift: 'گیفت کارت gift card هدیه'
  };


  /* ---------- ۱) آماده‌سازی متن برای مقایسه ----------
     حروف بزرگ و کوچک، ی و ک عربی، نیم‌فاصله، عدد فارسی و علامت‌ها (: - ) یکی می‌شوند */
  function normalize(text) {
    return String(text).toLowerCase()
      .replace(/[\u200c\u200e\u200f]/g, '')
      .replace(/ي/g, 'ی').replace(/ك/g, 'ک')
      .replace(/[۰-۹]/g, function (d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
      .replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); })
      .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
      .trim();
  }

  // برای هر محصول یک بار متن قابل جستجو را آماده می‌کنیم
  ITEMS.forEach(function (item) {
    item.nameNorm = normalize(item.name);
    item.hay = normalize(item.name + ' ' + item.fa + ' ' + TYPE_WORDS[item.type]);
  });


  /* ---------- ۲) پیدا کردن پیشنهادها ----------
     امتیاز کمتر = بالاتر در لیست:
     ۰ اسم با همین حرف‌ها شروع می‌شود، ۱ یکی از کلمه‌های اسم با آن شروع می‌شود،
     ۲ جایی از اسم هست، ۳ در اسم فارسی یا نوع محصول هست */
  function search(query) {
    const q = normalize(query);
    if (q === '') { return []; }
    const qCompact = q.replace(/ /g, '');   // «spiderman» هم «Spider-Man» را پیدا کند

    const found = [];
    ITEMS.forEach(function (item) {
      let score = -1;
      if (item.nameNorm.startsWith(q)) { score = 0; }
      else if ((' ' + item.nameNorm).includes(' ' + q)) { score = 1; }
      else if (item.nameNorm.includes(q) || item.nameNorm.replace(/ /g, '').includes(qCompact)) { score = 2; }
      else if (item.hay.includes(q)) { score = 3; }
      if (score >= 0) { found.push({ item: item, score: score }); }
    });

    found.sort(function (a, b) { return a.score - b.score; });
    return found.slice(0, MAX_RESULTS).map(function (entry) { return entry.item; });
  }


  /* ---------- ۳) قیمت به ریال ---------- */
  function priceText(item) {
    if (item.usd === 0) { return 'رایگان'; }
    const rial = Math.round((item.usd * USD_TO_RIAL) / 10000) * 10000;
    return (item.from ? 'از ' : '') + rial.toLocaleString('fa-IR') + ' ریال';
  }


  /* ---------- ۴) تاریخچه جستجو (داخل مرورگر ذخیره می‌شود) ---------- */
  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(list) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (error) { /* مهم نیست */ }
  }

  function addToHistory(text) {
    const clean = text.trim();
    if (clean === '') { return; }
    // اگر قبلا بوده، حذفش کن تا دوباره بالای لیست بیاید
    const list = loadHistory().filter(function (old) { return normalize(old) !== normalize(clean); });
    list.unshift(clean);
    saveHistory(list.slice(0, MAX_HISTORY));
  }

  function removeFromHistory(text) {
    saveHistory(loadHistory().filter(function (old) { return old !== text; }));
  }


  /* ---------- ۵) ساختن کادر پیشنهادها برای هر کادر جستجو ---------- */
  function setup(box) {
    const input = box.querySelector('input');
    if (!input) { return; }

    const panel = document.createElement('div');
    panel.className = 'search-suggest';
    box.appendChild(panel);

    let activeIndex = -1;   // کدام ردیف با کیبورد انتخاب شده

    function rows() { return Array.from(panel.querySelectorAll('.ss-row')); }
    function open() { panel.classList.add('open'); }
    function close() { panel.classList.remove('open'); activeIndex = -1; }

    // یک عنوان کوچک بالای لیست
    function addHead(text, actionText, onAction) {
      const head = document.createElement('div');
      head.className = 'ss-head';
      const title = document.createElement('span');
      title.textContent = text;
      head.appendChild(title);
      if (actionText) {
        const action = document.createElement('button');
        action.type = 'button';
        action.textContent = actionText;
        action.addEventListener('click', onAction);
        head.appendChild(action);
      }
      panel.appendChild(head);
    }

    // اسم محصول؛ قسمتی که کاربر تایپ کرده زرد می‌شود
    function nameElement(name, query) {
      const span = document.createElement('span');
      span.className = 'ss-name';
      const at = name.toLowerCase().indexOf(query.trim().toLowerCase());
      if (query.trim() === '' || at === -1) {
        span.textContent = name;
        return span;
      }
      const mark = document.createElement('mark');
      mark.textContent = name.substr(at, query.trim().length);
      span.appendChild(document.createTextNode(name.substr(0, at)));
      span.appendChild(mark);
      span.appendChild(document.createTextNode(name.substr(at + query.trim().length)));
      return span;
    }

    // وقتی کادر خالی است: تاریخچه جستجو
    function showHistory() {
      panel.innerHTML = '';
      activeIndex = -1;
      const list = loadHistory();
      if (list.length === 0) { close(); return; }

      addHead('جستجوهای اخیر', 'پاک کردن همه', function () {
        saveHistory([]);
        showHistory();
        input.focus();
      });

      list.forEach(function (text) {
        const row = document.createElement('div');
        row.className = 'ss-row ss-history';

        const icon = document.createElement('span');
        icon.className = 'ss-clock';
        icon.textContent = '🕘';

        const label = document.createElement('span');
        label.className = 'ss-name';
        label.textContent = text;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'ss-remove';
        remove.title = 'حذف';
        remove.textContent = '✕';
        remove.addEventListener('click', function (event) {
          event.stopPropagation();       // کلیک روی ✕ ردیف را انتخاب نکند
          removeFromHistory(text);
          showHistory();
          input.focus();                 // تا کلیدهای بالا و پایین کیبورد کار کنند
        });

        row.appendChild(icon);
        row.appendChild(label);
        row.appendChild(remove);
        row.addEventListener('click', function () {
          input.value = text;
          input.dispatchEvent(new Event('input', { bubbles: true }));   // فیلتر خود صفحه هم کار کند
          input.focus();
        });
        panel.appendChild(row);
      });
      open();
    }

    // وقتی چیزی تایپ شده: پیشنهادها با عکس کوچک
    function showResults(query) {
      panel.innerHTML = '';
      activeIndex = -1;
      const results = search(query);

      if (results.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'ss-empty';
        empty.textContent = 'نتیجه‌ای پیدا نشد 😕';
        panel.appendChild(empty);
        open();
        return;
      }

      results.forEach(function (item) {
        const row = document.createElement('a');
        row.className = 'ss-row ss-item';
        row.href = item.link;

        const thumb = document.createElement('img');
        thumb.className = 'ss-thumb' + (item.type === 'gift' ? ' ss-thumb-icon' : '');
        thumb.src = item.img;
        thumb.alt = '';
        if (item.bg) { thumb.style.backgroundColor = item.bg; }
        thumb.addEventListener('error', function () { thumb.style.visibility = 'hidden'; });

        const info = document.createElement('span');
        info.className = 'ss-info';
        info.appendChild(nameElement(item.name, query));
        const type = document.createElement('span');
        type.className = 'ss-type';
        type.textContent = TYPE_LABEL[item.type];
        info.appendChild(type);

        const price = document.createElement('span');
        price.className = 'ss-price';
        price.textContent = priceText(item);

        row.appendChild(thumb);
        row.appendChild(info);
        row.appendChild(price);
        // با کلیک روی یک پیشنهاد، اسمش هم در تاریخچه ذخیره می‌شود
        row.addEventListener('click', function () { addToHistory(item.name); });
        panel.appendChild(row);
      });
      open();
    }

    // کادر خالی = تاریخچه، پر = پیشنهادها
    function render() {
      if (input.value.trim() === '') { showHistory(); } else { showResults(input.value); }
    }

    // ردیف انتخاب‌شده با کیبورد را پررنگ کن
    function highlight(index) {
      const all = rows();
      all.forEach(function (row) { row.classList.remove('active'); });
      if (index >= 0 && all[index]) {
        all[index].classList.add('active');
        all[index].scrollIntoView({ block: 'nearest' });
      }
      activeIndex = index;
    }

    input.addEventListener('focus', render);
    input.addEventListener('input', render);

    input.addEventListener('keydown', function (event) {
      const all = rows();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!panel.classList.contains('open')) { render(); return; }
        highlight(activeIndex + 1 >= all.length ? 0 : activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        highlight(activeIndex - 1 < 0 ? all.length - 1 : activeIndex - 1);
      } else if (event.key === 'Enter') {
        if (activeIndex >= 0 && all[activeIndex]) {
          event.preventDefault();
          all[activeIndex].click();      // رفتن به محصول، یا پر کردن از تاریخچه
        } else {
          addToHistory(input.value);     // فقط در تاریخچه ذخیره شود
          close();
        }
      } else if (event.key === 'Escape') {
        close();
        input.blur();
      }
    });

    // کلیک روی ذره‌بین هم همین کار را می‌کند
    const icon = box.querySelector('a');
    if (icon) {
      icon.addEventListener('click', function (event) {
        event.preventDefault();
        addToHistory(input.value);
        input.focus();
        render();
      });
    }

    // کلیک بیرون از کادر جستجو، لیست را می‌بندد
    document.addEventListener('click', function (event) {
      if (!box.contains(event.target)) { close(); }
    });
  }

  document.querySelectorAll('.search-box').forEach(setup);
})();
