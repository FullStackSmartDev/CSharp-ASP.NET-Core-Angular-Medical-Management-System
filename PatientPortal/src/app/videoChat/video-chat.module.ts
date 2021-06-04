import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from '../share/share.module';
import { DxTextBoxModule } from 'devextreme-angular';

import { VideoRTCComponent } from './components/video-rtc/video-rtc.component';
import { VideoMemberComponent } from './components/video-member/video-member.component';
import { RtcSignalRService} from './services/video-chat.service';

@NgModule({
    imports: [
        CommonModule,
        ShareModule,
        DxTextBoxModule
    ],
    declarations: [
        VideoMemberComponent,
        VideoRTCComponent,
    ],
    providers: [
        RtcSignalRService,
    ],
})
export class VideoChatModule { }