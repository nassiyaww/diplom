import { Container, Graphics, Text } from 'pixi.js';

const COLORS = [
    0xf87171, 0xfbbf24, 0x34d399, 0x60a5fa, 0xa78bfa,
    0xf472b6, 0xfacc15, 0x818cf8, 0x4ade80, 0xf97316
];

export class Station {
    public view: Container;
    public x: number;
    public y: number;
    public name: string;
    public waiting: number;
    public departed: number;
    private tooltip: Container;
    private label: Text;

    constructor(x: number, y: number, name: string, colorIndex: number = 0) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.waiting = Math.floor(Math.random() * 14) + 6;  // симуляция
        this.departed = 0;
        this.view = new Container();

        // Круглая станция
        const color = COLORS[colorIndex % COLORS.length];
        const g = new Graphics();
        g.lineStyle(6, 0xffffff, 0.9);
        g.beginFill(color, 0.93);
        g.drawCircle(0, 0, 28);
        g.endFill();
        this.view.addChild(g);

        // Подпись к станции
        this.label = new Text(name, {
            fill: '#222', fontSize: 22, fontWeight: 'bold',
        });
        this.label.x = 38;
        this.label.y = -14;
        this.view.addChild(this.label);

        // Tooltip-плашка
        this.tooltip = new Container();
        const bg = new Graphics().beginFill(0x222, 0.93).drawRoundedRect(0, 0, 180, 54, 12).endFill();
        this.tooltip.addChild(bg);
        const tooltipText = new Text('', { fill: '#fff', fontSize: 16 });
        tooltipText.x = 10; tooltipText.y = 10;
        this.tooltip.addChild(tooltipText);

        this.tooltip.x = 0;
        this.tooltip.y = -70;
        this.tooltip.visible = false;
        this.view.addChild(this.tooltip);

        // Интерактивность
        this.view.eventMode = 'static';
        this.view.cursor = 'pointer';

        this.view.on('pointerover', () => {
            tooltipText.text = `Ожидают: ${this.waiting}\nСело: ${this.departed}`;
            this.tooltip.visible = true;
        });
        this.view.on('pointerout', () => {
            this.tooltip.visible = false;
        });

        this.view.x = x;
        this.view.y = y;
    }

    public updateTooltip() {
        // Если тултип есть, обновить его текст
        if (this.tooltip && this.tooltip.children[1] instanceof Text) {
            (this.tooltip.children[1] as Text).text = `Ожидают: ${this.waiting}\nСело: ${this.departed}`;
        }
    }

    public getPosition() {
        return { x: this.x, y: this.y };
    }
}
