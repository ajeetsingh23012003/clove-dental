"use strict";

/*  header stick on page forever */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* 2. FAQ question */
const faqButtons = document.querySelectorAll('[data-group="faq"] .acc-btn');

function setState(btn, open) {
  btn.setAttribute("aria-expanded", String(open));
  document.getElementById(btn.getAttribute("aria-controls")).classList.toggle("open", open);
}

faqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const wasOpen = btn.getAttribute("aria-expanded") === "true";
    faqButtons.forEach((b) => setState(b, false));
    setState(btn, !wasOpen);
  });
});

/* reviews drag*/
const track = document.getElementById("reviewTrack");
let startX = 0;
let startScroll = 0;
let dragging = false;

track.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse") return;
  dragging = true;
  startX = e.clientX;
  startScroll = track.scrollLeft;
  track.classList.add("dragging");
  track.setPointerCapture(e.pointerId);
});

track.addEventListener("pointermove", (e) => {
  if (dragging) track.scrollLeft = startScroll - (e.clientX - startX);
});

["pointerup", "pointercancel"].forEach((type) =>
  track.addEventListener(type, () => {
    dragging = false;
    track.classList.remove("dragging");
  })
);

/*captcha */
const form = document.getElementById("book");
const msg = document.getElementById("formMsg");
const codeEl = document.getElementById("captchaCode");
let code = "1514";

function newCaptcha() {
  code = String(Math.floor(1000 + Math.random() * 9000));
  codeEl.textContent = code;
}
newCaptcha();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { name, mobile, captcha, consent } = form.elements;
  [name, mobile, captcha].forEach((f) => f.classList.remove("invalid"));
  msg.className = "form-msg";

  let error = "";
  if (name.value.trim().length < 2) { name.classList.add("invalid"); error = "Please enter your name."; }
  else if (!/^[6-9]\d{9}$/.test(mobile.value.trim())) { mobile.classList.add("invalid"); error = "Enter a valid 10-digit mobile number."; }
  else if (captcha.value.trim() !== code) { captcha.classList.add("invalid"); error = "Captcha does not match."; newCaptcha(); }
  else if (!consent.checked) { error = "Please accept the terms to continue."; }

  if (error) { msg.textContent = error; msg.classList.add("error"); return; }

  msg.textContent = "Thank you! Our team will call you shortly.";
  msg.classList.add("ok");
  form.reset();
  newCaptcha();
});
