// Fisher–Yates shuffle 
Array.prototype.shuffle = function() {
 var input = this; 
 for (var i = input.length-1; i >=0; i--) { 
 	var randomIndex = Math.floor(Math.random()*(i+1)); 
 	var itemAtIndex = input[randomIndex]; 
 	input[randomIndex] = input[i]; 
 	input[i] = itemAtIndex; 
 } return input; 
}

function destoryLocalStorage(){
	localStorage.clear();
};

const mode = {intu: 0, ret: 1};

const DEBUG = 1;

const Characters = ['self', 'Your', 'Zhang', 'Wang', 'Li', 'Lala'];

var module = {

	initCharas: function(){
		this.characters = Array.from(Characters,(val)=>({cht: val, circle_c: null}));
		this.characters.shuffle();
		console.log(this.characters);
	},

	init: function(m){
		if (m = mode.intu){
			this.blankTimer = 0;	//白屏时间
			this.respTimer = 3;		//反应时间
		}else{
			this.blankTimer = 7;
			this.respTimer = 3;
		}
		this.mode = m;
		this.initCharas();
	}
};

var octopus = {

	init: function(m){
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}
		module.init(this.mode);


		
	},

	getRespTimer: function(){
		return module.respTimer * 1000;
	},

	getBlankTimer: function () {
		return module.blankTimer * 1000;
	},

	getMode: function(){
		return this.mode;
	},

	setPicClick: function(btIdx){
		module.clickPic(btIdx);
	},

	saveData: function(){
		var picArr = module.getAllData();
		completeView.init();
		console.log('Done!!');
	}
};

var stumiView = {

	init: function(){
		var self = this;
		self.timer = 0;
		self.drawCon = $('#stimuli-con');
		self.tipsCon = $('#tips-con');
		self.buttonCon = $('#button-con');
		self.nButton = $('#next-button');
		self.nButton.click(function(){ 
			self.render();
		}).hide();
		self.render();
	},

	clickButton: function(btIdx){
		var self=this;
		clearTimeout(self.tid)
		octopus.setPicClick(btIdx);
		self.picurl = octopus.getNextPic();
		this.render();
	},

	delay: function(timer){
		var self= this;
		return new Promise(function(resolve, reject){
			var timerID = setTimeout(function(){
				resolve({timerID:timerID});
			}, timer);
			self.tid = timerID;
		});
	},

	render: function(){

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();
		//self.clearScreen();

		return ;

		if (self.picurl == -1){
			return;
		}


		//console.log(picUrl);
		if (octopus.getMode() == mode.intu){
			self.delay(0).then(function(args){
				self.dispStumi('imgs/word/'+self.picurl);
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.nButton.show();
			});
			
		}else{
			self.delay(0).then(function(args){
				self.dispStumi('imgs/word/'+self.picurl);
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.dispTips('thinking...');
				return self.delay(octopus.getBlankTimer());
			}).then(function(args){
				self.tipsCon.empty();
				alert('click to continue...');
				return self.delay(0);
			}).then(function(args){
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.nButton.show();
			});
		}

	},

	dispStumi: function(picurl){
		this.pic.attr('src', picurl);
		this.pic.show();
	},

	dispButtons: function(){
		this.rButton.show();
		this.lButton.show();
	},

	dispTips: function(tips){
		this.tipsCon.empty().html(tips);
	},

	clearScreen: function(){
		this.pic.hide();
		this.rButton.hide();
		this.lButton.hide();
	},

	drawCircle: function(){
		var self = this;

        var $circle = null;  
  
        // 左上角
        var topX = 0, topY = 0;
        // 右下角
        var bottomX = 0, bottomY = 0;
        // 圆心
        var centerX, centerY; 
  
        // 是否正在画圆  
        var isDrawing = false;  
  
        // 按下鼠标开始画圆  
        this.drawCon.mousedown(function(event) {  
            $circle = $('<div class="circle"></div>');  
            topX = event.pageX;
            topY = event.pageY;
            $(this).append($circle);  
            isDrawing = true;  
            event.preventDefault();  
        });  
  
        // 鼠标拖动  
        $(document).mousemove(function(event) {  
            if(isDrawing) {

            	bottomX = event.pageX;
            	bottomY = event.pageY;

            	console.log(topX, topY, bottomX, bottomY)

                centerX = Math.abs(bottomX - topX) / 2;  
                centerY = Math.abs(bottomY - topY) / 2;  
                var radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY); // 半径，勾股定理  
                  
                // 下面四个条件判断是限制圆不能超出画布区域，如果不需要这个限制可以去掉这段代码  
                if(centerX - radius < 0) {  
                    radius = centerX;  
                }  
                if(centerY - radius < 0) {  
                    radius = centerY;  
                }  
                if(centerX + radius > $drawing.width()) {  
                    radius = $drawing.width() - centerX;  
                }  
                if(centerY + radius > $drawing.height()) {  
                    radius =  $drawing.height() - centerY;  
                }  
  
                // 设置圆的大小和位置  
                $circle.css("left", centerX - radius + "px");  
                $circle.css("top", centerY - radius + "px");  
                $circle.css("width", 2 * radius + "px");  
                $circle.css("height", 2 * radius + "px");  
                $circle.css("border-radius", radius + "px");  
            }  
        });  
  
        // 鼠标松开停止画圆  
        $(document).mouseup(function() {  
            isDrawing = false;  
        });  

	}
}

var completeView = {
	init: function(){
		this.headDiv = $('.head');
		this.render();
	},

	render: function(){
		this.headDiv.empty().html('<h2>Complete! Thank you!</h2>');
	}
}

$(document).ready(function(){
	octopus.init(mode.ret);
});