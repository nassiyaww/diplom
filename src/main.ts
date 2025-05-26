// src/main.ts
import { Application } from 'pixi.js';
import { MapScene } from './scenes/MapScene';

const app = new Application();
await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    backgroundColor: 0x010101
});

document.body.appendChild(app.canvas);

const mapScene = new MapScene(app.stage);
mapScene.init();
fitToWindow(app);

function fitToWindow(app: Application) {
    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const logicalW = 1920;
        const logicalH = 1080;
        const scale = Math.min(w / logicalW, h / logicalH);

        app.renderer.resize(w, h);
        app.stage.scale.set(scale);
        app.stage.position.set(
          (w - logicalW * scale) / 2,
          (h - logicalH * scale) / 2
        );

        app.canvas.style.width = `${w}px`;
        app.canvas.style.height = `${h}px`;
    }
    window.addEventListener('resize', resize);
    resize();
}
