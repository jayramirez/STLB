
function Lytebox(params){
	
	var This 	= this;
	var Options = new Object();
	var El 		= new Object();
	var Btn 	= new Object();
	var Config  = 	{
						/*base config*/
						paddingTop  : 50,
						paddingBottom: 50,
						transitionOut : 100,
						transitionIn : 100,

						/*overwritable config*/
						top 		: null,
						width 		: 900,
						align 		: 'left',
						okCaption 	: 'Ok',
						cancelCaption : 'Cancel', 
						btnAlign 	: 'right',

						close 		: true,
						escClose 	: false,
						bgClose 	: true,
					}

	$.extend(Config, params);


	This.dialog = function(strMsg_or_ObjParams, strTitle_or_ObjParams, objParams){
		/*	-------- USAGE -------
			dialog({})
			dialog(message,{})
			dialog(message, title, {})
		*/
		Options = {
			message 	: '',
			title 		: null,
			align 		: Config.align,
			close 		: Config.close,
			type 		: 'message', //'alert/confirm', default
			okCaption 	: Config.okCaption,
			cancelCaption : Config.cancelCaption, 
			btnAlign 	: Config.btnAlign,
			top  		: Config.top,
			width 		: Config.width, 
			escClose 	: Config.escClose,
			bgClose 	: Config.bgClose,

			onOpen		: function(){}, 
			onClose		: function(){},
			onConfirm	: function(){}, 
			onCancel	: function(){}
		}

		var params;
		if(typeof(strMsg_or_ObjParams)!='object'){
			params = strTitle_or_ObjParams;
			Options.message = strMsg_or_ObjParams;
		}else{
			params = strMsg_or_ObjParams;
		}

		if( strTitle_or_ObjParams ){
			if(typeof(strTitle_or_ObjParams)!='object'){
				params = objParams;
				Options.title = strTitle_or_ObjParams;
			}else{
				params = strTitle_or_ObjParams;
			}
		}

		initialize(params);
		createBase();

		El.Content.html('');
		El.Content.addClass(Options.align);

		if( Options.title ){
			createElement( 'h1' , Options.title )
					.addClass('lytebox-title')
					.appendTo(El.Content); 
		}
			
		var message = createElement('div', Options.title )
						.addClass('lytebox-message')
						.html(Options.message)
						.appendTo(El.Content); 
		
		if (Options.type == 'message'){
			if( Options.close ){
				var close = createElement('div','&times;')
							.addClass('lytebox-dialog-close')
							.prependTo(El.Content);
			}
		}else{

			var buttons = createElement()
						.addClass('lytebox-buttons')
						.addClass(Options.btnAlign)
						.appendTo(El.Content);


			Btn.Okay = createElement('button', Options.okCaption)
						.addClass('lytebox-ok')
						.attr('type','button')
						.appendTo(buttons);

			if (Options.type == 'confirm' ){		
				Btn.Cancel = createElement('button', Options.cancelCaption)
							.addClass('lytebox-cancel')
							.attr('type','button')
							.appendTo(buttons);
			}
		}

		install();
		bindButtons();
	}

	This.load = function(strURL_or_objParams, objParams){
		
		/*	-------- USAGE -------
			load({})
			load(url,{})
		*/

		Options = {
			url 		: null,
			data 		: {},

			top  		: Config.top,
			escClose 	: Config.escClose,
			bgClose 	: Config.bgClose,

			onOpen		: function(){}, 
			onClose		: function(){},
			onConfirm	: function(){}, 
			onCancel	: function(){}
		}

		var params;

		if(typeof(strURL_or_objParams)=='object'){
			params = strURL_or_objParams;
		}else{
			Options.url = strURL_or_objParams;
			params = objParams;
		}

		initialize(params);
		createBase();

		var getPage = $.get(Options.url, 
						  Options.data,
							function(result){
								El.Content.html(result);
								install();
								bindButtons();
					});
		
	}

	This.show = function(strSelector_or_objParams, objParams){

		Options = {
			html 		: null,
			top  		: Config.top,
			escClose 	: Config.escClose,
			bgClose 	: Config.bgClose,

			onOpen		: function(){}, 
			onClose		: function(){},
			onConfirm	: function(){}, 
			onCancel	: function(){}

		}

		var params;

		if(typeof(strSelector_or_objParams)=='object'){
			params = strSelector_or_objParams;
		}else{
			Options.html = strSelector_or_objParams;
			params = objParams;
		}

		initialize(params);

		setTimeout(function(){
			El.Modal 	=  $('.lytebox-wrap').addClass('lytebox');
			El.Holder 	=  $('.lytebox-content-holder');
			El.InlineContent  =   $(Options.html);

			if(!El.InlineContent.parent().hasClass('lytebox-content'))
					El.InlineContent .wrap('<div class="lytebox-content"></div>');

			El.Content 	= $('.lytebox-content');

			El.InlineContent.show(0);
			El.Modal.css({height : El.Document.height()});
			El.Modal.fadeIn(Config.transitionIn);
			install();
			bindButtons();
		},Config.transitionOut+50)

	}

	This.close = function( callback ){

		El.Modal.fadeOut(Config.transitionOut, function(){
			var modal = $(this);

			if( modal.hasClass('lytebox-wrap') ){
				$('.lytebox-wrapped-content',modal).each(function(){
					var el = $(this);
					el.hide();
					if( el.parent().hasClass('lytebox-content') ){
						el.unwrap();
					}
				});
				modal.removeClass('lytebox');
			}else{
				$(this).remove();
			}
			
			if(callback) callback();
		});

		El.Body.css({overflow:'auto'})
	}

	function initialize(params){

		if( $('.lytebox').length > 0 ){
			This.close( false );
		}

		$.extend(Options, params);
		El.Window 	= $(window);
		El.Document = $(document); 
		El.Body 	= $('body');

		El.Body.css({overflow:'hidden'});
		
	}

	function createBase(){

		El.Modal 	=  createElement().addClass('lytebox');
		El.Holder 	= createElement().addClass('lytebox-content-holder');
		El.Content 	= createElement().addClass('lytebox-content');

		El.Content.appendTo(El.Holder);
		El.Holder.appendTo(El.Modal);
		El.Modal.appendTo(El.Body);
		
		El.Modal.css({height : El.Document.height()});
	}

	function install(){

		El.Modal.fadeIn(Config.transitionIn,Options.onOpen);
		stabilize();
		El.Window.resize(stabilize);
	}

	function stabilize(){
		
		if(Options.url){
			El.Content.css({width :  El.Content.children(':first-child').outerWidth() });
		}
		else if(Options.html){
			El.Content.css({width :  El.InlineContent.outerWidth() });
		}else{
			El.Content.css({width :  Options.width });
		}

		var windowHeight  = El.Window.height();
		var contentHeight = El.Content.outerHeight();
		var windowWidth   = El.Window.width();
		var contentWidth  = El.Content.outerWidth();

		var positionTop 	= Options.top ? Options.top : (windowHeight-contentHeight)/2;
			positionTop 	= positionTop < Config.paddingTop ? Config.paddingTop : positionTop;

		var positionLeft 	= (windowWidth-contentWidth)/2;
		var paddingBottom  	= Config.paddingTop + Config.paddingBottom;
	
		El.Content.css({
			left: positionLeft,
			top: positionTop,
			marginBottom : paddingBottom
		});

		El.Modal.css({height : El.Document.height() });
	}

	function bindButtons(){
		
		Btn.Close = $('.lytebox-dialog-close, .lytebox-close');

		/* close popup by clicking the background */
		if( Options.bgClose ){
			El.Holder.unbind('click');
			El.Holder.bind('click', function(e){
				if( $(e.target).hasClass('lytebox-content-holder') )
				This.close( Options.onClose );
			});
		}

		/* close popup by esc key */
		if ( Options.escClose ){
			El.Document.unbind('keydown.escClose');
			El.Document.bind('keydown.escClose',function(e){
				if (e.keyCode == 27) { 
					This.close( Options.onClose );
				}
			});
		}

		/* close buttons */
		if( Options.close || Options.url || Options.html ){
			Btn.Close.unbind('click');
			Btn.Close.bind('click', function(e){
				This.close( Options.onClose );
			});
		}

		/*options for dialog alert/confirm*/
		if(Options.type && Options.type != 'message'){

			/*remove closing options*/
			El.Holder.unbind('click');
			El.Document.unbind('keydown.escClose');

			if(Btn.Okay){
				Btn.Okay.unbind('click');
				Btn.Okay.bind('click',function(){
					This.close( Options.onClose );
					Options.onConfirm();
				});
			} 
			if(Btn.Cancel){
				Btn.Cancel.unbind('click');
				Btn.Cancel.bind('click',function(){
					This.close( Options.onClose );
					Options.onCancel();
				});
			} 

		}


	}

	function createElement(element,html){
		element = element==undefined ? 'div' : element;
		html    = html==undefined ? '' : html;
		return $('<'+element+'>'+html+'</'+element+'>');
	}

}
