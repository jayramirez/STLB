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
		timerQueue,
		el;

	self.betLimit = 2;
	self.agencyID;
	self.cotejos = {list : [], total : 0};
	self.currentCotejo = {id: '', total : 0 };
	self.ctrlno = [];
	self.keys;
	self.bet;
	self.transactionID;

	

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
			inputAgency : $('#agency'),
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
			buttonCloseCotejo : $('#close-cotejo'),
			cotejoID : $('.cotejo-id'),
			cotejoTotal : $('.cotejo-total'),

			//cotejo list

			cotejoList : $('.cotejo-list ul'),
			grandTotal : $('#grand-total'),

			buttonCloseTransaction : $('#close-transaction')
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
			var agencyID = el.inputAgency.val();

			if(agencyID.length<3){
				return
			}

			$.post(apiURL+'api.php',function(result){
				
				if(result==0){
					popup.dialog({
						title : 'MENSAHE',
						message : 'Sarado ang tayaan, Subukan ulit mamaya.',
						type: 'alert'
					})
					return;
				}
				self.timerInit( result );
				self.paginate('cotejo');


				self.agencyID = agencyID;
				self.transactionID = Math.floor(Date.now() / 1000);
				el.loguser.text( self.transactionID );

				popup.dialog({
					message: ' <h1 style="font-size:50px; color:#333">Your transaction ID is: <br><big>'+self.transactionID+'</big></h1>',
					type: 'alert',
					align : 'center'
				})
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
			case 'login' : 
				page = el.pageLogin;
				page.addClass('active');
				el.inputAgency.val('');
			break;
			case 'cotejo':
				page = el.pageCotejo;
				el.ctrlNumberConfirm.addClass('disabled');	
				self.ctrlno = [];
				el.viewCtrlno.html('');
				page.addClass('active');
				
			break;
			case 'betting':
				self.keys = [];
				self.bet = [];
				self.resetBet();
				el.viewKeys.html('');
				el.viewBet.html('');
				el.submit.addClass('disabled');
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
			self.currentCotejo.id = el.viewCtrlno.html();
			el.cotejoID.html(self.currentCotejo.id);

			self.currentCotejo.total = 0;
			el.betList.html('');
			el.cotejoTotal.html('0');

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
				self.toggleSubmitBet();
			})

		el.clearBet.unbind('click')
			.bind('click',function(){
				self.bet.pop();
				self.updateViewBet();
				self.toggleSubmitBet();
			})

		el.buttonCloseCotejo.click(function(){
			popup.dialog({
				title : 'KUMPIRMAHIN',
				message : 'Tapusin na ang transaksyong ito?',
				width : 700,
				type : 'confirm',
				onConfirm : function(){

					if(self.currentCotejo.total==0){
						self.paginate('cotejo');
						return;
					}			
					self.cotejos.list[self.currentCotejo.id] = self.currentCotejo.total;
					self.cotejos.total += self.currentCotejo.total;
					el.grandTotal.html( self.humanizeNumber(self.cotejos.total) );
					el.cotejoList.prepend('<li><span>'+self.currentCotejo.id+'</span><span>'+self.humanizeNumber(self.currentCotejo.total)+'</span></li>');
					self.paginate('cotejo');	
				}
			})
		})

		el.submit.bind('click',function(){
			if(self.bet.length < self.betLimit || self.keys.length < 2){
				return;
			}
			var holder = $('<div></div>');
				holder.addClass('confirm-combination');
			

			var keys = $('<div></div>');
				keys.addClass('keys')
					.appendTo(holder)
					.append('<em>KOMBINASYON</em>');

			for(i=0; i<self.keys.length; i++){
				var span = $('<span></span>');
				span.html(self.keys[i]).appendTo(keys);
			}


			var keys = $('<div></div>');
				keys.addClass('bet')
					.appendTo(holder)
					.append('<em>TAYA</em>');

			for(i=0; i<self.bet.length; i++){
				var span = $('<span></span>');
				span.html(self.bet[i]).appendTo(keys);
			}

			popup.dialog({
				title: 'MENSAHE',
				message : holder,
				type : 'confirm',
				okCaption: 'OK',
				cancelCaption: 'CANCEL',
				onConfirm : function(){
								
					var combinations = self.keys.join(',');
					var bet = self.bet.join(',');

					$.post(apiURL+'/api.php',{
						combinations : combinations,
						amount : bet,
						ctrlno : self.currentCotejo.id,
						agency_id : self.agencyID,
						user_id : self.transactionID

					});

					self.updateCotejos();
					self.paginate('betting');
				}
			})
		})

		el.buttonCloseTransaction.click(function(){
			popup.dialog({
				title : 'KUMPIRMAHIN',
				message : 'Tapusin na ang transaksyong ito?',
				width : 700,
				type : 'confirm',
				onConfirm : self.finish
			})
		})
	}

	self.finish = function(){
		var content = 'Ibigay sa kahera ang ID ng transaksyon at ang halagang nakasulat sa ibaba:<br>';
			content+= '<div class="completion">';
			content+= '<div><span>Transaction ID:</span><span>'+self.transactionID+'</span></div>';
			content+= '<div><span>Halaga:</span><span>'+self.humanizeNumber(self.cotejos.total)+'</span></div>';
			content+= '</div>';
		popup.dialog({
			title: 'MENSAHE',
			message : content,
			type : 'alert',
			onConfirm : self.completed
		})
	}

	self.completed = function(){

		self.paginate('login');
		el.grandTotal.html('');
		el.cotejoList.html('');
		self.cotejos.list = [];
		self.cotejos.total = 0;

	}

	this.updateCotejos = function(){
		var bet = 0;
		var total = self.currentCotejo.total;
		var betBalls = '';
		var keyBalls = '';

		for(i=0; i<self.bet.length; i++){
			bet =self.bet[i]*1 + bet;
			betBalls += '<i>'+self.bet[i]+'</i>';
		}

		for(i=0; i<self.keys.length; i++){
			keyBalls += '<i>'+self.keys[i]+'</i>';
		}


		total = total*1 + bet;
		self.currentCotejo.total = total;
		el.cotejoTotal.html( self.humanizeNumber(total) );

		el.betList.prepend('<li><span>'+keyBalls+'</span><span>'+betBalls+'</span></li>');
	
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
					var val = el.text()*1;

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
		self.toggleSubmitBet();
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
					var val = el.text()*1;


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
			self.toggleSubmitBet();
		})

	}

	this.toggleSubmitBet = function(){
		var disabled = 'disabled';

		if(self.bet.length==self.betLimit && self.keys.length >=2){
			el.submit.removeClass(disabled);
		}else{
			el.submit.addClass(disabled);
		}
	}

	this.humanizeNumber = function(n) {
	  n = n.toString()
	  while (true) {
	    var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
	    if (n == n2) break
	    n = n2
	  }
	  return n
	}

	this.timerInit = function(sec){
	    startTimer(sec);
	}

	function startTimer(duration) {
	    var start = Date.now(),
	        diff,
	        hours,
	        minutes,
	        seconds;
	    function timer() {
	        // get the number of seconds that have elapsed since 
	        // startTimer() was called
	        diff = duration - (((Date.now() - start) / 1000) | 0);

	        // does the same job as parseInt truncates the float
	        hours = (diff / 3600) | 0;
	        minutes = (diff % 3600 / 60) | 0;
	        seconds = (diff % 60) | 0;

	        hours = hours < 10 ? "0" + hours : hours;
	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;

	        el.timer.html( hours +": "+ minutes + ":" + seconds); 
	        console.log( hours +": "+ minutes + ":" + seconds); 

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