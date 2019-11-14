import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  @ViewChild('canvas',{static:true})
  canvas:ElementRef;
  
  private ctx:CanvasRenderingContext2D

  constructor() { 

  }

  ngOnInit() {
    this.ctx=this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    this.ctx.fillRect(10, 10, 50, 50);
    this.ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    this.ctx.fillRect(30, 30, 50, 50);
  }


}
