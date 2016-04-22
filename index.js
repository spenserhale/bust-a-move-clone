$(document).ready(function () {
	
	/*visible canvas area*/
	GameCanvas = function () {
			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid = new GameGrid();
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

	GameCanvas.prototype.drawAimer = function () {
		this.context.beginPath();
		this.context.moveTo(260, 550);
		this.context.lineTo(250, 600);
		this.context.lineTo(270, 600);
		context.fillStyle = 'orange';
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
		this.context.closePath();	
	};

	/* grid to store orbs and locations */
	GameGrid = function () {
		this.grid = []; //[row][col]
	};

	/*populates grid with orbs*/
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
		this.position  = position; //array
		this.color     = randomColor();
		this.neighbors = [];
		this.diameter  = 30;
	
		function randomColor() {
			var colors = ['#FFE600'/*yellow*/,
						  '#C9C9C9'/*gray*/,
						  '#FF0000'/*red*/,
						  '#1464F4'/*blue*/,
						  '#00EE00'/*green*/,
						  '#FF00FF' /*purple*/,
						  '#00FFFF'/*light blue*/];
		
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
//						TO-DO:
//-------------------------------------------------------
//calculate individual orbs position
//function for randomizing orb color
//function for filling the board with randommized orbs
//fill grid according to how many orbs fit in a row
//calculate how many orbs fit in a row
//at start of game fill 5 rows with orbs
//offset every other row (orb.diameter/2)

	//start game! 
	$('#start-button').click(function () {
		$('#start-button').off();
		gameCanvas = new GameCanvas;
		gameCanvas.start();
		gameCanvas.grid.fillGrid();
		gameCanvas.fillCanvas();
		gameCanvas.drawAimer();
		mouseCoordsOnCanvas();
		
		//returns current mouse X and Y relative to canvas
		function mouseCoordsOnCanvas() {
			var canvasTop  = gameCanvas.canvas.getBoundingClientRect().top,
				canvasLeft = gameCanvas.canvas.getBoundingClientRect().left;

			$(document).on('mousemove', function (event) {
				console.log(event.pageX - canvasLeft, event.pageY - canvasTop);
				
				var canvasX = event.pageX - canvasLeft,
					canvasY = event.pageY - canvasTop,
					mouseCoords = [canvasX, canvasY];

				return mouseCoords;
			})	
						 	
		}
	});
})