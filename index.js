$(document).ready(function () {
	
	/* visible canvas area */
	GameCanvas = function () {
			this.canvas  = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid    = new GameGrid();
			this.queue   = new Queue();
			this.mouseCoords = [];
			this.angle   = 0;
	};

	/* populates canvas with visible orbs */
	GameCanvas.prototype.fillCanvas = function () {
		for (var j=0; j < this.grid.rows; j++) {
			for (var i=0; i < this.grid.cols; i++) {
				var orb = this.grid.grid[j][i];
				orb.drawOrb();	
			}
		}
	};

	GameCanvas.prototype.start = function () {
		this.canvas.setAttribute('id', 'canvas');
		this.canvas.width = 465;
		this.canvas.height = 600;
		
		$('#canvas-area').html(this.canvas); //adds canvas to the canvas area
		this.grid.fillGrid(); // fills the grid with orb data
		this.fillCanvas(); // fills the canvas with visible orbs
		this.drawQueuedOrbs();
	};

	GameCanvas.prototype.drawAimer = function (mouseCoords) {
		var x = mouseCoords[0],
			y = mouseCoords[1],
			aimerX = 230,
			aimerY = 600,
			mouseAngle = radToDeg(Math.atan2((aimerY+15) - y, x - (aimerX+15)));
			this.mouseCoords = mouseCoords;
			
		if (mouseAngle < 0) {
        	mouseAngle = 180 + (180 + mouseAngle);
    	}	

    	// this.angle = mouseAngle;

    	renderAimer(this);	

		function renderAimer (that) {
			var curr = that.queue.curr;

			context.clearRect(205, 560, 50, 50);
			curr.drawOrb(curr.X, curr.Y);
			that.context.beginPath();
			context.lineWidth = 3;
			context.strokeStyle = "green";	
			that.context.moveTo(aimerX, aimerY - 15);
			that.context.lineTo(aimerX + 1.5 * 15 * Math.cos(degToRad(mouseAngle)),
							   (aimerY - 15) - 1.5 * 15 * Math.sin(degToRad(mouseAngle))); 
			that.context.stroke();	
		};
	};

	GameCanvas.prototype.drawQueuedOrbs = function () {
		drawQueuedOrbs(this);

		function drawQueuedOrbs(that) {
			var curr = that.queue.curr,
				onDeck = that.queue.onDeck;

			curr.drawOrb(curr.X, curr.Y); //draws first orb in queue to pointer location
			onDeck.drawOrb(onDeck.X, onDeck.Y);
		};
	};

	// GameCanvas.prototype.shootOrb = function () {
	// 	var curr = this.queue.curr,
	// 		now  = new Date().getTime(),
 //        	dt   = now - (time || now),
	// 		time;
		
	// 	console.log(dt);

	// 	time = now;
	// 	curr.X += dt * curr.speed * Math.cos(degToRad(this.angle));
	// 	curr.Y += dt * curr.speed * (-1 * Math.cos(degToRad(this.angle)));

	// }

	/* array grid to store orb data and locations */
	GameGrid = function () {
		this.grid = []; //[row][col]
		this.cols = 15;
		this.rows = 10;
		this.totalRows = 19;
	};

	GameGrid.prototype.fillGrid = function () {   /* populates grid with initial orbs */
		
		for (var j = 0; j < this.totalRows; j++) {
			var row = [];
			for (var i = 0; i < this.cols; i++){
				if (j < this.rows) {
					var orb = new Orb([j, i]);
					row.push(orb);
				}
				else {
					row.push('empty');
				}
			}
			this.grid[j] = row;
		}
	};

    /* Orb Class */
	Orb = function(position) {
		this.position  = position;
		this.color     = randomColor();
		this.neighbors = [];
		this.diameter  = 30;
		this.X 	       = this.getOrbCoords(position, this.diameter)[0];
		this.Y 	       = this.getOrbCoords(position, this.diameter)[1];
		this.gridPos   = this.getGridPosition();
		this.speed     = 1;
		this.angle     = 1;

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

	Orb.prototype.getOrbCoords = function (position, diameter) {
		var row       = position[0],
			col       = position[1],
			rowHeight = 29,
			X         = 15 + diameter * col,
			Y         = 15 + rowHeight * row;

		if (row % 2 != 0) X += 15;

		return [X, Y];   //returns center [x, y] of orb
	};

	Orb.prototype.getGridPosition = function () {   // x and y will be the coordinates of the center of an orb
		var rowHeight = 29,
			x         = this.X,
			y         = this.Y,
			row       = Math.floor(y / rowHeight),
			rowOffset = 0,
			col;

		if (row % 2 != 0) rowOffset = 15;

		col = Math.floor((x-rowOffset) / this.diameter);

		return {row: row, col: col};
	};

	/* Draws singular Orb */
	Orb.prototype.drawOrb = function (x, y) {
		context = gameCanvas.context;
		context.beginPath();
		if (x && y) {
			context.arc(x, y, this.diameter/2, 0, 2 * Math.PI, false);	
		}
		else {
			context.arc(this.X, this.Y, this.diameter/2, 0, 2 * Math.PI, false);
		}
	    context.fillStyle = this.color;
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
	    context.closePath();
	    context.stroke();
	};

	Queue = function () {
		this.currPos   = [18, 7]; 
		this.onDeckPos = [19, 1];
		this.curr      = new Orb(this.currPos);
		this.onDeck    = new Orb(this.onDeckPos);
		this.curr.X    = 230;
		this.curr.Y    = 585;
		this.onDeck.X  = 170; 
		this.onDeck.Y  = 585;
	};

	Queue.prototype.nextOrb = function () {
		this.curr = this.onDeck;
		this.onDeck = new Orb(this.onDeckPos);
	};
//						TO-DO:
//-------------------------------------------------------
//refactor drawing queued orbs to the canvas instead of directing passing the coords in to the drawOrb func
//shoot orb
//collision detection, walls and other orbs
//snap orb to grid and store in gameGrid in accurate position

	//start game! 
	$('#start-button').click(function () {
		$('#start-button').off();
		gameCanvas = new GameCanvas;
		gameCanvas.start();
		mouseCoordsOnCanvas(); //handles drawAimer initiation, eventually will want to make this an attribute on the gameCanvas|* * *|
		
		$('#canvas').on('mousemove', function () {
			// console.log(gameCanvas.mouseCoords);
		})
		
		$('#canvas').click(function () {
			var curr = gameCanvas.queue.curr,
				time;

			gameCanvas.angle = getCurrentMouseAngle(gameCanvas.mouseCoords);
			console.log(gameCanvas.angle);
			draw();	
			
			function draw() {     /***************** BREAK THIS OUT INTO Orb.shootOrb *******************************/
    			requestAnimationFrame(draw);
    			var now = new Date().getTime(),
        			dt = now - (time || now);
 
			    time = now;
			    context.clearRect(curr.X-17, curr.Y-17, 35, 35);
				curr.X += dt * curr.speed * Math.cos(degToRad(gameCanvas.angle));
				curr.Y += dt * curr.speed * (-1 * Math.sin(degToRad(gameCanvas.angle)));
				curr.drawOrb();
				console.log(curr.X, curr.Y);
				// console.log(Math.cos(degToRad(gameCanvas.angle)), (-1 * Math.cos(degToRad(gameCanvas.angle))));
			}
		})
		
		//returns current mouse X and Y relative to canvas
		function mouseCoordsOnCanvas() {
			var canvasTop  = gameCanvas.canvas.getBoundingClientRect().top,
				canvasLeft = gameCanvas.canvas.getBoundingClientRect().left,
				canvasX, canvasY, mouseCoords;

			$('#canvas').on('mousemove', getMouseCoords);
			
			function getMouseCoords (event) {
				canvasX = event.pageX - canvasLeft;
				canvasY = event.pageY - canvasTop;
				mouseCoords = [canvasX, canvasY];
				gameCanvas.drawAimer(mouseCoords);
			};	
		};
	});

	/* ***************** PUBLIC FUNCTIONS *********************** */

	function radToDeg(angle) {
	    return angle * (180 / Math.PI);
	}

	function degToRad(angle) {
		return angle * (Math.PI / 180);
	}

	function getCurrentMouseAngle(mouseCoords) {
		var x = mouseCoords[0],
			y = mouseCoords[1],
			aimerX = 230,
			aimerY = 600,
			mouseAngle = radToDeg(Math.atan2((aimerY+15) - y, x - (aimerX+15)));
			
		if (mouseAngle < 0) {
        	mouseAngle = 180 + (180 + mouseAngle);
    	}
    	console.log(mouseAngle);
		return mouseAngle;
	}


})