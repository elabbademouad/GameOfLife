import { Injectable, EventEmitter } from '@angular/core';
import { CanvasService } from './canvas.service';
import { point } from '../model/point-model';
import { gameStateEnum } from '../model/game-state-enum';

@Injectable({
  providedIn: 'root'
})

export class GameEngineService {

  private _state: gameStateEnum = gameStateEnum.stoped;
  private _stateEvent: EventEmitter<gameStateEnum> = new EventEmitter<gameStateEnum>();
  private _generation: Array<point> = [];
  private _generationNumberEvent: EventEmitter<number> = new EventEmitter<number>();
  private _generationNumber: number = 0;
  private _intervalId: any;
  public speed: number = 800;

  constructor(public _canvasService: CanvasService) {
  }

  public break() {
    this._state = gameStateEnum.breaked;
    this._stateEvent.emit(this._state);
    clearInterval(this._intervalId);
  }

  public run() {
    this._state = gameStateEnum.running;
    this._stateEvent.emit(gameStateEnum.running);
    this._intervalId = setInterval(() => {
      if (this._state === gameStateEnum.running) {
        this.nextGeneration();
      }
    }, this.speed);
  }

  public stop() {
    this._state = gameStateEnum.stoped;
    this._stateEvent.emit(this._state);
    this._generation = [];
    this.nextGeneration();
    this._generationNumber = 0;
    this._generationNumberEvent.emit(this._generationNumber);
    clearInterval(this._intervalId);

  }

  public getCurrentState() {
    return this._stateEvent.asObservable();
  }

  public getGenerationNumber() {
    return this._generationNumberEvent.asObservable();
  }

  private nextGeneration() {
    this._generationNumber++;
    //TODO
    this._canvasService.drawGeneration(this._generation);
    this._generationNumberEvent.emit(this._generationNumber);
  }

  private dieRule(point: point): boolean {
    let result = this._generation.filter(p => {
      let counter = 0;
      if (p.x === point.x - 1 && p.y === point.y - 1)
        counter++;
      if (p.x === point.x && p.y === point.y - 1)
        counter++;
      if (p.x === point.x + 1 && p.y === point.y - 1)
        counter++;

      if (p.x === point.x - 1 && p.y === point.y)
        counter++;
      if (p.x === point.x + 1 && p.y === point.y)
        counter++;

      if (p.x === point.x - 1 && p.y === point.y + 1)
        counter++;
      if (p.x === point.x && p.y === point.y + 1)
        counter++;
      if (p.x === point.x + 1 && p.y === point.y + 1)
        counter++;
    });
    
    return result == null || result.length < 2 || result.length > 3;
  }

  private reproductionRule(): Array<point> {
    return [];
  }

  /*
    x-1,y-1  x,y-1 x+1,y-1
    x-1,y    x,y   x+1,y
    x-1,y+1  x,y+1 x+1,y+1
  */

  private applyRules() {

  }
}
