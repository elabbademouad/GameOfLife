import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { zoomEnum } from '../model/zoom-enum';
import { GameEngineService } from '../services/game-engine.service';
import { gameStateEnum } from '../model/game-state-enum';
import { Constants } from '../constants/constants';
import { point } from '../model/point-model';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  private _touchStartPoint: point = null;
  private _touchEndPoint: point = null;
  public state: gameStateEnum = gameStateEnum.stoped;
  public generation: number = 0;

  @ViewChild('grid', { static: true })
  grid: ElementRef;

  @ViewChild('scene', { static: true })
  scene: ElementRef;

  constructor(public _canvasService: CanvasService,
    public _gameEngineService: GameEngineService) {
    this._gameEngineService.getCurrentState()
      .subscribe((state: gameStateEnum) => {
        this.state = state;
      });
    this._gameEngineService.getGenerationNumber()
      .subscribe(generation => {
        this.generation = generation;
      });

  }

  zoomClick(e: zoomEnum) {
    this._canvasService.zoom(e);
  }

  touchstart(event: any) {
    let x = event.touches[0].clientX;
    let y = event.touches[0].clientY;
    this._touchStartPoint = this._touchStartPoint = this._canvasService.getPointFromPixel(x, y);
  }
  touchend(event: any) {
    let x = event.changedTouches[0].clientX;
    let y = event.changedTouches[0].clientY;

    this._touchEndPoint = this._canvasService.getPointFromPixel(x, y);
    this._gameEngineService.moveScene(this._touchStartPoint, this._touchEndPoint);
  }

  ngOnInit() {
    this._canvasService.setupCanvas(this.grid, this.scene);
    this._gameEngineService.stop();
  }

  public breakClick() {
    this._gameEngineService.break();
  }

  public stopClick() {
    this._gameEngineService.stop();
  }

  public runClick() {
    this._gameEngineService.run();
  }

  public sceneClick(e: any) {
    let point = this._canvasService.getPointFromPixel(e.layerX, e.layerY);
    this._gameEngineService.addPoint(point);
  }

  public changeSpeed(event: any) {
    let value = event.detail.value;
    this._gameEngineService.changeSpeed(Constants.MAX_SPEED - value);
  }
}
