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


var CONTOLNO = false;

function SuperLucky(){

	var self = this;
	self.ctrlno = [];
	self.combinations;
	self.bet;
	self.el;

	self.init = function(){
		self.el = {
			ctrlNumberConfirm : $('#ctrlNumberConfirm'),
			ctrlNumberClear : $('#ctrlNumberClear'),
			ctrlNumberValue : $('#ctrlNumberValue'),
			codeHolder : $('.code-holder'),
			combKeypad : $('#combinations'),
			combKeyHolder : $('.keypads .combinations'),
			betKeypad : $('#amount'),
			betKeyHolder : $('.keypads .amount'),
			ctrNoHolder : $('#ctrlNumber'),
			canvas : $('.canvas'),
			okCombinations : $('#okCombinations'),
			okBet : $('#okBet'),
			cancelBet : $('#cancelBet'),
			list : $('.lists ul'),
			viewCtrlno : $('#ctrlidinput'),
			viewComb : $('.selected-combinations'),
			viewBet : $('.selected-amount'),
			reload : $('#closeCurrent'),
			alphaKeys : $('.alpha'),
			numericKeys : $('.numeric')
		}

		self.el.reload.click(function(){
			window.location.reload();
		})

		self.createAlphaNumericKeys();

		$(self.el.ctrlNumberConfirm).click(function(){
			self.el.codeHolder.addClass('hide');
			CONTOLNO = self.ctrlno.join('');
			self.showCombinationKeys();
		
		})

		$(self.el.ctrlNumberClear).click(function(){
				self.el.viewCtrlno.html('');
				self.el.ctrlNumberConfirm.hide();
				self.ctrlno = [];
				CONTOLNO = '';
		})
	}

	self.createAlphaNumericKeys= function(){
		self.el.ctrlNumberConfirm.hide();	
		for (var i = 65; i <= 90; i++) {
			var btn = $('<span class="btnkey">'+String.fromCharCode(i)+'</span>');
			btn.appendTo(self.el.alphaKeys);

				btn.unbind('click').bind('click',function(){
					var el = $(this);

						if(self.ctrlno.length>=9){
							return false;
							//self.ctrlno.shift();
						}
						
						self.ctrlno.push(el.text());
						updateViewCtrlNumber();
				})

		};

		for (var i = 0; i <=9; i++) {
			var btn = $('<span class="btnkey">'+i+'</span>');
			btn.appendTo(self.el.numericKeys);

				btn.unbind('click').bind('click',function(){
					var el = $(this);

						if(self.ctrlno.length>=9){
							return false;
							//self.ctrlno.shift();
						}
						
						self.ctrlno.push(el.text());
						updateViewCtrlNumber();
				})

		};

		function updateViewCtrlNumber(){
			if(self.ctrlno.length==9){
				self.el.ctrlNumberConfirm.show();
			}

			self.el.viewCtrlno.html('');
			$.each(self.ctrlno,function(key, val){
			 	self.el.viewCtrlno.append(val)
			})
		}
	}

	self.showCombinationKeys = function(){
		self.el.ctrNoHolder.text(CONTOLNO);
		
		self.el.canvas.fadeIn(0,function(){
			$(this).removeClass('hide');
		})

		self.combinations = [];
		self.bet = [];
		self.el.betKeypad.fadeOut(0,function(){
			self.el.betKeypad.addClass('hide');
			self.el.combKeypad.fadeIn(0,function(){
				self.el.combKeypad.removeClass('hide');
			})
		});

		self.el.combKeyHolder.children('span').remove();
		self.el.betKeyHolder.children('span').remove();

		self.el.okCombinations.hide();
		self.el.okBet.hide();	


		for (var i = 38; i > 0; i--) {
			var btn = $('<span class="btnkey">'+i+'</span>');
			btn.prependTo(self.el.combKeyHolder);

				btn.unbind('click').bind('click',function(){
					var el = $(this);
					var val = el.text();

					if(self.combinations.length>=5){
						return false;
					}
					if($.inArray(val,self.combinations)<0){
						self.combinations.push(val);
						updateViewCombinations();	
					}

				})

		};

		self.el.okCombinations.unbind('click').bind('click',function(){
			self.showBetKeys();
		})

		function updateViewCombinations(){

			self.el.viewComb.html('');
			$.each(self.combinations,function(key, val){
				var combiBall = $('<span>'+val+'</span>');
				
				combiBall.appendTo(self.el.viewComb);
				combiBall.unbind('click').bind('click',function(){
					self.combinations.remove(val);
					$(this).remove();
					self.resetCombinations();
				})

			})

			if(self.combinations.length>1){
				self.el.okCombinations.fadeIn(1);
			}else{
				self.el.okCombinations.fadeOut(0)
			}
		}

	}

	self.resetCombinations = function(){
		self.bet = [];
		self.el.betKeypad.fadeOut(0,function(){
			self.el.betKeypad.addClass('hide');
			self.el.combKeypad.fadeIn(0,function(){
				self.el.combKeypad.removeClass('hide');
			})
		});

		self.el.betKeyHolder.children('span').remove();
		self.el.okBet.hide();
		self.el.viewBet.html('');	
	}

	self.showBetKeys = function(){
		self.el.combKeypad.fadeOut(0,function(){
			self.el.combKeypad.addClass('hide');
			self.el.betKeypad.fadeIn(0,function(){
				self.el.betKeypad.removeClass('hide');
			})
		});

		var multiplier;
		var max = 1;

		switch( self.combinations.length ){
			case 2 : multiplier = 1; max=2; break;
			case 3 : multiplier = 6; break;
			case 4 : multiplier = 12; break;
			case 5 : multiplier = 20; break;
		}

		for (var i = 30; i > 0; i--) {
			var value = i*multiplier;
			var btn = $('<span class="btnkey">'+value+'</span>');
			btn.prependTo(self.el.betKeyHolder);

				btn.unbind('click').bind('click',function(){
					var el = $(this);
					var val = el.text();

					if(self.bet.length>=max){
						return false;
					}
					if($.inArray(val, self.bet)<0){
						self.bet.push(val);
						updateViewBet();	
					}
				})
		};


		self.el.okBet.unbind('click').bind('click',function(){
			self.finish();
		})
		self.el.cancelBet.unbind('click').bind('click',function(){
			self.resetCombinations();
		})

		function updateViewBet(){
			self.el.viewBet.html('');
			$.each(self.bet,function(key, val){
				var betBall = $('<span>'+val+'</span>');
				betBall.appendTo(self.el.viewBet);

				betBall.unbind('click').bind('click',function(){
					self.bet.remove(val);
					$(this).remove();
				})
			})

			if(self.bet.length>0){
				self.el.okBet.fadeIn(1);
			}else{
				self.el.okBet.fadeOut(0)
			}
		}
	}

	self.finish = function(){
		var combinations = self.combinations.join('-');
		var bet = self.bet.join(',');
		self.el.list.prepend('<li><span>'+combinations+'</span><span>'+bet+'</span></li>');
		self.showCombinationKeys();
		self.el.viewBet.html('');
		self.el.viewComb.html('');


		$.post('http://192.168.1.100/superlucky/api.php',{
			combinations : combinations,
			amount : bet,
			ctrlno : CONTOLNO

		})
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