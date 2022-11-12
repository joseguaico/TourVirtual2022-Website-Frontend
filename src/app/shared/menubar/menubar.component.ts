import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit, AfterViewInit, OnDestroy {

  public menuStatus: boolean = this.menuService.menuStatus === 'active';

  constructor(public accountService: AccountService,
    public menuService: MenuService, 
    private router: Router
  ) { 
    this.menuService.reiniciarStatus();

    //console.log('MenuBar constructor...');
  }

  ngOnInit(): void {
    //console.log('On Init Sidebar.');

    document.querySelector('body')?.classList.remove('login-background');   
    this.menuService.cargarMenu();
    this.menuService.reiniciarStatus();
    this.menuStatus = false;
    this.verificarStatusMenu();
    //console.log('MenuBar onInit...');
  }

  ngAfterViewInit(): void {
    //this.menuService.reiniciarStatus();
    //this.verificarStatusMenu();
  }

  ngOnDestroy(): void {
    this.menuService.reiniciarStatus();
    //console.log('MenuBar onDestroy...');
  }


  salir(){
    this.accountService.logout();
  }

  reroute(url: string) {
    this.menuService.reiniciarStatus();
    //this.menuStatus = this.menuService.menuStatus;
    this.menuStatus = false;
    this.router.navigate([url])
  }
  
  onNavbarToggleClick(){
    this.menuService.toggleStatus();
    this.menuStatus = this.menuService.menuStatus !== '';
    //console.log("onNavbarToggleClick: ", this.menuStatus);
    this.verificarStatusMenu();
  }

  verificarStatusMenu(){
    const cssClasses = document.getElementById('sidebar')?.getAttribute('class') ?? '';

    if (this.menuStatus === true && cssClasses?.indexOf("active",0) <= 0){
      document.getElementById('sidebar')?.classList.add("active");
      //console.log('Agregando class. ', document.getElementById('sidebar')?.getAttribute('class'));
      return;
    }

    if (this.menuStatus === false && cssClasses?.indexOf("active",0) > 0){
      document.getElementById('sidebar')?.classList.remove("active");
      //console.log('Removiendo class. ', document.getElementById('sidebar')?.getAttribute('class'));
      return;
    }
  }

}
