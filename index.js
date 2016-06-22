$(document).ready(function () {
	
	/* visible canvas area */
	GameCanvas = function () {
			this.canvas  = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid    = new GameGrid();
			this.queue   = new Queue();
	};

	/* populates canvas with visible orbs */
	GameCanvas.prototype.fillCanvas = function () {
		for (var j=0; j<5; j++) {
			for (var i=0; i<15;i++) {
				var orb = this.grid.grid[j][i],
					orbCol = 15 + (this.grid.grid[j][i].position[0] * 29), //29 substitues for the gap between rows.
					orbRow = 15 + (this.grid.grid[j][i].position[1] * 30);
				
				if (j % 2 != 0) orbRow += 15; //offsets every other row
		
				orb.drawOrb(orbRow, orbCol);	
			}
		}
	};

	GameCanvas.prototype.start = function () {
		this.canvas.setAttribute('id', 'canvas');
		this.canvas.width = 465;
		this.canvas.height = 600;
		
		$('#canvas-area').html(this.canvas);
	};

	GameCanvas.prototype.drawAimer = function (mouseCoords) {
		var x = mouseCoords[0],
			y = mouseCoords[1],
			aimerX = 230,
			aimerY = 600,
			mouseAngle = radToDeg(Math.atan2((aimerY+15) - y, x - (aimerX+15)));

		if (mouseAngle < 0) {
        	mouseAngle = 180 + (180 + mouseAngle);
    	}	

		function radToDeg(angle) {
		    return angle * (180 / Math.PI);
		}

		function degToRad(angle) {
    		return angle * (Math.PI / 180);
		}

		context.clearRect(205,560,50,50);
		this.queue.curr.drawOrb(aimerX, aimerY-15); //draws first orb in queue to pointer location
		this.context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = "green";	
		this.context.moveTo(aimerX, aimerY-15);
		this.context.lineTo(aimerX + 1.5 * 15 * Math.cos(degToRad(mouseAngle)),
						   (aimerY - 15) - 1.5 * 15 * Math.sin(degToRad(mouseAngle))); 
		this.context.stroke();	
	};

	/* array grid to store orb data and locations */
	GameGrid = function () {
		this.grid = []; //[row][col]
	};

	/* populates grid with orbs */
	GameGrid.prototype.fillGrid = function () {
		this.rows = 15;
		this.cols = 15;
		
		for (var j = 0; j<5; j++) {
			var row = [];
			for (var i = 0; i<this.rows; i++){
				var orb = new Orb([j, i]);
				row.push(orb);
			}
			this.grid[j] = row;
		}
	};

    /* Orb Class */
	Orb = function(position) {
		this.position  = position || null; //array or null
		this.color     = randomColor();
		this.neighbors = [];
		this.diameter  = 30;
	
		function randomColor() {
			var colors = ['#FFE600'/* yellow */,
						  '#C9C9C9'/* gray */,
						  '#FF0000'/* red */,
						  '#1464F4'/* blue */,
						  '#00EE00'/* green */,
						  '#FF00FF' /* purple */,
						  '#00FFFF'/* light blue */];
		
			return colors[Math.floor(Math.random() * colors.length)];
		};
	};

	/* Draws singular Orb */
	Orb.prototype.drawOrb = function (orbX, orbY) {
		context = gameCanvas.context;
		context.beginPath();
		context.arc(orbX, orbY, this.diameter/2, 0, 2 * Math.PI, false);
	    context.fillStyle = this.color;
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
	    context.closePath();
	    context.stroke();
	};


	Queue = function () {
		this.curr = new Orb();
		this.onDeck = new Orb();
	};

	Queue.prototype.nextOrb = function () {
		this.curr = this.onDeck;
		this.onDeck = new Orb();
	};
//						TO-DO:
//-------------------------------------------------------
//add orb to end of pointer
//shoot orb
//collision detection
//add orb to queue position to the side of the pointer 
//calculate individual orbs position

	//start game! 
	$('#start-button').click(function () {
		$('#start-button').off();
		gameCanvas = new GameCanvas;
		gameCanvas.start();
		gameCanvas.grid.fillGrid();
		gameCanvas.fillCanvas();
		mouseCoordsOnCanvas();
		console.log(gameCanvas.queue);
		
		//returns current mouse X and Y relative to canvas
		function mouseCoordsOnCanvas() {
			var canvasTop  = gameCanvas.canvas.getBoundingClientRect().top,
				canvasLeft = gameCanvas.canvas.getBoundingClientRect().left,
				canvasX, canvasY, mouseCoords = 1;

			$('#canvas').on('mousemove', getMouseCoords);
			
			function getMouseCoords (event) {
				canvasX = event.pageX - canvasLeft;
				canvasY = event.pageY - canvasTop;
				mouseCoords = [canvasX, canvasY];
				gameCanvas.drawAimer(mouseCoords); 
			};	
	
		}
	});
})