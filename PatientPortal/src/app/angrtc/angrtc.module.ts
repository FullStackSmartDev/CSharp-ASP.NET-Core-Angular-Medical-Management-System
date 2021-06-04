import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc'; // Add
import { AngRTCComponent } from './angrtc.component';

// Add
const agoraConfig: AgoraConfig = {
  AppID: '4401c174797045a18518ba477005be03',
};


@NgModule({
  declarations: [
    AngRTCComponent
  ],
  imports: [
    BrowserModule,
   
    AngularAgoraRtcModule.forRoot(agoraConfig) // Add
  ],
  providers: [],
  bootstrap: [AngRTCComponent]
})
export class AngRTCModule { }
