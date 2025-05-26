import { Assets, Sprite, Ticker, Text, Container } from 'pixi.js';
import { Route } from './Route';
import { Station } from './Station';

export class Bus {
    public view: Container = new Container();
    private sprite: Sprite | null = null;
    private passengerLabel: Text;
    private tooltip: Container;
    private tooltipText: Text;
    private capacity: number = 24;
    public passengers: number = Math.floor(Math.random() * 24);
    private route: Route;
    private progress: number = 0;
    private direction: number = 1;
    private speed: number = 0.18;
    private running: boolean = false;
    public currentSegment: number = 0;
    private isPaused: boolean = false;
    private ticker: Ticker | null = null;
    private baseScale: number = 1;

    constructor(route: Route) {
        this.route = route;
        this.passengerLabel = new Text('', {
            fill: '#fff', fontSize: 18, fontWeight: 'bold',
            stroke: '#222'
        });
        this.passengerLabel.anchor.set(0.5, 1.1);
        this.view.addChild(this.passengerLabel);

        // Tooltip для подробной статистики автобуса (пассажиры, заполненность)
        this.tooltip = new Container();
        const bg = new Sprite(); // Можно использовать Graphics, но Sprite проще для подложки
        this.tooltipText = new Text('', { fill: '#fff', fontSize: 16 });
        this.tooltip.addChild(this.tooltipText);
        this.tooltip.visible = false;
        this.tooltip.y = -70;
        this.tooltip.x = 0;
        this.view.addChild(this.tooltip);

        // Интерактивность для hover тултипа
        this.view.eventMode = 'static';
        this.view.cursor = 'pointer';
        this.view.on('pointerover', () => {
            this.updateTooltip();
            this.tooltip.visible = true;
        });
        this.view.on('pointerout', () => {
            this.tooltip.visible = false;
        });
    }

    public async start() {
        if (!this.sprite) {
            const texture = await Assets.load('bus.png');
            this.sprite = new Sprite(texture);
            this.sprite.anchor.set(0.5, 0.5);
            this.baseScale = 100 / texture.width;
            this.sprite.scale.set(this.baseScale, this.baseScale);
            this.view.addChild(this.sprite);
        }
        this.updatePassengersLabel();

        this.running = true;
        this.progress = 0;
        this.direction = 1;
        this.currentSegment = 0;

        this.ticker = new Ticker();
        this.ticker.add(this.moveStep);
        this.ticker.start();
    }

    private moveStep = (ticker: Ticker) => {
        if (!this.running || !this.sprite || this.isPaused) return;

        const path = this.route.path;
        if (path.length < 2) return;

        let from = path[this.currentSegment];
        let to = path[this.currentSegment + this.direction];

        this.sprite.scale.x = this.baseScale * (to.x > from.x ? -1 : 1);

        this.progress += (this.speed / 60) * ticker.deltaTime;
        if (this.progress > 1) this.progress = 1;

        const x = from.x + (to.x - from.x) * this.progress;
        const y = from.y + (to.y - from.y) * this.progress;
        this.view.x = x;
        this.view.y = y;

        if (this.progress >= 1) {
            this.isPaused = true;

            // === НАЙДИ СТАНЦИЮ (через route) ===
            const stations: Station[] = this.route.stations as Station[];
            const currentStation = stations[this.currentSegment + this.direction];

            if (currentStation) {
                // === Симуляция посадки/высадки ===
                const maxToBoard = Math.min(currentStation.waiting, this.capacity - this.passengers);
                const toBoard = Math.floor(Math.random() * (maxToBoard + 1)); // сколько зайдет
                currentStation.waiting -= toBoard;
                currentStation.departed += toBoard;
                this.passengers += toBoard;

                // Высадка на станции (не обязательно, но можно)
                // const toLeave = Math.floor(Math.random() * (this.passengers + 1));
                // this.passengers -= toLeave;

                this.updatePassengersLabel();
                this.updateTooltip();

                // Не забудь обновить тултип и станции!
                if (typeof currentStation.updateTooltip === 'function') {
                    currentStation.updateTooltip();
                }
            }

            setTimeout(() => {
                this.isPaused = false;
                this.currentSegment += this.direction;
                if (this.currentSegment >= path.length - 1 || this.currentSegment <= 0) {
                    this.direction *= -1;
                }
                this.progress = 0;
            }, 1200);
        }
    }

    private updatePassengersLabel() {
        this.passengerLabel.text = `${this.passengers}/${this.capacity}`;
        this.passengerLabel.style.fill = (this.passengers === this.capacity) ? '#f43f5e' : '#094ed0';
    }

    private updateTooltip() {
        this.tooltipText.style.fill = (this.passengers === this.capacity) ? '#f43f5e' : '#094ed0';
        this.tooltipText.text =
          `Пассажиров: ${this.passengers}/${this.capacity}\n` +
          `Заполненность: ${(this.passengers / this.capacity * 100).toFixed(0)}%`;
    }

    public stop() {
        this.running = false;
        this.ticker?.stop();
        this.ticker?.destroy();
        this.ticker = null;
    }
}
