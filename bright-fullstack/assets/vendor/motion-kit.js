/* brand-motion-pro motion kit  (window.MK)
 * Seek-safe GSAP helpers for HyperFrames compositions: every function ADDS tweens to a paused timeline `tl` at a
 * time `at` (seconds, composition-local) and never loops forever, never uses Math.random or Date.
 * Load order in index.html: gsap, then icons.js, then motion-kit.js (all from assets/vendor, never a CDN).
 * NEVER write a script tag (open or close) inside a comment or string of an inlined script: the bundler parses the text.
 *
 * NEVER use the dollar sign in a composition script (no dollar-dollar, dollar-quote, dollar-ampersand, dollar-digit): the bundler inlines
 * scripts with String.replace, which mangles those sequences (it broke an early version with a baffling "r.pause is not a function").
 * Use qs()/qsa() instead of a dollar helper.
 * Rules baked in: every element that is not visible at t=0 is hidden by gsap.set (MK.hide) or opacity:0 in CSS, never tl.set at 0;
 * every fromTo whose element starts hidden ends with an explicit opacity:1 (cold render workers restore the authored state);
 * every fromTo that starts after t=0 carries immediateRender:false; only transforms/opacity/filter are tweened;
 * blur is capped (MK.MAX_BLUR) so no layer is blurred beyond what the renderer can take.
 */
