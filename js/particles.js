// ============================================
// SMERT-SHOP - Animated Particles Background
// ============================================

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
        this.ctx.fill();
    }
    
    drawLine(p1, p2, opacity) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Clamp position and reverse velocity if out of bounds
        if (particle.x < 0) {
            particle.x = 0;
            particle.vx *= -1;
        } else if (particle.x > this.canvas.width) {
            particle.x = this.canvas.width;
            particle.vx *= -1;
        }
        
        if (particle.y < 0) {
            particle.y = 0;
            particle.vy *= -1;
        } else if (particle.y > this.canvas.height) {
            particle.y = this.canvas.height;
            particle.vy *= -1;
        }
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.drawLine(this.particles[i], this.particles[j], opacity);
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.connectParticles();
        
        // Note: In a production app with SPA framework, add cleanup mechanism
        // to stop animation when component unmounts using cancelAnimationFrame
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('particles-canvas');
});
