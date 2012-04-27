/*
	testAccel.js
*/
var console_log;                // Debugging div on device
            var canvas_ctx;                 // HTML canvas 2d context
            var SPEED = 10;                 // Canvas redraw speed in milliseconds and accelerometer frequency
            var DISTANCE_FACTOR = .1;       // Factor to adjust accelerometer values to screen distance. Cordova 1.6 changed to values to be Android compatible which appeared to be * 10. For Cordova 1.5 make this value 1.
            var ax = 0;                     // Acceleration x axis (Accelerometer value adjusted for direction)
            var ay = 0;                     // Acceleration y axis (Accelerometer value adjusted for direction)
            var x;                          // Circle x position
            var y;                          // Circle y position
            var vx = 0;                     // Velocity x axis
            var vy = 0;                     // Velocity y axis
            var WIDTH = 400;                // Width of canvas
            var HEIGHT = 400;               // Height of canvas
            var RADIUS = 40;                // Width of circle object
            var CIRCLE_COLOR = "#8ED6FF";      // Circle color
            var CANVAS_COLOR = "#FFFFFF";   // Color of canvas background
            var watchID;                    // Accelerometer.watchAcceleration return value.
            var drawID;                     // Draw time interval.
            var playing = true;             // Boolean if animation is playing.
            /* DOM body onload event callback */
            function onBodyLoad()
            {
                document.addEventListener("deviceready", onDeviceReady, false);
            }
            /* Cordova has been initialized and is ready to roll */
            function onDeviceReady()
            {
                console.log('console_div');
                console_log = document.getElementById('console_div');
                console_log.innerHTML += "onDeviceReady()<br/>";
                init();
            }
            /* Initialize canvas and animation */
            function init()
            {
                var canvas = document.getElementById("canvas");
                canvas_ctx = canvas.getContext("2d");
                // Center
                x = WIDTH / 2 ;
                y = HEIGHT/ 2 ;
                startPlay();
            }
            /* Start watching the accelerometer */
            function startWatch()
            {
                var options = { frequency: SPEED };
                watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
            }
            // Stop watching the accelerometer
            function stopWatch()
            {
                if (watchID) {
                    navigator.accelerometer.clearWatch(watchID);
                    watchID = null;
                }
            }
            /* Accelerometer data callback */
            function onSuccess( acceleration )
            {
                // Set drawing acceleration values
                ax = acceleration.x * DISTANCE_FACTOR * -1; // -1 to change direction for Cordova 1.6. Removed for Cordova 1.5.
                ay = acceleration.y * DISTANCE_FACTOR ;// Add * -1 for Cordova 1.5;
                // Optional ouput for understanding accelerator values.
                console_log.innerHTML =
                'Acceleration X: ' + acceleration.x + '<br />' +
                'Acceleration Y: ' + acceleration.y + '<br />' +
                'Acceleration Z: ' + acceleration.z + '<br />' +
                'Timestamp: '      + acceleration.timestamp ;
            }
            /*  Accelerometer error callback */
            function onError()
            {
                alert("Accelerometer Error");
            }
            /* Steps to start animation play */
            function startPlay()
            {
                playing = true;
                vx = 0;
                vy = 0;
                startWatch();
                drawID = setInterval(draw, SPEED);
            }
            /* Steps to stop animation play */
            function stopPlay()
            {
                clearInterval(drawID);
                stopWatch();
                playing = false;
            }
            /* Draw circle */
            function circle( x, y, r )
            {
                canvas_ctx.beginPath();
                canvas_ctx.arc(x, y, r, 0, Math.PI*2, false);
                canvas_ctx.fill();
				canvas_ctx.lineWidth = 5;
				canvas_ctx.strokeStyle = "black";
				canvas_ctx.stroke();
            }
            /* Draw rectangle */
            function rect( x, y, w, h )
            {
                canvas_ctx.beginPath();
                canvas_ctx.rect(x,y,w,h);
                canvas_ctx.closePath();
                canvas_ctx.fill();
            }
            /* Clear canvas */
            function clear()
            {
                canvas_ctx.clearRect(0, 0, WIDTH, HEIGHT);
            }
            /* Compute drawing metrics and draw frame */
            function draw()
            {
                // Increase velocity by acceleration
                vx += ax;
                vy += ay;
                // Update circle drawing position.
                x += vx;
                y += vy;
                /* Boundaries testing */
                // Right boundary
                if ( x + RADIUS > WIDTH  )
                {
                    x = WIDTH - RADIUS ;
                    vx = 0;
                }
                // Left boundary
                if (x - RADIUS  <= 0)
                {
                    x = RADIUS   ;
                    vx = 0;
                }
                // Bottom boundary
                if (y +  RADIUS  > HEIGHT)
                {
                    y = HEIGHT - RADIUS ;
                    vy = 0;
                }
                // Top boundary
                if (y - RADIUS  <= 0)
                {
                    y = RADIUS  ;
                    vy = 0;
                }

                // Debugging info.
                console_log.innerHTML =
                'x: ' + x + '<br />' +
                'y: ' + y + '<br />' +
                'vx: ' + vx + '<br />' +
                'vy: ' + vy + '<br />' +
                'ax: ' + ax + '<br />' +
                'ay: ' + ay + '<br />' ;    

                /* Draw frame */
                // Clear canvas
                clear();
                // Draw canvas background
                canvas_ctx.fillStyle = CANVAS_COLOR;
                rect( 0, 0, WIDTH, HEIGHT );
                /* Draw circle */
                canvas_ctx.fillStyle = CIRCLE_COLOR;
                circle( x, y, RADIUS );
            }
            /* Canvas tag touch end event handler */
            function canvasTouchEnd()
            {
                if (playing)
                {
                    stopPlay();
                }
                else
                {
                    startPlay();
                }
            }