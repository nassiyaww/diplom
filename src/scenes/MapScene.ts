import { Container, Sprite, Assets } from 'pixi.js';
import { Route } from '../components/Route';
import { Bus } from '../components/Bus';
import { Station } from '../components/Station';
import { Dashboard } from '../components/Dashboard';

const STATIONS = [
    { name: 'Станционная', x: 275, y: 120 },
    { name: 'Западная Площадка', x: 240, y: 200 },
    { name: 'Троллейная', x: 380, y: 280 },
    { name: 'Титова', x: 600, y: 610 },
    { name: 'Ленинская', x: 490, y: 740 },
    { name: 'Гусинобродское ш.', x: 1510, y: 240 },
    { name: 'Студенческая', x: 1220, y: 250 },
    { name: 'Рынок', x: 1100, y: 540 },
    { name: 'Площадь Маркса', x: 920, y: 620 },
    { name: 'ГАИ', x: 1420, y: 700 },
    { name: 'ОбьГЭС', x: 320, y: 390 },
    { name: 'Северная', x: 800, y: 160 },
    { name: 'Южная', x: 500, y: 950 },
    { name: 'Восточная', x: 1700, y: 400 },
    { name: 'Центральная', x: 900, y: 500 },
    { name: 'Речной вокзал', x: 1600, y: 100 }
];


export class MapScene {
    private container: Container;
    private mapSprite!: Sprite;
    private stations: Station[] = [];
    private routes: Route[] = [];
    private buses: Bus[] = [];
    private dashboard: Dashboard;

    constructor(container: Container) {
        this.container = container;
        this.dashboard = new Dashboard();
    }

    public async init() {
        await Assets.load({ alias: 'map', src: 'map.png' });
        const mapTexture = Assets.get('map');
        this.mapSprite = new Sprite(mapTexture);
        this.mapSprite.width = 1920;
        this.mapSprite.height = 1080;
        this.container.addChild(this.mapSprite);

        this.stations = STATIONS.map((s, i) => new Station(s.x, s.y, s.name, i));
        // маршруты
        const route1 = new Route([this.stations[0], this.stations[1], this.stations[2], this.stations[3], this.stations[4], this.stations[12]]);
        const route2 = new Route([this.stations[6], this.stations[5], this.stations[7], this.stations[8], this.stations[9]]);
        const route3 = new Route([this.stations[2], this.stations[14], this.stations[10], this.stations[1]]);
        const route4 = new Route([this.stations[13], this.stations[5], this.stations[11], this.stations[12]]);
        const route5 = new Route([this.stations[15], this.stations[13], this.stations[9], this.stations[8], this.stations[14]]);

        this.routes = [route1, route2, route3, route4, route5];
        this.routes.forEach(r => this.container.addChild(r.view));
        this.stations.forEach(st => this.container.addChild(st.view));

        // автобусы

        for (const route of this.routes) {
            // Добавим по 2–3 автобуса на каждый маршрут
            const count = Math.floor(Math.random() * 2) + 2; // 2 или 3 автобуса
            for (let i = 0; i < count; i++) {
                const bus = new Bus(route);
                await bus.start();
                // Каждый стартует с разной станции (смещение сегмента)
                bus.currentSegment = Math.floor(route.stations.length * i / count);
                this.buses.push(bus);
                this.container.addChild(bus.view);
            }
        }

        this.container.addChild(this.dashboard.view);

        // Апдейт дашборда раз в 0.8 сек.
        setInterval(() => {
            this.dashboard.update({
                waiting: this.stations.reduce((sum, s) => sum + s.waiting, 0),
                onBoard: this.buses.reduce((sum, b) => sum + b.passengers, 0),
                buses: this.buses.length
            });
        }, 800);
    }
}
