/* =================================================================
   Armaan Chahal · portfolio interactions
   Vanilla JS. No dependencies. Respects prefers-reduced-motion.
   ================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer  = window.matchMedia("(pointer: fine)").matches;
  var lerp = function (a, b, n) { return a + (b - a) * n; };
  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };

  document.addEventListener("DOMContentLoaded", init);

  function init() {

    /* ---------- reticle cursor (pointer-fine, motion on) ---------- */
    if (finePointer && !reduceMotion) {
      var dot  = document.querySelector(".reticle");
      var ring = document.querySelector(".reticle-ring");
      if (dot && ring) {
        document.body.classList.add("has-reticle");
        var mx = window.innerWidth / 2, my = window.innerHeight / 2;
        var rx = mx, ry = my;

        window.addEventListener("mousemove", function (e) {
          mx = e.clientX; my = e.clientY;
          dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
        }, { passive: true });

        (function ringLoop() {
          rx = lerp(rx, mx, 0.18);
          ry = lerp(ry, my, 0.18);
          ring.style.transform = "translate(" + rx + "px," + ry + "px)";
          requestAnimationFrame(ringLoop);
        })();

        var hot = "a, button, .item, .chan, .work-row, .wk-media, .mag, input, textarea, [data-cursor]";
        document.addEventListener("mouseover", function (e) {
          if (e.target.closest(hot)) document.body.classList.add("cursor-on");
        });
        document.addEventListener("mouseout", function (e) {
          if (e.target.closest(hot) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hot))) {
            document.body.classList.remove("cursor-on");
          }
        });
        window.addEventListener("mouseleave", function () {
          dot.style.opacity = "0"; ring.style.opacity = "0";
        });
        window.addEventListener("mouseenter", function () {
          dot.style.opacity = ""; ring.style.opacity = "";
        });
      }
    }

    /* ---------- scroll progress hairline ---------- */
    var bar = document.getElementById("progress");
    function onScrollProgress() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      if (bar) bar.style.width = (clamp(p, 0, 1) * 100) + "%";
    }

    /* ---------- nav: shadow on scroll + burger ---------- */
    var nav = document.getElementById("nav");
    function onScrollNav() {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    }
    var burger = document.getElementById("burger");
    var menu = document.getElementById("menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.classList.toggle("open", open);
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("open");
          burger.classList.remove("open");
        });
      });
    }

    /* ---------- back to top ---------- */
    var totop = document.getElementById("totop");
    function onScrollTop() {
      if (totop) totop.classList.toggle("show", window.scrollY > 620);
    }
    if (totop) {
      totop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    /* combined scroll handler (rAF-throttled) ---------------------- */
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        onScrollProgress();
        onScrollNav();
        onScrollTop();
        spyNav();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScrollProgress, { passive: true });
    onScrollProgress(); onScrollNav(); onScrollTop();

    /* ---------- rotating role word ---------- */
    var swap = document.getElementById("swap");
    if (swap) {
      var words = ["AI systems", "cloud infrastructure", "automation that lasts", "software worth trusting"];
      if (reduceMotion) {
        var wi = 0;
        setInterval(function () {
          wi = (wi + 1) % words.length;
          swap.textContent = words[wi];
        }, 2600);
      } else {
        typeLoop(swap, words);
      }
    }

    /* ---------- hero letters rise in ---------- */
    var heroName = document.getElementById("heroName");
    if (heroName && !reduceMotion) {
      var chars = heroName.querySelectorAll(".ch");
      chars.forEach(function (ch, i) {
        ch.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
        ch.style.transitionDelay = (0.25 + i * 0.045) + "s";
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          chars.forEach(function (ch) { ch.style.transform = "translateY(0)"; });
        });
      });
    }

    /* ---------- magnetic buttons ---------- */
    if (finePointer && !reduceMotion) {
      document.querySelectorAll(".mag").forEach(function (mag) {
        var inner = mag.firstElementChild;
        if (!inner) return;
        var r = 0;
        mag.addEventListener("mouseenter", function () { r = mag.getBoundingClientRect(); });
        mag.addEventListener("mousemove", function (e) {
          if (!r) r = mag.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          inner.style.transform = "translate(" + dx * 0.28 + "px," + dy * 0.32 + "px)";
        });
        mag.addEventListener("mouseleave", function () {
          inner.style.transform = "translate(0,0)";
        });
      });
    }

    /* ---------- reveal on scroll ---------- */
    var revealEls = document.querySelectorAll("[data-reveal], [data-clip]");
    if (revealEls.length) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("vis"); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("vis");
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
      }
    }

    /* ---------- timeline spine draw ---------- */
    var timeline = document.getElementById("timeline");
    if (timeline) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        timeline.classList.add("lit");
      } else {
        var tio = new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) { timeline.classList.add("lit"); tio.disconnect(); }
        }, { threshold: 0.12 });
        tio.observe(timeline);
      }
    }

    /* ---------- count-up numbers ---------- */
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion || !("IntersectionObserver" in window)) {
        el.textContent = target + suffix; return;
      }
      var done = false;
      var cio = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && !done) {
          done = true; cio.disconnect();
          var dur = 1500, t0 = null;
          (function step(ts) {
            if (!t0) t0 = ts;
            var k = clamp((ts - t0) / dur, 0, 1);
            var eased = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (k < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
          })();
        }
      }, { threshold: 0.6 });
      cio.observe(el);
    });

    /* ---------- schematic: draw + traveling pulse ---------- */
    var schematic = document.getElementById("schematic");
    if (schematic) {
      var trace = document.getElementById("mainTrace");
      var pulse = document.getElementById("pulse");

      if (reduceMotion || !("IntersectionObserver" in window)) {
        schematic.classList.add("drawn");
      } else {
        var seen = false;
        var sio = new IntersectionObserver(function (e) {
          if (e[0].isIntersecting && !seen) {
            seen = true; sio.disconnect();
            schematic.classList.add("drawn");
            if (trace && pulse && trace.getTotalLength) startPulse(trace, pulse);
          }
        }, { threshold: 0.3 });
        sio.observe(schematic);
      }
    }

    /* ---------- project catalogue float preview ---------- */
    var preview = document.getElementById("preview");
    if (preview && finePointer && !reduceMotion) {
      var pImg = preview.querySelector("img");
      var px = 0, py = 0, tx = 0, ty = 0, active = false;
      preview.style.transition = "opacity 0.3s var(--ease)";

      document.querySelectorAll(".item[data-img]").forEach(function (item) {
        item.addEventListener("mouseenter", function () {
          var src = item.getAttribute("data-img");
          if (pImg.getAttribute("src") !== src) pImg.setAttribute("src", src);
          active = true; preview.classList.add("show");
        });
        item.addEventListener("mouseleave", function () {
          active = false; preview.classList.remove("show");
        });
      });

      window.addEventListener("mousemove", function (e) { tx = e.clientX + 26; ty = e.clientY + 26; }, { passive: true });
      (function previewLoop() {
        px = lerp(px, tx, 0.16); py = lerp(py, ty, 0.16);
        if (active) preview.style.transform = "translate(" + px + "px," + py + "px) translate(-50%,-50%) scale(1)";
        requestAnimationFrame(previewLoop);
      })();
    }

    /* ---------- scroll-spy for in-page nav (home page) ---------- */
    var spyLinks = nav ? nav.querySelectorAll('.menu a[href^="#"]') : [];
    var spySections = [];
    spyLinks.forEach(function (l) {
      var id = l.getAttribute("href").slice(1);
      var sec = id && document.getElementById(id);
      if (sec) spySections.push({ link: l, sec: sec });
    });
    function spyNav() {
      if (!spySections.length) return;
      var pos = window.scrollY + window.innerHeight * 0.34;
      var current = spySections[0];
      spySections.forEach(function (s) { if (s.sec.offsetTop <= pos) current = s; });
      spySections.forEach(function (s) { s.link.classList.toggle("active", s === current); });
    }

    /* ---------- smooth in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      a.addEventListener("click", function (e) {
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ===== helpers ===== */

  function startPulse(trace, pulse) {
    var len = trace.getTotalLength();
    var DUR = 3400;   // ms for a full pass
    var GAP = 700;    // pause at the end
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var cycle = DUR + GAP;
      var m = elapsed % cycle;
      if (m <= DUR) {
        var k = m / DUR;
        var eased = 0.5 - 0.5 * Math.cos(k * Math.PI); // ease in-out
        var pt = trace.getPointAtLength(eased * len);
        pulse.setAttribute("cx", pt.x);
        pulse.setAttribute("cy", pt.y);
        pulse.style.opacity = "1";
      } else {
        pulse.style.opacity = "0";
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function typeLoop(el, words) {
    var wi = 0, ci = 0, deleting = false;
    el.textContent = "";
    function tick() {
      var word = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci >= word.length) { deleting = true; return setTimeout(tick, 1500); }
        return setTimeout(tick, 70 + Math.random() * 50);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 380); }
        return setTimeout(tick, 34);
      }
    }
    setTimeout(tick, 900);
  }
})();