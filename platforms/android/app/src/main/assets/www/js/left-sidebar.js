/* eslint-disable */
(function () {
    const setupCategories = () => {
        database.getAllCategories((categories) => {
            for (let i = 0; i < categories.length; i += 1) {
                const name = categories[i].name;
                const id = categories[i].id;
                const getLastCategory = $('.category').last()[0];

                const anchor = document.createElement('a');
                const icon = document.createElement('i');
                const badge = document.createElement('span');
                const addon = document.createElement('span');
                const catName = document.createElement('span');
                const div = document.createElement('div');

                div.className = 'category input-group';
                addon.className = 'input-group-addon input-group-addon-custom';
                icon.className += 'fa fa-plus icon-plus';
                anchor.className += 'cat list-group-item';
                badge.className += ' badge';
                catName.className = 'catName';
                anchor.setAttribute('href', '#');
                anchor.setAttribute('data-toggle', 'popover');

                div.id = id;
                badge.id = 'badge_' + (id);

                if (name.length > 18) {
                    substr = name.substr(0, 18);
                    substr += '...';
                    catName.innerHTML = substr;
                } else {
                    catName.innerHTML = name;
                }

                div.appendChild(addon);
                addon.appendChild(icon);

                div.appendChild(anchor);
                anchor.appendChild(catName);
                anchor.appendChild(badge);

                badge.innerHTML = 0;
                getLastCategory.after(div);
            }

            visualize.updateBadges();
        });
    };
    
    setupCategories();

    $('.search-div').hide();
    $('.search').on('click', function () {
        $('.search-input').val('');
        $('.username').toggle();
        $('.search-div').toggle();
        $('.search-input').focus();
    });

    $('.search-input').on('keyup', function () {
        const value = $(this).val().toLowerCase();

        database.findTask(value, (tasks) => {
            visualize.customTasks(tasks.tasks, false, false, tasks.name);
        })
    });

    // creating a task event. 
    // includes popover, timepicker, datepicker and the 'add task' event

    $('#category-list').on('click', '.input-group-addon-custom', function (el) {
        const parent = $(this).parent().get(0);
        const title = $('div#' + parent.id + ' span.catName')[0].innerHTML.trim();
        sharedState.catId = parent.id;

        // think it's xss vaulnerable
        const popoverContent = `
            <div class="form-group">
                <div class='input-group popover-task'>
                    <input id='input-task' type='text' class='form-control'>
                    <span class="input-group-addon popover-task-addon">
                        <i class="fa fa-th-list" aria-hidden="true"></i>
                    </span>
                </div>
                <div class='input-group date popover-task'>
                    <input type='text' class="form-control" id='datepicker' />
                    <span class="input-group-addon popover-task-addon">
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                    </span>
                </div>
                <div class='input-group date popover-task'>
                    <input type='text' class="form-control" id='timepicker' />
                    <span class="input-group-addon popover-task-addon">
                        <i class="fa fa-clock-o"></i>
                    </span>
                </div>
                <div class="input-group popover-task">
                    <select class="form-control select-priority" id="selectPriority">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <span class="input-group-addon popover-task-addon">
                        <i class="fa fa-sort" aria-hidden="true"></i>
                    </span>
                </div>                
                <br>
                <button class="btn btn-primary" id="add-task">Add task</button>
            </div>
        `;
        $(this).popover({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title,
            content: popoverContent,
        });

        $(this).popover('toggle');

        // --- settings for the time- and date-pickers ---
        const date = new Date();

        if (date.getMinutes() < 10) {
            minutes = '0' + date.getMinutes();
        } else {
            minutes = date.getMinutes();
        }
        if (date.getHours() < 10) {
            hours = '0' + date.getMinutes();
        } else {
            hours = date.getMinutes();
        }

        $('#timepicker').timepicker({
            'timeFormat': 'H:i',
            'step': 15,
        });

        $('#datepicker').datepicker({
            minDate: 0,
            maxDate: '+1M +10D',
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        });
        $('#datepicker').datepicker().datepicker('setDate', new Date());

        // --- adds a task in the information object ---
        const self = this;
        $('#add-task').on('click', function (el) {
            const id = sharedState.catId;
            const task = $('#input-task').val();
            const priority = $('#selectPriority').val();
            const time = $('#timepicker').val();
            const date = $('#datepicker').val();

            if (task && priority && time && date) {
                const taskInformation = {
                    'taskName': task,
                    'taskDueTime': time,
                    'taskDueDate': date,
                    'taskPriority': priority,
                    'taskId': database.guid()
                };

                database.addTask(id, taskInformation, () => {
                    visualize.updateBadges();

                    database.getCategoryById(id, (result) => {
                        sharedState.categoryName = result[0].name;
                        sharedState.categoryId = id;

                        visualize.tasksInCategory(id);
                    })
                });

                $(self).popover('hide');
                // collapse categories if in mobile view
                if (window.innerWidth < 768) {
                    $('#allCategories').collapse('toggle');
                }
            }
        });

        // --- hides the container if the user clicks outside it ---
        $(document).mouseup(function (e) {
            const container = $('.popover');
            const calendar = $('.ui-datepicker');
            const time = $('.ui-timepicker-wrapper');
            if (!container.is(e.target) && container.has(e.target).length === 0 &&
                !calendar.is(e.target) && calendar.has(e.target).length === 0 &&
                !time.is(e.target) && time.has(e.target).length === 0) {
                $(self).popover('hide');
            }
        });
    });

    $('#category-list').on('click', '.all-tasks', function (el) {
        sharedState.categoryElement = el;
        sharedState.categoryName = el.currentTarget.children[0].innerHTML
        sharedState.isAll = true;
        visualize.allTasks();
        if (window.innerWidth < 768) {
            $('#allCategories').collapse('toggle');
        }
    });

    $('#category-list').on('click', '.cat', function (el) {
        const catId = $(this).parent().get(0).id;
        sharedState.categoryName = el.currentTarget.children[0].innerHTML
        sharedState.categoryId = catId;
        sharedState.categoryElement = el;
        sharedState.isAll = false;
        visualize.tasksInCategory(catId);
        if (window.innerWidth < 768) {
            $('#allCategories').collapse('toggle');
        }
    });

    $('#category-list').on('click', '.done-tasks', function (el) {
        sharedState.categoryName = el.currentTarget.children[0].innerHTML;
        sharedState.categoryId = 'done';

        visualize.allDoneTasks();
        if (window.innerWidth < 768) {
            $('#allCategories').collapse('toggle');
        }
    });

    $('#category-list').on('click', '.incompleted-tasks', function (el) {
        sharedState.categoryName = el.currentTarget.children[0].innerHTML;
        sharedState.categoryId = 'fail';

        visualize.allIncompledTasks();
        if (window.innerWidth < 768) {
            $('#allCategories').collapse('toggle');
        }
    });



    // --- adds a category in the UI and in the information object ---
    $('.add-category').click(function () {
        const value = $('.category-input').val();
        if (value) {
            const getLastCategory = $('.category').last()[0];
            const nextId = database.guid();

            const anchor = document.createElement('a');
            const icon = document.createElement('i');
            const badge = document.createElement('span');
            const addon = document.createElement('span');
            const catName = document.createElement('span');
            const div = document.createElement('div');

            div.className = 'category input-group';
            addon.className = 'input-group-addon input-group-addon-custom';
            icon.className += 'fa fa-plus icon-plus';
            anchor.className += 'cat list-group-item';
            badge.className += ' badge';
            catName.className = 'catName';
            anchor.setAttribute('href', '#');
            anchor.setAttribute('data-toggle', 'popover');

            div.id = nextId;
            badge.id = 'badge_' + (nextId);

            if (value.length > 18) {
                substr = value.substr(0, 18);
                substr += '...';
                catName.innerHTML = substr;
            } else {
                catName.innerHTML = value;
            }

            div.appendChild(addon);
            addon.appendChild(icon);

            div.appendChild(anchor);
            anchor.appendChild(catName);
            anchor.appendChild(badge);

            badge.innerHTML = 0;
            getLastCategory.after(div);

            database.addCategory(nextId, value);
            $('.category-input').val('');
        }
    });
})();