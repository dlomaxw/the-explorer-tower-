/* brand-motion-pro: original 24x24 stroke icon set (no third-party artwork). Each icon is a list of SVG path/shape
   strings drawn on a 24 grid with round caps. Use MK.icon(name, {size, stroke, color}) to get an <svg> string; every
   child carries class "mk-i" so MK.drawIcon() can draw them on. */
(function (w) {
  var I = {
    phone:    ['<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'],
    mail:     ['<rect x="3" y="5" width="18" height="14" rx="2"/>', '<path d="M3 7l9 6 9-6"/>'],
    pin:      ['<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/>', '<circle cx="12" cy="9.5" r="2.5"/>'],
    clock:    ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 7v5l3.5 2"/>'],
    check:    ['<circle cx="12" cy="12" r="9"/>', '<path d="M7.5 12.5l3 3 6-6.5"/>'],
    shield:   ['<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z"/>', '<path d="M8.5 12l2.5 2.5 4.5-5"/>'],
    star:     ['<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8L12 3.5z"/>'],
    arrow:    ['<path d="M4 12h15"/>', '<path d="M13 6l6 6-6 6"/>'],
    play:     ['<circle cx="12" cy="12" r="9"/>', '<path d="M10 8.5l6 3.5-6 3.5v-7z"/>'],
    home:     ['<path d="M3.5 11L12 4l8.5 7"/>', '<path d="M5.5 10v9.5h13V10"/>', '<path d="M10 19.5v-5h4v5"/>'],
    building: ['<rect x="5" y="3" width="14" height="18" rx="1.5"/>', '<path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M9 15.5h2M13 15.5h2"/>'],
    key:      ['<circle cx="8" cy="14" r="4"/>', '<path d="M11 11.5L20 3M16.5 6.5l2.5 2.5M14 9l2 2"/>'],
    bolt:     ['<path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z"/>'],
    chart:    ['<path d="M4 20V5"/>', '<path d="M4 20h16"/>', '<path d="M8 16l4-5 3 3 5-7"/>'],
    bars:     ['<path d="M5 20V12M10 20V6M15 20V10M20 20V3"/>'],
    user:     ['<circle cx="12" cy="8" r="4"/>', '<path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>'],
    users:    ['<circle cx="9" cy="8.5" r="3.5"/>', '<path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/>', '<path d="M16 5.3a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.7.7 2.8 2.3 3.2 4.7"/>'],
    gear:     ['<circle cx="12" cy="12" r="3"/>', '<path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'],
    search:   ['<circle cx="10.5" cy="10.5" r="6.5"/>', '<path d="M15.5 15.5L21 21"/>'],
    globe:    ['<circle cx="12" cy="12" r="9"/>', '<path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'],
    calendar: ['<rect x="3.5" y="5" width="17" height="15.5" rx="2"/>', '<path d="M3.5 10h17M8 3v4M16 3v4"/>'],
    tool:     ['<path d="M14.5 6.5a4 4 0 0 0 5 5L9 22l-3-3L16.5 8.5"/>', '<path d="M14.5 6.5l2.5-2.5 3 3-2.5 2.5"/>'],
    truck:    ['<path d="M2.5 6.5h11V17h-11z"/>', '<path d="M13.5 10h4l3 3v4h-7"/>', '<circle cx="7" cy="18" r="2"/>', '<circle cx="17" cy="18" r="2"/>'],
    lock:     ['<rect x="5" y="10.5" width="14" height="10" rx="2"/>', '<path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'],
    heart:    ['<path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.5 2.4C20.5 15 12 20.5 12 20.5z"/>'],
    layers:   ['<path d="M12 3.5l9 5-9 5-9-5 9-5z"/>', '<path d="M3 13l9 5 9-5"/>'],
    cube:     ['<path d="M12 3l8.5 4.5v9L12 21l-8.5-4.5v-9L12 3z"/>', '<path d="M3.8 7.6L12 12l8.2-4.4M12 12v9"/>'],
    spark:    ['<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>', '<path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>'],
    send:     ['<path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z"/>', '<path d="M10 13l11-10"/>'],
    download: ['<path d="M12 3.5v12M7 11l5 5 5-5"/>', '<path d="M4 20h16"/>'],
    bell:     ['<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17z"/>', '<path d="M10 21a2 2 0 0 0 4 0"/>'],
    card:     ['<rect x="3" y="5.5" width="18" height="13" rx="2"/>', '<path d="M3 10h18M7 15h4"/>']
  };
  w.MK_ICONS = I;
})(window);
