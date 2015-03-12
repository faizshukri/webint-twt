(function(){
    jQuery(document).ready(function($){
        $('#main-navbar').find('li').on('click', function(e){

            // Update main menu
            $('#main-navbar').find('li').removeClass('active');
            $(this).addClass('active');

            // Open and close related section
            $('section.active').hide().removeClass('active');
            $($(this).data('target')).show().addClass('active');
            
        });
    });
})();