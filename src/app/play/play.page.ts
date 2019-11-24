import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { zoomEnum } from '../model/zoom-enum';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  @ViewChild('grid',{static:true})
  grid:ElementRef;

  @ViewChild('scene',{static:true})
  scene:ElementRef;

  constructor(public _canvasService:CanvasService) { 
  }
  

  zoom(e:zoomEnum){
     this._canvasService.zoom(e);
  }
  ngOnInit() {
    this._canvasService.setupCanvas(this.grid,this.scene);
  }


}
