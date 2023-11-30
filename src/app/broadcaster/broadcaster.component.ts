import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-broadcaster',
  templateUrl: './broadcaster.component.html',
  styleUrls: ['./broadcaster.component.scss'],
})
export class BroadcasterComponent {
  title = 'webrtc-broadcasting';
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'turn:coturn.paysky.io:3478',
        credential: 'somepassword',
        username: 'guest',
      },
    ],
  };
  peerConnections: any = new RTCPeerConnection(this.config);

  socket: any;
  constructor(private webrtcService:ChatService) {
    this.socket = io('https://dev-apps.paysky.io', {
      path: '/onfido-node/socket.io'
    });
  }
  async ngOnInit(): Promise<void> {
    // this.webrtcService.announceBroadcaster();
    let broadcasterID ='lmVkQphpVgIdLNK7AABF'
    this.socket.emit('announce-broadcaster',broadcasterID);
    const constraints = {
      video: { facingMode: 'user' },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.remoteVideo.nativeElement.srcObject = stream;
        // this.socket.emit('broadcaster');
      })
      .catch((error) => console.error(error));


    this.socket.on('watcher', (id: any) => {
      console.log("watcher triggered",id);
      
      const peerConnection = new RTCPeerConnection(this.config);
      this.peerConnections[id] = peerConnection;

      let stream: any = this.remoteVideo.nativeElement.srcObject;
      stream
        .getTracks()
        .forEach((track: any) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('offer', id, peerConnection.localDescription);
        });
    });
    this.socket.on('answer', (id: any, description: any) => {
      console.log("answer triggered",id);

      this.peerConnections[id].setRemoteDescription(description);
      console.log(id);
    });
    this.socket.on('candidate', (id: any, candidate: RTCIceCandidateInit) => {
      console.log("candidate triggered",id);

      this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
    this.socket.on('disconnectPeer', (id: any) => {
      this.peerConnections.close();
      delete this.peerConnections[id];
    });

    window.onunload = window.onbeforeunload = () => {
      this.socket.close();
    };


  }
  onStart() {
    // if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((ms: MediaStream) => {
          const _video = this.remoteVideo.nativeElement;
          _video.srcObject = ms;
          _video.play();
        });
    // }
  }

  onStop() {
    this.remoteVideo.nativeElement.pause();
    (this.remoteVideo.nativeElement.srcObject as MediaStream)
      .getVideoTracks()[0]
      .stop();
    this.remoteVideo.nativeElement.srcObject = null;
  }

}
