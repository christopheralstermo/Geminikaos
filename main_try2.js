let canvas, container, ball, kanon, xFriction, vx, vy, kanonHøyde;
let count = 0;
let v = 0;
let gravity = .7;
let bounce = 0.3;
const radius = 100;
let vinkelen = 0;
let balls = [];
let colors = ["red", "green", "yellow", "purple", "orange", "blue", "black", "white"];
let colorIndex = 0;

canvas = document.querySelector('canvas');
c = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth - 30;
canvas.height = innerHeight - 50;
const fastPunkt = { x: canvas.width / 7, y: canvas.height / 1.5 };

let targetBall = {
    x: canvas.width / 2,
    y: canvas.height - 20,
    radius: 20,
    color: "blue",
    vx: 0,
    vy: 0,
};

function init() {
    vx = v * Math.cos(vinkelen / 180 * Math.PI);
    vy = v * -Math.sin(vinkelen / 180 * Math.PI);
    xFriction = 0.9 + bounce;
    kanonHøyde = canvas.height / 1.5;
    let newBall = { x: canvas.width / 7, y: kanonHøyde, radius: 20, status: 0, color: colors[colorIndex], vx: vx, vy: vy };
    balls.push(newBall);
    colorIndex = (colorIndex + 1) % colors.length;
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
        c.beginPath();
        c.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2, false);
        c.fillStyle = balls[i].color;
        c.fill();
        c.closePath();
    }

    c.beginPath();
    c.arc(targetBall.x, targetBall.y, targetBall.radius, 0, Math.PI * 2, false);
    c.fillStyle = targetBall.color;
    c.fill();
    c.closePath();

    updateVinkel();
    ballMovement();
    targetBallMovement();
    checkCollision();
}

function updateVinkel() {
    const bevegeligPunkt = {
        x: fastPunkt.x + radius * Math.cos(-vinkelen / 180 * Math.PI),
        y: fastPunkt.y + radius * Math.sin(-vinkelen / 180 * Math.PI),
    };

    c.beginPath();
    c.moveTo(fastPunkt.x, fastPunkt.y);
    c.lineTo(bevegeligPunkt.x, bevegeligPunkt.y);
    c.stroke();
    tegnPil(fastPunkt.x, fastPunkt.y, bevegeligPunkt.x, bevegeligPunkt.y);
}

function tegnPil(x1, y1, x2, y2) {
    const pilLengde = 20;
    const pilBredde = 10;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const vinkel = Math.atan2(dy, dx);

    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(
        x2 - pilLengde * Math.cos(vinkel - Math.PI / 6),
        y2 - pilLengde * Math.sin(vinkel - Math.PI / 6)
    );
    c.moveTo(x2, y2);
    c.lineTo(
        x2 - pilLengde * Math.cos(vinkel + Math.PI / 6),
        y2 - pilLengde * Math.sin(vinkel + Math.PI / 6)
    );
    c.stroke();
}

setInterval(draw, 1000 / 35);

function speed(theSpeed) {
    v = theSpeed;
}

function gravityn(theGravity) {
    gravity = theGravity / 10;
}

function angle(theAngle) {
    vinkelen = theAngle;
}

function spretten(theBounce) {
    bounce = theBounce / 10;
}

function ballMovement() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += gravity;

        if (balls[i].x + balls[i].radius > canvas.width) {
            balls[i].x = canvas.width - balls[i].radius;
            balls[i].vx = -balls[i].vx * bounce;
        } else if (balls[i].x - balls[i].radius < 0) {
            balls[i].x = balls[i].radius;
            balls[i].vx = -balls[i].vx * bounce;
        }

        if (balls[i].y + balls[i].radius > canvas.height) {
            balls[i].y = canvas.height - balls[i].radius;
            balls[i].vy *= -bounce;

            if (balls[i].vy < 0 && balls[i].vy > -2.1) {
                balls[i].vy = 0;
            }

            if ((canvas.height - balls[i].y) < 22) {
                count++;
                if (count > 14 && bounce < 0.8) {
                    balls[i].vy += 0.6;
                } else {
                    balls[i].vy += 0.9;
                }
            }

            if (Math.abs(balls[i].vx) < 1.1) {
                balls[i].vx = 0;
            }

            xF(i);
        }
    }
}

