/* THE DAMN PSYCHIATRIC — interacciones */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- nav ---- */
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector(".menu-btn");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("open"); });
  });

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- lightbox galería ---- */
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lb = document.querySelector(".lightbox");
  var lbImg = lb.querySelector("img");
  var current = 0;
  function showLb(i) {
    current = (i + shots.length) % shots.length;
    lbImg.src = shots[current].dataset.src;
    lbImg.alt = shots[current].querySelector("img").alt;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function hideLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
    shots[current].focus();
  }
  shots.forEach(function (b, i) { b.addEventListener("click", function () { showLb(i); }); });
  lb.querySelector(".lb-close").addEventListener("click", hideLb);
  lb.querySelector(".lb-prev").addEventListener("click", function () { showLb(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { showLb(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) hideLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") hideLb();
    if (e.key === "ArrowLeft") showLb(current - 1);
    if (e.key === "ArrowRight") showLb(current + 1);
  });

  /* ---- vídeo: fachada → reproductor con barra de controles ---- */
  function init(){ var root=document;
  document.querySelectorAll(".video-facade").forEach(function (f) {
    f.addEventListener("click", function (e) {
      e.preventDefault();
      var yt = f.getAttribute("data-yt");
      if (!yt) return;
      var box = document.createElement("div"); box.className = "player-box";
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0&playsinline=1";
      frame.title = "THE DAMN PSYCHIATRIC — tráiler oficial (YouTube)";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.setAttribute("allowfullscreen", "");
      var bar = document.createElement("div"); bar.className = "ytbar";
      var fs = document.createElement("button"); fs.type = "button"; fs.className = "ytbar-btn"; fs.textContent = "Pantalla completa";
      function isFs(){ return document.fullscreenElement === box || document.webkitFullscreenElement === box; }
      function sync(){ fs.textContent = isFs() ? "Salir de pantalla completa ×" : "Pantalla completa"; }
      function toggleFs(){
        if (isFs()) { if (document.exitFullscreen) document.exitFullscreen().catch(function(){}); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); }
        else if (box.requestFullscreen) box.requestFullscreen().catch(function(){});
        else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
        else window.open("https://www.youtube.com/watch?v=" + yt, "_blank");
      }
      fs.addEventListener("click", toggleFs);
      document.addEventListener("fullscreenchange", sync);
      document.addEventListener("webkitfullscreenchange", sync);
      var link = document.createElement("a"); link.className = "ytbar-btn"; link.target = "_blank"; link.rel = "noopener noreferrer";
      link.href = "https://www.youtube.com/watch?v=" + yt; link.textContent = "Ver en YouTube ↗";
      var hint = document.createElement("span"); hint.className = "ytbar-hint"; hint.textContent = "Gira el teléfono o usa pantalla completa para manejar mejor el tiempo";
      bar.appendChild(fs); bar.appendChild(link); bar.appendChild(hint);
      box.appendChild(frame); box.appendChild(bar);
      f.replaceWith(box);
    });
  });
  }
  root&&init();

  /* ---- PRUEBA DE AUDIO: "el enemigo te escucha" ---- */
  var widget = document.querySelector("[data-mic]");
  if (widget) {
    var btn = widget.querySelector(".btn-mic");
    var meter = widget.querySelector(".mic-meter");
    var bars = meter.querySelectorAll("i");
    var status = widget.querySelector(".mic-status");
    var stream = null, actx = null, raf = null, listening = false;
    var LEVELS = [0.02, 0.045, 0.03, 0.06, 0.04, 0.09, 0.05, 0.12, 0.06, 0.04, 0.08, 0.03];
    var idleTimer = null;

    function setStatus(t, alarm) {
      status.textContent = t;
      status.classList.toggle("alarm", !!alarm);
    }
    function stop() {
      listening = false;
      cancelAnimationFrame(raf);
      if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
      if (actx) { actx.close(); actx = null; }
      meter.hidden = true;
      btn.textContent = "Iniciar prueba de audio";
    }
    function caught() {
      if (document.querySelector(".caught-flash")) return;
      setStatus("SILENCIO. ÉL TAMBIÉN TE HA OÍDO.", true);
      document.body.classList.add("caught");
      var flash = document.createElement("div");
      flash.className = "caught-flash";
      flash.innerHTML = "TE&nbsp;HA&nbsp;ENCONTRADO<small>en el juego, así funciona. guarda silencio.</small>";
      document.body.appendChild(flash);
      setTimeout(function () {
        flash.remove();
        document.body.classList.remove("caught");
      }, reduce ? 900 : 1800);
    }

    btn.addEventListener("click", function () {
      if (listening) { stop(); setStatus("Prueba detenida. El pabellón vuelve a estar en calma."); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("Tu navegador no permite acceder al micrófono. Imagina el silencio.");
        idleDemo();
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        stream = s;
        actx = new (window.AudioContext || window.webkitAudioContext)();
        var src = actx.createMediaStreamSource(s);
        var analyser = actx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        var data = new Uint8Array(analyser.fftSize);
        listening = true;
        meter.hidden = false;
        btn.textContent = "Detener prueba";
        setStatus("Escuchando… no hagas ruido.");
        (function tick() {
          if (!listening) return;
          analyser.getByteTimeDomainData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) { var v = (data[i] - 128) / 128; sum += v * v; }
          var rms = Math.sqrt(sum / data.length);
          bars.forEach(function (b) {
            var jitter = 0.75 + Math.random() * 0.5;
            b.style.height = Math.max(6, Math.min(100, rms * 420 * jitter)) + "%";
          });
          if (rms > 0.11) caught();
          else if (rms > 0.055) setStatus("Te oigo… baja la voz.", true);
          raf = requestAnimationFrame(tick);
        })();
      }).catch(function () {
        setStatus("Sin micrófono no hay sustos. Prueba una versión simulada:");
        idleDemo();
      });
    });

    function idleDemo() {
      meter.hidden = false;
      btn.textContent = "Detener simulación";
      listening = true;
      var t = 0;
      (function tick() {
        if (!listening) return;
        t += 0.03;
        var wave = Math.abs(Math.sin(t * 2.1) * 0.5 + Math.sin(t * 7.3) * 0.2) * (Math.sin(t / 4) > 0.2 ? 1 : 0.35);
        bars.forEach(function (b, i) {
          var h = Math.max(6, Math.min(100, (wave * 90 + Math.random() * 14) * (1 - Math.abs(i - 6) / 12)));
          b.style.height = h + "%";
        });
        setStatus(wave > 0.42 ? "Te oigo… baja la voz." : "Simulación: qué se siente cuando te escuchan.", wave > 0.42);
        raf = requestAnimationFrame(tick);
      })();
    }
  }
})();
