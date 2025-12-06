// DevOps Portfolio - Evolution Edition
// Implemented with Three.js for high performance and "Retro -> Cyber" evolution

class EvolutionManager {
    constructor() {
        this.scrollProgress = 0;
        this.evolutionStage = 0; // 0: Retro, 1: Modern, 2: Cyber
        
        // DOM Elements
        this.root = document.documentElement;
        
        // Initialize Systems
        this.initThreeJS();
      this.setupEventListeners();
      this.animate();
    }

    initThreeJS() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;

        // Optimization: powerPreference: 'high-performance' helps browsers manage GPU resources better
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.createParticles();
        
        // Mouse tracking - Store World Position
        this.mouse = new THREE.Vector3(9999, 9999, 9999); // Initialize far off-screen
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Plane at Z=0
        this.mouseNdc = new THREE.Vector2(0, 0);
        
        // Performance Optimization: Reusable vector for animation loop to avoid garbage collection
        this.localMouse = new THREE.Vector3();

        document.addEventListener('mousemove', (e) => {
            this.mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate World Position on Z=0 plane
            this.raycaster.setFromCamera(this.mouseNdc, this.camera);
            this.raycaster.ray.intersectPlane(this.plane, this.mouse);
        });
    }
    
    createCharTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 4x4 Grid of characters
        const cols = 4;
        const rows = 4;
        const charSize = 128;
        
        // Code & Terminal Symbols
        // Pure programming aesthetics as requested
        const chars = [
            '<', '>', '{', '}', 
            '[', ']', '(', ')', 
            '/', '*', '+', '=', 
            ';', '$', '!', 'x'
        ];
        
        // Use monospace font for code look
        ctx.font = 'bold 80px "JetBrains Mono", "Courier New", "Consolas", monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < chars.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            const x = col * charSize + charSize / 2;
            const y = row * charSize + charSize / 2; 
            
            ctx.fillText(chars[i], x, y);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.NearestFilter; // Pixelated look
        texture.magFilter = THREE.NearestFilter;
        return texture;
    }

    createParticles() {
        const count = 5000; // Increased density
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(count * 3);
        const initials = new Float32Array(count * 3);
        const targets = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const charIndices = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Initial: Random spread
            const rX = (Math.random() - 0.5) * 70; // Wider initial spread
            const rY = (Math.random() - 0.5) * 70;
            const rZ = (Math.random() - 0.5) * 50;
            
            initials[i * 3] = rX;
            initials[i * 3 + 1] = rY;
            initials[i * 3 + 2] = rZ;
            
            positions[i * 3] = rX;
            positions[i * 3 + 1] = rY;
            positions[i * 3 + 2] = rZ;
      
            // Target: Infinity Shape (Lemniscate)
            // Parametric equation for Lemniscate of Bernoulli
            // x = (a * cos(t)) / (1 + sin^2(t))
            // y = (a * cos(t) * sin(t)) / (1 + sin^2(t))
            
            const t = Math.random() * Math.PI * 2;
            const scale = 18; // Base scale
            const widthFactor = 1.4; // Tuned to fit inner div
            const denom = 1 + Math.sin(t) * Math.sin(t);
            
            const xBase = (scale * widthFactor * Math.cos(t)) / denom;
            const yBase = (scale * Math.cos(t) * Math.sin(t)) / denom;
            
            // Add volume/thickness to the infinity loop
            const spread = 2.5; // Slightly tighter spread for density
            const tX = xBase + (Math.random() - 0.5) * spread;
            const tY = yBase + (Math.random() - 0.5) * spread;
            const tZ = (Math.random() - 0.5) * spread * 2;

            targets[i * 3] = tX;
            targets[i * 3 + 1] = tY;
            targets[i * 3 + 2] = tZ;
            
            sizes[i] = Math.random();
            charIndices[i] = Math.floor(Math.random() * 16); // 0-15 index for 16 chars
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aInitial', new THREE.BufferAttribute(initials, 3));
        geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aCharIndex', new THREE.BufferAttribute(charIndices, 1));
        
        const charTexture = this.createCharTexture();

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uScrollProgress: { value: 0 },
                uMouse: { value: new THREE.Vector3(0, 0, 0) },
                uColorRetro: { value: new THREE.Color('#00ff00') },
                uColorCyber: { value: new THREE.Color('#00f3ff') },
                uCharTexture: { value: charTexture }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uScrollProgress;
                uniform vec3 uMouse;
                
                attribute vec3 aInitial;
                attribute vec3 aTarget;
                attribute float aSize;
                attribute float aCharIndex;
                
                varying vec3 vPos;
                varying float vProgress;
                varying float vCharIndex;
                
                void main() {
                    vProgress = uScrollProgress;
                    vCharIndex = aCharIndex;
                    
                    // Interpolate position
                    vec3 pos = mix(aInitial, aTarget, smoothstep(0.2, 0.8, uScrollProgress));
        
                    // Noise/Float movement
                    pos.y += sin(uTime * 0.5 + pos.x) * 0.2;
                    pos.x += cos(uTime * 0.3 + pos.y) * 0.2;
                    
                    // Mouse repulsion
                    // uMouse is now in World Coordinates
                    float dist = distance(pos, uMouse);
                    float repulsion = smoothstep(8.0, 0.0, dist); // Increased radius slightly
                    vec3 dir = normalize(pos - uMouse);
                    pos += dir * repulsion * 4.0; // Stronger repulsion
                    
                    vPos = pos;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
        
                    // Size modulation - Increased base size for text visibility
                    float baseSize = mix(12.0, 20.0, uScrollProgress);
                    gl_PointSize = baseSize * aSize * (30.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                uniform vec3 uColorRetro;
                uniform vec3 uColorCyber;
                uniform float uScrollProgress;
                uniform sampler2D uCharTexture;
                
                varying float vCharIndex;
                
                void main() {
                    // Texture Atlas Lookup (4x4 grid)
                    float cols = 4.0;
                    vec2 uv = gl_PointCoord;
                    
                    // Index to grid position
                    float col = mod(vCharIndex, cols);
                    float row = floor(vCharIndex / cols);
                    
                    // Map UV to atlas cell
                    // Assumes char drawn at top (row 0) corresponds to V 0.75-1.0 range if 0,0 is bottom-left
                    // Canvas (0,0) is top-left.
                    // Row 0 in loop (top of canvas) = top of texture = high V
                    
                    float uvRow = 3.0 - row; // Flip row index for GL texture coords
                    vec2 atlasUV = (uv + vec2(col, uvRow)) / cols;
                    
                    vec4 texColor = texture2D(uCharTexture, atlasUV);
                    
                    // Alpha test based on texture
                    if (texColor.a < 0.3) discard;
                    
                    // Color interpolation
                    vec3 color = mix(uColorRetro, uColorCyber, uScrollProgress);
                    
                    // Add some glow to the character itself
                    // float dist = length(gl_PointCoord - 0.5);
                    // float glow = exp(-dist * 3.0) * uScrollProgress;
                    // color += glow * 0.3;
                    
                    gl_FragColor = vec4(color, texColor.a);
      }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, this.particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        this.scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
        
        this.updateEvolution();
      }

    updateEvolution() {
        // Interpolate CSS Variables based on scroll progress
        const r = this.root;
        const p = this.scrollProgress;
        
        // Evolution Stages based on Scroll - DISABLED as per request to stop evolution step
        // 0.0 - 0.3: Retro (Stage 0)
        // 0.3 - 0.6: Modern (Stage 1)
        // 0.6 - 1.0: Cyber (Stage 2)
        
        // Keeping site in "Cyber" mode visually by default via CSS
        // We can still use p (scrollProgress) for particle effects in shaders
        
        /* 
        // Calculate current stage index
        let currentStage = 0;
        if (p >= 0.6) currentStage = 2;
        else if (p >= 0.3) currentStage = 1;
        else currentStage = 0;

        // Only update DOM if stage changed
        if (this.evolutionStage !== currentStage) {
            this.evolutionStage = currentStage;
            
            if (currentStage === 0) {
                document.body.classList.remove('stage-cyber', 'stage-modern');
                document.body.classList.add('stage-retro');
                r.style.setProperty('--theme-color', '#00ff00'); // Green
            } else if (currentStage === 1) {
                document.body.classList.remove('stage-retro', 'stage-cyber');
                document.body.classList.add('stage-modern');
                r.style.setProperty('--theme-color', '#ffffff'); // White/Clean
          } else {
                document.body.classList.remove('stage-retro', 'stage-modern');
                document.body.classList.add('stage-cyber');
                r.style.setProperty('--theme-color', '#00f3ff'); // Cyan
      }
    }
        */
    }
    
    handleResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particleMaterial) {
            this.particleMaterial.uniforms.uTime.value = performance.now() * 0.001;
            this.particleMaterial.uniforms.uScrollProgress.value = this.scrollProgress;
            
            // Rotation
            if (this.particles) {
                this.particles.rotation.y = this.scrollProgress * Math.PI * 0.2 + (performance.now() * 0.0001);
                
                // Update Mouse Uniform (World -> Local conversion)
                // We need to do this every frame because the object rotates
                // The mouse world position is static (unless mouse moves), but the
                // local position corresponding to that world point changes as the object rotates.
                if (this.mouse) {
                     // Optimization: Use copy instead of clone() to prevent object creation every frame
                     this.localMouse.copy(this.mouse);
                     // Convert world coordinate to local coordinate system of the particles
                     this.particles.worldToLocal(this.localMouse);
                     this.particleMaterial.uniforms.uMouse.value.copy(this.localMouse);
                }
            }
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
  }
  
// Spotify Background Controller (kept as requested features, optimized where possible)
  class SpotifyBackgroundController {
    constructor() {
      this.nowPlayingBar = document.querySelector('.now-playing-bar');
      this.progressFill = document.querySelector('.progress-fill');
      this.currentProgress = 65;
      this.isPlaying = true;
      this.progressInterval = null;
      this.trackIndex = 0;
      
      this.tracks = [
        { name: 'Study Beats', artist: 'Lofi Collective', duration: 210 },
        { name: 'Code Flow', artist: 'Focus Music', duration: 185 },
        { name: 'Deep Work', artist: 'Ambient Beats', duration: 225 },
        { name: 'Terminal Vibes', artist: 'Dev Music', duration: 195 },
        { name: 'Algorithm Dreams', artist: 'Coding Collective', duration: 240 }
      ];
      
      this.init();
    }
    
    init() {
      console.log('Initializing Spotify background...');
      this.setupNowPlayingAnimation();
      this.setupPlaylistHovers();
      this.startProgressAnimation();
      this.updateTimeDisplay();
    }
    
    setupNowPlayingAnimation() {
      // Animate the now playing cover
      const nowPlayingCover = document.querySelector('.now-playing-cover');
      if (nowPlayingCover) {
        // Already animated via CSS
        console.log('Now playing cover animation active');
      }
      
      // Setup play/pause button
      const playBtn = document.querySelector('.play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.isPlaying = !this.isPlaying;
          playBtn.textContent = this.isPlaying ? '⏸' : '▶';
          
          // Update cover animation
          const cover = document.querySelector('.now-playing-cover');
          if (cover) {
            cover.style.animationPlayState = this.isPlaying ? 'running' : 'paused';
          }
        });
      }
      
      // Setup other control buttons
      const prevBtn = document.querySelector('.control-buttons button:first-child');
      const nextBtn = document.querySelector('.control-buttons button:last-child');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.previousTrack();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextTrack();
        });
      }
    }
    
    setupPlaylistHovers() {
      const playlistCards = document.querySelectorAll('.playlist-card, .playlist-item');
      
      playlistCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'scale(1.05)';
          card.style.transition = 'all 0.3s ease';
          card.style.boxShadow = '0 8px 25px rgba(29, 185, 84, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'scale(1)';
          card.style.boxShadow = 'none';
        });
        
        // Click to "play" playlist
        card.addEventListener('click', () => {
          const playlistName = card.querySelector('.playlist-name')?.textContent || 
                              card.querySelector('h4')?.textContent || 'Unknown Playlist';
          this.updateTrackInfo(playlistName, 'Various Artists');
          this.currentProgress = 0;
        });
      });
    }
    
    startProgressAnimation() {
      // Animate progress bar if playing
      this.progressInterval = setInterval(() => {
        if (this.isPlaying && this.currentProgress < 100) {
          this.currentProgress += 0.15; // Slightly faster progression
          if (this.progressFill) {
            this.progressFill.style.width = `${this.currentProgress}%`;
          }
          this.updateTimeDisplay();
        }
        
        // Reset when song "ends"
        if (this.currentProgress >= 100) {
          this.nextTrack();
        }
      }, 100);
    }
    
    updateTimeDisplay() {
      const currentTrack = this.tracks[this.trackIndex];
      const currentSeconds = Math.floor((this.currentProgress / 100) * currentTrack.duration);
      const totalSeconds = currentTrack.duration;
      
      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
      const currentTimeEl = document.querySelector('.time-current');
      const totalTimeEl = document.querySelector('.time-total');
      
      if (currentTimeEl) currentTimeEl.textContent = formatTime(currentSeconds);
      if (totalTimeEl) totalTimeEl.textContent = formatTime(totalSeconds);
    }
    
    nextTrack() {
      this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
      this.currentProgress = 0;
      this.updateCurrentTrack();
    }
    
    previousTrack() {
      this.trackIndex = this.trackIndex === 0 ? this.tracks.length - 1 : this.trackIndex - 1;
      this.currentProgress = 0;
      this.updateCurrentTrack();
    }
    
    updateCurrentTrack() {
      const track = this.tracks[this.trackIndex];
      this.updateTrackInfo(track.name, track.artist);
    }
    
    updateTrackInfo(trackName, artistName) {
      const trackNameEl = document.querySelector('.track-name');
      const artistNameEl = document.querySelector('.artist-name');
      
      if (trackNameEl) trackNameEl.textContent = trackName;
      if (artistNameEl) artistNameEl.textContent = artistName;
    }
    
    destroy() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    }
  }
  
// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Spotify Background
    window.spotifyBackground = new SpotifyBackgroundController();
    
    // Initialize Evolution System
    window.evolutionManager = new EvolutionManager();
    
    // Initialize Resource Widget
    window.resourceWidget = new ResourceUsageWidget();
    
    // Console welcome message
    console.log(`
      ╔══════════════════════════════════════╗
      ║     DevOps Portfolio v4.0 Evolution   ║
      ║        Three.js Enhanced Edition     ║
      ║                                      ║
      ║  🎵 Spotify Background: ACTIVE       ║
      ║  🚀 Three.js Core: INITIALIZING      ║
      ║  🔄 Evolution Mode: READY            ║
      ║  📊 System Monitor: ONLINE           ║
      ╚══════════════════════════════════════╝
    `);
});

// Resource Usage Widget (Real System Stats)
class ResourceUsageWidget {
    constructor() {
        this.widget = document.querySelector('.resource-widget');
        this.toggleBtn = document.querySelector('.resource-toggle');
        this.content = document.querySelector('.resource-content');
        
        // Elements to update
        this.cpuValue = document.querySelector('.cpu-value');
        this.memValue = document.querySelector('.mem-value');
        this.ipValue = document.querySelector('.ip-value');
        
        this.isExpanded = true;
        
        this.init();
    }
    
