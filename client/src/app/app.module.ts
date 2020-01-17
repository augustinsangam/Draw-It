import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { Routes, RouterModule } from '@angular/router';
import { DrawComponent } from './pages/draw/draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';


// *************************** Pour le rooting ********************************
const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'draw', component: DrawComponent },
	{ path: 'documentation', component: DocumentationComponent },
	{ path: '**', component: NotFoundPageComponent }
];


@NgModule({
    declarations: [AppComponent, HomeComponent, DocumentationComponent, DrawComponent, NotFoundPageComponent],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule, 
        HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
