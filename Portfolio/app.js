// DevOps Particle System - Enhanced Implementation
class DevOpsParticleSystem {
    constructor() {
      this.container = document.getElementById('particleContainer');
      this.particles = [];
      this.mouseX = window.innerWidth / 2;
      this.mouseY = window.innerHeight / 2;
      this.isMouseMoving = false;
      this.mouseTimeout = null;
      this.animationId = null;
      this.particleCreateTimer = null;
      
      // DevOps tools with inline SVG
      this.devopsTools = [
        { 
          name: 'AWS', 
          color: '#FF9900',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#FF9900" stroke-width="2" fill="none"/>
            <path d="M6 15l6-6 6 6" stroke="#FF9900" stroke-width="2" fill="none"/>
          </svg>`
        },
        { 
          name: 'Docker', 
          color: '#2496ED',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="8" width="2" height="2" fill="#2496ED"/>
            <rect x="7" y="8" width="2" height="2" fill="#2496ED"/>
            <rect x="9" y="8" width="2" height="2" fill="#2496ED"/>
            <rect x="11" y="8" width="2" height="2" fill="#2496ED"/>
            <rect x="13" y="8" width="2" height="2" fill="#2496ED"/>
            <ellipse cx="12" cy="14" rx="9" ry="4" fill="#2496ED"/>
          </svg>`
        },
        { 
          name: 'Kubernetes', 
          color: '#326CE5',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#326CE5"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>`
        },
        { 
          name: 'Terraform', 
          color: '#623CE4',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <polygon points="8,6 8,18 14,15 14,9" fill="#623CE4"/>
            <polygon points="14,9 14,15 20,12 20,6" fill="#623CE4"/>
          </svg>`
        },
        { 
          name: 'Jenkins', 
          color: '#D33833',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#D33833"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
            <circle cx="12" cy="12" r="2" fill="#D33833"/>
          </svg>`
        },
        { 
          name: 'Prometheus', 
          color: '#E6522C',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 8.5L17 19H7L2 8.5L12 2Z" fill="#E6522C"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>`
        },
        { 
          name: 'Git', 
          color: '#F05032',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 10.5L13.5 3L10.5 6L13.5 9L10.5 12L13.5 15L21 22.5L21 10.5Z" fill="#F05032"/>
            <path d="M3 10.5L10.5 3L13.5 6L10.5 9L13.5 12L10.5 15L3 22.5L3 10.5Z" fill="#F05032"/>
          </svg>`
        },
        { 
          name: 'Ansible', 
          color: '#EE0000',
          svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#EE0000" stroke-width="2" fill="none"/>
            <path d="M2 12L12 17L22 12" stroke="#EE0000" stroke-width="2" fill="none"/>
            <path d="M2 17L12 22L22 17" stroke="#EE0000" stroke-width="2" fill="none"/>
          </svg>`
        }
      ];
      
      this.init();
    }
    
