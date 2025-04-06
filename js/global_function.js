/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 Area function 
 */

$('body').on('click', function (e) {
    $("#gr_imgoption").hide(); // previewhtml and compose message
    $("#gr_poption").hide();

    // hide the div result web crawler when click anywhere
    if (e.target.id == "dv_resultwebcrawler" || e.target.id == "lb_webcrawler" || e.target.id == "sp_globalspin")
        return;
    if ($(e.target).closest('#dv_resultwebcrawler').length)
        return;

    //Do processing of click event here for every element except with id dv_resultwebcrawler
    $('#dv_resultwebcrawler').hide();
});

function validateURL(str) { //return true/false
    var urlregex = new RegExp("^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)");
    return urlregex.test(str);
}

// this function will search image and get location source ex: src or data-cfsrc
function checkImgSrc(str) {
    // ex: str = "<img src ='www.google.com/123.png'>";
    // some website they don't use attribute src they use data-cfsr; Ex: <img data-cfsrc=''>
    var imgSrc = ["src", "data-cfsrc"];
    var tmpImg = "";
    // looping and search for attribute
    for (i = 0; i < imgSrc.length; i++) {
        var attr = $(str).attr(imgSrc[i]);
        if (attr) {
            tmpImg = '<img border="0" src="' + attr + '">';
            break;
        }

    }
    return tmpImg;
}

//javascript check if null or white space or no space
function isEmptyOrSpaces(str) {
    if (str == null || str.trim() === ''){
		return null;
	}
	return str === null || str.match(/^ *$/) !== null;
}


function extractGoogleCode(varGoogleCode) {
	if(typeof varGoogleCode == 'undefined' || varGoogleCode=="" || varGoogleCode == null) return "";
	var tmpTracking;
    var FBIAarray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var randomFBIA = FBIAarray[Math.floor(Math.random()*FBIAarray.length)]; 
   
    var varRemoveSpaceScript = "< /script>";
    varRemoveSpaceScript = varRemoveSpaceScript.replace(/\s+/g, ''); // Remove the space when closing script is always error and conflict with another closing script
    tmpTracking = "\t\t\t<script>";
    
    tmpTracking += "\t\t\t  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n"
            + "\t\t\t  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n"
            + "\t\t\t  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n"
            + "\t\t\t  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n"
            + "\t\t\t  ga('create', '" + varGoogleCode + "', 'auto');\n"
            + "\t\t\t  ga('require', 'displayfeatures');\n"
            + "\t\t\t  ga('set', 'campaignSource', 'Social Instant Articles');\n"
            + "\t\t\t  ga('set', 'campaignMedium', 'Social Instant Articles');\n"
            + "\t\t\t  ga('set', 'title', '" + randomFBIA + "IA: ' + ia_document.title);\n"
            + "\t\t\t  ga('send', 'pageview');\n";
    
    tmpTracking += "\t\t\t" + varRemoveSpaceScript + "\n";
    
    return tmpTracking;
	
}

function extractGoogleCodeV2(varGoogleCode) {
    var tmpTracking;
    
    var FBIAarray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var randomFBIA = FBIAarray[Math.floor(Math.random()*FBIAarray.length)]; 
    
    var varRemoveSpaceScript = "< /script>";
    varRemoveSpaceScript = varRemoveSpaceScript.replace(/\s+/g, ''); // Remove the space when closing script is always error and conflict with another closing script
    
    tmpTracking = "<script async='async' src='https://www.googletagmanager.com/gtag/js?id=" + varGoogleCode + "'>" + varRemoveSpaceScript + "\n";
    tmpTracking += "<script>\n";
    tmpTracking += "\t\t\t window.dataLayer = window.dataLayer || [];\n" 
			   + "\t\t\t function gtag(){dataLayer.push(arguments);}\n"
			   + "\t\t\t gtag('js', new Date());\n"
			   + "\t\t\t gtag('config', '" + varGoogleCode + "',{\n"
			   + "\t\t\t\t 'page_title' : '" + randomFBIA + ": ' + ia_document.title,\n"
			   + "\t\t\t\t campaign: {\n "
			   + "\t\t\t\t source: 'Social Instant Articles',\n"
			   + "\t\t\t\t medium: 'Social Instant Articles'\n"
			   + "\t\t\t\t }\n"
			   + "\t\t\t });\n";
    tmpTracking += "\t\t\t\t " + varRemoveSpaceScript + "\n"; // End </script>
   
   return tmpTracking;
}

function extractFacebookBanner(varPlacementId) {
    var fbBannerAds = '\t\t\t\t<figure class="op-ad">\n';
    fbBannerAds += '\t\t\t\t  <iframe src="https://www.facebook.com/adnw_request?placement=' + varPlacementId + '&adtype=banner300x250" width="300" height="250"></iframe>\n';
    fbBannerAds += '\t\t\t\t</figure>\n';
    return fbBannerAds;
}

