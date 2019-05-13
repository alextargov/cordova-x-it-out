/* eslint-disable */
/**
 * @description Global function for the points.
 * @returns {function} calculatePoints
 */
const pointsLogic = (function () {

    /**
     * @description Get completed and incompleted tasks and calculate their sum based on their priorities.
     * @returns {Object} doneSum, incompletedSum
     */
    const calculatePoints = (fn) => {
        database.getDone((done) => {
            database.getIncompleted((incompleted) => {
                let doneSum = 0;
                let incompletedSum = 0;
                const low = 2;
                const medium = 5;
                const high = 10;
                console.log('done', done);
                console.log('incompleted', incompleted);
                for (let i = 0; i < done.length; i += 1) {
                    const priority = done[i].priority;
                    if (priority === 'low') {
                        doneSum += low;
                    } else if (priority === 'medium') {
                        doneSum += medium;
                    } else if (priority === 'high') {
                        doneSum += high;
                    }
                }

                for (let i = 0; i < incompleted.length; i += 1) {
                    const priority = incompleted[i].priority;
                    if (priority === 'low') {
                        incompletedSum -= low;
                    } else if (priority === 'medium') {
                        incompletedSum -= medium;
                    } else if (priority === 'high') {
                        incompletedSum -= high;
                    }
                }

                fn({
                    doneSum,
                    incompletedSum
                })
            })
        });
        
    };

    const ONE_MINUTE = 60 * 1000;

    function showTime() {
        const calc = () => {
            visualize.updateBadges();

            calculatePoints((sums) => {
                const pointsResult = sums.doneSum + sums.incompletedSum;
                $('#calculated-points').text(pointsResult);
            });
        }

        database.checkDueTasks((dueTasks) => {
            if (dueTasks.length > 0) {
                for (let i = 0; i < dueTasks.length; i += 1) {
                    const id = dueTasks[i].id;
                    database.addtoIncompleted(id);
                    // update current element only if it is visualized
                    if ($('#del-' + id)[0]) {
                        $('#del-' + id)[0].style.display = 'block';
                        $('#done-' + id)[0].style.display = 'none';
                        $('#del-' + id).hover(function () {
                            $('#del-' + id)[0].style.color = '#F00';
                            $('#del-' + id)[0].style.backgroundColor = '#FFF'
                            $('#del-' + id)[0].style.cursor = 'default'
                        });
                    }
                }
            }

            calc();
        });
    }

    function repeatEvery(func, interval) {
        const now = new Date();
        const delay = interval - now % interval;

        function start() {
            func();
            repeatEvery(func, interval);
        }
        setTimeout(start, delay)
    }

    repeatEvery(showTime, ONE_MINUTE);

    document.addEventListener("resume", showTime, false);

    return {
        calculatePoints,
        showTime
    }
})();