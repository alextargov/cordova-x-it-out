/* eslint-disable */
// --- gets the info from the JSON file and appends it to the UI ---
(function() {
    visualize.allTasks();
    sharedState.categoryName = 'All tasks';

    // events for the delete and done buttons
    $('.main').on('click', '.done-icon, .delete-icon', function (doneElement) {
        const buttonId = $(this).attr('id');
        
        // checking for class name because we've attached the functionallity for two buttons
        if ($(this).hasClass('delete-icon')) {
            const taskId = buttonId.slice(4);
            database.addtoIncompleted(taskId);
        } else {
            const taskId = buttonId.slice(5);
            database.addToDone(taskId);
        }
    
        // remove element from the DOM cuz it is marked done/deleted
        $(this).parent().parent().parent().remove();
    
        visualize.updateBadges();
        
        pointsLogic.calculatePoints((calculation) => {
            const incompletedSum = calculation.incompletedSum;
            const doneSum = calculation.doneSum;
            const pointsResult = doneSum + incompletedSum;
            $('#calculated-points').text(pointsResult);
        });
        
    });
    
    // event for the show more button on the task visualization
    $('.main').on('click', '.show-more', function() {
        $(this).popover('toggle');
        const self = this;
        $(document).mouseup(function (e) {
            const container = $('.taskNameWrapper .popover');
            if (!container.is(e.target) && container.has(e.target).length === 0 &&
                !$(self).is(e.target) && $(self).has(e.target).length === 0) {
                $(self).popover('hide');
            }
        });
    })
    
})();