function ordinal_suffix_of_Date(i) {
    var j = i % 10,
            k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];
    if (domain.indexOf("www") < 0) {
        domain = "www." + domain;
    }
    var myProtocol = url.split('/')[0];
    return myProtocol + '//' + domain; // example: http://+domain
}

function extractDomainNoWWW(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    var myProtocol = url.split('/')[0];
    return myProtocol + '//' + domain; // example: http://abc.com
}

function extractDomainForHTTPs(url, urlToSwap) {

    var myProtocol = url.split('/')[0];
    var domain;
    //find & remove protocol (http, ftp, etc.) and get address
    domain = urlToSwap.replace(/^https?\:\/\//i, "");

    return myProtocol + '//' + domain; // example: http://www.abc.com or https://www.abc.com
}

function extractDomainForHTTPsNoWWW(url, urlToSwap) {
    var myProtocol = url.split('/')[0];
    var myDomainUrlPath = urlToSwap.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
    var domain;
    //find & remove protocol (http, ftp, etc.) and get address
    domain = urlToSwap.replace(/^https?\:\/\//i, "");
    return myProtocol + '//' + myDomainUrlPath; // example: http://www.abc.com or https://www.abc.com
}

function extractDomainNoHTTPWWW(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    return url; // example: hotnews.com
}

function extractDomainOnlyPath(url){
	url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
    return url; // output: abc.com/2018/03/49-84.html

}

function removeProtocol(url) {
    return url.replace(/(^\w+:|^)\/\//, '');
}

function removeExactString(valueToSearch) {

    var names_arr = ['พื้นที่โฆษณา', 'advertisement', 'เรียบเรียง'];
    var status = '';
    for (var i = 0; i < names_arr.length; i++) {
        var name = names_arr[i];

        if (valueToSearch.toLowerCase().indexOf(name) >= 0) {
            status = 'exist';
            break;
        }
    }

    if (status === 'exist') {
        return '';
    } else {
        return valueToSearch;
    }
}


function detectmobAndSafari() {

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || safari.pushNotification);

    if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            || isSafari
            ) {
        return true;
    } else {
        return false;
    }
}


function validateUrl(urlVal)   // return true or false.
{
    var urlregex = new RegExp(
            "^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)");
    return urlregex.test(urlVal);
}

// focus on text box working for safari and mobile phone
// when click on textbox will show button copy
function focusMe(vitem) {
    if(detectmobAndSafari()===true) { //if browser from mobile phone
    	window.setTimeout(function () {
            vitem.setSelectionRange(0, 9999);
        }, 10);
	}
}

function focusMeOnPc(vitem) {
    if (detectmobAndSafari() === false) { 
        window.setTimeout(function () {
            vitem.setSelectionRange(0, 9999);
        }, 10);
    }
}
function mouseUpOnPc(vitem){
	if (detectmobAndSafari() === false) { 
		$(vitem).select();
    }
}
function resetUIView() {
    //reset are ui of html preview and compose
    $("#btn_previewhtml").addClass("active");
    $("#btn_previewcompose").removeClass("active");
    $('#dv_previewhtml').hide();
    $('#tarea_message').show();
    $("#txt_previewhtmlorcompose").val('html');
    activaTab();
}

// open bootstrap tab
function activaTab(tab = 'tabs-1') {
    $('.nav.nav-tabs a[href="#' + tab + '"]').tab('show');
}

// replace all linebreak with wrap p tag
function replace_br(html) {
    lines = html.split("\n");
    result = '<p>' + lines.join("</p><p>") + '</p>';
    return result;
}
// Use in jhtmlcomposepreview.js
function RemoveHtmlTags(divId, arg_domain = 'blogspot') {
    var whitelist = "p,img,iframe,video,ul,ol,li,a"; // for more tags use the multiple selector, e.g. "p, img"
    // this will loop all content in div but not whitelist
    $(divId + " *").not(whitelist).each(function () {
        var content = $(this).contents();
        $(this).replaceWith(content);
    });
    var countP = 0;
    // this will find all p and remove p but keep content and new line break
    $(divId + " p ").each(function () {
        if ($(this).html() !== "") {
            if (countP == 0) {
                // first line no need to put linebreak because it maybe title or thumbnail
                $(this).replaceWith($(this).html() + "\n");
            } else {
                $(this).replaceWith("\n" + $(this).html() + "\n");
            }
        } else {
            $(this).replaceWith("");
        }
        countP++;
    });
    //Remove wrapping <a> anchor tag from an image using jQuery
    $(divId + " a > img").unwrap();
    
    
    // let create variable to save image blogspot to array 
    var arrImgSrcBlogspot = [];
    var isHaveImageOtherDomain = false;
    // looping blogspot image
    $(divId + " img").each(function() {
      	var imgsrc = $(this).attr("src");
      	// assign blospot image to array
      	if (imgsrc.indexOf(arg_domain) > -1) {
	        arrImgSrcBlogspot.push(imgsrc);
	    }else{
	    	// set to true when looping and see image is not from blogspot
        	isHaveImageOtherDomain = true;
        }
   	}); 
    // number of blogspot image array
    var tmpIloop = 0;
    $(divId + " img").each(function() {
    	var imgsrc = $(this).attr("src");
    	// replace other image to blogspot image within length of array
    	if(tmpIloop <= arrImgSrcBlogspot.length-1 && imgsrc.indexOf(arg_domain) <= -1){
        	$(this).replaceWith("<img src='"+arrImgSrcBlogspot[tmpIloop]+"' border='0'/>");
            tmpIloop++;
        }else{
        	if(isHaveImageOtherDomain)
	        	$(this).remove(); // Remove unnecessary image that is not blogspot
        }
    });
    
    /*
    // Create array which containt word from domain
    var arrFilterDomain = ['siamtopic', 'siamnews', 'mumkhao','siamstreet'];
    // looping image again to clear out unnecessary image
    $(divId + " img").each(function() {
    	var imgsrc = $(this).attr("src");
	    for (i = 0; i < arrFilterDomain.length; ++i) {
	      	if (imgsrc.indexOf(arrFilterDomain[i]) > -1) {
	      		$(this).remove(); // remove image
	      	}
	  	}
    });
    */
    
    // assign final html & return it.
    var finalText = $(divId).html();
    return finalText;
}
//Here is the simple function to test if the string contains HTML data:
function isHTML(str) {
  var a = document.createElement('div');
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true; 
  }

  return false;
}

