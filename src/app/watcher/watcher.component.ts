import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-watcher',
  templateUrl: './watcher.component.html',
  styleUrls: ['./watcher.component.scss'],
})
export class WatcherComponent implements OnInit {
  broadcastersList: string[] = [];
  selectedBroadcaster: string = '';
   config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      },
      {
        urls: 'turn:coturn.paysky.io:3478',
        credential: 'somepassword',
        username: 'guest',
      },
    ]
  };
  peerConnection: any = new RTCPeerConnection(this.config);
  socket: any;
  constructor(private webrtcService: ChatService) {
    this.socket = io('http://localhost:80');
  }
  @ViewChild('receiverVideo') receiverVideo!: ElementRef<HTMLVideoElement>;
  ngOnInit(): void {
    const enableAudioButton = document.querySelector('#enable-audio');
    // this.webrtcService.requestBroadcasters();
  this.socket.emit('request-broadcasters');
  this.socket.on('broadcasters-list', (broadcastersList: string[]) => {
    this.broadcastersList = broadcastersList
      });

    
    // enableAudioButton.addEventListener('click', enableAudio);

    this.socket.on("offer", (id: any, description: any) => {
      // this.peerConnection = new RTCPeerConnection(config);
      this.peerConnection
        .setRemoteDescription(description)
        .then(() => this.peerConnection.createAnswer())
        .then((sdp:any) => this.peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit("answer", id, this.peerConnection.localDescription);
        });
      this.peerConnection.ontrack = (event:any) => {
        this.receiverVideo.nativeElement.srcObject = event.streams[0];
      };
      this.peerConnection.onicecandidate = (event:any) => {
        if (event.candidate) {
          this.socket.emit("candidate", id, event.candidate);
        }
      };
    });

    this.socket.on('candidate', (id: any, candidate: RTCIceCandidateInit) => {
      this.peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e:any) => console.error(e));
    });

    this.socket.on('connect', () => {
      this.socket.emit('watcher');
    });

    this.socket.on('broadcaster', () => {
      this.socket.emit('watcher');
    });

    window.onunload = window.onbeforeunload = () => {
      this.socket.close();
      this.peerConnection.close();
    };

    
  }

  joinBroadcast(): void {
    this.socket.emit('watcher', this.selectedBroadcaster);
  }
  enableAudio() {
    this.receiverVideo.nativeElement.muted = false;
  }

   // announceBroadcaster(): void {
  //   this.socket.emit('announce-broadcaster');
  // }

  // requestBroadcasters(): void {
  //   this.socket.emit('request-broadcasters');
  // }



  // private setupSocketListeners(): void {
  //   this.socket.on('broadcasters-list', (broadcastersList: string[]) => {
  //     this.broadcastersListSubject.next(broadcastersList);
  //   });
  // }
}
