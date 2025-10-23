



export  class bgAnimation{
    constructor(){

    }

     static renderBgAnimation(){
        const body = document.body;

// Create a canvas for the background animation
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.classList.add('bg-canvas');
body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// Responsive resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Animated particles
const particles = [];
const PARTICLE_COUNT = 100;
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
        color: `hsla(${Math.random() * 360}, 70%, 70%, 0.7)`
    });
}

function drawGradientBackground() {
    // Create a moving linear gradient
    const time = Date.now() * 0.0002;
    const grad = ctx.createLinearGradient(
        canvas.width * (0.5 + 0.5 * Math.sin(time)),
        0,
        canvas.width * (0.5 + 0.5 * Math.cos(time)),
        canvas.height
    );
    grad.addColorStop(0, `hsl(${(time * 120) % 360}, 60%, 20%)`);
    grad.addColorStop(1, `hsl(${(time * 120 + 120) % 360}, 60%, 40%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    drawGradientBackground();

    // Draw and move particles
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);

        // Use a radial gradient for each particle
        const particleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        particleGrad.addColorStop(0, p.color);
        particleGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = particleGrad;
        ctx.fill();

        // Move
        p.x += p.dx;
        p.y += p.dy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }

    // Draw lines between close particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const a = particles[i];
            const b = particles[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 100) {
                ctx.strokeStyle = 'rgba(200,200,255,0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();


    }


}