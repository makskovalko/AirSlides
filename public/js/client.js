function toggleFullScreen() {

    var doc = window.document,
        docEl = doc.documentElement,
        requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullScreen,
        cancelFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen;


    var span = this.children[0],
        classname = span.className,
        idx = classname.lastIndexOf('-') + 1,
        now = classname.substr(idx);

    if (now === 'small') {
        span.className = 'glyphicon glyphicon-fullscreen';
        cancelFullScreen.call(doc);
    } else if (now === 'fullscreen') {
        span.className = 'glyphicon glyphicon-resize-small';
        requestFullScreen.call(docEl);
    } else {
        console.error('Wrong fullscreen state, check DOM span classnames.');
    }
}

(function ($) {

    var TOKEN,
        DOMAIN = "http://localhost:3000",
        $question_modal = $('#question_modal'),
        $question_form = $('#question_form'),
        $token_modal = $('#token_modal'),
        $token_form = $('#token_form'),
        $token_input = $('#token_form input').parsley(),
        question_text = document.getElementById('question_text'),
        $vote_wrap = $('#like_dislike_wrap'),
        $like_btn = $('#like'),
        $dislike_btn = $('#dislike'),
        $fullscreen_btn = $('#fullscreen'),
        $question_btn = $('#quest_btn'),
        $cancel_btn = $('#cancel_btn'),
        socket,
        current_slide = 0;

    (function initSocket() {
        socket = io(DOMAIN);

        socket.on('wrong_token', function () {
            window.ParsleyUI.removeError($token_input, "wrong-token");
            window.ParsleyUI.addError($token_input, "wrong-token", "Wrong token!");
            TOKEN = "";
            $token_input.$element[0].value = "";
            $token_modal.modal('show');
        });

        socket.on('change_user_slide', function (resp) {
            updateSlide(resp.img_url);
            current_slide = resp.slide_number;

            $token_modal.modal("hide");
            window.ParsleyUI.removeError($token_input, "wrong-token");
        });

        socket.on('speaker_disconnected',function() {
           //console.log("Speaker disconnected! Reload the page");
            TOKEN = "";
            window.location.reload();
        });
    }());

    function showLoadIn(parent_id) {
        $('#' + parent_id + ' input, #' + parent_id + ' label').css('display', 'none');
        $('#' + parent_id + ' .loader_wrap').css('display', 'block');
    }

    function hideLoadIn(parent_id) {
        $('#' + parent_id + ' input, #' + parent_id + ' label').css('display', 'block');
        $('#' + parent_id + ' .loader_wrap').css('display', 'none');
    }

    function setUpButtons() {
        // Reset
        $like_btn.removeClass('inactive');
        $dislike_btn.removeClass('inactive');

        //Check local storage and then add the inactive class
        var like = localStorage.getItem("AS_"+TOKEN+"_"+current_slide+"_like");
        var dislike = localStorage.getItem("AS_"+TOKEN+"_"+current_slide+"_dislike");

        if (like) {
            $like_btn.addClass('inactive');
        }

        if (dislike) {
            $dislike_btn.addClass('inactive');
        }

        //$like_btn.addClass('inactive');
    }

    function handleVote() {


        socket.emit(this.id,  {
            slide_no: current_slide,
            token: TOKEN,
        });

        // Apply session storage to disable the button
        localStorage.setItem("AS_"+TOKEN+"_"+current_slide+"_"+this.id, true);

        var $bt = (this.id === "like") ? $like_btn : $dislike_btn;
        $bt.addClass('inactive');
    }

    function disconnect() {
        if (TOKEN) {
            socket.emit('user_disconnect', TOKEN);
            //socket.disconnect();
        }
    }

    function updateSlide(src) {

        slide.src = src;
        setUpButtons();
    }

    $token_modal.modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    });

    $token_form.parsley().on('form:submit', function (e) {

        var token = e.fields[0].value;

        if (TOKEN === token) {
            console.log("Same token");
            $token_modal.modal('hide');
            return false;
        }

        showLoadIn('token_form');

        console.log("Submit token", token);

        disconnect();
        TOKEN = token;
        socket.emit('user_connect', TOKEN);

        hideLoadIn('token_form');
        $vote_wrap.css('display', 'block');

        return false;
    });

    $question_modal.modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

    $question_modal.on('show.bs.modal', function (e) {
        question_text.value = "";
    });

    $question_form.parsley().on('form:submit', function (e) {

        var question = {
            token: TOKEN,
            sender_name: e.fields[0].value,
            question: e.fields[1].value
        };

        console.log("Submit question", question);

        socket.emit('question', question);

        $question_modal.modal('hide');

        return false;
    });

    $fullscreen_btn.click(toggleFullScreen);

    $cancel_btn.click(function () {
        $question_modal.modal('hide');
    });

    $like_btn.click(handleVote);

    $dislike_btn.click(handleVote);

    $question_btn.click(function () {

        if (TOKEN) {
            $question_modal.modal('show');
        }
    });

    window.addEventListener('unload', disconnect, false);

})(jQuery);