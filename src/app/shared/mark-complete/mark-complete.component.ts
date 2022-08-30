import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mark-complete',
  templateUrl: './mark-complete.component.html',
  styleUrls: ['./mark-complete.component.sass']
})
export class MarkCompleteComponent implements OnInit {
  @Input() state: boolean = false;
  @Input() stopPropagation: boolean = false;

  @Output() click: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onComplete(e: Event, state: boolean) {
    if (this.stopPropagation) {
      e.stopPropagation();
    }
    this.click.emit(state);
  }

}
