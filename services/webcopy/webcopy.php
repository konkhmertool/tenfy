		
<?php

$url = @$_GET['fullWebSiteCopy']; // if you want to paste data via url
$blogcontent = @$_GET['blogcontent'];
$blogcontentby = @$_GET['blogcontentby']; // search blog content by ID or Class
$tmpTitlePrefix = @$_GET['tmpTitlePrefix'];
$tmpTitleSubfix = @$_GET['tmpTitleSubfix'];

/*
  $url = 'https://siamstations.com/จงใจหรือไม่เห็น-หมานอน/';
  //  $blogcontent = 'content';
  //  $blogcontentby = 'id';
 */

$response = array();
$tmpIsBlogSpot = false;
if ($blogcontent == "blogspot" || strpos($url, 'blogspot') !== false) {
    $tmpIsBlogSpot = true;
}

if ($url && $tmpIsBlogSpot == FALSE) {
    /*
      https://oscarliang.com/six-ways-retrieving-webpage-content-php/

      To use file_get_contents and fopen you must ensure “allow_url_fopen” is enabled.
      Check php.ini file, turn allow_url_fopen = On.
      When allow_url_fopen is not on, fopen and file_get_contents will not work.
     */
    
    
      /*
      //fopen opens webpage in Binary
      $handle=fopen($url,"rb");
      // initialize
      $lines_string="";
      // read content line by line
      do{
            $data=fread($handle,1024);
            if(strlen($data)==0) {
                break;
            }
            $lines_string.=$data;
      }while(true);
      //close handle to release resources
      fclose($handle);
      */
    
    // -- function file_get_contents() reads remote webpage content
    $lines_string = file_get_contents($url);
    
    
    $fileHeaders = @get_headers($url);
    if ($fileHeaders[0] == "HTTP/1.1 200 OK" || $fileHeaders[0] == "HTTP/1.0 200 OK") {
        //$content = strip_html_tags($blogcontent, $blogcontentby, file_url_contents($url));
        $content = strip_html_tags($url, $blogcontent, $blogcontentby, $lines_string, $tmpTitlePrefix, $tmpTitleSubfix);  
        $response = array(
            'status' => true,
            'message' => $content
        );
    } else {
        $response = array(
            'status' => false,
            'message' => "Erro File header!! Cannot retrieve information."
        );
    }
    
}else if ($tmpIsBlogSpot){
    $response = array(
        'status' => false,
        'message' => "blogspot"
    );
}else {
    $response = array(
        'status' => false,
        'message' => "Error Url!! Cannot retrieve information."
    );
}

