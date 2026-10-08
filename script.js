/* ==========================================================
   BIRTHDAY LETTER — logic
   Flow: cake → password → envelope → typed letter
   ========================================================== */

const PASSWORD = '08102011';   // không xuất hiện trong DOM

/* ---------- ELEMENTS ---------- */
const screenCake   = document.getElementById('screen-cake');
const screenPw     = document.getElementById('screen-password');
const screenLetter = document.getElementById('screen-letter');

const cakeEl   = document.getElementById('cake');
const pwForm   = document.getElementById('pw-form');
const pwInput  = document.getElementById('pw-input');
const pwError  = document.getElementById('pw-error');

const envelope  = document.getElementById('envelope');
const letterBody = document.getElementById('letter-body');
const letterFoot = document.getElementById('letter-foot');

const musicBtn = document.getElementById('music-toggle');
const bgm      = document.getElementById('bgm');

/* ---------- SCREEN SWITCH ---------- */
function showScreen(el){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  // màn hình letter cần scroll top khi mở
  if (el === screenLetter) el.scrollTop = 0;
}

/* ==========================================================
   1. CAKE CLICK
   ========================================================== */
function handleCakeOpen(){
  document.body.classList.add('flash');
  setTimeout(() => document.body.classList.remove('flash'), 500);

  cakeEl.style.transition = 'transform .3s ease';
  cakeEl.style.transform = 'scale(.95)';
  setTimeout(() => { cakeEl.style.transform = ''; }, 300);

  setTimeout(() => {
    showScreen(screenPw);
    pwInput.focus();
  }, 600);
}

cakeEl.addEventListener('click', handleCakeOpen);
cakeEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleCakeOpen(); }
});

/* ==========================================================
   2. PASSWORD CHECK
   ========================================================== */
pwForm.addEventListener('submit', e => {
  e.preventDefault();
  const value = pwInput.value.trim();
  if (value === PASSWORD) unlockSuccess();
  else unlockFail();
});

function unlockFail(){
  pwError.textContent = 'Oops! Mật khẩu chưa đúng, thử lại nhé 💕';
  pwInput.classList.remove('shake');
  void pwInput.offsetWidth;
  pwInput.classList.add('shake');
  pwInput.value = '';
  pwInput.focus();
}

function unlockSuccess(){
  pwError.textContent = '';
  pwInput.disabled = true;

  const box = document.querySelector('.gift-box');
  box.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1), opacity .8s';
  box.style.transform = 'scale(1.06)';
  box.style.opacity = '0';

  startMusic();

  setTimeout(() => {
    showScreen(screenLetter);
    // reset trạng thái envelope trước khi mở
    envelope.classList.remove('open');
    letterBody.innerHTML = '';
    letterFoot.classList.remove('show');

    setTimeout(() => {
      envelope.classList.add('open');
      // chờ phong bì mở + thư trượt lên xong mới bắt đầu viết
      setTimeout(startLetterTyping, 1300);
    }, 300);
  }, 800);
}

/* ==========================================================
   3. LETTER TYPING — từng dòng xuất hiện
   ========================================================== */
const LETTER_LINES = [
  "Chúc mừng sinh nhật Linh 🎂💐",
  "Vậy là thêm một tuổi mới rồi nha. Chúc Linh tuổi mới luôn vui vẻ, mạnh khỏe, gặp thật nhiều may mắn và có thật nhiều điều tốt đẹp đến với mình. Mong rằng những chuyện chưa được như ý, kể cả chuyện thi CHT lần này, cũng sẽ chỉ là một chút tiếc nuối trên hành trình phía trước thôi. Đừng buồn quá nhé, vì một lần chưa đạt được điều mình mong muốn không thể quyết định được khả năng hay giá trị của một người.",
  "Tuổi mới mong Linh sẽ luôn giữ được nụ cười, sự đáng yêu và những điều tốt đẹp của riêng mình. Mong những ngày sắp tới sẽ nhẹ nhàng hơn, những dự định của Linh sẽ dần thành hiện thực, và nếu có lúc mệt mỏi thì nhớ rằng một thất bại nhỏ không phải dấu chấm hết.",

  "Chúc cô gái tên Linh có một sinh nhật thật vui, thật đáng nhớ và một tuổi mới thật rực rỡ nhé! 🎉❤️Happy Birthday, Linh! 🥳",
];

function startLetterTyping(){
  letterBody.innerHTML = '';
  let i = 0;

  function nextLine(){
    if (i >= LETTER_LINES.length){
      letterFoot.classList.add('show');
      spawnHearts(14);
      spawnConfetti(40);
      return;
    }

    const text = LETTER_LINES[i];
    const p = document.createElement('p');

    if (text === '') p.innerHTML = '&nbsp;';
    else p.textContent = text;

    letterBody.appendChild(p);
    requestAnimationFrame(() => p.classList.add('show'));

    i++;
    setTimeout(nextLine, text === '' ? 300 : 900 + text.length * 18);
  }

  nextLine();
}

/* ==========================================================
   4. FLOATING HEARTS / PETALS / CONFETTI
   ========================================================== */
function spawnHearts(count = 10){
  const glyphs = ['❤️','💕','🌸','✨','💗'];
  for (let i = 0; i < count; i++){
    const el = document.createElement('div');
    el.className = 'floater';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.bottom = '-40px';
    el.style.animationDuration = (6 + Math.random() * 4) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    el.style.fontSize = (16 + Math.random() * 16) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 12000);
  }
}

function spawnConfetti(count = 30){
  const colors = ['#f7c8d8','#d9c8f7','#c8f7d8','#e8d5a8','#ffe4c4'];
  for (let i = 0; i < count; i++){
    const el = document.createElement('div');
    el.className = 'floater';
    el.style.width = '6px';
    el.style.height = '10px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = '2px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.bottom = '-20px';
    el.style.animationDuration = (4 + Math.random() * 3) + 's';
    el.style.animationDelay = (Math.random() * 1.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 9000);
  }
}

/* ==========================================================
   5. MUSIC
   ========================================================== */
let musicStarted = false;

function startMusic(){
  if (musicStarted) return;
  bgm.volume = 0.35;
  bgm.play().then(() => {
    musicStarted = true;
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('on');
  }).catch(() => {
    musicBtn.textContent = '🔇';
  });
}

musicBtn.addEventListener('click', () => {
  if (bgm.paused){
    bgm.volume = 0.35;
    bgm.play().then(() => {
      musicStarted = true;
      musicBtn.textContent = '🔊';
      musicBtn.classList.add('on');
    }).catch(() => {});
  } else {
    bgm.pause();
    musicBtn.textContent = '🔇';
    musicBtn.classList.remove('on');
  }
});

/* ==========================================================
   6. BACKGROUND CANVAS — hạt sáng bay chậm
   ========================================================== */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildDots();
}

function buildDots(){
  dots = [];
  const count = Math.min(70, Math.floor(W / 22));
  for (let i = 0; i < count; i++){
    dots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.45 + 0.15,
      hue: Math.random() < 0.5 ? '247,200,216' : '217,200,247'
    });
  }
}

function drawDots(){
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${d.hue},${d.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawDots);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawDots();

/* ==========================================================
   7. BOOT
   ========================================================== */
window.addEventListener('load', () => {
  showScreen(screenCake);
});