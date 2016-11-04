(function($) { 'use strict';

    $(document).ready(function($){

        // Contact Form

        var contactForm = $('form.contact-form');

        if(contactForm.length){
            var contactSubmit = contactForm.find('input[type="submit"]');
            var halfWidthInputs = contactForm.find('input[type=text], input[type=email]').parent();
            var halfWidthInputsOdd =  halfWidthInputs.filter(function(index) {
                return (index + 1) % 2 === 0;
            });
            contactSubmit.attr({value: 'Submit'});
            halfWidthInputs.addClass('half-width');
            halfWidthInputsOdd.addClass('last');
        }


        // Send email AJAX function
        $('#send_contact').click(function(e){

            e.preventDefault();

            // Get data values from submited form
            var sender_name    = document.getElementById('contactname');
            var sender_email   = document.getElementById('contactemail');
            var sender_message = document.getElementById('contactmessage');
            var message_info   = js_contact_vars.message_info;


            // Pass our data and actons to AJAX function
            $.ajax({
                type: "post",
                url: js_contact_vars.admin_url,
                data:{
                    action: 'send_contact_email',
                    nonce: js_contact_vars.nonce,
                    sender_name: sender_name.value,
                    sender_email: sender_email.value,
                    sender_message: sender_message.value,
                    message_info: js_contact_vars.message_info
                },
                beforeSend:function(){
                    $("#contact-error").empty();
                    $("#contact-error").append( 'Sending...' );
                },
                success: function(data){
                    $("#contact-error").empty();
                    $("#contact-error").append(data);

                    // Empty all form fields
                    if ( message_info == data ) {
                        setTimeout(function(){
                            $('#contactform').each(function(){
                              this.reset();
                            });
                            $("#contact-error").empty();
                        },3000);
                    }

                }
            });
            return false;
        });

    }); // End Window Resize

})(jQuery);

