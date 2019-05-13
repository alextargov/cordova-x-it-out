/* eslint-disable */

var visualize = (function () {
    function _visualizeLogic(tasks, isDoneCategory, isIncompleted, inputSearch) {

        var categoryNameWrapper = document.createElement('div');
        var categoryName = document.createElement('span');
        categoryName.className = 'label label-primary';
        categoryNameWrapper.className = 'category-heading col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
        categoryName.innerHTML = sharedState.categoryName;
        categoryNameWrapper.appendChild(categoryName);
        document.getElementsByClassName('main')[0].appendChild(categoryNameWrapper);

        for (var i = 0; i < tasks.length; i += 1) {
            var divCol = document.createElement('div');
            var thumbnail = document.createElement('div');
            var caption = document.createElement('div');
            var footer = document.createElement('div');
            var htmlTaskNameWrapper = document.createElement('div');
            var htmlTaskName = document.createElement('h5');
            var htmlTaskDueDate = document.createElement('h5');
            var htmlTtaskDueTime = document.createElement('h5');
            var htmlTaskPriority = document.createElement('h5');
            var button = document.createElement('button');
            var deleteIcon = document.createElement('i');
            var icon = document.createElement('i');
            var doneIcon = document.createElement('i');
            var horizonalLine1 = document.createElement('hr');
            var horizonalLine2 = document.createElement('hr');
            var horizonalLine3 = document.createElement('hr');

            button.className = 'btn btn-primary show-more';
            thumbnail.className = 'thumbnail';
            caption.className = 'caption';
            divCol.className = 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 task';
            htmlTaskPriority.className = 'task-priority';
            htmlTaskNameWrapper.className = 'taskNameWrapper';
            htmlTaskName.className = 'taskName';
            icon.className = 'fa fa-minus-square';
            doneIcon.className = 'fa fa-check-square done-icon';
            deleteIcon.className = 'fa fa-times delete-icon';
            deleteIcon.id = 'del-' + tasks[i].id;
            doneIcon.id = 'done-' + tasks[i].id;

            var taskname = tasks[i].name;
            var fullTaskname = tasks[i].name;
            var taskduedate = tasks[i].dueDate;
            var taskduetime = tasks[i].dueTime;
            var taskpriority = tasks[i].priority;

            var substr;
            if (window.innerWidth >= 1200) {
                if (taskname.length > 25) {
                    substr = taskname.substr(0, 25);
                    substr += '...';
                    taskname = substr;
                    button.innerHTML = 'More';
                    htmlTaskNameWrapper.appendChild(button);
                }
            } else if (window.innerWidth >= 992 && window.innerWidth < 1200) {
                if (taskname.length > 18) {
                    substr = taskname.substr(0, 18);
                    substr += '...';
                    taskname = substr;
                    button.innerHTML = 'More';
                    htmlTaskNameWrapper.appendChild(button);
                }
            } else if (window.innerWidth < 992) {
                if (taskname.length > 20) {
                    substr = taskname.substr(0, 20);
                    substr += '...';
                    taskname = substr;
                    button.innerHTML = 'More';
                    htmlTaskNameWrapper.appendChild(button);
                }
            } 

            $(button).popover({
                trigger: 'manual',
                placement: 'bottom',
                html: true,
                content: `<p style='padding: 0px; word-wrap: break-word'>${fullTaskname}</p>`,
            });

            if (inputSearch) {
                var spanBold = document.createElement('span');
                spanBold.style.fontWeight = 'bold';
                spanBold.style.color = '#337ab7';
                var startHTML = document.createElement('span');
                var endHTML = document.createElement('span');
                var tempName = taskname.toLowerCase();
                inputSearch = inputSearch.toLowerCase();
                var startIndex = tempName.indexOf(inputSearch);
                if (startIndex !== -1) {
                    if (startIndex !== 0) {
                        var start = taskname.substr(0, startIndex);
                    } else {
                        var start = '';
                    }

                    var end = taskname.substr(startIndex + inputSearch.length, taskname.length);
                    startHTML.innerHTML = start;
                    spanBold.innerHTML = taskname.substr(startIndex, inputSearch.length);
                    endHTML.innerHTML = end;
                    htmlTaskName.appendChild(startHTML);
                    htmlTaskName.appendChild(spanBold);
                    htmlTaskName.appendChild(endHTML);
                    htmlTaskNameWrapper.appendChild(htmlTaskName)
                } else {
                    htmlTaskName.innerHTML = taskname;
                    htmlTaskNameWrapper.appendChild(htmlTaskName);
                }

            } else {
                htmlTaskName.innerHTML = taskname;
                htmlTaskNameWrapper.appendChild(htmlTaskName);
            }

            htmlTaskDueDate.innerHTML = taskduedate;
            htmlTtaskDueTime.innerHTML = taskduetime;
            htmlTaskPriority.innerHTML = taskpriority;

            if (taskpriority === 'high') {
                icon.style.color = '#F00';
            } else if (taskpriority === 'medium') {
                icon.style.color = '#FF8000';
            } else {
                icon.style.color = '#0eb511';
            }

            if (isDoneCategory && !isIncompleted) {
                deleteIcon.style.display = 'block';
                deleteIcon.style.color = '#0eb511';
                deleteIcon.className = 'fa fa-check-square delete-icon-completed';
                deleteIcon.style.cursor = 'initial';
                caption.appendChild(deleteIcon);
            }

            console.log(isIncompleted, isDoneCategory);

            if (isIncompleted && !isDoneCategory) {
                deleteIcon.style.display = 'block';
                deleteIcon.className = 'fa fa-times delete-icon-incompleted';
                doneIcon.style.display = 'none';
                deleteIcon.style.color = '#F00';
                deleteIcon.style.cursor = 'initial';
                $(thumbnail).hover(function () {
                    deleteIcon.style.color = '#F00';
                });
                caption.appendChild(deleteIcon);
            }

            if (!isDoneCategory) {
                caption.appendChild(deleteIcon);
                caption.appendChild(doneIcon);
                console.log('here');
            }

            footer.appendChild(icon);
            footer.appendChild(htmlTaskPriority);

            document.getElementsByClassName('main')[0].appendChild(divCol);
            divCol.appendChild(thumbnail);
            thumbnail.appendChild(caption);
            caption.appendChild(htmlTaskNameWrapper);
            caption.appendChild(horizonalLine1);
            caption.appendChild(htmlTaskDueDate);
            caption.appendChild(horizonalLine2);
            caption.appendChild(htmlTtaskDueTime);
            caption.appendChild(horizonalLine3);
            caption.appendChild(footer);

        }
    }

    /**
     * @description Clears the main block out, gets all tasks and visualize them
     * @description Visualization parameters: tasks, is not in 'Done' category, is not in 'Incompleted' category, no input search string provided
     */
    function allTasks() {
        document.getElementsByClassName('main')[0].innerHTML = '';
        database.getAllTasks((tasks) => {
            if (tasks.length > 0) {
                _visualizeLogic(tasks, false, false, false);
            } else {
                document.getElementsByClassName('main')[0].innerHTML = 'No tasks found.';
            }
        });
    }

    /**
     * @description Clears the main block out, gets all tasks in a category and visualize them
     * @description Visualization parameters: tasks, is not in 'Done' category, is not in 'Incompleted' category, no input search string provided
     * @param {number} id
     * @returns {Object[]}
     */
    function tasksInCategory(id) {
        document.getElementsByClassName('main')[0].innerHTML = '';
        database.getAllTasksInCategory(id, (tasks) => {
            if (tasks.length > 0) {
                _visualizeLogic(tasks, false, false, false);
            } else {
                document.getElementsByClassName('main')[0].innerHTML = 'No tasks found.';
            }
        });
    }

    /**
     * @description Clears the main block out, gets all tasks in 'Done' category and visualize them
     * @description Visualization parameters: tasks, is in 'Done' category, is not in 'Incompleted' category, no input search string provided
     */
    function allDoneTasks() {
        document.getElementsByClassName('main')[0].innerHTML = '';
        database.getDone((tasks) => {
            if (tasks.length > 0) {
                _visualizeLogic(tasks, true, false, false);
            } else {
                document.getElementsByClassName('main')[0].innerHTML = 'No tasks found.';
            }
        });
    }

    /**
     * @description Clears the main block out, gets all tasks in 'Incompleted' category and visualize them
     * @description Visualization parameters: tasks, is not in 'Done' category, is in 'Incompleted' category, no input search string provided
     */
    function allIncompledTasks() {
        document.getElementsByClassName('main')[0].innerHTML = '';
        database.getIncompleted((tasks) => {
            if (tasks.length > 0) {
                _visualizeLogic(tasks, false, true, false);
            } else {
                document.getElementsByClassName('main')[0].innerHTML = 'No tasks found.';
            }
        });
    }

    function categoryLength(id, fn) {
        database.getAllTasksInCategory(id, (tasks) => {
            fn(tasks.length)
        });
    }

    /**
     * @description Clears the main block out, gets all tasks in 'Done' category and visualize them
     * @description Visualization parameters: tasks, is not in 'Done' category, is not in 'Incompleted' category, input search string provided
     * @param {Object[]} tasks
     * @param {string} inputSearch
     */
    function customTasks(tasks, isDoneCategory, isIncompletedCategory, inputSearch) {
        document.getElementsByClassName('main')[0].innerHTML = '';
        if (tasks.length > 0) {
            _visualizeLogic(tasks, isDoneCategory, isIncompletedCategory, inputSearch);
        } else {
            document.getElementsByClassName('main')[0].innerHTML = 'No tasks found.';
        }
    }

    function noTasks() {
        document.getElementsByClassName('main')[0].innerHTML = 'You have not selected a category yet.';
    }

    const updateBadges = () => {
        database.getAllTasks((tasks) => {
            $('#badge_0').html(tasks.length);
        });
    
        database.getAllCategories((categories) => {
            for (let i = 0; i < categories.length; i += 1) {
                database.getAllTasksInCategory(categories[i].id, (tasks) => {
                    $('#badge_' + categories[i].id).html(tasks.length);
                });
            }
        });
    
        database.getIncompleted((tasks) => {
            $('#badge_incompleted').html(tasks.length);
        })
    
        database.getDone((tasks) => {
            $('#badge_done').html(tasks.length);
        })
    };
    

    return {
        updateBadges,
        allTasks,
        tasksInCategory,
        categoryLength,
        customTasks,
        allDoneTasks,
        allIncompledTasks,
        noTasks
    }
})();