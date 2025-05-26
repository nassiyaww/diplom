import { Container, Graphics, Text } from 'pixi.js';

export class StatsPanel {
    public view: Container;
    private load: number = 0;
    private text: Text;

    constructor() {
        this.view = new Container();

        const bg = new Graphics();
        bg.beginFill(0x333333, 0.8)
          .drawRoundedRect(0, 0, 160, 50, 10)
          .endFill();
        this.view.addChild(bg);

        this.text = new Text('', { fill: 'white', fontSize: 16 });
        this.text.x = 10;
        this.text.y = 15;
        this.view.addChild(this.text);

        this.view.x = 10;
        this.view.y = 10;

        this.simulateLoad();
    }

    public getLoad() {
        return this.load;
    }

    private simulateLoad() {
        setInterval(() => {
            this.load = Math.random();
            this.text.text = `Загруженность: ${(this.load * 100).toFixed(0)}%`;
        }, 2000);
    }
}