(function (w) {
  "use strict";
  var MK = { FPS: 30, MAX_BLUR: 18 };
  var FE = 1 / MK.FPS;
  MK.FE = FE;

  // house eases: expo.out for gestures, power3.out for settles, power2.in for exits, linear for drifts
  MK.ease = { out: "expo.out", soft: "power3.out", exit: "power2.in", io: "power2.inOut", lin: "none", snap: "power4.out" };

  function qs(s, root) { return typeof s === "string" ? (root || document).querySelector(s) : s; }
  function qsa(s, root) { return typeof s === "string" ? Array.prototype.slice.call((root || document).querySelectorAll(s)) : [].concat(s); }
  MK.qs = qs; MK.qsa = qsa;
  function num(v, d) { return v === undefined ? d : v; }
  function blurPx(b) { return "blur(" + Math.min(MK.MAX_BLUR, b) + "px)"; }

  /* ---------- state helpers ---------- */
  // hide elements until their reveal (call once per element group, at time 0)
  MK.hide = function (sel) { gsap.set(sel, { opacity: 0 }); }; // NOT tl.set at 0: frame 0 would show the element
  // set a state at time `at` (default 0)
  MK.set = function (sel, vars) { gsap.set(sel, vars); }; // initial state, applied at load

  /* ---------- reveals ---------- */
  // MK.reveal(tl, ".card", 0.4, {dir:"up", dist:60, blur:12, scale:.96, dur:.6, ease:"expo.out", stagger:.08})
  MK.reveal = function (tl, sel, at, o) {
    o = o || {};
    var dist = num(o.dist, 60), d = o.dir || "up", from = { opacity: 0, filter: blurPx(num(o.blur, 12)) };
    if (d === "up") from.y = dist; else if (d === "down") from.y = -dist;
    else if (d === "left") from.x = dist; else if (d === "right") from.x = -dist;
    if (o.scale !== undefined) from.scale = o.scale;
    if (o.rotate !== undefined) from.rotation = o.rotate;
    var to = { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, filter: "blur(0px)", duration: num(o.dur, 0.6),
      ease: o.ease || MK.ease.out, immediateRender: false };
    if (o.stagger) to.stagger = o.stagger;
    if (d === "scale" || d === "none") { delete from.y; delete from.x; }
    tl.fromTo(sel, from, to, at);
  };
  // exit: faster than the entry
  MK.exit = function (tl, sel, at, o) {
    o = o || {};
    var to = { opacity: 0, filter: blurPx(num(o.blur, 8)), duration: num(o.dur, 0.25), ease: o.ease || MK.ease.exit };
    if (o.y !== undefined) to.y = o.y; if (o.x !== undefined) to.x = o.x; if (o.scale !== undefined) to.scale = o.scale;
    if (o.stagger) to.stagger = o.stagger;
    tl.to(sel, to, at);
  };
  // photo / screenshot arrival: x1.15 and blurred, settles sharp
  MK.photo = function (tl, sel, at, o) {
    o = o || {};
    tl.fromTo(sel, { scale: num(o.from, 1.15), filter: blurPx(num(o.blur, 14)), opacity: 0 },
      { scale: 1, filter: "blur(0px)", opacity: 1, duration: num(o.dur, 0.5), ease: MK.ease.out, immediateRender: false }, at);
  };

  /* ---------- SVG draw-on (strokes, icons, frames, charts) ---------- */
  // prepares paths so that they can be drawn: pathLength=1, dash 1, hidden. Call at build time.
  MK.prep = function (sel) {
    qsa(sel).forEach(function (el) {
      var shapes = el.matches && el.matches("path,line,circle,rect,polyline,polygon,ellipse") ? [el] :
        Array.prototype.slice.call(el.querySelectorAll("path,line,circle,rect,polyline,polygon,ellipse"));
      shapes.forEach(function (s) {
        s.setAttribute("pathLength", "1");
        s.style.strokeDasharray = "1";
        s.style.strokeDashoffset = "1";
        s.style.opacity = "0";
      });
    });
  };
  // MK.draw(tl, "#logo path", 0.2, {dur:.8, ease:"power2.inOut", stagger:.08})
  MK.draw = function (tl, sel, at, o) {
    o = o || {};
    MK.prep(sel);
    var targets = [];
    qsa(sel).forEach(function (el) {
      if (el.matches && el.matches("path,line,circle,rect,polyline,polygon,ellipse")) targets.push(el);
      else targets = targets.concat(Array.prototype.slice.call(el.querySelectorAll("path,line,circle,rect,polyline,polygon,ellipse")));
    });
    tl.set(targets, { opacity: 1 }, at);
    var to = { strokeDashoffset: 0, duration: num(o.dur, 0.7), ease: o.ease || MK.ease.io, immediateRender: false };
    if (o.stagger) to.stagger = o.stagger;
    tl.fromTo(targets, { strokeDashoffset: 1 }, to, at);
    return targets;
  };
  // fill a drawn shape after its stroke (logo marks, check marks)
  MK.fillIn = function (tl, sel, at, color, dur) {
    tl.to(sel, { fill: color, duration: num(dur, 0.3), ease: "power2.out" }, at);
  };

  /* ---------- icons ---------- */
  // returns an <svg> string; children carry .mk-i for drawing
  MK.icon = function (name, o) {
    o = o || {};
    var paths = (w.MK_ICONS || {})[name];
    if (!paths) throw new Error("MK.icon: unknown icon " + name);
    var s = num(o.size, 48), sw = num(o.stroke, 1.8), c = o.color || "currentColor";
    return '<svg class="mk-icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c +
      '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + paths.join("") + "</svg>";
  };
  // inject an icon into an element
  MK.putIcon = function (target, name, o) { qs(target).innerHTML = MK.icon(name, o); };
  // draw an icon on (stroke), then optionally pop the tile it sits in
  MK.drawIcon = function (tl, sel, at, o) {
    o = o || {};
    var t = MK.draw(tl, sel, at, { dur: num(o.dur, 0.55), ease: MK.ease.io, stagger: num(o.stagger, 0.08) });
    if (o.tile) tl.fromTo(o.tile, { scale: 0.8 }, { scale: 1, duration: 0.45, ease: MK.ease.out, immediateRender: false }, at);
    return t;
  };

  /* ---------- numbers and text ---------- */
  // rolling counter: MK.count(tl, "#n", 0.5, 1.2, 0, 500, {suffix:"+", decimals:0, sep:","})
  MK.count = function (tl, sel, at, dur, from, to, o) {
    o = o || {};
    var el = qs(sel), p = { v: from }, dec = num(o.decimals, 0);
    function fmt(v) {
      var s = v.toFixed(dec);
      if (o.sep) { var parts = s.split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, o.sep); s = parts.join("."); }
      return (o.prefix || "") + s + (o.suffix || "");
    }
    el.textContent = fmt(from);
    tl.fromTo(p, { v: from }, { v: to, duration: dur, ease: o.ease || MK.ease.soft, immediateRender: false,
      onUpdate: function () { el.textContent = fmt(p.v); } }, at);
  };
  // typed text (per letter, steps ease)
  MK.type = function (tl, sel, text, at, perChar) {
    var host = qs(sel); host.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var sp = document.createElement("span"); sp.className = "mk-ch"; sp.style.opacity = "0";
      sp.textContent = text[i] === " " ? " " : text[i]; host.appendChild(sp);
    }
    tl.fromTo(host.querySelectorAll(".mk-ch"), { opacity: 0 },
      { opacity: 1, duration: 0.02, ease: "none", stagger: num(perChar, 0.04), immediateRender: false }, at);
  };
  // headline split into words that rise from a mask: MK.headline(tl, "#h", 0.2, {stagger:.07})
  MK.headline = function (tl, sel, at, o) {
    o = o || {};
    var host = qs(sel), words = host.textContent.trim().split(/\s+/);
    host.textContent = "";
    words.forEach(function (wd, i) {
      var mask = document.createElement("span"); mask.className = "mk-mask";
      var inner = document.createElement("span"); inner.className = "mk-mw"; inner.textContent = wd;
      mask.appendChild(inner); host.appendChild(mask);
      if (i < words.length - 1) host.appendChild(document.createTextNode(" "));
    });
    tl.fromTo(host.querySelectorAll(".mk-mw"), { yPercent: 115, opacity: 0, filter: blurPx(8) },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: num(o.dur, 0.7), ease: MK.ease.out,
        stagger: num(o.stagger, 0.07), immediateRender: false }, at);
  };
  // word-by-word subtitle with ONE yellow/brand key-word box. words = [["Built", 0.2], ["to", 0.4], ["last", 0.6, true]]
  // cues are composition-local seconds; each word appears 0-2 frames BEFORE its spoken time.
  MK.subtitle = function (tl, sel, words, o) {
    o = o || {};
    var host = qs(sel); host.textContent = "";
    var p = document.createElement("p"); p.className = "mk-sub"; host.appendChild(p);
    words.forEach(function (wd, i) {
      var wrap = document.createElement("span"); wrap.className = "mk-wd";
      if (wd[2]) { var k = document.createElement("i"); k.className = "mk-key"; wrap.appendChild(k); wd.k = k; }
      var t = document.createElement("span"); t.className = "mk-w"; t.textContent = wd[0]; wrap.appendChild(t);
      p.appendChild(wrap); if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
      var cue = Math.max(0, wd[1] - FE);
      tl.fromTo(t, { opacity: 0, y: 8, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.14, ease: MK.ease.soft, immediateRender: false }, cue);
      tl.to(t, { color: o.ink || "var(--mk-ink)", duration: 0.2, ease: "none" }, cue + 0.14);
      if (wd[2]) {
        tl.fromTo(wd.k, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.16, ease: "power3.out", immediateRender: false }, Math.max(0, cue - 0.06));
        tl.to(t, { color: "var(--mk-on-accent)", duration: 0.1, ease: "none" }, cue + 0.1);
      }
    });
    if (o.out !== undefined) tl.to(p, { opacity: 0, filter: "blur(6px)", duration: 0.14, ease: "none" }, o.out);
    return p;
  };

  /* ---------- 3D / depth (CSS 3D only: the headless renderer has no WebGL) ---------- */
  // give a parent a perspective so children can rotate in 3D
  MK.stage3d = function (sel, perspective, originX, originY) {
    var el = qs(sel);
    el.style.perspective = num(perspective, 1400) + "px";
    el.style.perspectiveOrigin = (originX || "50%") + " " + (originY || "50%");
    el.style.transformStyle = "preserve-3d";
  };
  // MK.tilt(tl, ".dash", 0.5, 1.2, {rx:-12, ry:18, rz:0, z:0, scale:1.02, from:{rx:0, ry:-30}})
  MK.tilt = function (tl, sel, at, dur, o) {
    o = o || {};
    var f = o.from || {};
    tl.fromTo(sel, { rotationX: num(f.rx, 0), rotationY: num(f.ry, 0), rotationZ: num(f.rz, 0), z: num(f.z, 0),
        scale: num(f.scale, 1), transformPerspective: num(o.persp, 1400) },
      { rotationX: num(o.rx, 0), rotationY: num(o.ry, 0), rotationZ: num(o.rz, 0), z: num(o.z, 0), scale: num(o.scale, 1),
        transformPerspective: num(o.persp, 1400), duration: dur, ease: o.ease || MK.ease.io, immediateRender: false }, at);
  };
  // layered parallax: layers = [{sel:".bg", depth:.2}, {sel:".mid", depth:.6}, {sel:".fg", depth:1}]; depth scales travel
  MK.parallax = function (tl, layers, at, dur, o) {
    o = o || {};
    layers.forEach(function (l) {
      tl.fromTo(l.sel, { x: -num(o.x, 0) * l.depth / 2, y: -num(o.y, 0) * l.depth / 2 },
        { x: num(o.x, 0) * l.depth / 2, y: num(o.y, 0) * l.depth / 2, duration: dur, ease: "none", immediateRender: false }, at);
    });
  };
  // camera move on a wrapper: MK.camera(tl, "#cam", 0, 3, {scale:1.08, x:-40, y:-30, rot:0, blur:0})
  MK.camera = function (tl, sel, at, dur, o) {
    o = o || {};
    var to = { scale: num(o.scale, 1), x: num(o.x, 0), y: num(o.y, 0), rotation: num(o.rot, 0), duration: dur,
      ease: o.ease || MK.ease.lin, immediateRender: false };
    if (o.blur !== undefined) to.filter = blurPx(o.blur);
    tl.to(sel, to, at);
  };
  // floating idle (FINITE yoyo, computed from the duration, never repeat:-1)
  MK.float = function (tl, sel, at, dur, o) {
    o = o || {};
    var period = num(o.period, 1.6), reps = Math.max(1, Math.round(dur / period) * 2 - 1);
    tl.fromTo(sel, { y: 0, rotationZ: 0 }, { y: num(o.y, -14), rotationZ: num(o.rot, 0), duration: period / 2,
      ease: "sine.inOut", yoyo: true, repeat: reps, immediateRender: false }, at);
  };
  // pulsing ring around a point of interest (finite)
  MK.pulse = function (tl, sel, at, o) {
    o = o || {};
    var n = num(o.count, 2), gap = num(o.gap, 0.5);
    for (var i = 0; i < n; i++) {
      tl.fromTo(sel, { scale: 0.6, opacity: 0.7 }, { scale: num(o.scale, 2.2), opacity: 0, duration: num(o.dur, 0.9),
        ease: "power2.out", immediateRender: false }, at + i * gap);
    }
  };
  // light sweep across a surface (a skewed gradient bar inside an overflow:hidden parent)
  MK.sweep = function (tl, sel, at, dur, from, to) {
    tl.fromTo(sel, { x: from, opacity: 1 }, { x: to, opacity: 1, duration: dur, ease: "power2.inOut", immediateRender: false }, at);
    tl.set(sel, { opacity: 0 }, at + dur + 0.01);
  };

  /* ---------- UI components ---------- */
  // bars: grow from the baseline. MK.bars(tl, ".bar", 0.4, {stagger:.07, dur:.7})
  MK.bars = function (tl, sel, at, o) {
    o = o || {};
    tl.fromTo(sel, { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: num(o.dur, 0.7), ease: MK.ease.out,
      stagger: num(o.stagger, 0.07), immediateRender: false }, at);
  };
  // donut / ring gauge: <circle class="ring" r=.. pathLength=1> ; pct 0..1
  MK.ring = function (tl, sel, at, dur, pct) {
    var el = qs(sel); el.setAttribute("pathLength", "1"); el.style.strokeDasharray = "1"; el.style.strokeDashoffset = "1";
    tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 1 - pct, duration: dur, ease: MK.ease.soft, immediateRender: false }, at);
  };
  // progress bar fill (scaleX from the left)
  MK.progress = function (tl, sel, at, dur, pct) {
    tl.fromTo(sel, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: pct, transformOrigin: "0% 50%", duration: dur,
      ease: MK.ease.soft, immediateRender: false }, at);
  };
  // toggle switch: knob travels, track takes the brand colour
  MK.toggle = function (tl, knob, track, at, travel, onColor) {
    tl.to(knob, { x: travel, duration: 0.3, ease: MK.ease.out }, at);
    tl.to(track, { backgroundColor: onColor || "var(--mk-primary)", duration: 0.3, ease: "none" }, at);
  };
  // notification / toast that slides in and out
  MK.toast = function (tl, sel, at, hold) {
    tl.fromTo(sel, { y: -120, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: MK.ease.out, immediateRender: false }, at);
    tl.to(sel, { y: -90, opacity: 0, duration: 0.3, ease: MK.ease.exit }, at + 0.5 + num(hold, 1.6));
  };
  // list rows entering one after another
  MK.rows = function (tl, sel, at, o) {
    o = o || {};
    tl.fromTo(sel, { x: num(o.x, 40), opacity: 0, filter: blurPx(6) }, { x: 0, opacity: 1, filter: "blur(0px)",
      duration: num(o.dur, 0.45), ease: MK.ease.out, stagger: num(o.stagger, 0.09), immediateRender: false }, at);
  };
  // cursor: one curved move (x eases out, y eases in-out so the path arcs), then a click with a ripple.
  // MK.cursor(tl, "#cur", {x:1200,y:800}, {x:960,y:620}, 1.0, 0.5, "#ripple")
  MK.cursor = function (tl, sel, from, to, at, dur, ripple) {
    gsap.set(sel, { x: from.x, y: from.y, opacity: 0, scale: 1 });
    tl.to(sel, { opacity: 1, duration: 0.15, ease: "none" }, at);
    tl.to(sel, { x: to.x, duration: dur, ease: "power3.out" }, at);
    tl.to(sel, { y: to.y, duration: dur, ease: "power2.inOut" }, at);
    var c = at + dur;
    tl.to(sel, { scale: 0.85, duration: 0.06, ease: "none" }, c);
    tl.to(sel, { scale: 1, duration: 0.12, ease: "power2.out" }, c + 0.06);
    if (ripple) tl.fromTo(ripple, { scale: 0.3, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, c);
    return c; // click time
  };
  // button press feedback on click time
  MK.press = function (tl, sel, at) {
    tl.to(sel, { scale: 0.96, duration: 0.07, ease: "none" }, at);
    tl.to(sel, { scale: 1, duration: 0.25, ease: MK.ease.out }, at + 0.07);
  };


  /* ---------- video scenes ---------- */
  // HTML for a muted, frame-accurate <video>. HyperFrames seeks and decodes it; sound ALWAYS goes on a separate <audio>.
  // RULES: put it under the composition root (never under another element that has data-start), give it an id,
  // class="clip", data-start/data-duration (composition-local seconds), data-track-index, muted, playsinline.
  // o = {start, dur, track, mediaStart, x, y, w, h, fit:"cover", radius, z}
  MK.video = function (id, src, o) {
    o = o || {};
    var st = "position:absolute;left:" + num(o.x, 0) + "px;top:" + num(o.y, 0) + "px;width:" + num(o.w, 1920) + "px;height:" + num(o.h, 1080) +
      "px;object-fit:" + (o.fit || "cover") + ";" + (o.radius ? "border-radius:" + o.radius + "px;" : "") + (o.z !== undefined ? "z-index:" + o.z + ";" : "") + "opacity:0;";
    return '<video id="' + id + '" class="clip mk-video" src="' + src + '" data-start="' + num(o.start, 0) + '" data-duration="' + num(o.dur, 4) +
      '" data-track-index="' + num(o.track, 2) + '"' + (o.mediaStart ? ' data-media-start="' + o.mediaStart + '"' : "") +
      ' muted playsinline style="' + st + '"></video>';
  };
  // video enters like a photo (x1.12 + blur, settles) and drifts slowly (Ken Burns) until `until`
  MK.videoIn = function (tl, sel, at, o) {
    o = o || {};
    tl.fromTo(sel, { opacity: 0, scale: num(o.from, 1.12), filter: blurPx(num(o.blur, 14)) },
      { opacity: 1, scale: num(o.to, 1.04), filter: "blur(0px)", duration: num(o.dur, 0.7), ease: MK.ease.out, immediateRender: false }, at);
    if (o.drift) tl.to(sel, { scale: num(o.drift, 1.0), duration: num(o.until, 4) - at - num(o.dur, 0.7), ease: "none" }, at + num(o.dur, 0.7));
  };
  // reveal through a growing window (clip-path inset/circle are safe to tween; polygons are not)
  // MK.window(tl, sel, at, dur, {shape:"inset", from:"inset(0 100% 0 0 round 28px)", to:"inset(0 0% 0 0 round 28px)"})
  MK.window = function (tl, sel, at, dur, o) {
    o = o || {};
    var fromV = o.from || (o.shape === "circle" ? "circle(0% at 50% 50%)" : "inset(0% 100% 0% 0% round 28px)");
    var toV = o.to || (o.shape === "circle" ? "circle(75% at 50% 50%)" : "inset(0% 0% 0% 0% round 28px)");
    tl.fromTo(sel, { clipPath: fromV, opacity: 1 }, { clipPath: toV, opacity: 1, duration: dur, ease: o.ease || MK.ease.io, immediateRender: false }, at);
  };
  // fade a video (or any layer) out before its slot ends so nothing hangs on the last frame
  MK.videoOut = function (tl, sel, at, dur) { tl.to(sel, { opacity: 0, filter: blurPx(10), duration: num(dur, 0.3), ease: MK.ease.exit }, at); };

  /* ---------- builders (HTML strings) ---------- */
  // phone mockup shell; put screen content inside .mk-screen
  MK.phone = function (id, inner) {
    return '<div class="mk-phone" id="' + id + '"><div class="mk-phone-notch"></div><div class="mk-screen">' + (inner || "") + "</div></div>";
  };
  // browser window shell
  MK.browser = function (id, url, inner) {
    return '<div class="mk-browser" id="' + id + '"><div class="mk-bar"><i></i><i></i><i></i><span>' + (url || "") +
      '</span></div><div class="mk-body">' + (inner || "") + "</div></div>";
  };
  // icon tile: rounded square with an icon
  MK.tile = function (id, iconName, label, o) {
    return '<div class="mk-tile" id="' + id + '"><div class="mk-tile-ic">' + MK.icon(iconName, o) + "</div>" + (label ? '<div class="mk-tile-l">' + label + "</div>" : "") + "</div>";
  };

  w.MK = MK;
})(window);
