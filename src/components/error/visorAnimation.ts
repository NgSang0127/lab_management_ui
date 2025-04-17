export function initAstronautAnimation(): void {
    const canvas = document.getElementById('visor') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function drawVisor(): void {
        ctx.beginPath();
        ctx.moveTo(5, 15);
        ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);
        ctx.lineTo(55, 20);
        ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);
        ctx.lineTo(15, 10);
        ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
        ctx.lineTo(5, 45);

        ctx.fillStyle = '#2f3640';
        ctx.strokeStyle = '#f5f6fa';
        ctx.fill();
        ctx.stroke();
    }

    const cordCanvas = document.getElementById('cord') as HTMLCanvasElement | null;
    if (cordCanvas) {
        const ctx2 = cordCanvas.getContext('2d');
        if (!ctx2) return;

        let y1 = 160, y2 = 100, y3 = 100;
        let y1Forward = true, y2Forward = false, y3Forward = true;

        function animate(): void {
            requestAnimationFrame(animate);
            ctx2.clearRect(0, 0, cordCanvas.width, cordCanvas.height);
            ctx2.beginPath();
            ctx2.moveTo(130, 170);
            ctx2.bezierCurveTo(250, y1, 345, y2, 400, y3);

            ctx2.strokeStyle = 'white';
            ctx2.lineWidth = 8;
            ctx2.stroke();

            if (y1 === 100) y1Forward = true;
            if (y1 === 300) y1Forward = false;
            if (y2 === 100) y2Forward = true;
            if (y2 === 310) y2Forward = false;
            if (y3 === 100) y3Forward = true;
            if (y3 === 317) y3Forward = false;

            y1Forward ? y1++ : y1--;
            y2Forward ? y2++ : y2--;
            y3Forward ? y3++ : y3--;
        }

        drawVisor();
        animate();
    }
}