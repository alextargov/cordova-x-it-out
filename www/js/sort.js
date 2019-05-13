/* eslint-disable */

/**
 * @desc By clicking $('.sort-alphabeth-all') execute sorting in increasing or decreasing order. 
 * By so class 'ascending' in sort button is changed with 'descending'.
 */

(function () {
    $('.sort-alphabeth-all').on('click', function () {
        const leftSortButton = $('#allCategories .sort-alphabeth-all');
        const rightSortButton = $('#parent-dropdown .sort-alphabeth-all');
        if (leftSortButton.hasClass('ascending') && rightSortButton.hasClass('ascending')) {
            database.getSortedAlphabetically(false, (result) => {
                leftSortButton.addClass('ascending');
                leftSortButton.removeClass('descending');
                rightSortButton.addClass('ascending');
                rightSortButton.removeClass('descending');

                visualize.customTasks(result);
            });

        } else {
            database.getSortedAlphabetically(true, (result) => {
                rightSortButton.removeClass('ascending');
                rightSortButton.addClass('descending');
                leftSortButton.removeClass('ascending');
                leftSortButton.addClass('descending');

                visualize.customTasks(result);
            });
        }
    });

    $('#sort-alphabeth-in-cat').on('click', function () {
        const catId = sharedState.categoryId;

        if (!catId) {
            visualize.noTasks();
            return;
        }

        if ($(this).hasClass('ascending')) {
            if (catId === 'done') {
                database.getSortedAlphabeticallyDone(false, (result) => {
                    visualize.customTasks(result, true, false);
                });
            } else if (catId === 'fail') {
                database.getSortedAlphabeticallyFailed(false, (result) => {
                    visualize.customTasks(result, false, true);
                });
            } else {
                database.getSortedAlphabeticallyInCategory(catId, false, (result) => {
                    visualize.customTasks(result, false, false);
                });
            }

            $(this).removeClass('ascending');
            $(this).addClass('descending');
        } else {
            if (catId === 'done') {
                database.getSortedAlphabeticallyDone(true, (result) => {
                    visualize.customTasks(result, true, false);
                });
            } else if (catId === 'fail') {
                database.getSortedAlphabeticallyFailed(true, (result) => {
                    visualize.customTasks(result, false, true);
                });
            } else {
                database.getSortedAlphabeticallyInCategory(catId, true, (result) => {
                    visualize.customTasks(result, false, false);
                });
            }

            $(this).removeClass('descending');
            $(this).addClass('ascending');
        }
    });

    /*
        Sorting by dateTime and visualize
    */

    $('#sort-due-date').on('click', function () {
        if ($(this).hasClass('ascending')) {
            database.getSortedByDateAndTime(false, null, (result) => {
                visualize.customTasks(result);
            });

            $(this).removeClass('ascending');
            $(this).addClass('descending');
        } else {
            database.getSortedByDateAndTime(true, null, (result) => {
                visualize.customTasks(result);
            });

            $(this).removeClass('descending');
            $(this).addClass('ascending');
        }
        
    });

    $('#sort-due-date-in-cat').on('click', function () {
        const catId = sharedState.categoryId;

        if (!catId) {
            visualize.noTasks();
            return;
        }
        console.log('cadId', catId);
        if ($(this).hasClass('ascending')) {
            if (catId === 'done') {
                database.getSortedDoneByDateAndTime(false, (result) => {
                    visualize.customTasks(result, true, false);
                });
            } else if (catId === 'fail') {
                database.getSortedFailedByDateAndTime(false, (result) => {
                    visualize.customTasks(result, false, true);
                });
            } else {
                database.getSortedByDateAndTime(false, catId, (result) => {
                    visualize.customTasks(result, false, false);
                });
            }

            $(this).removeClass('ascending');
            $(this).addClass('descending');
        } else {
            console.log('desc');
            if (catId === 'done') {
                database.getSortedDoneByDateAndTime(true, (result) => {
                    visualize.customTasks(result, true, false);
                });
            } else if (catId === 'fail') {
                database.getSortedFailedByDateAndTime(true, (result) => {
                    visualize.customTasks(result, false, true);
                });
            } else {
                database.getSortedByDateAndTime(true, catId, (result) => {
                    visualize.customTasks(result, false, false);
                });
            }

            $(this).removeClass('descending');
            $(this).addClass('ascending');
        }
    });
})();