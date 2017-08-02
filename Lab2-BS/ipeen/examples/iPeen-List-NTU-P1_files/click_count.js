function credit_card_click_count(page_name, section_name, project_id) {
    $.ajax({
        url         : '/cgi/credit_card_click_count.php',
        data        : { 'page_name'     : page_name,
                        'section_name'  : section_name,
                        'project_id'    : project_id
                      },
        dataType    : 'text',
        type        : 'GET',
        success     : function(res){}
    });
}
