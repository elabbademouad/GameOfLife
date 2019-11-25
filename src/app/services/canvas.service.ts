import { Injectable, ElementRef } from '@angular/core';
import { zoomEnum } from '../model/zoom-enum'
import { point } from '../model/point-model';
@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private gridWidth: number;
  private gridHeight: number;

  private sceneWidth: number;
  private sceneHeight: number;

  private gridContext: CanvasRenderingContext2D;
  private grid: ElementRef;
  private sceneContext: CanvasRenderingContext2D;
  private scene: ElementRef;


  private _drawingUnit: number;
  constructor() { }
  zoom(e: zoomEnum) {
    if (e === zoomEnum.zoomOut) {
      if (this._drawingUnit > 2) {
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
    let dpi=window.devicePixelRatio;
    this.gridHeight = this.grid.nativeElement.height=this.grid.nativeElement.height*dpi;
    this.gridWidth = this.grid.nativeElement.width = this.gridHeight;
    this.gridContext = this.grid.nativeElement.getContext("2d");

    this.scene = scene;
    this.sceneHeight = this.scene.nativeElement.height = this.gridHeight;
    this.sceneWidth = this.scene.nativeElement.width = this.gridHeight;
    this.sceneContext = this.scene.nativeElement.getContext("2d");
    this._drawingUnit = 8;
    this.drawGrid();
  }

  private drawGrid() {
    for (let x = 0; x < this.gridWidth; x += this._drawingUnit) {
      for (let y = 0; y < this.gridWidth; y += this._drawingUnit) {
        this.gridContext.fillStyle = "white"
        this.gridContext.fillRect(x, y, this._drawingUnit, this._drawingUnit);
        this.gridContext.lineWidth = 0.09*window.devicePixelRatio;
        this.gridContext.strokeStyle = "black"
        this.gridContext.strokeRect(x, y, this._drawingUnit, this._drawingUnit);
      }
    }
  }
  public drawGeneration(generations: Array<point>) {
    for (let x = 0; x < this.gridWidth; x += this._drawingUnit) {
      for (let y = 0; y < this.gridWidth; y += this._drawingUnit) {
        this.sceneContext.clearRect(x, y, this._drawingUnit, this._drawingUnit);
      }
    }
    generations.forEach(p=>{
      this.sceneContext.fillStyle="#3880ff"
      this.sceneContext.fillRect(p.x*this._drawingUnit,p.y*this._drawingUnit,this._drawingUnit,this._drawingUnit);
    })
  }

}
