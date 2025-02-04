import { Injectable } from '@angular/core';
import { StackBlitzProjectPayload } from './stackblitz.service';
import { XlayersNgxEditorModel } from '../../editor-container/codegen/codegen.service';

@Injectable({
  providedIn: 'root',
})
export class ExportStackblitzAngularService {
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          if (content[i].language === 'base64') {
            files[`src/app/` + content[i].uri] = content[i].value;
          } else {
            files[`src/app/xlayers/` + content[i].uri] = content[i].value;
          }
        }
      }
    }

    files['src/app/app.component.ts'] = `\
import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: \`<xly-page-1></xly-page-1>\`,
})
export class AppComponent  {}`;
    files['src/app/app.module.ts'] = `\
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { XlayersModule } from './xlayers/xlayers.module';
@NgModule({
  imports:      [ BrowserModule, XlayersModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }`;
    files['src/main.ts'] = `\
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)`;
    files['src/index.html'] = '<my-app>loading</my-app>';

    return {
      files,
      template: 'angular-cli',
      tags: ['angular'],
    };
  }
}