//function on 10-March-2019
function chunkZeroSpace(str, objRandNumChar=2) {
    var ret = [];
    var i;
    var len;

    // 3 is the start number
    // 7 is the number of possible results (3 + start (7) - end (3))

    var rndCharacter = Math.floor(Math.random() * 7) + objRandNumChar;
    var tmpRnd = rndCharacter;
    
    var result = "";
    var consonant = ["ก", "ข", "ฃ", "ค", "ฅ", "ฆ", "ง", "จ", "ฉ", "ช", "ซ", "ฌ", "ญ", "ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ", "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล", "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ"];
    var vowel = ["ะ", " ั", " ็", "า", " ิ", " ่", " ่ ่", " ํ", " ุ", " ู", "เ", "ใ", "ไ", "โ", "อ", "ย", "ว", "ฤ", "ฦ", "ำ", "้"];

    for (i = 0, len = str.length; i < len; i += tmpRnd) {

        //ret.push(str.substr(i, rndCharacter));

        // get the trim current content in loop
        var currentCharacter = str.substr(i, 1);

        // if the last characters is consonent then add zero space
        if (consonant.indexOf(currentCharacter.toLowerCase()) >= 0) {
            result += "​" + str.substr(i, rndCharacter);
        } else {
            result += str.substr(i, rndCharacter);
        }

        tmpRnd = rndCharacter;

        rndCharacter = Math.floor(Math.random() * 6) + 1;

    }

    return result;
    //return ret
}

function chunkWordAddWhiteSpace(str) {
    var ret = [], i, len, runtime = 0; 
    // 3 is the start number
    // 7 is the number of possible results (3 + start (7) - end (3))

    var rndCharacter = Math.floor(Math.random() * 10) + 1;
    var tmpRnd = rndCharacter;

    var result = "";
    var consonant = ["ก", "ข", "ฃ", "ค", "ฅ", "ฆ", "ง", "จ", "ฉ", "ช", "ซ", "ฌ", "ญ", "ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ", "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล", "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ"];
    var vowel = ["ะ", " ั", " ็", "า", " ิ", " ่", " ่ ่", " ํ", " ุ", " ู", "เ", "ใ", "ไ", "โ", "อ", "ย", "ว", "ฤ", "ฦ", "ำ", "้"];

    for (i = 0, len = str.length; i < len; i += tmpRnd) {

        //ret.push(str.substr(i, rndCharacter));

        // get the trim current content in loop
        var currentCharacter = str.substr(i, 1);

        // if the last characters is consonent
        if ((consonant.indexOf(currentCharacter.toLowerCase()) >= 0) && runtime < 7) {
            result += " " + str.substr(i, rndCharacter);
            runtime++;
        } else {
            result += str.substr(i, rndCharacter);
        }

        tmpRnd = rndCharacter;
        rndCharacter = Math.floor(Math.random() * 10) + 1; // re-random again.
    }

    return result;
    //return ret
}