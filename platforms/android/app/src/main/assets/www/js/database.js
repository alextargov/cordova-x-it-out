/* eslint-disable */
var sharedState = {};

const database = (function () {
    // is zero because it will be increased after the ajax populates the database with json tasks.

    const guid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    const initialCreation = (db) => {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIES (id unique NOT NULL, name, primary key(id))', [], null, (a, b) => { console.log(b) });
            tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (id unique NOT NULL, name, dueTime, dueDate, priority, categoryId, status, primary key(id))', [], null, (a, b) => { console.log(b) });
        });
    };

    const dbConnect = (name, version, displayName, estimatedSize) => {
        return window.openDatabase(name, version, displayName, estimatedSize);
    };

    const db = dbConnect('xitout', '1.0', 'x-it-out', 10 * 1024 * 1024);
    initialCreation(db);
 
    function addCategory(id, name) {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO CATEGORIES (id, name) VALUES (?, ?)', [id, name], null, (a,b) => {console.log(b)}) ;
        });
    }

    function getAllCategories(fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM CATEGORIES', [], function (tx, results) {
                fn(results.rows);
            }, (a, b) => {console.log('error', e)}); 
        });
    }

    function addTask(catId, task, fn) {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO TASKS (id, name, dueTime, dueDate, priority, categoryId, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [task.taskId, task.taskName, task.taskDueTime, task.taskDueDate, task.taskPriority, catId, 'none'],
                (e, result) => {
                    fn();
                },
                (a,b) => {console.log(b)}
            );
        });

        // _categories[catId].push(task);
    }

    function getAllTasksInCategory(id, fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM TASKS WHERE categoryId=? and status="none"', [id], function (tx, results) {
                fn(results.rows);
            }, (a, b) => {console.log('error', b)}); 
        });
    }

    /**
     * @description Get all tasks and returns them
     * @returns {Object[]}
     */
    function getAllTasks(fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Tasks where status="none"', [], function (tx, results) {
                fn(results.rows)
            }, (a, b) => {console.log('error', b)}); 
        });
    }

    function getCategoryById(id, fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM CATEGORIES where id=?', [id], function (tx, results) {
                fn(results.rows)
            }, (a, b) => {console.log('error', b)}); 
        });
    }

    /**
     * @description Adds a task to the incompleted array.
     * @description  If an id is provided, the task is deleted and pushed to the array
     * @description If a task is provided, it is pushed to the array and deleted.
     * @description All active tasks' length is decremented. All incopmleted tasks' length is incremented
     * @param {number} id 
     * @returns {void}
     */
    function addtoIncompleted(id) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE TASKS SET status="fail" WHERE id=?', [id], function (tx, results) {
            }, (a, b) => {console.log('error', e)}); 
        });
    }
    /**
     * @description Deletes a task by given id and adds it to the done array. 
     * @description All active tasks' length is decremented. All done tasks' length is incremented
     * @param {number} id 
     * @returns {void}
     */
    function addToDone(id) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE TASKS SET status="done" WHERE id=?', [id], null, (a, b) => {console.log('error', e)}); 
        });
    }

    /*
        Used by getSortedByDateAndTime() and getDone()
    */
    var _compareFuncByDateAndTimeAsc = function (a, b) {

        var aDate = a.dueDate.slice(0, 2);
        var aMonth = a.dueDate.slice(3, 5);
        var aYear = a.dueDate.slice(6);
        var aTime = a.dueTime;

        var bDate = b.dueDate.slice(0, 2);
        var bMonth = b.dueDate.slice(3, 5);
        var bYear = b.dueDate.slice(6);
        var bTime = b.dueTime;

        if (aYear < bYear) {
            return -1;
        }
        if (aYear > bYear) {
            return 1;
        }
        if (aYear === bYear) {
            if (aMonth < bMonth) {
                return -1;
            }
            if (aMonth > bMonth) {
                return 1;
            }
            if (aMonth === bMonth) {
                if (aDate < bDate) {
                    return -1;
                }
                if (aDate > bDate) {
                    return 1;
                }
                if (aDate === bDate) {

                    if (aTime < bTime) {
                        return -1;
                    }
                    if (aTime > bTime) {
                        return 1;
                    }
                    return 0;
                }
                return 0;
            }
            return 0;
        }
    }

    var _compareFuncByDateAndTimeDesc = function (b, a) {

        var aDate = a.dueDate.slice(0, 2);
        var aMonth = a.dueDate.slice(3, 5);
        var aYear = a.dueDate.slice(6);
        var aTime = a.dueTime;

        var bDate = b.dueDate.slice(0, 2);
        var bMonth = b.dueDate.slice(3, 5);
        var bYear = b.dueDate.slice(6);
        var bTime = b.dueTime;

        if (aYear < bYear) {
            return -1;
        }
        if (aYear > bYear) {
            return 1;
        }
        if (aYear === bYear) {
            if (aMonth < bMonth) {
                return -1;
            }
            if (aMonth > bMonth) {
                return 1;
            }
            if (aMonth === bMonth) {
                if (aDate < bDate) {
                    return -1;
                }
                if (aDate > bDate) {
                    return 1;
                }
                if (aDate === bDate) {

                    if (aTime < bTime) {
                        return -1;
                    }
                    if (aTime > bTime) {
                        return 1;
                    }
                    return 0;
                }
                return 0;
            }
            return 0;
        }
    }


    function getDone(fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Tasks where status="done"', [], function (tx, results) {
                let res = [];

                for (let i = 0; i < results.rows.length; i += 1) {
                    res.push(results.rows[i]);
                }

                fn(res.sort(_compareFuncByDateAndTimeAsc))
            }, (a, b) => {console.log('error', e)}); 
        });
    }

    function getIncompleted(fn) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Tasks where status="fail"', [], function (tx, results) {
                let res = [];

                for (let i = 0; i < results.rows.length; i += 1) {
                    res.push(results.rows[i]);
                }

                fn(res.sort(_compareFuncByDateAndTimeAsc))
            }, (a, b) => {console.log('error', b)}); 
        });
    }

    /**
     * @description Finds a task by given name and returns and array of tasks and the given name
     * @param {string} name 
     * @returns {Object}
     */
    const findTask = (name, fn) => {
        getAllTasks((tasks) => {
            const res = [];

            for (let i = 0; i < tasks.length; i += 1) {
                const task = tasks[i].name.toLowerCase();
                if (task.includes(name.toLowerCase())) {
                    res.push(tasks[i]);
                }
            }

            fn({
                tasks: res,
                name
            });
        });
    }
    /**
     * @description Sorts all tasks alphabetically and returns an array of objects
     * @param {boolean} isAscending 
     * @returns {Object[]}
     */
    const getSortedAlphabetically = function (isAscending, fn) {
        var compareIncr = function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            getAllTasks((tasks) => {
                const res = [];
                for (let i = 0; i < tasks.length; i += 1) {
                    res.push(tasks[i]);
                }

                fn(res.sort(compareIncr));
            })
        } else {
            getAllTasks((tasks) => {
                const res = [];
                for (let i = 0; i < tasks.length; i += 1) {
                    res.push(tasks[i]);
                }

                fn(res.sort(compareDecr));
            })
        }
    };
    /**
     * @description Sorts taks in a category alphabetically and returns an array of objects
     * @param {number} id
     * @param {boolean} isAscending 
     * @returns {Object[]}
     */
    const getSortedAlphabeticallyInCategory = function (id, isAscending, fn) {
        var compareIncr = function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            getAllTasksInCategory(id, (result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareIncr))
            });
        } else {
            getAllTasksInCategory(id, (result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareDecr))
            });
        }
    }

    const getSortedAlphabeticallyDone = function (isAscending, fn) {
        var compareIncr = function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            getDone((result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareIncr))
            });
        } else {
            getDone((result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareDecr))
            });
        }
    }

    const getSortedAlphabeticallyFailed = function (isAscending, fn) {
        var compareIncr = function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            getIncompleted((result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareIncr))
            });
        } else {
            getIncompleted((result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                fn(res.sort(compareDecr))
            });
        }
    }
    /**
     * @description Sorts tasks in a category both by date and time and return an array of objects
     * @param {number} catId 
     * @returns {Object[]}
     */
    const getSortedByDateAndTime = function (isAscending, catId, fn) {
        if (catId) {
            getAllTasksInCategory(catId, (result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }
                isAscending ?
                    fn(res.sort(_compareFuncByDateAndTimeAsc)) :
                    fn(res.sort(_compareFuncByDateAndTimeDesc));

            });
        } else {
            getAllTasks((result) => {
                const res = [];
                for (let i = 0; i < result.length; i += 1) {
                    res.push(result[i]);
                }

                isAscending ?
                    fn(res.sort(_compareFuncByDateAndTimeAsc)) :
                    fn(res.sort(_compareFuncByDateAndTimeDesc));
            });
        }
    }

    const getSortedDoneByDateAndTime = function (isAscending, fn) {
        getDone((result) => {
            const res = [];
            for (let i = 0; i < result.length; i += 1) {
                res.push(result[i]);
            }

            isAscending ?
                fn(res.sort(_compareFuncByDateAndTimeAsc)) :
                fn(res.sort(_compareFuncByDateAndTimeDesc));
        });
    }

    const getSortedFailedByDateAndTime = function (isAscending, fn) {
        getIncompleted((result) => {
            const res = [];
            for (let i = 0; i < result.length; i += 1) {
                res.push(result[i]);
            }

            isAscending ?
                fn(res.sort(_compareFuncByDateAndTimeAsc)) :
                fn(res.sort(_compareFuncByDateAndTimeDesc));
        });
    }

    /**
     * @description Searches tasks by given date and returns an array of objects
     * @param {string} date 
     * @returns {Object[]}
     */
    const findTaskByDate = function (date, fn) {
        var tasks = [];
        getAllTasks((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].dueDate == date) {
                    tasks.push(result[i]);
                }
            }

            fn(tasks);
        });
    }
    /**
     * @description Gets current date and time, compares all tasks with the current date. If a task is due, it is pushed to an array of objects.
     * @returns {Object[]}
     */
    const checkDueTasks = function (fn) {
        getAllTasks((allTasks) => {
            var date = new Date();
            var day = date.getDate().toString();
            var month = (date.getMonth() + 1).toString();
            var year = date.getFullYear().toString();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            var tasks = [];
            if (day.length === 1) {
                day = '0' + day;
            }
            if (month.length === 1) {
                month = '0' + month;
            }
            if (hours.length === 1) {
                hours = '0' + hours;
            }
            if (minutes.length === 1) {
                minutes = '0' + minutes;
            }
    
            var currentDate = day + '/' + month + '/' + year;
            var currentTime = hours + ':' + minutes;

            for (let i = 0; i < allTasks.length; i += 1) {
                var taskDay = allTasks[i].dueDate.slice(0, 2);
                var taskMonth = allTasks[i].dueDate.slice(3, 5);
                var taskYear = allTasks[i].dueDate.slice(6);
                var taskHours = allTasks[i].dueTime.slice(0, 2);
                var taskMinutes = allTasks[i].dueTime.slice(3);
    
                if (taskYear < year) {
                    tasks.push(allTasks[i]);
                } else if (taskYear === year) {
                    if (taskMonth < month) {
                        tasks.push(allTasks[i]);
                    } else if (taskMonth === month) {
                        if (taskDay < day) {
                            tasks.push(allTasks[i]);
                        } else if (taskDay === day) {
                            if (taskHours < hours) {
                                tasks.push(allTasks[i]);
                            } else if (taskHours === hours) {
                                if (taskMinutes <= minutes) {
                                    tasks.push(allTasks[i]);
                                }
                            }
                        }
                    }
                }
            }

            fn(tasks);
        });
    }

    return {
        addCategory,
        addTask,
        addToDone,
        addtoIncompleted,
        getDone,
        getIncompleted,
        findTaskByDate,
        findTask,
        getAllTasks,
        getAllCategories,
        getAllTasksInCategory,
        getSortedAlphabetically,
        getSortedByDateAndTime,
        getSortedAlphabeticallyInCategory,
        checkDueTasks,
        db,
        guid,
        getCategoryById,
        getSortedAlphabeticallyFailed,
        getSortedAlphabeticallyDone,
        getSortedDoneByDateAndTime,
        getSortedFailedByDateAndTime
    }
})();