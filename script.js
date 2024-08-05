let countdown = 5;
let timerInterval;
let recognition;
let isRecording = false;
let animationFrameId;

// Check for browser support
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        console.log('Voice recognition started.');
    };

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        document.getElementById('message').textContent = `You said: ${command}`;
        drawShape(command);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };

    recognition.onend = () => {
        isRecording = false;
        console.log('Voice recognition ended.');
    };
} else {
    alert("Your browser doesn't support speech recognition.");
}

document.getElementById('startButton').addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
        return;
    }

    startRecording();
});

function startRecording() {
    isRecording = true;
    countdown = 5;
    document.getElementById('timer').textContent = countdown;
    document.getElementById('message').textContent = "Recording...";

    // Start the voice recognition
    if (recognition) {
        recognition.start();
    }

    // Start the countdown timer
    timerInterval = setInterval(() => {
        countdown--;
        document.getElementById('timer').textContent = countdown;

        if (countdown === 0) {
            stopRecording();
        }
    }, 1000);
}

function stopRecording() {
    clearInterval(timerInterval);
    document.getElementById('message').textContent = "Record completed";
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
    }
}

function drawShape(command) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image(); // Create a new image instance
    const imageName = command.split(" ")[1]; // Assumes the command is like "draw mountain"
    img.src = `${imageName}.jpg`; // Set the path to your image
    // Cancel any ongoing animation
    cancelAnimationFrame(animationFrameId);

    // Clear the canvas before drawing a new shape
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (command.includes("circle")) {
        animateCircle(ctx, 250, 250, 100);
    } else if (command.includes("rectangle")) {
        animateRectangle(ctx, 150, 150, 200, 100);
    } else if (command.includes("square")) {
        animateSquare(ctx, 150, 150, 200);
    } else if (command.includes("triangle")) {
        animateTriangle(ctx, 250, 100, 350, 300, 150, 300);
    } else if (command.includes("ellipse")) {
        animateEllipse(ctx, 250, 250, 150, 100);
    } else if (command.includes("pentagon")) {
        animatePolygon(ctx, 5, 250, 250, 100);
    } else if (command.includes("hexagon")) {
        animatePolygon(ctx, 6, 250, 250, 100);
    } else if (command.includes("cube")) {
        animate3DCube(ctx);
    } else if (command.includes("cylinder")) {
        animate3DCylinder(ctx);
    } else if (command.includes("pic")) {
        img.onload = () => {
            animateImage(ctx, img, 400, 400, 400, 200); // Adjust coordinates and size as needed
        };
    } else {
        document.getElementById('message').textContent = "Shape not recognized. Try 'circle', 'rectangle', 'square', 'triangle', 'ellipse', 'pentagon', 'hexagon', 'cube','cylinder' or 'cartoons'.";
    }
}

// Animation functions for each shape
function animateCircle(ctx, cx, cy, radius) {
    let progress = 0;
    function draw() {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2 * progress);
        ctx.stroke();
        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}

function animateRectangle(ctx, x, y, width, height) {
    let progress = 0;
    function draw() {
        ctx.beginPath();
        if (progress < 0.25) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + progress * 4 * width, y); // Top line
        } else if (progress < 0.5) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y); // Complete top line
            ctx.lineTo(x + width, y + (progress - 0.25) * 4 * height); // Right line
        } else if (progress < 0.75) {
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width, y + height); // Complete right line
            ctx.lineTo(x + width - (progress - 0.5) * 4 * width, y + height); // Bottom line
        } else {
            ctx.moveTo(x + width, y + height);
            ctx.lineTo(x, y + height); // Complete bottom line
            ctx.lineTo(x, y + height - (progress - 0.75) * 4 * height); // Left line
        }
        ctx.stroke();
        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}

function animateSquare(ctx, x, y, size) {
    animateRectangle(ctx, x, y, size, size);
}

function animateTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    let progress = 0;
    function draw() {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        if (progress < 1) {
            if (progress < 1 / 3) {
                ctx.lineTo(x1 + (x2 - x1) * 3 * progress, y1 + (y2 - y1) * 3 * progress);
            } else if (progress < 2 / 3) {
                ctx.lineTo(x2, y2);
                ctx.lineTo(x2 + (x3 - x2) * 3 * (progress - 1 / 3), y2 + (y3 - y2) * 3 * (progress - 1 / 3));
            } else {
                ctx.lineTo(x3, y3);
                ctx.lineTo(x3 + (x1 - x3) * 3 * (progress - 2 / 3), y3 + (y1 - y3) * 3 * (progress - 2 / 3));
            }
            ctx.stroke();
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}

function animateEllipse(ctx, cx, cy, rx, ry) {
    let progress = 0;
    function draw() {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2 * progress);
        ctx.stroke();
        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}

function animatePolygon(ctx, sides, xCenter, yCenter, radius) {
    let progress = 0;
    function draw() {
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = xCenter + radius * Math.cos(angle);
            const y = yCenter + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}


function animate3DCube(ctx) {
    let progress = 0;
    const size = 100;
    const x = 200;
    const y = 200;

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw the front face of the cube
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.stroke();

        // Draw the top face of the cube
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / 2, y - size / 2);
        ctx.lineTo(x + size + size / 2, y - size / 2);
        ctx.lineTo(x + size, y);
        ctx.closePath();
        ctx.stroke();

        // Draw the side face of the cube
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size + size / 2, y - size / 2);
        ctx.lineTo(x + size + size / 2, y + size / 2);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.stroke();

        if (progress < 1) {
            progress += 0.02;
            requestAnimationFrame(draw);
        }
    }

    draw();
} 



function animate3DCylinder(ctx) {
    let progress = 0;
    const x = 200;
    const y = 150;
    const radius = 100;
    const height = 150;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw top ellipse
        ctx.beginPath();
        ctx.ellipse(x + radius, y, radius, radius / 2, 0, 0, Math.PI * 2 * progress);
        ctx.stroke();

        // Draw sides
        if (progress >= 0.5) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + height * 2 * (progress - 0.5));
            ctx.moveTo(x + 2 * radius, y);
            ctx.lineTo(x + 2 * radius, y + height * 2 * (progress - 0.5));
            ctx.stroke();
        }

        // Draw bottom ellipse (solid part)
        if (progress >= 1) {
            ctx.beginPath();
            ctx.ellipse(x + radius, y + height, radius, radius / 2, 0, 0, Math.PI);
            ctx.stroke();
        }

        // Draw bottom ellipse (dashed part)
        if (progress >= 1) {
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.ellipse(x + radius, y + height, radius, radius / 2, 0, Math.PI, 0);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw shadow
        if (progress >= 1) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.beginPath();
            ctx.ellipse(x + radius, y + height, radius, radius / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}

function animateImage(ctx, img, width, height) {
    let progress = 0;

    // Calculate center position
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const imgX = (canvasWidth - width) / 2;
    const imgY = (canvasHeight - height) / 2;

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw the image with a top-to-bottom reveal
        ctx.drawImage(img, imgX, imgY + (height - height * progress), width, height * progress);

        // Draw the rest of the shapes (if any) below the image
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.stroke();

        if (progress < 1) {
            progress += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        }
    }
    draw();
}