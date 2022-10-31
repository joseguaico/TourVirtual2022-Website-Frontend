import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-auth',
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.css']
})
export class HomeAuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    document.querySelector('body')?.classList.add('login-background');

  }

}
