/* eslint-disable */
/*
    Using jQuery click method to show datepicker, take value from picked cell
    and store it into variable(selectedDate).
*/
(function () {
    let selectedDate;
    $(document).on('click', '#showRightPicker', function (el) {

        /*  Dynamically created div showing popover */
        let placement = 'left';
        if (window.innerWidth <= 767) {
            placement = 'bottom';
        }
        $(this).popover({
            trigger: 'manual',
            placement: placement,
            html: true,
            content: `<!-- think it's xss vaulnerable -->
                <div class="calendar-right-side form-group">
                    <div class='input-group'>
                        <input id='rightPicker' type='text' class='form-control'>
                        <span class="input-group-addon">
                            <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
                `,
        });

        /*  Showing element by clicking */

        $(this).popover('toggle');

        // invoke datepicker
        $('#rightPicker').datepicker({
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        });

        /*  Set interval, take datepicker's value and hiding datepicker */
        const self = this;
        const interval = setInterval(function () {
            const date = $('#rightPicker').val();
            if (date) {
                selectedDate = $('#rightPicker').val();
                database.findTaskByDate(selectedDate, (result) => {
                    clearInterval(interval);
                    $(self).popover('hide');
                    visualize.customTasks(result);
                    $(self).popover('destroy');
                });
            }
        }, 2000);

        $(document).mouseup(function (e) {
            const containerRightSide = $('.popover.left');
            const containerBottomSide = $('.popover.bottom');
            const calendarRightSide = $('.ui-datepicker');
            const right = $('#showRightPicker')
            if (!containerRightSide.is(e.target) && containerRightSide.has(e.target).length === 0 &&
                !calendarRightSide.is(e.target) && calendarRightSide.has(e.target).length === 0 &&
                !containerBottomSide.is(e.target) && containerBottomSide.has(e.target).length === 0 &&
                !right.is(e.target) && right.has(e.target).length === 0) {

                $(self).popover('destroy');
            }
        });
    });

    /*
        Show information from both modal forms and hide each one after next or prev buttons
        are executed.
    */

    $(document).on('click', '#modalDescription', function () {
        $('#modalDescriptionBlock').modal('show');
    });

    $("div[id^='descriptionForm']").each(function () {
        var currentModal = $(this);

        // click next
        currentModal.find('.btn-next').click(function () {
            currentModal.modal('hide');
            currentModal.closest("div[id^='descriptionForm']").nextAll("div[id^='descriptionForm']").first().modal('show')
        });

        // click prev
        currentModal.find('.btn-prev').click(function () {
            currentModal.modal('hide');
            currentModal.closest("div[id^='descriptionForm']").prevAll("div[id^='descriptionForm']").first().modal('show');
        });
    });

    // controlling navbar dropdowns
    $('.drop-date a').on("click", function (e) {
        $('.drop-alpha ul').hide();
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $('.drop-alpha a').on("click", function (e) {
        $('.drop-date ul').hide();
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $('.sub-option a').on('click', function () {
        $('#parent-dropdown').toggle();
        $('.drop-alpha ul').hide();
        $('.drop-date ul').hide();
        $('#parent-toggle').removeClass('opened');
    });

    $(document).on('click', '#parent-toggle', function () {
        $('#parent-dropdown').toggle();
    });

    $(document).mouseup(function (e) {
        const container1 = $('.drop-alpha a');
        const container2 = $('.drop-date a');
        if (!container1.is(e.target) && container1.has(e.target).length === 0 &&
            !container2.is(e.target) && container2.has(e.target).length === 0) {
            $('.drop-alpha ul').hide();
            $('.drop-date ul').hide();
        }
    });
    $(document).mouseup(function (e) {
        const container = $('#parent-dropdown');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });
})();