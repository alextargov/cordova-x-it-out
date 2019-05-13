/* eslint-disable */
var processJSON = function (categories) {
    for (var i = 0; i < categories.length; i += 1) {
        var cat = categories[i];
        var catLength = cat.tasks.length;
        var getLastCategory = $('.category').last()[0];
        var anchor = document.createElement('a');
        var icon = document.createElement('i');
        var badge = document.createElement('span');
        var addon = document.createElement('span');
        var catName = document.createElement('span');
        var div = document.createElement('div');

        var nextId = +getLastCategory.id + 1;

        database.addCategory(nextId);

        $.each(cat.tasks, function (index, value) {
            database.addTask(nextId, value);
        });

        div.className = 'category input-group';
        addon.className = 'input-group-addon input-group-addon-custom';
        icon.className += 'fa fa-plus icon-plus';
        anchor.className += 'cat list-group-item';
        badge.className += ' badge';
        catName.className = 'catName';
        anchor.setAttribute('href', '#');
        anchor.setAttribute('data-toggle', 'popover');

        div.id = +getLastCategory.id + 1;
        badge.id = 'badge_' + (+getLastCategory.id + 1)

        if (cat.categoryName.length > 18) {
            substr = cat.categoryName.substr(0, 18);
            substr += '...';
            catName.innerHTML = substr;
        } else {
            catName.innerHTML = cat.categoryName;
        }

        div.appendChild(addon);
        addon.appendChild(icon);

        div.appendChild(anchor);
        anchor.appendChild(catName);
        anchor.appendChild(badge);

        badge.innerHTML = catLength;
        getLastCategory.after(div);
    }
};