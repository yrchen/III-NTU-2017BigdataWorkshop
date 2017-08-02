    var infoIsOpen = 0
    var styleOpen =  'border-top-color:#C9151E';

    $('.quickClose').bind('click',function(e){
        e.preventDefault();
        $('.hdQuick').hide();
        $('.hdSlide').removeClass('selected');
        $('.hdArrow').attr('style',styleClose);
        infoIsOpen =0;
    }); 

    $('body').bind('click',function(){
        if(infoIsOpen!=1){
        }else{
            $('.hdQuick').hide();
            $('.hdSlide').removeClass('selected');
            $('.hdArrow').attr('style',styleClose);
        }
    });

    $('.hdSlide').bind('mouseover',function(e){
        e.preventDefault();
        
        $('.hdSlide').addClass('selected');
        $('.hdArrow').attr('style',styleOpen);
        $('.hdQuick').show();
        infoIsOpen = 1;
        e.stopPropagation();
    });
