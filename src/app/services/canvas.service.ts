import { Injectable, ElementRef } from '@angular/core';
import { zoomEnum } from '../model/zoom-enum'
import { point } from '../model/point-model';
import { Constants } from '../constants/constants';
@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private gridContext: CanvasRenderingContext2D;
  private grid: ElementRef;
  private sceneContext: CanvasRenderingContext2D;
  private scene: ElementRef;


  private _drawingUnit: number;
  constructor() { }
  zoom(e: zoomEnum) {
    if (e === zoomEnum.zoomOut) {
      if (this._drawingUnit > Constants.MIN_DRAWING_UNIT) {
        this._drawingUnit -= 1;
        this.drawGrid();
      }
    } else {
      this._drawingUnit += 1;
      this.drawGrid();
    }
  }
  setupCanvas(grid: ElementRef, scene: ElementRef) {
    this.grid = grid;
    this.grid.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.grid.nativeElement.width = Constants.CANVAS_WIDTH;
    this.gridContext = this.grid.nativeElement.getContext("2d");

    this.scene = scene;
    this.scene.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.scene.nativeElement.width = Constants.CANVAS_WIDTH;
    this.sceneContext = this.scene.nativeElement.getContext("2d");
    this._drawingUnit = Constants.DEFAULT_DRAWING_UNIT;
    this.drawGrid();
  }

  private drawGrid() {
    for (let x = 0; x < Constants.CANVAS_WIDTH; x += this._drawingUnit) {
      for (let y = 0; y < Constants.CANVAS_HEIGHT; y += this._drawingUnit) {
        this.gridContext.fillStyle = Constants.DEFAULT_GRID_FILL_COLOR
        this.gridContext.fillRect(x, y, this._drawingUnit, this._drawingUnit);
        this.gridContext.strokeStyle = Constants.DEFAULT_GRID_STORK_COLOR
        this.gridContext.strokeRect(x, y, this._drawingUnit, this._drawingUnit);
      }
    }
  }
  public getPointFromPixel(xPixel: any,yPixel:any): point {
    let x = (xPixel / this._drawingUnit).toString().split('.')[0];
    let y = (yPixel / this._drawingUnit).toString().split('.')[0];
    let p = new point();
    p.x = Number(x);
    p.y = Number(y);
    return p;
  }
  public drawGeneration(generations: Array<point>) {
    for (let x = 0; x < Constants.CANVAS_WIDTH; x += this._drawingUnit) {
      for (let y = 0; y < Constants.CANVAS_HEIGHT; y += this._drawingUnit) {
        this.sceneContext.clearRect(x, y, this._drawingUnit, this._drawingUnit);
      }
    }
    generations.forEach(p => {
      this.sceneContext.fillStyle = Constants.DEFAULT_SCENE_FILL_COLOR
      this.sceneContext.fillRect(p.x * this._drawingUnit, p.y * this._drawingUnit, this._drawingUnit, this._drawingUnit);
      this.sceneContext.strokeStyle = Constants.DEFAULT_SCENE_STORK_COLOR
      this.sceneContext.strokeRect(p.x * this._drawingUnit, p.y * this._drawingUnit, this._drawingUnit, this._drawingUnit);
    })
  }

}