//To remove all the hidden text not displayed on a webpage
function strip_html_tags($objUrl, $searchcontent, $searchby, $str, $objPrefix, $objSubfix) {

    $title_thumbnail = crawlTitleThumbnail($objUrl, $str, $objPrefix, $objSubfix);
    //$title = '#'.getTextBetweenTags($str, 'title'); // get content from html tag
    //$title = $objPrefix.$title.$objSubfix ."\n";
    
    if ($searchby) {
        $str = getHTMLByIDorClass($searchcontent, $searchby, $str);
    }

    $str = preg_replace('/(<|>)\1{2}/is', '', $str);
    
    $str = preg_replace(
           array(// Remove invisible content
                '@<head[^>]*?>.*?</head>@siu',
                '@<header[^>]*?>.*?</header>@siu',
                '@<menu[^>]*?.*?</menu>@siu',
                '@<style[^>]*?>.*?</style>@siu',
                '@<script[^>]*?.*?</script>@siu',
                '@<noscript[^>]*?.*?</noscript>@siu',
                '@<object[^>]*?.*?</object>@siu',
                '@<embed[^>]*?.*?</embed>@siu',
                '@<applet[^>]*?.*?</applet>@siu',
                '@<noframes[^>]*?.*?</noframes>@siu',
                '@<blockquote[^>]*?.*?</blockquote>@siu',
                '@<p class="text-muted"[^>]*?.*?</p>@siu',
                '@<div class="tag"[^>]*?.*?</div>@siu',
                '@<span itemscope[^>]*?.*?</span>@siu', // Page 4M David
                '@<div class="head-image thumb-wrap relative"[^>]*?.*?</div>@siu', // https://www.siamnews.com
                '@<div class="fb-follow-box"[^>]*?.*?</div>@siu', // https://www.siamnews.com
                '@<div class="line_view"[^>]*?.*?</div>@siu', // https://www.siamnews.com
                '@<div class="ad ad-separator"[^>]*?.*?</div>@siu', // https://www.siamnews.com
                '@<div class="line_view"[^>]*?.*?</div>@siu', // https://www.siamnews
                '@<div class="col-md-6"[^>]*?.*?</div>@siu', // http://www.tnews.co.th/
                '@<div class="right-feed-main"[^>]*?.*?</div>@siu', // http://www.tnews.co.th/
                '@<div class="over-h80"[^>]*?.*?</div>@siu', // http://www.tnews.co.th/
                '@<div id="wpdevar_comment_1"[^>]*?.*?</div>@siu', // https://www.postsara.com
                '@<div class="td-related-row"[^>]*?.*?</div>@siu', // https://www.postsara.com
                '@<div id="mvp-post-feat-img"[^>]*?.*?</div>@siu', // https://www.khobkhao.com
                '@<h3 class="mvp-post-cat left"[^>]*?.*?</h3>@siu', // https://www.khobkhao.com
                '@<h1 class="mvp-post-title left entry-title"[^>]*?.*?</h1>@siu', // https://www.khobkhao.com
                '@<div class="mvp-author-info-wrap left relative"[^>]*?.*?</div>@siu', // https://www.khobkhao.com
                '@<div class="code-block"[^>]*?.*?</div>@siu', // https://socialnewsupdates.com/
                '@<div class="mvp-post-tags"[^>]*?.*?</div>@siu', // https://treesweat.info/
                '@<section id="mvp-more-post-wrap"[^>]*?.*?</section>@siu', // https://treesweat.info/
                '@<div class="hm-related-posts"[^>]*?.*?</div>@siu', // https://socialnewsupdates.com/
                '@<div class="hmrp-container"[^>]*?.*?</div>@siu', // https://socialnewsupdates.com/
                '@<div id="comments"[^>]*?.*?</div>@siu', // https://socialnewsupdates.com/
                '@<div class="entry-meta"[^>]*?.*?</div>@siu', // Team office website
                '@<div id="comments"[^>]*?.*?</div>@siu', // Team office website
                '@<div class="entry-media"[^>]*?.*?</div>@siu', // Team office website
                '@<nav class="navigation post-navigation"[^>]*?.*?</nav>@siu', // Team office website
                '@<nav class="pagination-single section-inner"[^>]*?.*?</nav>@siu', // Team office website
                '@<small[^>]*?>.*?</small>@siu', // http://www.tnews.co.th/
                '@<footer[^>]*?.*?</footer>@siu',
                '@<div id="sudfooter"[^>]*?.*?</div>@siu',
           ), "", //replace above with nothing
           $str);
    
    
    $str = replaceWhitespace($str);

    $str = strip_tags($str, "<img> <iframe> <br> <h3> <p> <video>");

    $tags = array("p", "br", "h3");

    // check if there is video tag and then get the src
    $video = getTextBetweenTags($str, "video");
    $video = (!$video ? $video = "" : "\n<iframe src='" . $video . "'></iframe>\n");

    // remove the certaintag 
    $str = removeCertainTag($tags, $str);

    //$str = $title . $thumbnail . $video . $str;
    $str =  $title_thumbnail . $video . $str;

    return $str;
}

//function strip_html_tags ENDS

function getHTMLByIDorClass($searchcontent, $searchby, $html) {

    $html = mb_convert_encoding($html, 'HTML-ENTITIES', "UTF-8");

    $dom = new DOMDocument("1.0", "utf-8");
    libxml_use_internal_errors(true);

    $dom->loadHTML($html);

    header("Content-Type: text/html; charset=utf-8");

    /*
    $node = $dom->getElementById($searchcontent);
    if ($node) {
        $str = $dom->saveHTML($node);
        return $str;
    }
    */
        
    if ($searchby === 'id') {
        $node = $dom->getElementById($searchcontent);
        if ($node) {
            $str = $dom->saveHTML($node);
            return $str;
        }
    } else {
        
        $div = $dom->getElementsByTagName('div');
        $i = 0;
        $str = "";
        while($dv = $div->item($i++))
        {
            $class_node = $dv->attributes->getNamedItem($searchby);//('class');

            if($class_node)
            {
                if($dv->attributes->getNamedItem($searchby)->value === $searchcontent){ //('class')->value === $searchcontent){
                    $str = $dom->saveHTML($dv);
                    break;
                }
            }
        }
        return $str;
        
    }
    
    return false;
}

