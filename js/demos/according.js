//according panel ctrl

$(document).ready(function() {
	//$('#box').load("test.html");
	
});

function initAccordingPanels() {	
	$('.according-panel-wrapper').each(function() {
		let currentAccPanel = $(this);		
		let accordingPanelOpenCloseIcon = $(currentAccPanel).children().children().eq(0);
		if($(currentAccPanel).children().next().css('display').toLowerCase() != 'block') {
			$(accordingPanelOpenCloseIcon).text('[+]');
		} else {
			$(accordingPanelOpenCloseIcon).text('[-]');
		}
	});		
}

function accordingPanelHeaderOnmouseOverEvent(accordingPanelHeader) {
	if(typeof(accordingPanelHeader) !== 'undefined') {
		$(accordingPanelHeader).css('cursor', 'pointer');
	}
}

function accordingPanelHeaderClickEvent(accordingPanelHeader) {
	if(typeof(accordingPanelHeader) !== 'undefined') {
		let accordingPanelContentPanel = $(accordingPanelHeader).next();
		let accordingPanelOpenCloseIcon = $(accordingPanelHeader).children().eq(0);
		if($(accordingPanelContentPanel).css('display').toLowerCase() == 'block') {
			$(accordingPanelContentPanel).slideUp("fast", function() {					
    			$(accordingPanelOpenCloseIcon).text('[+]');
			});
		} else {
			$(accordingPanelContentPanel).slideDown("fast", function() {					
    			$(accordingPanelOpenCloseIcon).text('[-]');
			});
		}		
	}
}