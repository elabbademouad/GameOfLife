import { Injectable, EventEmitter } from '@angular/core';
import { CanvasService } from './canvas.service';
import { point } from '../model/point-model';
import { gameStateEnum } from '../model/game-state-enum';

@Injectable({
  providedIn: 'root'
})

export class GameEngineService {

  private _state:gameStateEnum=gameStateEnum.stoped;
  private _stateEvent:EventEmitter<gameStateEnum>=new EventEmitter<gameStateEnum>();
  private _generation:Array<point>=[];
  private _generationNumberEvent:EventEmitter<number>=new EventEmitter<number>();
  private _generationNumber:number=0;

  public speed:number=500;

  constructor(public _canvasService:CanvasService) {
  }

  public break(){
    this._state=gameStateEnum.breaked;
    this._stateEvent.emit(this._state);
    clearInterval();
  }

  public run(){
    
    this._state=gameStateEnum.running;
    this._stateEvent.emit(gameStateEnum.running);
    setInterval(()=>{
      if(this._state===gameStateEnum.running){
        this.nextGeneration();
      }
    },this.speed);
  }

  public stop(){
    this._state=gameStateEnum.stoped;
    this._stateEvent.emit(this._state);
    this._generation=[];
    this.nextGeneration();
    this._generationNumber=0;
    this._generationNumberEvent.emit(this._generationNumber);
    clearInterval();

  }

  public getCurrentState(){
    return this._stateEvent.asObservable();
  }

  public getGenerationNumber(){
    return this._generationNumberEvent.asObservable();
  }

  private nextGeneration(){
    this._generationNumber++;
    //TODO
    this._canvasService.drawGeneration(this._generation);
    this._generationNumberEvent.emit(this._generationNumber);
  }
}
