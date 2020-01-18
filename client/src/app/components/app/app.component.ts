import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndexService } from '../../services/index/index.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly title: string = 'LOG3900';
  message = new BehaviorSubject<string>('');

  constructor(private basicService: IndexService) {
    this.basicService
      .basicGet()
      .pipe(map(({title, body}) => `${title} ${body}`))
      .subscribe(this.message);
  }
}
