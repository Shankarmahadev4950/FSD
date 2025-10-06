// ✅ VIDEO CALL MANAGER - Enhanced for Render.com Deployment
class VideoCallManager {
    constructor() {
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.currentCall = null;
        this.socket = null;
        this.callTimer = null;
        this.callStartTime = null;
        this.isCallActive = false;
        
        // ✅ ENHANCED: Production-ready ICE servers
        this.iceServers = [
            // Free STUN servers
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            
            // Optional: Add your own TURN servers for better connectivity
            // {
            //     urls: 'turn:your-turn-server.com:3478',
            //     username: 'your-username',
            //     credential: 'your-password'
            // }
        ];
        
        console.log('✅ VideoCallManager initialized');
    }

    // ✅ INITIALIZE WITH EXISTING WEBSOCKET
    initializeSocket(existingSocket) {
        if (!existingSocket) {
            console.error('❌ No WebSocket provided to VideoCallManager');
            return;
        }
        
        this.socket = existingSocket;
        this.setupSocketListeners();
        console.log('✅ VideoCallManager WebSocket initialized');
    }

    // ✅ SETUP SOCKET LISTENERS FOR VIDEO CALL EVENTS
    setupSocketListeners() {
        if (!this.socket) {
            console.error('❌ Cannot setup listeners - no WebSocket');
            return;
        }

        // Handle incoming messages
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Video call WebSocket message:', data.type);
                
                switch (data.type) {
                    case 'video_call_request':
                        this.handleIncomingCall(data);
                        break;
                    case 'video_call_answer':
                        this.handleCallAnswer(data);
                        break;
                    case 'video_call_reject':
                        this.handleCallRejection(data);
                        break;
                    case 'ice_candidate':
                        this.handleICECandidate(data);
                        break;
                    case 'video_call_end':
                        this.handleCallEnd(data);
                        break;
                    case 'video_call_timeout':
                        this.handleCallTimeout(data);
                        break;
                }
            } catch (error) {
                console.error('❌ WebSocket message parsing error:', error);
            }
        };

        // Handle socket closure
        this.socket.onclose = () => {
            console.log('🔌 WebSocket closed - ending active call');
            if (this.isCallActive) {
                this.endCall('Connection lost');
            }
        };

        // Handle socket errors
        this.socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    }

    // ✅ START A NEW VIDEO CALL
    async startCall(skillId, recipientId, recipientName) {
        try {
            console.log('🎬 Starting video call to:', recipientName);
            
            // Check if already in a call
            if (this.isCallActive) {
                throw new Error('You are already in a call');
            }

            // Check WebSocket connection
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                throw new Error('No active connection to server');
            }

            // Request camera and microphone permissions
            console.log('📷 Requesting camera and microphone access...');
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 2
                }
            }).catch(error => {
                console.error('❌ Media access denied:', error);
                throw new Error('Camera and microphone access is required for video calls. Please check your permissions.');
            });

            console.log('✅ Media access granted');

            // Create peer connection
            this.createPeerConnection();

            // Add local tracks to connection
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Generate unique call ID
            const callId = this.generateCallId();
            this.currentCall = { 
                callId, 
                skillId, 
                recipientId, 
                recipientName,
                isInitiator: true 
            };

            // Create and set local description
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            
            await this.peerConnection.setLocalDescription(offer);

            // Send call request
            this.socket.send(JSON.stringify({
                type: 'video_call_request',
                callId,
                skillId,
                recipientId,
                recipientName: currentUser.name,
                offer: offer,
                timestamp: new Date().toISOString()
            }));

            // Show calling interface
            this.showCallingInterface(recipientName);
            
            // Set call timeout (60 seconds)
            this.callTimeout = setTimeout(() => {
                if (!this.isCallActive) {
                    this.endCall('Call timed out - no answer');
                    this.socket.send(JSON.stringify({
                        type: 'video_call_timeout',
                        callId
                    }));
                }
            }, 60000);

            console.log('✅ Call request sent successfully');

        } catch (error) {
            console.error('❌ Failed to start call:', error);
            this.showError('Failed to start video call: ' + error.message);
            this.cleanup();
        }
    }

    // ✅ HANDLE INCOMING CALL
    async handleIncomingCall(data) {
        try {
            console.log('📞 Incoming call from:', data.recipientName);
            
            // Don't accept if already in a call
            if (this.isCallActive) {
                this.socket.send(JSON.stringify({
                    type: 'video_call_reject',
                    callId: data.callId,
                    reason: 'User is in another call'
                }));
                return;
            }

            // Store call data
            this.currentCall = {
                callId: data.callId,
                skillId: data.skillId,
                recipientId: data.recipientId,
                recipientName: data.recipientName,
                isInitiator: false,
                offer: data.offer
            };

            // Show incoming call interface
            this.showIncomingCallInterface(data.recipientName, data.skillId);

        } catch (error) {
            console.error('❌ Error handling incoming call:', error);
        }
    }

    // ✅ ANSWER INCOMING CALL
    async answerCall() {
        try {
            console.log('✅ Answering incoming call...');
            
            if (!this.currentCall || !this.currentCall.offer) {
                throw new Error('No active call to answer');
            }

            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            // Create peer connection
            this.createPeerConnection();

            // Add local tracks
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Set remote description from offer
            await this.peerConnection.setRemoteDescription(this.currentCall.offer);

            // Create and set local answer
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);

            // Send answer
            this.socket.send(JSON.stringify({
                type: 'video_call_answer',
                callId: this.currentCall.callId,
                answer: answer
            }));

            // Show active call interface
            this.showVideoCallInterface();
            this.isCallActive = true;
            this.startCallTimer();

            console.log('✅ Call answered successfully');

        } catch (error) {
            console.error('❌ Failed to answer call:', error);
            this.showError('Failed to answer call: ' + error.message);
            this.cleanup();
        }
    }

    // ✅ REJECT INCOMING CALL
    rejectCall() {
        if (this.currentCall) {
            this.socket.send(JSON.stringify({
                type: 'video_call_reject',
                callId: this.currentCall.callId,
                reason: 'Call rejected by user'
            }));
        }
        this.cleanupIncomingCall();
    }

    // ✅ CREATE WEBRTC PEER CONNECTION
    createPeerConnection() {
        try {
            this.peerConnection = new RTCPeerConnection({
                iceServers: this.iceServers,
                iceTransportPolicy: 'all',
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require'
            });

            // Handle incoming stream
            this.peerConnection.ontrack = (event) => {
                console.log('✅ Remote stream received');
                this.remoteStream = event.streams[0];
                this.updateRemoteVideo();
            };

            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate && this.socket && this.currentCall) {
                    this.socket.send(JSON.stringify({
                        type: 'ice_candidate',
                        callId: this.currentCall.callId,
                        candidate: event.candidate
                    }));
                }
            };

            // Handle connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                const state = this.peerConnection.connectionState;
                console.log('🔗 WebRTC connection state:', state);
                
                switch (state) {
                    case 'connected':
                        console.log('✅ WebRTC connection established');
                        break;
                    case 'disconnected':
                    case 'failed':
                        console.log('❌ WebRTC connection failed');
                        if (this.isCallActive) {
                            this.endCall('Connection lost');
                        }
                        break;
                    case 'closed':
                        console.log('🔌 WebRTC connection closed');
                        break;
                }
            };

            // Handle ICE connection state
            this.peerConnection.oniceconnectionstatechange = () => {
                console.log('🧊 ICE connection state:', this.peerConnection.iceConnectionState);
            };

        } catch (error) {
            console.error('❌ Failed to create peer connection:', error);
            throw error;
        }
    }

    // ✅ HANDLE CALL ANSWER FROM RECIPIENT
    async handleCallAnswer(data) {
        try {
            console.log('✅ Call answered by recipient');
            
            if (!this.peerConnection || !this.currentCall) {
                throw new Error('No active peer connection');
            }

            await this.peerConnection.setRemoteDescription(data.answer);
            this.isCallActive = true;
            this.startCallTimer();
            
            // Update UI to show call is connected
            this.showVideoCallInterface();
            
            // Clear call timeout
            if (this.callTimeout) {
                clearTimeout(this.callTimeout);
                this.callTimeout = null;
            }

        } catch (error) {
            console.error('❌ Error handling call answer:', error);
            this.endCall('Error establishing connection');
        }
    }

    // ✅ HANDLE ICE CANDIDATES
    async handleICECandidate(data) {
        try {
            if (this.peerConnection && data.candidate) {
                await this.peerConnection.addIceCandidate(data.candidate);
            }
        } catch (error) {
            console.error('❌ Error adding ICE candidate:', error);
        }
    }

    // ✅ HANDLE CALL REJECTION
    handleCallRejection(data) {
        console.log('❌ Call rejected:', data.reason);
        this.showNotification('Call was rejected', 'error');
        this.cleanup();
    }

    // ✅ HANDLE CALL END
    handleCallEnd(data) {
        console.log('📞 Call ended by other participant');
        this.endCall('Call ended by other participant');
    }

    // ✅ HANDLE CALL TIMEOUT
    handleCallTimeout(data) {
        console.log('⏰ Call timeout');
        this.endCall('Call timed out - no answer');
    }

    // ✅ END CURRENT CALL
    endCall(reason = 'Call ended') {
        console.log('📞 Ending call:', reason);
        
        // Send end call signal if we have an active call
        if (this.currentCall && this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'video_call_end',
                callId: this.currentCall.callId,
                reason: reason
            }));
        }

        this.cleanup();
        this.showNotification(reason, 'info');
    }

    // ✅ CLEANUP RESOURCES
    cleanup() {
        console.log('🧹 Cleaning up call resources...');
        
        // Stop media tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            this.localStream = null;
        }

        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Clear timers
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
        
        if (this.callTimeout) {
            clearTimeout(this.callTimeout);
            this.callTimeout = null;
        }

        // Remove call UI
        this.removeCallInterface();

        // Reset state
        this.remoteStream = null;
        this.currentCall = null;
        this.isCallActive = false;
        this.callStartTime = null;
        
        console.log('✅ Call cleanup completed');
    }

    // ✅ CLEANUP INCOMING CALL (without sending reject)
    cleanupIncomingCall() {
        this.removeCallInterface();
        this.currentCall = null;
    }

    // ✅ UI METHODS

    // Show calling interface
    showCallingInterface(recipientName) {
        this.removeCallInterface(); // Remove any existing call UI
        
        const callingHTML = `
            <div id="video-call-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">Calling ${recipientName}</h5>
                            <button type="button" class="btn-close btn-close-white" onclick="videoCallManager.endCall('Call cancelled')"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <div class="call-avatar mb-4">
                                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                     style="width: 100px; height: 100px; font-size: 2rem;">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <h4>Calling ${recipientName}</h4>
                            <p class="text-muted">Waiting for answer...</p>
                            <div class="calling-animation mt-4">
                                <div class="pulse"></div>
                            </div>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button class="btn btn-danger btn-lg rounded-circle" onclick="videoCallManager.endCall('Call cancelled')">
                                <i class="fas fa-phone-slash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', callingHTML);
    }

    // Show incoming call interface
    showIncomingCallInterface(callerName, skillId) {
        this.removeCallInterface();
        
        const incomingHTML = `
            <div id="video-call-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">Incoming Call</h5>
                        </div>
                        <div class="modal-body text-center py-5">
                            <div class="call-avatar mb-4">
                                <div class="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                     style="width: 100px; height: 100px; font-size: 2rem;">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <h4>${callerName}</h4>
                            <p class="text-muted">is calling you</p>
                            <div class="incoming-animation mt-4">
                                <div class="ring"></div>
                            </div>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button class="btn btn-success btn-lg rounded-circle me-4" onclick="videoCallManager.answerCall()">
                                <i class="fas fa-phone"></i>
                            </button>
                            <button class="btn btn-danger btn-lg rounded-circle" onclick="videoCallManager.rejectCall()">
                                <i class="fas fa-phone-slash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', incomingHTML);
    }

    // Show active video call interface
    showVideoCallInterface() {
        this.removeCallInterface();
        
        const videoCallHTML = `
            <div id="video-call-modal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.9);">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">
                                <span id="call-timer">00:00</span> - 
                                ${this.currentCall?.recipientName || 'Video Call'}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" onclick="videoCallManager.endCall('Call ended')"></button>
                        </div>
                        <div class="modal-body p-0 position-relative" style="height: 60vh;">
                            <!-- Remote Video -->
                            <div class="h-100 w-100 position-relative">
                                <video id="remote-video" autoplay playsinline class="h-100 w-100 bg-black"></video>
                                <div id="remote-placeholder" class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark">
                                    <i class="fas fa-user fa-4x text-muted mb-3"></i>
                                    <p class="text-muted">${this.currentCall?.recipientName || 'Connecting...'}</p>
                                </div>
                            </div>
                            
                            <!-- Local Video Preview -->
                            <div class="position-absolute bottom-0 end-0 m-3" style="width: 200px; height: 150px;">
                                <video id="local-video" autoplay playsinline muted class="w-100 h-100 bg-black rounded shadow"></video>
                            </div>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button class="btn-control mic-toggle btn btn-outline-light rounded-circle mx-2" onclick="videoCallManager.toggleMic()">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button class="btn-control camera-toggle btn btn-outline-light rounded-circle mx-2" onclick="videoCallManager.toggleCamera()">
                                <i class="fas fa-video"></i>
                            </button>
                            <button class="btn-control end-call btn btn-danger rounded-circle mx-2" onclick="videoCallManager.endCall('Call ended')">
                                <i class="fas fa-phone-slash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', videoCallHTML);
        
        // Setup video elements
        this.setupVideoElements();
    }

    // Setup video elements after UI is created
    setupVideoElements() {
        const localVideo = document.getElementById('local-video');
        const remoteVideo = document.getElementById('remote-video');
        
        if (localVideo && this.localStream) {
            localVideo.srcObject = this.localStream;
        }
        
        if (remoteVideo && this.remoteStream) {
            remoteVideo.srcObject = this.remoteStream;
            document.getElementById('remote-placeholder').style.display = 'none';
        }
    }

    // Update remote video when stream is received
    updateRemoteVideo() {
        const remoteVideo = document.getElementById('remote-video');
        const placeholder = document.getElementById('remote-placeholder');
        
        if (remoteVideo && this.remoteStream) {
            remoteVideo.srcObject = this.remoteStream;
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    // Remove call interface
    removeCallInterface() {
        const existingModal = document.getElementById('video-call-modal');
        if (existingModal) {
            existingModal.remove();
        }
    }

    // ✅ UTILITY METHODS

    // Start call timer
    startCallTimer() {
        this.callStartTime = new Date();
        this.callTimer = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - this.callStartTime) / 1000);
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            
            const timerElement = document.getElementById('call-timer');
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    // Toggle microphone
    toggleMic() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const enabled = !audioTracks[0].enabled;
                audioTracks[0].enabled = enabled;
                
                const micBtn = document.querySelector('.mic-toggle');
                if (micBtn) {
                    micBtn.classList.toggle('btn-outline-light', enabled);
                    micBtn.classList.toggle('btn-warning', !enabled);
                    micBtn.innerHTML = enabled ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash"></i>';
                }
            }
        }
    }

    // Toggle camera
    toggleCamera() {
        if (this.localStream) {
            const videoTracks = this.localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const enabled = !videoTracks[0].enabled;
                videoTracks[0].enabled = enabled;
                
                const cameraBtn = document.querySelector('.camera-toggle');
                if (cameraBtn) {
                    cameraBtn.classList.toggle('btn-outline-light', enabled);
                    cameraBtn.classList.toggle('btn-warning', !enabled);
                    cameraBtn.innerHTML = enabled ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
                }
            }
        }
    }

    // Generate unique call ID
    generateCallId() {
        return 'call_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Use your existing NotificationManager or create a simple alert
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.show(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
            // Fallback to simple alert
            alert(message);
        }
    }

    // Show error
    showError(message) {
        this.showNotification(message, 'error');
    }
}

// ✅ GLOBAL INSTANCE
const videoCallManager = new VideoCallManager();

// ✅ INTEGRATION WITH EXISTING APP
// Add this to your app.js initialization
function initializeVideoCalls() {
    // This will be called after WebSocket is established
    console.log('✅ Initializing video call system...');
}

// ✅ ADD VIDEO CALL BUTTON TO SKILL CARDS
function addVideoCallButton(skillId, providerId, providerName) {
    return `
        <button class="btn btn-success btn-sm mt-2" 
                onclick="startVideoCall('${skillId}', '${providerId}', '${providerName}')"
                ${!currentUser ? 'disabled title="Please login to start video call"' : ''}>
            <i class="fas fa-video me-1"></i> Video Call
        </button>
    `;
}

// ✅ ENHANCED START VIDEO CALL FUNCTION
function startVideoCall(skillId, recipientId, recipientName) {
    if (!currentUser || !currentUser.id) {
        NotificationManager.show('Please login to start a video call', 'error');
        showAuthForm('signin');
        return;
    }
    
    if (!videoCallManager.socket) {
        // Try to initialize with existing WebSocket
        if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
            videoCallManager.initializeSocket(socket);
        } else {
            NotificationManager.show('No active connection. Please refresh the page.', 'error');
            return;
        }
    }
    
    videoCallManager.startCall(skillId, recipientId, recipientName);
}

// ✅ MAKE FUNCTIONS GLOBALLY ACCESSIBLE
window.videoCallManager = videoCallManager;
window.startVideoCall = startVideoCall;
window.addVideoCallButton = addVideoCallButton;

console.log('✅ videocall.js loaded successfully');
