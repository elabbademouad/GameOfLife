import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { zoomEnum } from '../model/zoom-enum';
import { GameEngineService } from '../services/game-engine.service';
import { gameStateEnum } from '../model/game-state-enum';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

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

  ngOnInit() {
    this._canvasService.setupCanvas(this.grid, this.scene);
    this._gameEngineService.addPoint({ x: 8, y: 7 });
    this._gameEngineService.addPoint({ x: 8, y: 8 });
    this._gameEngineService.addPoint({ x: 8, y: 9 });
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

  public sceneClick(e:any){
    let point= this._canvasService.getPoint(e);
    this._gameEngineService.addPoint(point);
    //this._canvasService.drawGeneration()
  }
}