    init() {
      if (!this.container) {
        console.error('Particle container not found');
        return;
      }
      
      // console.log('Initializing particle system...');
      this.setupEventListeners();
      this.createInitialParticles();
      this.startParticleGeneration();
      this.setupNavigationToggle();
      this.animate();
    }
        // New method to set up the navigation toggle
    setupNavigationToggle() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active'); // Optional: for toggle animation
                console.log("Toggle clicked! Menu active state:", navMenu.classList.contains('active'));
            });

            // Optional: Close the menu when a nav link is clicked
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        } else {
            console.error("Error: navToggle or navMenu element not found for navigation setup!");
        }
    }
    setupEventListeners() {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.isMouseMoving = true;
        
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
          this.isMouseMoving = false;
        }, 150);
      });
      
      window.addEventListener('resize', () => {
        this.handleResize();
      });
    }
    
    createInitialParticles() {
      const initialCount = this.getParticleCount();
      // console.log(`Creating ${initialCount} initial particles`);
      
      for (let i = 0; i < initialCount; i++) {
        setTimeout(() => {
          this.createParticle(true);
        }, i * 200);
      }
    }
    
    getParticleCount() {
      const width = window.innerWidth;
      if (width < 768) return 6;
      if (width < 1024) return 10;
      return 14;
    }
    
    createParticle(isInitial = false) {
      const tool = this.devopsTools[Math.floor(Math.random() * this.devopsTools.length)];
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Set SVG content
      particle.innerHTML = tool.svg;
      
      // Calculate positions
      const startY = Math.random() * (window.innerHeight - 200) + 50;
      const startX = isInitial ? Math.random() * window.innerWidth : -60;
      const speed = 0.8 + Math.random() * 1.2;
      const rotationSpeed = (Math.random() - 0.5) * 3;
      const size = 0.7 + Math.random() * 0.6;
      const opacity = 0.7 + Math.random() * 0.3;
      
      // Apply styles
      particle.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        opacity: ${opacity};
        transform: scale(${size});
        pointer-events: auto;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 15;
        filter: drop-shadow(0 0 6px ${tool.color}80);
      `;
      
      // Store particle data
      particle.particleData = {
        x: startX,
        y: startY,
        speed: speed,
        rotation: 0,
        rotationSpeed: rotationSpeed,
        tool: tool,
        originalOpacity: opacity,
        size: size,
        baseY: startY,
        floatOffset: Math.random() * Math.PI * 2
      };
      
      // Add interactions
      // this.addParticleInteractions(particle);
      
      // Add to container
      this.container.appendChild(particle);
      this.particles.push(particle);
      
      // // console.log(`Created particle: ${tool.name} at (${startX}, ${startY})`);
      return particle;
    }
    
    // addParticleInteractions(particle) {
    //   let isHovering = false;
      
    //   particle.addEventListener('mouseenter', (e) => {
    //     e.preventDefault();
    //     if (!isHovering) {
    //       isHovering = true;
    //       const data = particle.particleData;
          
    //       // Scale up effect
    //       particle.style.transform = `scale(${data.size * 1.8}) rotate(${data.rotation}deg)`;
    //       particle.style.filter = `drop-shadow(0 0 20px ${data.tool.color}) brightness(1.5)`;
    //       particle.style.zIndex = '1000';
          
    //       // Show tooltip
    //       this.showTooltip(particle, data.tool.name);
          
    //       // console.log(`Hovering ${data.tool.name}`);
    //     }
    //   });
      
    //   particle.addEventListener('mouseleave', (e) => {
    //     e.preventDefault();
    //     if (isHovering) {
    //       isHovering = false;
    //       const data = particle.particleData;
          
    //       // Reset scale
    //       particle.style.transform = `scale(${data.size}) rotate(${data.rotation}deg)`;
    //       particle.style.filter = `drop-shadow(0 0 6px ${data.tool.color}80)`;
    //       particle.style.zIndex = '15';
          
    //       // Hide tooltip
    //       this.hideTooltip();
    //     }
    //   });
    // }
    
    showTooltip(particle, text) {
      this.hideTooltip();
      
      const tooltip = document.createElement('div');
      tooltip.id = 'particle-tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.95);
        color: #1DB954;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        pointer-events: none;
        z-index: 10000;
        border: 1px solid rgba(29, 185, 84, 0.6);
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        text-shadow: 0 0 5px #1DB954;
        animation: tooltipFadeIn 0.2s ease-out;
      `;
      
      // Add tooltip animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(tooltip);
      
      // Position tooltip
      const rect = particle.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      let top = rect.top - tooltipRect.height - 15;
      
      // Keep tooltip in viewport
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (top < 10) top = rect.bottom + 15;
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }
    
    hideTooltip() {
      const tooltip = document.getElementById('particle-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    }
    
    startParticleGeneration() {
      this.particleCreateTimer = setInterval(() => {
        if (this.particles.length < this.getParticleCount()) {
          this.createParticle();
        }
      }, 2000);
    }
    
    animate() {
      this.updateParticles();
      this.applyParallaxEffect();
      this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
      const currentTime = Date.now() * 0.001;
      
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        const data = particle.particleData;
        
        if (!data) continue;
        
        // Update position
        data.x += data.speed;
        data.rotation += data.rotationSpeed;
        
        // Floating motion
        const floatY = data.baseY + Math.sin(currentTime + data.floatOffset) * 30;
        data.y = floatY;
        
        // Apply position and rotation
        particle.style.left = data.x + 'px';
        particle.style.top = data.y + 'px';
        
        // Update rotation in transform
        const currentScale = particle.style.transform.match(/scale\(([^)]+)\)/);
        const scale = currentScale ? currentScale[1] : data.size;
        particle.style.transform = `scale(${scale}) rotate(${data.rotation}deg)`;
        
        // Remove off-screen particles
        if (data.x > window.innerWidth + 100) {
          particle.remove();
          this.particles.splice(i, 1);
          // console.log(`Removed off-screen particle: ${data.tool.name}`);
        }
      }
    }
    
    applyParallaxEffect() {
      if (!this.isMouseMoving) return;
      
      const mouseXPercent = (this.mouseX / window.innerWidth - 0.5) * 2;
      const mouseYPercent = (this.mouseY / window.innerHeight - 0.5) * 2;
      
      this.particles.forEach((particle) => {
        const data = particle.particleData;
        if (!data) return;
        
        const depth = data.speed / 2;
        const parallaxStrength = 15;
        const offsetX = mouseXPercent * parallaxStrength * depth;
        const offsetY = mouseYPercent * parallaxStrength * depth;
        
        // Apply parallax offset
        const currentScale = particle.style.transform.match(/scale\(([^)]+)\)/)?.[1] || data.size;
        particle.style.transform = `scale(${currentScale}) rotate(${data.rotation}deg) translate(${offsetX}px, ${offsetY}px)`;
      });
    }
    
    handleResize() {
      const targetCount = this.getParticleCount();
      const currentCount = this.particles.length;
      
      if (currentCount > targetCount * 3) {
        const excessCount = currentCount - targetCount;
        for (let i = 0; i < excessCount; i++) {
          if (this.particles.length > 0) {
            const particle = this.particles.pop();
            particle.remove();
          }
        }
      }
    }
    
    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.particleCreateTimer) {
        clearInterval(this.particleCreateTimer);
      }
      this.particles.forEach(particle => particle.remove());
      this.particles = [];
    }
  }
  
  // Resource Usage Widget Controller
  class ResourceUsageWidget {
    constructor() {
      this.widget = document.getElementById('resourceWidget');
      this.header = document.getElementById('resourceHeader');
      this.toggle = document.getElementById('resourceToggle');
      this.content = document.getElementById('resourceContent');
      this.isCollapsed = false;
      this.updateInterval = null;
      this.loadInterval = null;
      
      this.init();
    }
    
    init() {
      if (!this.widget) {
        console.error('Resource widget not found');
        return;
      }
      
      console.log('Initializing resource usage widget...');
      this.setupEventListeners();
      this.updateSystemInfo();
      this.startUpdating();
      this.animateWidget();
    }
    
    setupEventListeners() {
      // Make header clickable
      this.header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleWidget();
      });
      
      // Make toggle button clickable
      this.toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleWidget();
      });
      
      // Hide widget on mobile
      this.checkMobileVisibility();
      window.addEventListener('resize', () => {
        this.checkMobileVisibility();
      });
      
      console.log('Resource widget event listeners setup complete');
    }
    
    checkMobileVisibility() {
      if (window.innerWidth <= 400) {
        this.widget.style.display = 'none';
        console.log('Resource widget hidden on mobile');
      } else {
        this.widget.style.display = 'block';
        console.log('Resource widget visible on desktop');
      }
    }
    
    toggleWidget() {
      this.isCollapsed = !this.isCollapsed;
      
      console.log(`Toggling resource widget: ${this.isCollapsed ? 'collapsing' : 'expanding'}`);
      
      if (this.isCollapsed) {
        this.content.classList.add('collapsed');
        this.toggle.classList.add('collapsed');
        this.toggle.textContent = '▶';
      } else {
        this.content.classList.remove('collapsed');
        this.toggle.classList.remove('collapsed');
        this.toggle.textContent = '▼';
      }
      
      console.log(`Resource widget ${this.isCollapsed ? 'collapsed' : 'expanded'}`);
    }
    
    updateSystemInfo() {
      try {
        // CPU Cores
        const cpuCores = navigator.hardwareConcurrency || null;
        const cpuElement = document.getElementById('cpuCores');
        if (cpuElement) {
          cpuElement.textContent = cpuCores ? `${cpuCores} cores` : 'N/A';
        }
        
        // Device Memory
        const deviceMemory = navigator.deviceMemory || null;
        const memoryElement = document.getElementById('deviceMemory');
        if (memoryElement) {
          memoryElement.textContent = deviceMemory ? `${deviceMemory} GB` : 'N/A';
        }
        
        // Device IP
        fetch('https://api.ipify.org/?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("deviceIP").textContent = data.ip;
        })
        .catch(() => {
            document.getElementById("deviceIP").textContent = 'Unavailable';
        });
        
      } catch (error) {
        console.error('Error updating system info:', error);
      }
    }
    
    updateLoad() {
      try {
        // Simulate load percentage with realistic variation
        const baseLoad = 25 + Math.random() * 50; // 25-75%
        const time = Date.now() * 0.0008;
        const oscillation = Math.sin(time) * 20; // ±20% oscillation
        const load = Math.max(5, Math.min(95, baseLoad + oscillation));
        
        const loadFill = document.getElementById('loadFill');
        if (loadFill) {
          loadFill.style.width = `${load}%`;
          
          // Change color based on load
          let gradient;
          if (load < 30) {
            gradient = 'linear-gradient(90deg, #1DB954, #1ed760)';
          } else if (load < 70) {
            gradient = 'linear-gradient(90deg, #ffbd2e, #ff9900)';
          } else {
            gradient = 'linear-gradient(90deg, #ff5f57, #ff3030)';
          }
          
          loadFill.style.background = gradient;
        }
      } catch (error) {
        console.error('Error updating load:', error);
      }
    }
    
    startUpdating() {
      // Update system info every 5 seconds
      this.updateInterval = setInterval(() => {
        this.updateSystemInfo();
      }, 5000);
      
      // Update load animation more frequently
      this.loadInterval = setInterval(() => {
        this.updateLoad();
      }, 800);
      
      console.log('Resource widget update intervals started');
    }
    
    animateWidget() {
      // Add subtle floating animation
      let startTime = Date.now();
      
      const animate = () => {
        const time = (Date.now() - startTime) * 0.001;
        const floatOffset = Math.sin(time * 0.6) * 2;
        
        if (this.widget) {
          this.widget.style.transform = `translateY(${floatOffset}px)`;
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    destroy() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      if (this.loadInterval) {
        clearInterval(this.loadInterval);
      }
    }
  }
  
  // Spotify Background Controller
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
          
          // console.log(`Music ${this.isPlaying ? 'playing' : 'paused'}`);
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
          // console.log(`Playing playlist: ${playlistName}`);
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
      // console.log(`Now playing: ${track.name} by ${track.artist}`);
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
  
  // Enhanced loading and initialization
  function initializeApplication() {
    // console.log('=== DevOps Portfolio with Spotify Integration Initializing ===');
    
    try {
      // Initialize particle system
      // console.log('Starting particle system...');
      const particleSystem = new DevOpsParticleSystem();
      window.particleSystem = particleSystem; // For debugging
      
      // Initialize resource usage widget
      // console.log('Starting resource widget...');
      const resourceWidget = new ResourceUsageWidget();
      window.resourceWidget = resourceWidget; // For debugging
      
      // Initialize Spotify background
      // console.log('Starting Spotify background...');
      const spotifyBackground = new SpotifyBackgroundController();
      window.spotifyBackground = spotifyBackground; // For debugging
      
      // console.log('✅ All systems initialized successfully');
      
      // Force initial particle creation
      setTimeout(() => {
        if (particleSystem.particles.length === 0) {
          // console.log('Force creating initial particles...');
          for (let i = 0; i < 5; i++) {
            particleSystem.createParticle(true);
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error initializing systems:', error);
    }
  }
  
  // Add enhanced styling and animations
  function addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(29, 185, 84, 0.3);
        }
        50% {
          box-shadow: 0 0 20px rgba(29, 185, 84, 0.6);
        }
      }
      
      .terminal-window {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .terminal-window:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
      .terminal-window:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
      .terminal-window:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
      .terminal-window:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
      
      .particle {
        will-change: transform, opacity;
      }
      
      .resource-widget {
        animation: fadeInUp 1s ease-out 0.5s both;
        opacity: 0;
      }
      
      .resource-header:hover {
        animation: pulseGlow 2s ease-in-out infinite;
      }
      
      .spotify-interface {
        animation: fadeInUp 1.2s ease-out 0.2s both;
        opacity: 0;
      }
      
      .now-playing-bar {
        animation: fadeInUp 1s ease-out 0.8s both;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Add enhanced styles first
    addEnhancedStyles();
    
    // Add loading animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease-in-out';
    
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
    
    // Initialize main application after short delay
    setTimeout(() => {
      initializeApplication();
    }, 300);
    
    // Add scroll-based animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);
    
    // Observe terminal windows after they exist
    setTimeout(() => {
      document.querySelectorAll('.terminal-window').forEach(window => {
        observer.observe(window);
      });
    }, 500);
    
    // Console welcome message
    console.log(`
      ╔══════════════════════════════════════╗
      ║     DevOps Portfolio v3.0 Spotify   ║
      ║        Enhanced Terminal Edition     ║
      ║                                      ║
      ║  🎵 Spotify Background: ACTIVE       ║
      ║  📊 Resource Monitor: RUNNING        ║
      ║  🐳 Docker   ☸️  Kubernetes          ║
      ║  ☁️  AWS      🔧 Terraform           ║
      ║  🔄 Jenkins  📊 Prometheus           ║
      ║  🔥 Git      ⚡ Ansible              ║
      ║                                      ║
      ║  ✨ Particles: ACTIVE                ║
      ║  🖱️  Parallax: ENABLED              ║
      ║  🎧 Now Playing: Study Beats         ║
      ╚══════════════════════════════════════╝
    `);
    
    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 Portfolio loaded in ${Math.round(loadTime)}ms`);
        
        // Log system capabilities
        console.log('💻 System Info:', {
          cores: navigator.hardwareConcurrency || 'Unknown',
          memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
          connection: navigator.connection?.effectiveType || 'Unknown',
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          userAgent: navigator.userAgent.substring(0, 50) + '...'
        });
      });
    }
  });

// Ensure the DOM is fully loaded before instantiating your class
document.addEventListener('DOMContentLoaded', function() {
    const myDevOpsSystem = new DevOpsParticleSystem();
    myDevOpsSystem.init(); // Call the init method after creating an instance
});
