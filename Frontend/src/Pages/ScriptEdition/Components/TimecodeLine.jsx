import { React, useEffect } from 'react';

const canvasHeight = 80;


const TimecodeLine = ({videoLength, secondToPixelCoef, minute, zoom}) => {

    const drawLine = function(ctx, xCoordinate, heightCoef) {
        ctx.moveTo(xCoordinate, canvasHeight);
        ctx.lineTo(xCoordinate, canvasHeight - canvasHeight * heightCoef);
        ctx.stroke();
    }
    
    const fillBackground = function(ctx, canvas) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    useEffect(() => {
        const drawTimecodeLines = function() {
            const spacing = secondToPixelCoef / 1000;
            var canvas = document.getElementById('timecodeCanvas');
            var ctx = canvas.getContext('2d');
            fillBackground(ctx, canvas);
            ctx.lineWidth = 1;
            ctx.font = "15px Arial";
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
    
    
            ctx.beginPath();
    
            for (var second = 0; second < 60; second++) {
                drawLine(ctx, spacing * second, 0.5);
                if (second !== 0 && second % 10 === 0)
                    ctx.fillText(`${second}s`, spacing * second - 7.5, 30);
                // ms
                drawLine(ctx, spacing * second + spacing * 0.25, 0.2);
                drawLine(ctx, spacing * second + spacing * 0.5, 0.2);
                drawLine(ctx, spacing * second + spacing * 0.75, 0.2);
            }
            drawLine(ctx, spacing * 60, 0.8);
            ctx.textAlign = 'end';
            ctx.fillText(`${minute}m`, spacing * 60 - 2, 30);
        }

        drawTimecodeLines();
    }, [minute, secondToPixelCoef]);

    return (
        <canvas id='timecodeCanvas' className='bg-black'
        style={{width: `${secondToPixelCoef * videoLength / 10000000}px`, height: `${canvasHeight}px`}}
        width={9000} height={canvasHeight}>
        </canvas>
    )
}

export default TimecodeLine;