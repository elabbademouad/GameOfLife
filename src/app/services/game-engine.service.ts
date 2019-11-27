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
  private _minPoint: point = new point();
  private _maxPoint: point = new point();
  public speed: number = 80;

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
    this._generation = this.applyRules();
    this._canvasService.drawGeneration(this._generation);
    this._generationNumberEvent.emit(this._generationNumber);
  }
  private applyRules(): Array<point> {
    let newGeneration = [];
    let minX = this._minPoint.x;
    let maxX = this._maxPoint.x;
    let minY = this._minPoint.y;
    let maxY = this._maxPoint.y
    for (let x = minX - 3; x <= maxX + 4; x++) {
      for (let y = minY - 3; y <= maxY + 4; y++) {
        let tmpPoint = new point();
        tmpPoint.x = x;
        tmpPoint.y = y;
        let neighbors = this.getNeighbors(tmpPoint);
        let isLive=this.isLive(tmpPoint);
        if (!this.underpopulationRule(neighbors) && !this.overpopulationRule(neighbors) && isLive) {
          this.setMinAndMaxPoint(tmpPoint, newGeneration);
          newGeneration.push(tmpPoint);
        }
        if (this.reproductionRule(neighbors) && !isLive) {
          this.setMinAndMaxPoint(tmpPoint, newGeneration);
          newGeneration.push(tmpPoint);
        }
      }
    }
    return newGeneration;
  }

  private underpopulationRule(neighbors: Array<point>): boolean {
    return neighbors.length < 2;
  }

  private overpopulationRule(neighbors: Array<point>): boolean {
    return neighbors.length > 3;
  }

  private reproductionRule(neighbors: Array<point>): boolean {
    if (neighbors.length === 3) {
      return true;
    } else {
      return false;
    }
  }

  private getNeighbors(point: point): Array<point> {
    let result = [];
    this._generation.forEach(p => {
      if (p.x === point.x - 1 && p.y === point.y - 1)
        result.push(p);
      if (p.x === point.x && p.y === point.y - 1)
        result.push(p);
      if (p.x === point.x + 1 && p.y === point.y - 1)
        result.push(p);

      if (p.x === point.x - 1 && p.y === point.y)
        result.push(p);
      if (p.x === point.x + 1 && p.y === point.y)
        result.push(p);

      if (p.x === point.x - 1 && p.y === point.y + 1)
        result.push(p);
      if (p.x === point.x && p.y === point.y + 1)
        result.push(p);
      if (p.x === point.x + 1 && p.y === point.y + 1)
        result.push(p);
    });
    return result;
  }
  private isLive(point: point): boolean {
    return this._generation.findIndex((p) => { return p.x == point.x && p.y == point.y }) !== -1;
  }
  public addPoint(point: point) {
    this.setMinAndMaxPoint(point, this._generation)
    this._generation.push(point);
    this._canvasService.drawGeneration(this._generation);
  }
  private setMinAndMaxPoint(point: point, generation: Array<point>) {
    if (generation.length == 0) {
      this._maxPoint.x = point.x;
      this._maxPoint.y = point.y;
      this._minPoint.x = point.x;
      this._minPoint.y = point.y;
    } else {
      if (this._maxPoint.x < point.x) {
        this._maxPoint.x = point.x;
      }
      if (this._maxPoint.y < point.y) {
        this._maxPoint.y = point.y;
      }
      if (this._minPoint.x > point.x) {
        this._minPoint.x = point.x;
      }
      if (this._minPoint.y > point.y) {
        this._minPoint.y = point.y;
      }
    }
  }

  /*
    x-1,y-1  x,y-1 x+1,y-1
    x-1,y    x,y   x+1,y
    x-1,y+1  x,y+1 x+1,y+1
  */


}