function getTextBetweenTags($string, $tagname) {

    $pattern = "/<$tagname ?.*>(.*)<\/$tagname>/";

    preg_match($pattern, $string, $matches);

    if ($matches) {
        return $matches[1];
    }
    return false;
}

function crawlTitleThumbnail($objUrl, $objStr, $objPrefix, $objSubfix){
    // convert all html to UTF-8,, preventing from display error characters
    $lines_string = mb_convert_encoding($objStr, 'HTML-ENTITIES', "UTF-8");

    $html = new DOMDocument("1.0", "utf-8");
    @$html->loadHTML($lines_string);
    $meta_og_img = null;
    $meta_og_title = null;
    //Get all meta tags and loop through them.
    foreach($html->getElementsByTagName('meta') as $meta) {
        if($meta->getAttribute('property')=='og:title'){ 
            //Assign the value from content attribute to $meta_og_title
            $meta_og_title = $objPrefix.$meta->getAttribute('content').$objSubfix."\n";
            $meta_og_title = strtolower($meta_og_title);
            //$meta_og_title = str_replace("- news","", $meta_og_title);
        }
        //If the property attribute of the meta tag is og:image
        if($meta->getAttribute('property')=='og:image'){ 
            //Assign the value from content attribute to $meta_og_img
            $meta_og_img = "<img data-thumbnail='".$meta->getAttribute('content')."' width='320'/>\n";
            //break;
        }
    }
    
    // Get title tag when the site doesn't provide og: title
    if(!isset($meta_og_title)){
        $meta_og_title = $html->getElementsByTagName('title'); 
        if ($meta_og_title->length){
            $meta_og_title = $meta_og_title->item(0)->nodeValue."\n";
            $meta_og_title = strtolower($meta_og_title);
        }
    }
    // Ex: if title is ทางวันที่ 1 กันยายน - abc.com
    // Then get the last index of - and remove it out
    $tmp_lastindexof = strrpos($meta_og_title, '-');
    // Result: ทางวันที่ 1 กันยายน
    if($tmp_lastindexof){
        $meta_og_title = substr($meta_og_title, 0, $tmp_lastindexof)."\n";
    }
    return $meta_og_title.$meta_og_img;
}

// This will remove tag but keep content inside
function removeCertainTag($tagnames, $html) {
    foreach ($tagnames as $tag) {
        $html = preg_replace("/<\\/?" . $tag . "(.|\\s)*?>/", "\n", $html);
    }
    return $html;
}

function getVideoSrc($str) {
    preg_match("'<source src=\"(.*?)\" type=\"video/mp4\">'si", $str, $match);

    if ($match)
        return $match[1];

    return false;
}

// This will remove tag and content inside
function removeCertainTagAndContent($tagnames, $html) {
    $result = preg_replace('#<(' . implode('|', $tagnames) . ')(?:[^>]+)?>.*?</\1>#s', '', $html);
    return $result;
}

//To replace all types of whitespace with a single space
function replaceWhitespace($str) {
    $result = $str;
    foreach (array(
"  ", " \t", " \r", " \n",
 "\t\t", "\t ", "\t\r", "\t\n",
 "\r\r", "\r ", "\r\t", "\r\n",
 "\n\n", "\n ", "\n\t", "\n\r",
    ) as $replacement) {
        $result = str_replace($replacement, $replacement[0], $result);
    }
    return $str !== $result ? replaceWhitespace($result) : $result;
}

############################################
//To fetch the $url by using cURL

function file_url_contents($url) {
    $crl = curl_init();
    $timeout = 30;
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
    $ret = curl_exec($crl);
    curl_close($crl);
    return $ret;
}

//file_url_contents ENDS
############################

echo json_encode($response);

?>