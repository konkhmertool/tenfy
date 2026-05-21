$(document).ready(function() {
		//$("<link id='myStyle2' href='css/style2.css' rel='stylesheet'/>").appendTo("head");
		
        // Hide upload control
		$('#custom_img_file').hide();
		$('#custom_img_file2').hide();
		$('#custom_img_file3').hide();
		$('#custom_img_file4').hide();
		$('#custom_img_file5').hide();
        $("#img_1").focus();
        $(".sp_slogan").text($("#txt_slogan").val());
        $(".dv_slogan").draggable();
        
        $('.uploadButton').on('click', function () {
        		var elem = $(this);
        		var this_upload_id = '#'+ elem.attr("data-upload-id");
            $(this_upload_id).click();
		});
		
		$('.uploadFile').change(function () {
			var elem = $(this);
			var this_img_bl_id = elem.attr("data-img-bl-id");
            var file = this.files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
                	$("div[data-img-bl-id|='"+this_img_bl_id+"']").css({"background-image": "url("+ reader.result +")"});
                $("div[data-img-bl-id|='"+this_img_bl_id+"'] span").css("display","none");  
                

                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
                    // access image size here 
                		$("div[data-img-bl-id|='"+this_img_bl_id+"']").attr("data-img-width", this.width);
                		$("div[data-img-bl-id|='"+this_img_bl_id+"']").attr("data-img-height", this.height);
                };
            }
            if (file) {
              reader.readAsDataURL(file);
            } else {
            }
		});
		$('#custom_img_file2').change(function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
               //$('#pf_foto').css('background-image', 'url("' + reader.result + '")');
               $("div[data-img-bl-id|='img_block2']").css({"background-image": "url("+ reader.result +")"});
               $("div[data-img-bl-id|='img_block2_g2']").css({"background-image": "url("+ reader.result +")"});

               $("div[data-img-bl-id|='img_block2'] span").css("display","none");
               $("div[data-img-bl-id|='img_block2_g2'] span").css("display","none");
            }
            if (file) {
                reader.readAsDataURL(file);
            } else {
            }
		});
		
		$('#txt_slogan').on("input", function(){
		    var tmp = $("#txt_slogan").val();
		    if(tmp){
		    		$(".sp_slogan").text(tmp);
		    }else{
		    		$(".sp_slogan").text("");
		    }
		});
		
        	$("#txt_img_num").bind('keyup mouseup', function () {
        		if(parseInt($(this).val()) >= 2){
        			$(".wrap_thumbnail #sp_img_number").text("+"+$(this).val());
        			$('.wrap_thumbnail .dv_cover_bg').css({"display": "block"}); 
        			for(var i=2;i<=15;i++){
        				$(".wrap_thumbnail"+i+" #sp_img_number").text("+"+$(this).val());
            			$(".wrap_thumbnail"+i+" .dv_cover_bg").css({"display": "block"}); 
        			}
        			$('.dv_cover_number').css({"display": "block"}); 
        	     }else{
        	    	 	$(".wrap_thumbnail #sp_img_number").text("");
        	    	 	$('.wrap_thumbnail .dv_cover_bg').css({"display": "none"}); 
        	    	 	for(var i=2;i<=8;i++){
        	    	 		$(".wrap_thumbnail"+i+" #sp_img_number").text("");
            	    	 	$(".wrap_thumbnail"+i+" .dv_cover_bg").css({"display": "none"});
        			}
        	    	 	$('.dv_cover_number').css({"display": "none"}); 
        	     }
        	});
        	
        	$(".img_crawler").on('paste', function (e) {
        		var elem = $(this);
        		setTimeout(function () {
        			var this_img_bl_att = elem.attr("data-img-bl-id");
        			if(!isUrlValid(elem.val())){
            			 return;
        			}
        			//$("div[data-img-bl-id|='"+this_img_bl_att+"']").css({"background-image": "url("+elem.val()+")"});        
        			var objSpan = $("div[data-img-bl-id|='"+this_img_bl_att+"'] span");
        			getimgBase64(elem.val(),this_img_bl_att,objSpan, function(dataUrl){
                    //console.log('RESULT:',dataUrl);
                    $("div[data-img-bl-id|='"+this_img_bl_att+"']").css({"background-image": "url("+dataUrl+")"});
                });
        			elem.next(':input').focus();
        			
        		}, 100); // end timeout
        	});
        	$(".dv_display_img").click(function() {
        		//var elem = $(this);
        		//$(this).toggleClass('bg_position_center bg_position_inherit');
        	});
        	
        	$(".dv_cover_bg, .dv_cover_number").click(function() {
        		console.log("yes");
        		var elem = $(this);
        		var elem_click = elem.parents(".dv_t2_bottom").children(".dv_t2_ch").last().children(".dv_display_img");
        		$(elem_click).toggleClass('bg_position_center bg_position_inherit');
        	});
        	$(".btn_download" ).click(function() {
        		$('#myStyle2').remove();
        		var elem = $(this);
        		var this_wrap_thumbnail = elem.attr("data-thumnail");
        		$('.dv_cover_number').css({"display": "none"});
			$('.dv_cover_bg').css({"display": "none"});
        		Make_Download($(this),this_wrap_thumbnail); 
        		$("<link id='myStyle2' href='css/style2.css' rel='stylesheet'/>").appendTo("head");
        	});
        	$(".btn_download_square" ).click(function() {
        		//$('#myStyle2').remove();
        		
        		var elem = $(this);
        		var this_wrap_thumbnail = elem.attr("data-thumnail");
        		Make_Download($(this),this_wrap_thumbnail, "1-sqr");
        		
        		//$("<link id='myStyle2' href='css/style2.css' rel='stylesheet'/>").appendTo("head");
        	});
        	function Make_Download(objThis, objBlockDivId, objFileName = "0-lsc"){
        		var tmpFakeNum = $("#txt_img_num").val();
        		if(parseInt(tmpFakeNum) < 2){
        			$(".wrap_thumbnail #sp_img_number").text("");
    	    	 		$('.wrap_thumbnail .dv_cover_bg').css({"display": "none"}); 
        		}
        		var elem = objThis;
        		var this_img_bl_att = objBlockDivId; //elem.attr("data-thumnail");
            	// Using function from html2canvas.min.js 
        		html2canvas(document.getElementById(this_img_bl_att),{
        			allowTaint: true,
        			useCORS: true
        		}).then(function (canvas) {
        			var anchorTag = document.createElement("a");
        			document.body.appendChild(anchorTag);
        			anchorTag.download = objFileName +".png"; // "0thum.png";
        			anchorTag.href = canvas.toDataURL();
        			anchorTag.target = '_blank';
        			anchorTag.click();
        			
        			setTimeout(function() {
        				if(parseInt(tmpFakeNum) >= 2){
        					$('.dv_cover_number').css({"display": "block"});
        					$('.dv_cover_bg').css({"display": "block"});
        				}
        			 }, 1000);
        		});
        	} // End-function Make_Download
        	$("input[type='text']").on("focus", function () {
        		window.setTimeout(function () {
        	        
        	    }, 10);
        	});
        	function getimgBase64(url,objBlockImg,objSpan,callback){
            var xhr=new XMLHttpRequest();
            xhr.onload=function(){
                var reader=new FileReader();
                reader.onloadend=function(){
                		objSpan.css("display","none");
            			objSpan.text("");
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET',url);
            xhr.responseType='blob';
            xhr.send();
            xhr.onerror = function() {
                 //console.log("Access to XMLHttpRequest cross origin not allowed.");
                $("div[data-img-bl-id|='"+objBlockImg+"']").css({"background-image": "none"});
            		objSpan.css("display","block");
            		objSpan.text("Access image from this domain not allowed");
			} 
        }
        	function isUrlValid(url) {
        		return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
        	} // End checking url validation
        	
        	
        	var tmpDisplayImg = '.dv_display_img';
        	var $bg = $(tmpDisplayImg),
            elbounds = {
                w: parseInt($bg.width()), 
                h: parseInt($bg.height())
            },
            bounds = {w: 2350 - elbounds.w, h: 1750 - elbounds.h},
            origin = {x: 0, y: 0},
            start = {x: 0, y: 0},
            movecontinue = false;
        	
        	function bgSize($el, cb){
            return function(){ cb($el.attr("data-img-width"), $el.attr("data-img-height")); };
        }
        function move (e){
            var inbounds = {x: false, y: false},
                offset = {
                    x: start.x - (origin.x - e.clientX), 
                    y: start.y - (origin.y - e.clientY)
                };
            
            inbounds.x = offset.x < 0 && (offset.x * -1) < bounds.w;
            inbounds.y = offset.y < 0 && (offset.y * -1) < bounds.h;
            
            if (movecontinue && inbounds.x && inbounds.y) {
                start.x = offset.x;
                start.y = offset.y;
                
                $(this).css('background-position', start.x + 'px ' + start.y + 'px');
            }
            
            origin.x = e.clientX;
            origin.y = e.clientY;
            
            e.stopPropagation();
            return false;
        }
        
        function handle (e){
            movecontinue = false;
            $bg.unbind('mousemove', move);
            
            if (e.type == 'mousedown') {
            		// Get the original size background
            		bgSize($(tmpDisplayImg), function(width, height){
                    start = {x: 0 -(width/2), y:0 - (height/2)};
                });
            	
                origin.x = e.clientX;
                origin.y = e.clientY;
                movecontinue = true;
                $bg.bind('mousemove', move);
            } else {
                $(document.body).focus();
            }
            
            e.stopPropagation();
            return false;
        }
        
        function reset (){
        		bgSize($(tmpDisplayImg), function(width, height){
                //$('body').append('width : ' + width + ' height : ' + height);
                start = {x: 0 -(width/2), y:0 - (height/2)};
            });
            //start = {x: 0, y: 0};
            $(this).css('backgroundPosition', 'center');
        }
        
        $bg.bind('mousedown mouseup mouseleave', handle);
        $bg.bind('dblclick', reset);

}); // End document ready
        		
function focusMeOnPc(vitem) {
    window.setTimeout(function () {
        vitem.setSelectionRange(0, 9999);
    }, 10);
}
