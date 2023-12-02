$(document).ready(function () {
    // var message_side = 'right';

    var socket = io.connect('http://15.165.10.78:5020');
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                $message.get(0).scrollIntoView();
                setTimeout(function () {
                    $message.addClass('appeared');
                    scrollToBottom();
                }, 0);
            };
        }(this);
        return this;
    };

    function getMessageText() {
        var $message_input;
        $message_input = $('.message_input');
        return $message_input.val();
    }

    function sendMessage(text, message_side) {
        var $messages, message;


        if (text.trim() === '') {
            return;
        }
        $('.message_input').val('');
        $messages = $('.messages');
        message = new Message({ text: text, message_side: message_side });
        message.draw();
        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    }

    socket.on('connect', function () {
        console.log('Connected to WebSocket');

    });

    socket.on('response', function (msg) {
        console.log('Message from server:', msg);
        if (msg.sender_id == socket.id) {
            sendMessage(msg.message, 'right');
        } else {
            sendMessage(msg.message, 'left');
        }
    });

    socket.on('disconnect', function () {
        console.log('Disconnected from WebSocket');
    });

    $('.send_message').click(function () {
        var messageText = getMessageText();
        $('.message_input').val('');
        if (messageText) {
            socket.emit('message', messageText);
        }
    });

    $('.message_input').keyup(function (e) {
        if (e.which === 13) {
            var messageText = getMessageText();
            $('.message_input').val('');
            if (messageText) {
                socket.emit('message', messageText);
            }
        }
    });

    var scrollToBottom = function () {
        var messagesContainer = $('.messages');
        messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
    };

    var centerPopup = function (popupId) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var popupWidth = $(popupId).outerWidth();
        var popupHeight = $(popupId).outerHeight();

        $(popupId).css({
            "position": "fixed",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)"
        });
    };

    $(window).resize(function () {
        if ($('.popup:visible').length) {
            centerPopup('.popup:visible');
        }
    });

    $(document).on('click', '.like-img, .dislike-img', function () {
        var popupId = $(this).data('option') === 'like' ? '#thanks-popup' : '#dislike-popup';
        $(popupId).fadeIn();
        centerPopup(popupId);

        if ($(this).data('option') === 'dislike') {
            $(popupId).find('.popup-content').css({
                'background-color': '#fff',
                'border-color': '#f44336'
            });
        } else {
            $(popupId).find('.popup-content').css({
                'background-color': '',
                'border-color': ''
            });
        }
    });


    $('.close-popup').click(function () {
        $('.popup').fadeOut();
    });

    // 싫어요 제출 버튼 이벤트
    $(document).ready(function () {
        $('#dislike-form').submit(function (event) {
            // 폼이 기본 동작을 중지시킴
            event.preventDefault();

            // 폼 데이터를 직렬화하여 가져옴
            var formData = $(this).serialize();

            // Ajax 요청 설정
            $.ajax({
                type: 'POST',
                url: 'http://15.165.10.78:5020/submit_dislike',
                data: formData,
                success: function (response) {
                    // 성공적인 응답 처리
                    console.log('전송 성공!');
                    console.log(response);

                    // 데이터 초기화 및 팝업 종료
                    resetForm();
                    closePopup();
                },
                error: function (error) {
                    // 오류 발생 시 처리
                    console.error('전송 실패!');
                    console.error(error);

                    // 실패해도 팝업은 닫을 수 있도록 추가
                    closePopup();
                }
            });
        });

        // 전송 버튼 클릭 시 폼 제출
        $('#submitDislikeBtn').click(function () {
            $('#dislike-form').submit();
        });

        // 팝업 닫기 버튼 클릭 시 팝업 종료
        $('.close-popup').click(function () {
            closePopup();
        });

        // 전송시 팝업을 자동으로 닫는 함수
        function closePopup() {
            $('#dislike-popup').hide();
        }

        // 입력된 데이터 초기화 함수
        function resetForm() {
            $('input[name="gender"]').prop('checked', false);
            $('input[name="age"]').val('');
            $('input[name="dislike_reason"]').prop('checked', false);
            $('textarea[name="reason_etc"]').val('');
        }
    });
})


const docStyle = document.documentElement.style;
const sendButton = document.querySelector('.send_message');
const boundingClientRect = sendButton.getBoundingClientRect();

sendButton.onmousemove = function (e) {
    const x = e.clientX - boundingClientRect.left;
    const y = e.clientY - boundingClientRect.top;
    const xc = boundingClientRect.width / 2;
    const yc = boundingClientRect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    docStyle.setProperty('--rx', `${dy / -1}deg`);
    docStyle.setProperty('--ry', `${dx / 10}deg`);
};

sendButton.onmouseleave = function (e) {
    docStyle.setProperty('--ty', '0');
    docStyle.setProperty('--rx', '0');
    docStyle.setProperty('--ry', '0');
};

sendButton.onmousedown = function (e) {
    docStyle.setProperty('--tz', '-25px');
};

document.body.onmouseup = function (e) {
    docStyle.setProperty('--tz', '-12px');
};

$('button').click(function (event) {
    event.preventDefault();
});
