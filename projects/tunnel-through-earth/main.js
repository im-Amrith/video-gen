const cv = document.getElementById('c'), g = cv.getContext('2d');
for (const w of [400, 500, 600, 700]) await document.fonts.load(`${w} 40px Jost`);
const TL = await (await fetch('timeline.json')).json();
const film = await import('./film.js');
film.init(TL);
window.DUR = TL.DUR; window.EV = film.events();
window.TEXTS = t => film.texts(t);
window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); film.render(g, t); };
window.READY = true;
