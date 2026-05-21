$(document).ready(function() {
	$('#tabs li a:not(:first)').addClass('inactive');
	$('.container').hide();
	$('.container:first').show();
	    
	$('#tabs li a').click(function(){
	    var t = $(this).attr('id');
	  if($(this).hasClass('inactive')){ //this is the start of our condition 
	    $('#tabs li a').addClass('inactive');           
	    $(this).removeClass('inactive');
	    
	    $('.container').hide();
	    $('#'+ t + 'C').fadeIn('slow');
	 }
	});
	
	var tmpObjDivDsImg;
	$('body .dv_display_img').on('contextmenu', function(e){
	  e.stopPropagation(); 
	  // Your code.
	  console.log(e.pageX);
	  console.log(e.pageY);
	  tmpObjDivDsImg = $(this);
	  $(".dropdown").css({'top':e.pageY + 'px','left':e.pageX + 'px'});
	  $(".dropdown").addClass( "show" );
	  return false;
	});
	
	$(".dropdown-content ul li span").click(function(){
		var tmpData = $(this).attr("data-value");
		tmpObjDivDsImg.css({'background-size':tmpData});
		if(tmpData == 'cover'){
			tmpObjDivDsImg.css({'background-size':'cover','background-position':'center'});
			$(".dropdown-content #txt_imgwidth").val('100');
			$(".dropdown-content #txt_imgheight").val('100');
		}
	});
	$(".dropdown-content ul li div.dvOptionImgWH").click(function(){
		// stopPropagation top keep dropdown menu open
		event.stopPropagation();
	});
	$('body .dropdown-content #txt_imgwidth').on("input", function(){
		var tmpW = $(this).val();
		var tmpH = $(".dropdown-content #txt_imgheight").val();
		tmpObjDivDsImg.css({'background-size':tmpW+'% '+tmpH+'%'});
	});
	$('body .dropdown-content #txt_imgheight').on("input", function(){
		var tmpW = $(".dropdown-content #txt_imgwidth").val();
		var tmpH = $(this).val();
		tmpObjDivDsImg.css({'background-size':tmpW+'% '+tmpH+'%'});
	});
    	
}); // End document ready
        		
//Close the dropdown if the user clicks outside of it
	
$(document).on("click", function(event){
	// Close dropdown option when click anywhere 
	var $trigger = $(".dv_display_img");
	if($trigger !== event.target && !$trigger.has(event.target).length){
		$(".dropdown").removeClass( "show" );
    }
});
