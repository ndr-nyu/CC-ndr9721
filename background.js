let sparks = []; 

function setup() { 
    let cnv = createCanvas(windowWidth, windowHeight); 
    cnv.style('z-index', '-1'); // Keep behind HTML elements 
    cnv.style('position', 'fixed'); // Pin full screen 
    cnv.style('top', '0'); 
    cnv.style('left', '0'); 
    cnv.style('pointer-events', 'none'); // Lets clicks pass directly to cards 
}

function draw() { 
    clear(); // Leaves canvas background transparent so CSS background shows 
    
    // Ambient Background Sparkles (spawns randomly) 
    sparks.push({ 
        x: random(width),  
        y: random(height), 
        vx: random(-0.3, 0.3), 
        vy: random(-0.5, 0.1), 
        size: random(1.2, 3.0), 
        alpha: random(120, 220), 
        decay: random(1.5, 3.0), 
        isMouseSpark: false
    }); 

    // Mouse Emitter Sparkles (spawns directly at cursor!) 
    if (mouseX > 0 && mouseY > 0) { 
        for (let i = 0; i < 2; i++) { 
            sparks.push({ 
                x: mouseX + random(-4, 4), 
                y: mouseY + random(-4, 4), 
                vx: random(-0.5, 0.5), 
                vy: random(-0.5, 0.5), 
                size: random(2.0, 4.5), 
                alpha: 255, 
                decay: random(1.0, 2.0), 
                isMouseSpark: true 
            }); 
        }
    }

    // Update and draw each sparkler particle 
    for (let i = sparks.length - 1; i >= 0; i--) { 
        let s = sparks[i]; 

        // Subtle attraction force pulling nearby ambient sparks toward cursor 
        if (!s.isMouseSpark && mouseX > 0 && mouseY > 0) { 
            let d = dist(s.x, s.y, mouseX, mouseY); 
            if (d < 150) { 
                s.vx += (mouseX - s.x) * 0.0003; 
                s.vy += (mouseY - s.y) * 0.0003; 
            } 
        } 

        s.x += s.vx; 
        s.y += s.vy; 
        s.alpha -= s.decay; 
        
        // Draw glowing sparkler dot 
        noStroke(); 
        // Cyan glow for mouse sparks, warm gold for ambient background 
        if (s.isMouseSpark) { 
            fill(56, 189, 248, s.alpha); 
        } else { 
            fill(255, 230, 170, s.alpha); 
        }

        circle(s.x, s.y, s.size); 
        
        // Remove invisible sparks 
        if (s.alpha <= 0) { 
            sparks.splice(i, 1); 
        } 
    } 
} 

// Keep canvas full screen on window resize 
function windowResized() { 
    resizeCanvas(windowWidth, windowHeight); 
}