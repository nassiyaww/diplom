import { Graphics, Container } from 'pixi.js';
import { Station } from './Station';

export class Route {
    public view: Container;
    public path: { x: number, y: number }[];
    public stations: Station[]; // <-- добавляем это поле

    constructor(stations: Station[]) {
        this.view = new Container();
        this.stations = stations; // <-- сохраняем массив станций
        this.path = stations.map(st => st.getPosition());
        this.drawPath();
    }

    private drawPath() {
        if (this.path.length < 2) return;
        const g = new Graphics();
        // Белая обводка
        g.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) g.lineTo(this.path[i].x, this.path[i].y);
        g.stroke({ color: 0xffffff, width: 22, alpha: 0.97});
        // Красная линия
        g.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) g.lineTo(this.path[i].x, this.path[i].y);
        g.stroke({ color: 0xffa500, width: 12, alpha: 0.97 });
        this.view.addChild(g);
    }
}
