Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var popup = new Lytebox({
	btnAlign : 'center'
});

function SuperLucky(){

	var self =this,
		betLimit = 2,
		timerQueue,
		el;
	self.ctrlno = [];
	self.keys;
	self.bet;

	

	this.init = function(){

		el = {
			alphaKeys : $('#alpha-keys'),
			numericKeys : $('#numeric-keys'),
			ctrlNumberConfirm : $('#submit-ctrlno'),
			ctrlNumberClear : $('#clear-ctrlno'),
			buttonKeysHolder : $('#keys-holder'),
			buttonBetHolder : $('#bet-holder'),
			viewCtrlno : $('#ctrlno-holder'),
			viewKeys : $('#keys-view'),
			clearKeys : $('#keys-clear'),
			viewBet : $('#bet-view'),
			clearBet : $('#bet-clear'),
			submit : $('#place-bet'),
			timer : $('._timer'),

			//login
			inputUser : $('#user'),
			inputPass : $('#pass'),
			buttonLogin : $('#login'),

			//logged
			loguser : $('#logged'),
			buttonLogout : $('#logout'),

			//pages
			pages : $('.page'),
			pageLogin : $('#page-login'),
			pageCotejo : $('#page-cotejo'),
			pageBetting : $('#page-betting'),

			//combinations list
			betList : $('.combination-list'),
			buttonCloseCotejo : $('#close-cotejo')
		}

		self.login();
		self.createAlphaNumericKeys();
		self.activateButtons();
		self.generateKeysButtons();
		self.generateBetButtons();

	}

	this.login = function(){

		el.pageLogin.addClass('active');
		el.buttonLogin.click(function(){

			$.post('services/api.php',{
				user : el.inputUser.val(),
				pass : el.inputPass.val()
			},function(result){
				var data = eval('('+result+')');

				if(data.status==1){

					self.timerInit( data.system.timeout );
					el.loguser.text( data.user.name )

					self.paginate('cotejo');

				}else{
					el.inputPass.val('');
					popup.dialog({
						width : 600,
						title : 'Error',
						message : 'Invalid login details'
					})
				}
			})

		})
	}

	self.createAlphaNumericKeys= function(){
		for (var i = 65; i <= 90; i++) {


			btn = $('<i>'+String.fromCharCode(i)+'</i>');
			btnHolder = $('<span></span>');
			btn.appendTo(btnHolder);
			btnHolder.appendTo(el.alphaKeys);

				btn.bind('click',function(){
					var el = $(this);

						if(self.ctrlno.length>=9){
							return false;
						}
						
						self.ctrlno.push(el.text());
						updateViewCtrlNumber();
				})

		};

		for (var i = 0; i <=9; i++) {
			var btn = $('<span><i>'+i+'</i></span>');
			btn.appendTo(el.numericKeys);

				btn.bind('click',function(){
					var el = $(this);

						if(self.ctrlno.length>=9){
							return false;
						}
						
						self.ctrlno.push(el.text());
						updateViewCtrlNumber();
				})

		};

		function updateViewCtrlNumber(){
			if(self.ctrlno.length>=9){
				el.ctrlNumberConfirm.removeClass('disabled');
			}
			el.viewCtrlno.html('');
			$.each(self.ctrlno,function(key, val){
			 	el.viewCtrlno.append(val)
			})
		}
	}

	this.paginate = function(section){
		el.pages. removeClass('active');

		var page;

		switch(section){

			case 'cotejo':
				page = el.pageCotejo;
				el.ctrlNumberConfirm.addClass('disabled');	
				self.ctrlno = [];
				el.viewCtrlno.html('');
				page.addClass('active');
				
			break;
			case 'betting':

				console.log(section);
				// if(self.ctrlno.length<9){
				// 	self.paginate('cotejo');
				// 	return;
				// }

				self.keys = [];
				self.bet = [];
				self.resetBet();
				el.viewKeys.html('');
				el.viewBet.html('');
				el.submit.addClass('disabled')

				page = el.pageBetting;
				CTRLNO = self.ctrlno.join('');
				page.addClass('active');
			break;
		}
	}

	this.activateButtons = function(){
		
		el.ctrlNumberConfirm.click(function(){
			if(self.ctrlno.length<9){
				return;
			}
			self.paginate('betting');
		})

		el.ctrlNumberClear.click(function(){
				el.ctrlNumberConfirm.addClass('disabled');
				el.viewCtrlno.html('');
				self.ctrlno = [];
				CTRLNO = '';
		})

		el.clearKeys.unbind('click')
			.bind('click',function(){
				self.keys.pop();
				self.updateViewKeys();
				self.resetBet();
				self.toggleKeypads();
			})

		el.clearBet.unbind('click')
			.bind('click',function(){
				self.bet.pop();
				self.updateViewBet();
				self.toggleKeypads();
			})

		el.buttonCloseCotejo.click(function(){
			self.paginate('cotejo');	
		})

		el.submit.bind('click',function(){

			var holder = $('<div></div>');
				holder.addClass('confirm-combination');
			

			var keys = $('<div></div>');
				keys.addClass('keys')
					.appendTo(holder)
					.append('<em>COMBINATIONS</em>');

			for(i=0; i<self.keys.length; i++){
				var span = $('<span></span>');
				span.html(self.keys[i]).appendTo(keys);
			}


			var keys = $('<div></div>');
				keys.addClass('bet')
					.appendTo(holder)
					.append('<em>BET</em>');

			for(i=0; i<self.bet.length; i++){
				var span = $('<span></span>');
				span.html(self.bet[i]).appendTo(keys);
			}

			popup.dialog({
				message : holder,
				type : 'confirm',
				okCaption: 'CONFIRM',
				cancelCaption: 'CANCEL',
				onConfirm : function(){
					// popup.dialog('sending');
					// $.post('services/api.php',function(result){

					//	popup.dialog('success');
						self.updateCotejos();
						self.paginate('betting')
					//})
				}
			})
		})
	}

	this.updateCotejos = function(){
		el.betList.append('<li><span>'+self.keys.join('-')+'</span><span>'+self.bet.join('-')+'</span></li>');
	}

	this.generateKeysButtons = function(){
		var max = 38;
		var btn;
		self.keys = [];

		for(i=1;i<=max;i++){
			btn = $('<i>'+i+'</i>');
			btnHolder = $('<span></span>');
			btn.appendTo(btnHolder);
			btnHolder.appendTo(el.buttonKeysHolder);

			btn.unbind('click')
				.bind('click',function(){
					var el = $(this);
					var val = el.text();

					if(self.keys.length>=5){
						return false;
					}
					if($.inArray(val,self.keys)<0){
						self.keys.push(val);
						self.updateViewKeys();
						self.resetBet();	
					}
				})
		}
	}

	this.resetBet = function(){
		self.bet = [];	
		self.updateViewBet();
		count = 0;
		multiplier = 1;

		switch( self.keys.length ){
			case 2 : multiplier = 1; break;
			case 3 : multiplier = 6; break;
			case 4 : multiplier = 12; break;
			case 5 : multiplier = 20; break;
		}
		$('span i', el.buttonBetHolder).each(function(){
			count++;
			i = count*multiplier;
			$(this).text(i);
		})

	}

	this.updateViewKeys = function(){
		self.betLimit = self.keys.length>2? 1 : 2;
		el.viewKeys.html('');

		$.each(self.keys,function(key, val){
			var keysBall = $('<span>'+val+'</span>');
			keysBall.appendTo(el.viewKeys);

		})
		self.toggleKeypads();
	}

	this.generateBetButtons = function(){
		var max = 30;
		var btn;

		self.bet = [];

		for(i=1;i<=max;i++){
			btn = $('<i>'+i+'</i>');
			btnHolder = $('<span></span>');
			btn.appendTo(btnHolder);
			btnHolder.appendTo(el.buttonBetHolder);

			btn.unbind('click')
				.bind('click',function(){
					var el = $(this);
					var val = el.text();


					if(self.bet.length>=self.betLimit || self.keys.length<2){
						return false;
					}
					//if($.inArray(val, self.bet)<0){
						self.bet.push(val);	
						self.bet.sort(function(a, b){return b-a});
						self.updateViewBet();	
					//}

				})
		}
	}

	this.updateViewBet = function(){
		el.viewBet.html('');
		$.each(self.bet,function(key, val){
			var betBall = $('<span>'+val+'</span>');
			betBall.appendTo(el.viewBet);
			self.toggleKeypads();
		})

	}

	this.toggleKeypads = function(){
		var disabled = 'disabled';


		if(self.bet.length==self.betLimit && self.keys.length >=2){
			el.submit.removeClass(disabled);
		}else{
			el.submit.addClass(disabled);
		}
	}

	this.timerInit = function(sec){
	    startTimer(sec);
	}

	function startTimer(duration, display) {
	    var start = Date.now(),
	        diff,
	        minutes,
	        seconds;
	    function timer() {
	        // get the number of seconds that have elapsed since 
	        // startTimer() was called
	        diff = duration - (((Date.now() - start) / 1000) | 0);

	        // does the same job as parseInt truncates the float
	        minutes = (diff / 60) | 0;
	        seconds = (diff % 60) | 0;

	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;

	        el.timer.html(minutes + ":" + seconds); 

	        if (diff <= 0) {
	            // add one second so that the count down starts at the full duration
	            // example 05:00 not 04:59
	            start = Date.now() + 1000;
	        }
	    };
	    // we don't want to wait a full second before the timer starts
	    timer();
	    clearInterval(timerQueue);
	    timerQueue = setInterval(timer, 1000);
	}
}


var superLucky = new SuperLucky();



$(function(){
	superLucky.init();
})

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}