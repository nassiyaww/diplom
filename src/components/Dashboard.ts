import { Container, Graphics, Text } from 'pixi.js';

export class Dashboard {
  public view: Container;
  private text: Text;

  constructor() {
    this.view = new Container();

    const bg = new Graphics();
    bg.beginFill(0x18181b, 0.93)
      .drawRoundedRect(0, 0, 350, 110, 16)
      .endFill();
    this.view.addChild(bg);

    this.text = new Text('', { fill: '#fff', fontSize: 18 });
    this.text.x = 16;
    this.text.y = 18;
    this.view.addChild(this.text);

    this.view.x = 50;
    this.view.y = 30;
  }

  public update(stats: { waiting: number, onBoard: number, buses: number }) {
    this.text.text = `Ожидает на остановках: ${stats.waiting}\n` +
      `Пассажиров в автобусах: ${stats.onBoard}\n` +
      `Автобусов: ${stats.buses}`;
  }
}
