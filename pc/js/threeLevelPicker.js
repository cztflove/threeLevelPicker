/**
 * 
 * @cchen
 * @date    2017-09-19 
 * @version 1.0
 * @plugin threeLevelPicker
 */
;(function(root,factory){
	root.threeLevelPicker = factory();

})(window,function(){
	var threeLevelPicker = function(options){
		this.opt = {};
		this.idNum = null;
		this.extend(options);
		this.$pickerEle = this.createEntity();
		this.getData();
		this.setPos();
		this.bindEvent();
	};
	threeLevelPicker.prototype = {
		extend: function(options){
			var defaults = {
				trigger: '#picker',
				levelName: ['省份', '城市', '县区'],
				dataPath: 'js/area.json',
				seperator: ' '
			};
			var key;
			for(key in options){
				var defaultVal = defaults[key];
				var optionVal = options[key];
				if(optionVal == defaultVal){
					continue;
				}
				else if(optionVal !== undefined){
					defaults[key] = optionVal;
				}
				
			}
			this.opt = defaults;

		},
	
		createEntity: function(){
			 var _this = this;
			 var idNum = Math.random().toFixed(4).toString().replace('.', '');
			 var pickerId = 'picker'+idNum;
			 var body = document.getElementsByTagName('body')[0];
			 var dom = '<div class="threePicker-layout picker-hide" id="'+ pickerId +'"><div class="picker-content">';
			 dom += '<div class="picker-tab">';
			 for(var i=0; i < _this.opt.levelName.length; i++){
			 	if(i == 0){
			 		dom += '<p class="on" data-tab="picker-list'+ idNum +'-'+ (i+1) +'">'+ _this.opt.levelName[i] +'</p>';
			 	}
			 	else{
			 		dom += '<p data-tab="picker-list'+ idNum +'-'+ (i+1) +'">'+ _this.opt.levelName[i] +'</p>';
			 	}
			 	dom += '<input type="hidden" name="picker-selection-'+ (i+1) +'">';
			 }
			 dom += '</div>';
			 dom += '<div class="ub-f1 picker-list-wrapper">';
			 for(var i=0; i < _this.opt.levelName.length; i++){
			 	if(i == 0){
			 		dom += '<ul class="picker-list on" id="picker-list'+ idNum +'-'+ (i+1) +'"></ul>';
			 	}
			 	else{
			 		dom += '<ul class="picker-list" id="picker-list'+ idNum +'-'+ (i+1) +'"></ul>';
			 	}
			 }
			 dom += '</div>';
			 dom += '<p class="picker-preview">请选择您的所在地区</p>';
			 dom += '</div></div>';
			 // dom += '<div class="ub ub-pc picker-btn-wrapper"><div class="picker-close-btn">取消</div></div></div></div>';
			 $('body').append(dom);
			 _this.idNum = idNum;
			 var newPicker = $('#'+pickerId);
			 return newPicker;
			
		},
		getData: function(){
			var _this = this;
			$.getJSON(_this.opt.dataPath, function(json, textStatus) {
				_this.opt.data = json; 
				_this.initPicker();
        	});
		},
		initPicker: function(){
			var _this = this;
			var data = _this.opt.data;
			var pickerLen = _this.opt.levelName.length;
			var $trigger = $(_this.opt.trigger);
			var lev1_data = data[0];
            var i = 0;
            var dom = '';
            var init_id = $trigger.attr('data-id');
            var init_text = $trigger.val();
            if(init_text != ''){
            	_this.$pickerEle.find('.picker-preview').text(init_text);
            }
            init_id = init_id.split(',');


            if(init_id[0]){
                _this.$pickerEle.find('input[name=picker-selection-1]').val(init_id[0]);                
            }
            if(init_id[1]){
                _this.$pickerEle.find('input[name=picker-selection-2]').val(init_id[1]);                
            }
            if(init_id[2] && pickerLen == 3){
                _this.$pickerEle.find('input[name=picker-selection-3]').val(init_id[2]);
            }
            for(i = 0; i<lev1_data.length; i++){
                dom += '<li data-id="'+lev1_data[i][0]+'">'+lev1_data[i][1]+'</li>';
            }
            $('#picker-list'+ _this.idNum +'-1').html(dom);
            if(init_id[0]){
            	$('#picker-list'+ _this.idNum +'-1').find('li[data-id='+init_id[0]+']').addClass('on');
                var lev2_id = parseInt(init_id[0]);
                var lev2_data = data[lev2_id];
                dom = '';
                for(i = 0; i<lev2_data.length; i++){
                    dom += '<li data-id="'+lev2_data[i][0]+'">'+lev2_data[i][1]+'</li>';
                }
                $('#picker-list'+ _this.idNum +'-2').html(dom);

                if(init_id[1]){
                    $('#picker-list'+ _this.idNum +'-2').find('li[data-id='+init_id[1]+']').addClass('on');
                    var lev3_id = parseInt(init_id[1]);
                    var lev3_data = data[lev3_id];
                    dom = '';
                    for(i = 0; i<lev3_data.length; i++){
                        dom += '<li data-id="'+lev3_data[i][0]+'">'+lev3_data[i][1]+'</li>';
                    }
                    $('#picker-list'+ _this.idNum +'-3').html(dom).find('li[data-id='+init_id[2]+']').addClass('on');
                }
            }
		},
		setPos: function(){
			var _this = this;
			var $trigger = $( _this.opt.trigger);
			var inputOffset = $trigger.offset();
			_this.$pickerEle.css(
            {
                top: inputOffset.top + $trigger.height() + 10,
                left: inputOffset.left
            });
		},
		bindEvent: function(){
			var _this = this;
			_this.$pickerEle.find('.picker-tab p').on('click',function(){
				var $self = $(this);
				var tabId = $self.attr('data-tab');
				if(tabId == 'picker-list'+ _this.idNum +'-1'){
					$('#'+tabId).addClass('on').siblings().removeClass('on');
					$self.addClass('on').siblings().removeClass('on');			
				}
				else if(tabId == 'picker-list'+ _this.idNum +'-2'){
					var lev1_id = _this.$pickerEle.find('input[name=picker-selection-1]').val();
					if(lev1_id != ''){
						$('#'+tabId).addClass('on').siblings().removeClass('on');
						$self.addClass('on').siblings().removeClass('on');
					}
				}
				else if(tabId == 'picker-list'+ _this.idNum +'-3'){
					var lev2_id = _this.$pickerEle.find('input[name=picker-selection-2]').val();
					if(lev2_id != ''){
						$('#'+tabId).addClass('on').siblings().removeClass('on');
						$self.addClass('on').siblings().removeClass('on');
					}				
				}
			});
			_this.$pickerEle.find('.picker-list').on('click','li',function(){
				var $self = $(this);
				var $parent = $self.parent();
				var parentId = $parent.attr('id');
				var targetId = parseInt($self.attr('data-id'));
				var targetName = $self.text();
				var data = null;
				var dom = '';
				var selectedArr = _this.$pickerEle.find('.picker-preview').text().split(_this.opt.seperator);

				if(parentId == 'picker-list'+ _this.idNum +'-1'){
					_this.$pickerEle.find('input[name=picker-selection-1]').val(targetId);
					_this.$pickerEle.find('input[name=picker-selection-2]').val('');
					_this.$pickerEle.find('input[name=picker-selection-3]').val('');
					$self.addClass('on').siblings().removeClass('on');
					selectedArr = [];
					selectedArr.push(targetName);
					data = _this.opt.data[targetId];
					for(i = 0; i<data.length; i++){
						dom += '<li data-id="'+data[i][0]+'">'+data[i][1]+'</li>';
		    		}
		    		$('#picker-list'+ _this.idNum +'-2').html(dom).addClass('on').siblings().removeClass('on');
					_this.$pickerEle.find('.picker-tab p[data-tab=picker-list'+ _this.idNum +'-2]').addClass('on').siblings().removeClass('on');
					_this.$pickerEle.find('.picker-preview').text(selectedArr.join(_this.opt.seperator));
				}
				else if(parentId == 'picker-list'+ _this.idNum +'-2'){
					_this.$pickerEle.find('input[name=picker-selection-2]').val(targetId);
					_this.$pickerEle.find('input[name=picker-selection-3]').val('');
					$self.addClass('on').siblings().removeClass('on');
					selectedArr[1] = targetName;

					if(_this.opt.levelName.length == 3){
						data = _this.opt.data[targetId];
						for(i = 0; i<data.length; i++){
							dom += '<li data-id="'+data[i][0]+'">'+data[i][1]+'</li>';
			    		}
			    		$('#picker-list'+ _this.idNum +'-3').html(dom).addClass('on').siblings().removeClass('on');
						_this.$pickerEle.find('.picker-tab p[data-tab=picker-list'+ _this.idNum +'-3]').addClass('on').siblings().removeClass('on');
					}
					else if(_this.opt.levelName.length == 2){
						_this.$pickerEle.addClass('picker-hide');
						var lev1_result = _this.$pickerEle.find('input[name=picker-selection-1]').val();
						var lev2_result = _this.$pickerEle.find('input[name=picker-selection-2]').val();
						$(_this.opt.trigger).val(selectedArr.join(_this.opt.seperator)).attr('data-id', lev1_result+ ',' +lev2_result);
					}
					_this.$pickerEle.find('.picker-preview').text(selectedArr.join(_this.opt.seperator));
				}
				else if(parentId == 'picker-list'+ _this.idNum +'-3'){
					selectedArr[2] = targetName;
					_this.$pickerEle.find('input[name=picker-selection-3]').val(targetId);
					$self.addClass('on').siblings().removeClass('on');
					_this.$pickerEle.find('.picker-preview').text(selectedArr.join(_this.opt.seperator));

					_this.$pickerEle.addClass('picker-hide');
					var lev1_result = _this.$pickerEle.find('input[name=picker-selection-1]').val();
					var lev2_result = _this.$pickerEle.find('input[name=picker-selection-2]').val();
					var lev3_result = _this.$pickerEle.find('input[name=picker-selection-3]').val();
					$(_this.opt.trigger).val(selectedArr.join(_this.opt.seperator)).attr('data-id', lev1_result+ ',' +lev2_result+ ',' +lev3_result);
				}
			});
			$( _this.opt.trigger).click(function(event) {
				_this.$pickerEle.removeClass('picker-hide');
			});
			$('body').on('click', function(e){
				var $target = $(e.target);
				var $trigger = $( _this.opt.trigger);
				if(!$target.is($trigger)&& !$target.hasClass('threePicker-layout') && !$target.parents('.threePicker-layout').get(0)){
					_this.$pickerEle.addClass('picker-hide');
				}
			});
		}
	};
	return threeLevelPicker;
});