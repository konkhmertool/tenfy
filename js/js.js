/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */


var jqXHR;
    var jqHTTP_or_HTTPS;
    $("input:radio[name=optradiobloggerid]").click(function () {
        // if there is a still requesting then abort it
        if (typeof jqXHR !== 'undefined')
            jqXHR.abort();
        var tmpBloggerId = $(this).attr('value');
        jqHTTP_or_HTTPS = $(this).attr('data-url');
       
        $("input:radio[name=optradiobloggerid]").attr('checked', false);
        $(this).attr('checked', true);
        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        
		//$('#img_refreshloading_blogger').attr("src", "img/refresh_loading2.gif");
		$(".dv_mobilepulldownrefresh").css("display", "block");
        getBloggerPost(tmpBloggerId);
        //definedControl(false,"block");
        
    });
    $("#blogContainerPostContent").on("click", "input.btnShortLink", function () {
		var tmpTxtArea = $(this).closest('li').find('.tareapstctn');
		copyNewsBlogWp($(this),$(tmpTxtArea),false,false,false,true);
    });    
    $("#blogContainerPostContent").on("click", "input.btnCopyNews", function () {
		var tmpTxtArea = $(this).closest('li').find('.tareapstctn');
		copyNewsBlogWp($(this),$(tmpTxtArea),true,false,false,false);
    });
    
    function getBloggerPost(tmpBloggerId) {
        // before update content must clear the old content first
        var objurl = 'https://www.blogger.com/feeds/' + tmpBloggerId + '/posts/default?max-results=40&alt=json-in-script';
        $('#blogContainerPostContent').html("");
        
        jqXHR = $.ajax({
            url: objurl,
            type: 'get',
            dataType: "jsonp",
            beforeSend: function(){
            },
            success: function (data) {
                var post_number = data.feed.entry.length;
                var clearBoth = "";
                var disabledWhenMobile = "";
                var str_tags = "";
                var row_clear = 0;
                var tmpTextContent="";
                // calling function from global_function.js
                for (var i = 0; i < data.feed.entry.length; i++) {
                    var post_body = data.feed.entry[i].content.$t;
                    var temporaryElement = document.createElement('div');
                    temporaryElement.innerHTML = post_body;
                    var firstImg = temporaryElement.getElementsByTagName('img')[0];
                    
                    // Get image src attribute                    
                    var imgSrc = firstImg ? firstImg.src : "";
                    var smallImgSrc = "";
                    // Actually original image (/s1600/1.png) is big that loading so slow
                    // So we need to take small image (/w200-h105/1.png) insteat
                    if(firstImg){
                        var _array = imgSrc.split('/');
        				var _foo = _array[_array.length - 2]; // get the last 2nd slash
        				var tmpRest = imgSrc.substring(0, imgSrc.lastIndexOf("/") + 1); // get the url until last index of /
        				var tmpFileName = imgSrc.substring(imgSrc.lastIndexOf("/") + 1, imgSrc.length);
        				tmpRest = tmpRest.replace('/' + _foo, ''); // remove small image put the original image in blogger
        				if (imgSrc.indexOf('blogger') > -1) {
        					imgSrc = imgSrc.replace("=s1600", "");
        					smallImgSrc = imgSrc + '=s320';
        				}else{
        					smallImgSrc = tmpRest + 'w200-h105/' + tmpFileName;
        				}
                    }
                    var postUrl = "";
                    for (var j = 0; j < data.feed.entry[i].link.length; j++) {
                        if (data.feed.entry[i].link[j].rel == 'alternate') {
                            postUrl = data.feed.entry[i].link[j].href;
                            break;
                        }
                    }
                    
                    //global variable HTTP or HTTPS
                    postUrl = extractDomainForHTTPsNoWWW(jqHTTP_or_HTTPS,postUrl);
                    var q_parameter="" , q_linebreaklink="",q_thumbnail="",q_sfb = "",q_comment="", q_readmore="";
                    
                    if(jqHTTP_or_HTTPS.includes('?')) { 
                    		q_parameter = (new URL(jqHTTP_or_HTTPS)).searchParams.get('q')?(new URL(jqHTTP_or_HTTPS)).searchParams.get('q') : null;
                    		q_linebreaklink= (new URL(jqHTTP_or_HTTPS)).searchParams.get('linebreaklink');
                    		q_thumbnail= (new URL(jqHTTP_or_HTTPS)).searchParams.get('thumbnail');
                    		q_sfb= (new URL(jqHTTP_or_HTTPS)).searchParams.get('sfb');
                    		q_comment= (new URL(jqHTTP_or_HTTPS)).searchParams.get('comment');
                    }
                    
                    var tmpTitle = data.feed.entry[i].title.$t;
                    tmpTitle = tmpTitle.replace(/\u200B/g,''); // chunk and remove all zero space from title
                    tmpTitle = tmpTitle.trim(); // remove white space first and last
                    // 
                    var tmpLabel = "";
                    if(data.feed.entry[i].category[0].term){
                    		tmpLabel = "#" + data.feed.entry[i].category[0].term;
                    }
                    var arr = ['#ข่าวสังคม','#ข่าวดารา','#ข่าวบันเทิง','#คลิป'];
                    	// Remove html tag get text only
                		var tmp_tags = "";
                		for(var ilabel=0; ilabel<arr.length;ilabel++){
                		  if(tmpLabel !== arr[ilabel]){
                    		  // Add only different label
                			  tmp_tags = tmp_tags + arr[ilabel] + " ";
                		  }
                		}
                		str_tags = "\n\n" + tmpLabel + " " + tmp_tags;
                		// Result: #ข่าวสังคม #ข่าวดารา #ข่าวบันเทิง #คลิป #ข่าวทั่วไป
                        
                        // Blogger 1st content is image
                        // So we need to grab the second content as description  
                		var tmpDesc = temporaryElement.children[1].textContent;

                		if(tmpDesc){
                		  tmpDesc = tmpDesc.replace(/\u200B/g,''); // Remove zero space
                		  tmpDesc = "\n" + tmpDesc.substr(0, 70);
                		}

                		var tmpPostUrl = postUrl;
                		
                		var arr_Readmore = ['อ่านข่าว','อ่านข่าวที่นี่','อ่านเพิ่มเติม'];
                		var arr_readmore_icon = ['ความคิดเห็น👇','ความคิดเห็น👇👇'];
                		
					if(q_parameter !=="" && q_parameter !== null){
						var strRandom = Math.floor(Math.random()*arr_Readmore.length);
						q_parameter = arr_Readmore[strRandom];
						q_readmore = q_parameter + " " + arr_readmore_icon[Math.floor(Math.random()*arr_readmore_icon.length)];
						tmpPostUrl = q_parameter + ": " + tmpPostUrl;
					}
					
					if(q_sfb){
						tmpPostUrl = tmpPostUrl + "?sfb=1";
					}
                    if(q_linebreaklink==1){
                    		tmpPostUrl = tmpPostUrl + "\n\n";
                    }
                    var tmpTextArea = tmpPostUrl + "\n" + tmpTitle;
                    if(q_comment){
                    		tmpTextArea = tmpTextArea + "\n" + q_readmore;
					}

                    // Get the last image
					var sqaure_img_parameter = temporaryElement.getElementsByTagName('img');
                    var last_sqaure_img = sqaure_img_parameter[sqaure_img_parameter.length-1];
                    var last_sqaure_img_src = last_sqaure_img.src;
                    var tmp_filename_noext = last_sqaure_img_src.substring(last_sqaure_img_src.lastIndexOf("/") + 1, last_sqaure_img_src.lastIndexOf("."));  
        				// indexOf() returns -1 if the string wasn't found at all.
        				// case-insensitive search
        				tmp_filename_noext = tmp_filename_noext.toLowerCase();
        				// grab only sqaure image
        				if (q_thumbnail!=="" & (tmp_filename_noext.indexOf("0-sar") >= 0 || tmp_filename_noext.indexOf("0-sqr") >= 0 || tmp_filename_noext.indexOf("1-sar") >= 0 || tmp_filename_noext.indexOf("1-sqr") >= 0)){
            				// show square image instead of default or first image
        					smallImgSrc=last_sqaure_img_src;
        				}
                    
                    tmpTextContent = tmpTitle+"\n"+post_body;
                    // Replace ' and " 
                    tmpTextContent = tmpTextContent.replace(/"/g, "&quot;");
                    tmpTextContent = tmpTextContent.replace(/'/g, "&#039;");
                    
                    $('#blogContainerPostContent').append(
                            '<div class="wrapContainerPostContent '+clearBoth+'">'
                            + "<ul>"
                            + "<li>"
                            + "<span class='post_number post_number2'>"+ post_number +"</span>"
                            + "<textarea id='txtLinkTitle"+i+"' rows='5' cols='100%' readonly class='form-control tareapstctn tareapstctnblogger' onmouseup='mouseUpOnPc(this)'>" + tmpTextArea + "</textarea>" //onfocus='focusMe(this)'
                            + "<div class='dvpstctnSendBoomNews'>"
                            + "<input type='button' data-blogid='"+tmpBloggerId+"' data-url='" + postUrl + "' data-title='" + tmpTitle + "' data-img='" + imgSrc + "' data-desc='" + tmpDesc + "' data-tags='" + str_tags + "' data-content='"+tmpTextContent+"' class='btn btnleft btn-primary btnCopyNews' value='COPY Ctn'>"
                            + "<input type='button' data-blogid='"+tmpBloggerId+"' data-url='" + tmpPostUrl + "' data-title='" + tmpTitle + "' data-img='" + imgSrc + "' data-qparam='"+q_parameter+"' class='btn btnmiddle btn-primary btnShortLink' value='COPY Link'>"
                            + "<input type='button' data-toggle='modal' data-value='200' data-blogid='"+tmpBloggerId+"' data-url='" + postUrl + "' data-title='" + tmpTitle + "' data-img='" + imgSrc + "' class='btn btnright btn-warning openModalPostContentSendBoomNews' value='Boom'></div>"
                            + "</li>"
                            + "<li>"
                            + "<p><img width='50px' src='" + smallImgSrc + "' /></p>"
                            + "<p class='plikeshare'><iframe src='https://www.facebook.com/plugins/share_button.php?href=" + postUrl + "&width=118&layout=button_count&locale=en_US&size=small&mobile_iframe=true&height=46&appId' width='118' height='21' style='border:none;overflow:hidden' scrolling='no' frameborder='0' allowTransparency='true' allow='encrypted-media'></iframe></p>"
                            //+ "<div class='plikeshare'><div class='fb-share-button' data-href='" + postUrl + "' data-layout='button_count' data-size='small'><a target='_blank' href='https://www.facebook.com/sharer/sharer.php?u=" + postUrl + "&amp;src=sdkpreparse' class='fb-xfbml-parse-ignore'>Share</a></div></div>"
                            + "<p class='pviewlink'><a href='" + postUrl + "' target='_blank' class='viewlinkbgg pviewbitly'>View</a></p>"
                            + "</li>"
                            + '<br clear="all">'
                            + "</ul></div>"
                            );
                    if((row_clear+1) % 4 === 0){
                        clearBoth = "clear";
                    }else{
            				clearBoth = "";
                    }
                    row_clear++;
                    post_number--;
                }// end loop content
				
                $(".dv_mobilepulldownrefresh").css("display", "none");
               	setTimeout(function(){
                }, 700);
            } // end ajax success retreive content
        }).done(function() {
	    		setTimeout(function(){
	        	}, 700); // End setTimeout
	    	}); // End done ajax function
    } // End function getBloggerPost
    
    function copyNewsBlogWp(objThis,objThisTxt=false,objIsButtonCopyClick = false,objIsBtnCopyContent = false, objIsTouch = false,objIsBtnCopyLink =false){
			// Chunk the title with zero space when button copy is clicked; calling function from [global_function.js]
	    var tmpTitle = objThis.attr('data-title');
	    tmpTitle = tmpTitle.replace(/\u200B/g,'');
	    var tmpUrl = objThis.attr('data-url');
	    var linkAndTitle = tmpUrl+"\n"+tmpTitle;
	    var objThisTxtId = objThisTxt.attr('id');
	    var tmpOriginalValue = objThisTxt.val();
	
	    if(objIsButtonCopyClick){
	        // Set new value of content with zerospace to text area	    		
	    }
	    // Condition when button copy description tag is click
	    // Store all value of textarea
	    if(objIsBtnCopyContent){
	    		var tmpCnt = objThis.attr('data-content');
	    		objThisTxt.val(tmpCnt);
	    }
	    if(objIsBtnCopyLink){
	        	// Set new value of content with zerospace to text area
	    		objThisTxt.val(tmpUrl);
	    }
	    
	    var copyText = document.getElementById(objThisTxtId);
		    /* Select the text field */
		  	copyText.select();
		 	copyText.setSelectionRange(0, 99999); /* For mobile devices */
	    /* Copy the text inside the text field */
	    document.execCommand("copy");
	    
	    // Change value of button copy and after 1 second revert it back
	    objThis.prop('value', 'Copied');
		// reset the previous textarea background to default 
	    $('.tareapstctn').css("background-color", "#fdfdfd");
	    // set background when object is not null
	    if(objThisTxt) objThisTxt.css("background-color", "#cecece");
	
	    
			objThis.addClass("btnCopiedURLTitle").delay(1000).queue(function(){
	        objThis.removeClass("btnCopiedURLTitle").dequeue();
	        objThis.prop('value', 'COPY Ctn');
	        if(objIsBtnCopyLink){objThis.prop('value', 'COPY Link');}
	     	// clear background after 1 second
	        //if(objThisTxt) objThisTxt.css("background-color", "#fdfdfd");
	        //Remove focus from textarea | and selected
	        copyText.blur();
	        // Restore the original value to textarea back
	        objThisTxt.val(tmpOriginalValue);
	    });     
	} //copyNewsBlogWp