    init() {
        if (!this.widget) return;
        
        // Toggle functionality
        this.toggleBtn.addEventListener('click', () => this.toggle());
        document.querySelector('.resource-header').addEventListener('click', () => this.toggle());
        
        // Fetch Stats
        this.getHardwareStats();
        this.fetchIP();
    }
    
    getHardwareStats() {
        // CPU Cores (Logical Processors)
        const cores = navigator.hardwareConcurrency || 'Unknown';
        this.cpuValue.textContent = cores !== 'Unknown' ? `${cores} Cores` : 'Unknown';
        
        // Total Memory (RAM)
        // Note: deviceMemory is approximate and experimental (Chrome/Edge only)
        // It returns values like 0.25, 0.5, 1, 2, 4, 8 (capped at 8 usually for privacy)
        let memory = 'Unknown';
        if (navigator.deviceMemory) {
            memory = `${navigator.deviceMemory} GB`;
            if (navigator.deviceMemory >= 8) {
                memory = '8+ GB'; // Often capped at 8GB for privacy
            }
        }
        this.memValue.textContent = memory;
    }
    
    async fetchIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            if (this.ipValue) {
                this.ipValue.textContent = data.ip;
            }
        } catch (e) {
            console.error('Failed to fetch IP:', e);
            if (this.ipValue) {
                this.ipValue.textContent = 'Unavailable';
            }
        }
    }
    
    toggle() {
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            this.content.classList.remove('collapsed');
            this.toggleBtn.classList.remove('collapsed');
        } else {
            this.content.classList.add('collapsed');
            this.toggleBtn.classList.add('collapsed');
        }
    }
}

