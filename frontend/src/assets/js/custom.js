function openNav() {
      
    document.getElementById("mySidepanel").style.transform = "translateX(0)";
    if(!$("body").hasClass('sidebar-bgoverlay'))
     $("body").addClass('sidebar-bgoverlay');
    }
    
    function closeNav() {
    
    document.getElementById("mySidepanel").style.transform = "translateX(-100%)";
    if($("body").hasClass('sidebar-bgoverlay'))
     $("body").removeClass('sidebar-bgoverlay');
    }