function targetBallMovement() {
    targetBall.x += targetBall.vx;
    targetBall.y += targetBall.vy;

    targetBall.vy += gravity;

    if (targetBall.x + targetBall.radius > canvas.width) {
        targetBall.x = canvas.width - targetBall.radius;
        targetBall.vx *= -bounce;
    } else if (targetBall.x - targetBall.radius < 0) {
        targetBall.x = targetBall.radius;
        targetBall.vx *= -bounce;
    }

    if (targetBall.y + targetBall.radius > canvas.height) {
        targetBall.y = canvas.height - targetBall.radius;
        targetBall.vy *= -bounce;
    }
}

function checkCollision() {

    for (let i = 0; i < balls.length; i++) {
        const dx = balls[i].x - targetBall.x;
        const dy = balls[i].y - targetBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < balls[i].radius + targetBall.radius) {

            const angle = Math.atan2(dy, dx);
            const overlap = balls[i].radius + targetBall.radius - distance;

            balls[i].x += overlap / 2 * Math.cos(angle);
            balls[i].y += overlap / 2 * Math.sin(angle);
            targetBall.x -= overlap / 2 * Math.cos(angle);
            targetBall.y -= overlap / 2 * Math.sin(angle);

            const v1 = Math.sqrt(balls[i].vx * balls[i].vx + balls[i].vy * balls[i].vy);
            const v2 = Math.sqrt(targetBall.vx * targetBall.vx + targetBall.vy * targetBall.vy);

            const theta1 = Math.atan2(balls[i].vy, balls[i].vx);
            const theta2 = Math.atan2(targetBall.vy, targetBall.vx);

            const phi = Math.atan2(targetBall.y - balls[i].y, targetBall.x - balls[i].x);

            const newVxBall = v2 * Math.cos(theta2 - phi) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
            const newVyBall = v2 * Math.cos(theta2 - phi) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
            const newVxTarget = v1 * Math.cos(theta1 - phi) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
            const newVyTarget = v1 * Math.cos(theta1 - phi) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

            balls[i].vx = newVxBall;
            balls[i].vy = newVyBall;
            targetBall.vx = newVxTarget;
            targetBall.vy = newVyTarget;
        }
    }


    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balls[i].radius + balls[j].radius) {

                const angle = Math.atan2(dy, dx);
                const overlap = balls[i].radius + balls[j].radius - distance;

                balls[i].x += overlap / 2 * Math.cos(angle);
                balls[i].y += overlap / 2 * Math.sin(angle);
                balls[j].x -= overlap / 2 * Math.cos(angle);
                balls[j].y -= overlap / 2 * Math.sin(angle);

                const v1 = Math.sqrt(balls[i].vx * balls[i].vx + balls[i].vy * balls[i].vy);
                const v2 = Math.sqrt(balls[j].vx * balls[j].vx + balls[j].vy * balls[j].vy);

                const theta1 = Math.atan2(balls[i].vy, balls[i].vx);
                const theta2 = Math.atan2(balls[j].vy, balls[j].vx);

                const phi = Math.atan2(balls[j].y - balls[i].y, balls[j].x - balls[i].x);

                const newVxBall1 = v2 * Math.cos(theta2 - phi) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
                const newVyBall1 = v2 * Math.cos(theta2 - phi) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
                const newVxBall2 = v1 * Math.cos(theta1 - phi) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
                const newVyBall2 = v1 * Math.cos(theta1 - phi) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

                balls[i].vx = newVxBall1;
                balls[i].vy = newVyBall1;
                balls[j].vx = newVxBall2;
                balls[j].vy = newVyBall2;
            }
        }
    }
}

function xF(index) {
    if (balls[index].vx > 0)
        balls[index].vx = balls[index].vx - xFriction;
    if (balls[index].vx < 0)
        balls[index].vx = balls[index].vx + xFriction;
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        vinkelen += 5; // Øk vinkelen
    } else if (event.key === 'ArrowRight') {
        vinkelen -= 5; // Reduser vinkelen
    } else if (event.key === ' ') {
        init(); // Launch ball
    }
});


