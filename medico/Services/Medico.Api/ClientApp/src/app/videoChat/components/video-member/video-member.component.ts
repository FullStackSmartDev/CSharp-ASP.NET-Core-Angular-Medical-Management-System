import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UserConnection } from '../../services/video-chat.service';

@Component({
  selector: 'video-member',
  templateUrl: './video-member.component.html',
})
export class VideoMemberComponent implements OnInit {
  @Input()
  user: UserConnection;

  theVideo: HTMLVideoElement;
  @ViewChild('theVideo', {static: false})
  set mainLocalVideo(el: ElementRef) {
    this.theVideo = el.nativeElement;
  }

  constructor() {
  }

  ngOnInit() {
    this.user.streamObservable.subscribe(stream => {
      if (stream) {
        if (this.user.isCurrentUser) {
          this.theVideo.srcObject = stream;
          this.theVideo.defaultMuted = true;
          this.theVideo.volume = 0;
          this.theVideo.muted = true;
        } else {
          this.theVideo.srcObject = stream;
        }
      }
    });
  }
}
