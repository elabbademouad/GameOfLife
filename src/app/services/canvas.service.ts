import { Injectable, ElementRef } from '@angular/core';
import {zoomEnum} from '../model/zoom-enum'
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
  

  private _drawingUnit:number;
  constructor() { }
  zoom(e:zoomEnum){
    if(e===zoomEnum.zoomOut){
      if(this._drawingUnit>4){
        this._drawingUnit-=1;
        this.drawGrid();
      }        
    }else{
      this._drawingUnit+=1;
      this.drawGrid();
    }
  }
  setupCanvas(grid:ElementRef,scene:ElementRef) {
    this.grid = grid;
    this.gridWidth = this.grid.nativeElement.width;
    this.gridHeight = this.grid.nativeElement.height=this.gridWidth;
    this.gridContext=this.grid.nativeElement.getContext("2d");

    this.scene = scene;
    this.sceneWidth = this.scene.nativeElement.width=this.gridWidth;
    this.sceneHeight = this.scene.nativeElement.height=this.gridHeight;
    this.sceneContext=this.scene.nativeElement.getContext("2d");

    this._drawingUnit=10;
    this.drawGrid();
  }
  
  private drawGrid(){
    for (let x = 0; x < this.gridWidth; x+=this._drawingUnit) {
      for (let y = 0; y < this.gridWidth; y+=this._drawingUnit) {
        this.gridContext.fillStyle="lightgray"
        this.gridContext.fillRect(x,y,this._drawingUnit,this._drawingUnit);
        this.gridContext.strokeStyle="gray"
        this.gridContext.strokeRect(x,y,this._drawingUnit,this._drawingUnit);
        this.sceneContext.clearRect(x,y,this._drawingUnit,this._drawingUnit);
      }
    }
    this.sceneContext.fillStyle="red"
    this.sceneContext.fillRect(this._drawingUnit*3,this._drawingUnit*3,this._drawingUnit,this._drawingUnit);
  }


}
