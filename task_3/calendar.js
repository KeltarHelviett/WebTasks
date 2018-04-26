
function Calendar(id) {
    this.carrier = document.getElementById(id);
    if (!this.carrier)
        throw HTMLUnknownElement;
    this.observingDate = new Date(Date.now());
    this.observingDate.setHours(0, 0, 0, 0);
    this.selectedDate = new Date(this.observingDate.getTime());
    this.coreYear = this.observingDate.getFullYear();
    this.GMT = this.observingDate.getTimezoneOffset();
    this.init();
}

Calendar.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
Calendar.mothShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                           'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
Calendar.shortWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

Calendar.createElement = function (elem = 'div', classList = [], innerText = '', onclick = undefined) {
    let e = document.createElement(elem);
    e.innerText = innerText;
    e.onclick = onclick;
    classList.forEach(function (item) {
        e.classList.add(item);
    })
    return e;
}

Calendar.isWeekendOrHoliday = function(date) {
    let weekday = date.getDay();
    if (weekday == 0 || weekday == 6)
        return true;
    return false;
}

Calendar.prototype.init = function() {
    let self = this;
    let year  = this.observingDate.getFullYear();
    let month = this.observingDate.getMonth();

    while (this.carrier.firstChild) { 
        this.carrier.removeChild(this.carrier.firstChild); // ?
    }

    this.calendar = Calendar.createElement('div', ['calendar']);
    let header = Calendar.createElement('div', ['calendar-header'])
    this.calendar.appendChild(header);

    [
        ['button', ['calendar-header-prev-month'], '<', (e) => { self.prevMonth(); self.render(); }],
        ['div', ['calendar-current-month'], '', (e) => { self.selectMonth(); }],
        ['div', ['calendar-current-year'], '', (e) => { self.selectYear(); }],
        ['button', ['calendar-header-next-month'], '>', (e) => { self.nextMonth(); self.render(); }],
    ].forEach(function (i) {
        header.appendChild(Calendar.createElement(i[0], i[1], i[2], i[3]));
    })
    
    this.monthSelector = Calendar.createElement('div', ['calendar-month-selector']);
    this.calendar.appendChild(this.monthSelector);
    let row = undefined;
    Calendar.mothShortNames.forEach(function (month, index) {
        if (!(index % 3)) {
            row = Calendar.createElement('div', ['calendar-month-selector-row']);
            self.monthSelector.appendChild(row);
        }
        classList = ['calendar-month-selector-month'];
        if (index == self.observingDate.getMonth())
            classList.push('calendar-month-selector-month-selected')
        row.appendChild(Calendar.createElement('div', classList, month, () => {
            self.observingDate.setMonth(index);
            self.render();
        }))
    });

    self.yearSelector = Calendar.createElement('div', ['calendar-year-selector']);
    [
        ['button', ['calendar-year-group-picker'], '<', () => { self.prevYearGroup(); }], 
        ['div', ['calendar-year-selector-rows'], undefined, undefined],
        ['button', ['calendar-year-group-picker'], '>', () => { self.nextYearGroup(); }]
    ].forEach(function (i) {
        self.yearSelector.appendChild(Calendar.createElement(i[0], i[1], i[2], i[3]));
    })

    self.calendar.appendChild(self.yearSelector);

    let weekdays = Calendar.createElement('div', ['calendar-weekdays']);

    Calendar.shortWeekdayNames.forEach(function(item, index){
        classList = ['calendar-weekday'];
        if (index == 0 || index == 6)
            classList.push('calendar-weekday-weekend');
        weekdays.appendChild(Calendar.createElement('div', classList, item));
    });
    
    this.calendar.appendChild(weekdays);
    this.calendar.appendChild(Calendar.createElement('div', ['calendar-rows']));

    this.carrier.appendChild(this.calendar);
    self.render();
}

Calendar.prototype.render = function() {
    let self = this;
    self.calendar.removeChild(self.calendar.lastChild);
    [{ name: 'month', getValue: () => Calendar.monthNames[this.observingDate.getMonth()] },
     { name: 'year', getValue: () => self.observingDate.getFullYear() }]
        .forEach(function (item) {
            let css = `calendar-${item.name}-selector-${item.name}`
            let e = self.calendar.getElementsByClassName(css + '-selected')[0];
            if (typeof e != 'undefined') e.classList.toggle(css + '-selected');
            self.calendar
                .getElementsByClassName(`calendar-current-${item.name}`)[0]
                .innerText = item.getValue();
        });
    self.calendar.
            getElementsByClassName('calendar-month-selector-month')
            [self.observingDate.getMonth()].
            classList.toggle('calendar-month-selector-month-selected');
    
    let years = self.yearSelector.getElementsByClassName('calendar-year-selector-year');
    for (let i = 0; i < years.length; i++) {
        if (parseInt(years[i].innerText) == self.observingDate.getFullYear()) {
            years[i].classList.toggle('calendar-year-selector-year-selected');
            break;
        }
    }

    let startDate = new Date(self.observingDate.getTime());
    startDate.setDate(1);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(self.observingDate.getFullYear(), self.observingDate.getMonth() + 1, 0);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    let calendarRows = Calendar.createElement('div', ['calendar-rows'])
    self.calendar.appendChild(calendarRows);
    
    let row = undefined;
    let selectedDateTime = self.selectedDate.getTime();
    let observingMonth = this.observingDate.getMonth();
    let monthState = 0;
    while (startDate <= endDate) {
        let startDateTime = startDate.getTime();
        let startDateMonth = startDate.getMonth();
        if (!startDate.getDay()) {
            row = Calendar.createElement('div', ['calendar-row']);
            calendarRows.appendChild(row);
        }
        let cell = Calendar.createElement('div', ['calendar-cell']);

        if (startDateTime == selectedDateTime)
            cell.classList.add('calendar-cell-selected');
        if (Calendar.isWeekendOrHoliday(startDate))
            cell.classList.add('calendar-cell-weekend-or-holiday');
        if (startDateMonth == observingMonth && (this.observingDate.getFullYear() == startDate.getFullYear()))
            monthState = 1;
        if (monthState == 1 && (startDateMonth > observingMonth || (this.observingDate.getFullYear() < startDate.getFullYear())))
            monthState = 2;
        if (!monthState)
            cell.classList.add('calendar-cell-prev-month');
        else if (monthState == 2)
            cell.classList.add('calendar-cell-next-month');

        cell.onclick = function () {            
            if (cell.classList.contains('calendar-cell-next-month'))
                self.nextMonth();
            else if (cell.classList.contains('calendar-cell-prev-month'))
                self.prevMonth();
            
            self.selectedDate = new Date(self.observingDate.getTime());
            self.selectedDate.setDate(parseInt(cell.innerText));
            self.render();
        }
        cell.innerText = startDate.getDate();
        row.appendChild(cell);
        startDate.setDate(startDate.getDate() + 1);
    }
}

Calendar.prototype.addMonth = function (term) {
    this.observingDate.setMonth(this.observingDate.getMonth() + term);
    this.calendar
        .getElementsByClassName('calendar-current-month')[0]
        .innerText = Calendar.monthNames[this.observingDate.getMonth()];
    this.calendar
        .getElementsByClassName('calendar-current-year')[0]
        .innerText = this.observingDate.getFullYear();
}

Calendar.prototype.nextMonth = function () {
    this.addMonth(1);
}

Calendar.prototype.prevMonth = function () {
    this.addMonth(-1);
}

Calendar.prototype.yearGroup = function (year) {
    let self = this;
    this.coreYear = year;
    let yearRows = this.yearSelector.firstChild.nextSibling; 
    while (yearRows.firstChild) {
        yearRows.removeChild(yearRows.firstChild);
    }

    let row = undefined;
    for (let i = year - 4; i <= year + 4; ++i) {
        if (!((i + 4 - year) % 3)) {
            row = document.createElement('div');
            row.classList.add('calendar-year-selector-row');
            yearRows.appendChild(row);
        }
        row.appendChild(Calendar.createElement('div', ['calendar-year-selector-year'],
            i, () => {
            self.observingDate.setFullYear(i);
            self.render();    
        }));
    }
    self.render();
}

Calendar.prototype.prevYearGroup = function () {
    this.yearGroup(this.coreYear - 9); 
}

Calendar.prototype.nextYearGroup = function () {
    this.yearGroup(this.coreYear + 9);
}

Calendar.prototype.selectYear = function () {
    this.yearGroup(this.observingDate.getFullYear());
    this.yearSelector.classList.toggle('calendar-year-selector-shown');
}

Calendar.prototype.selectMonth = function () {
    this.monthSelector.classList.toggle("calendar-month-selector-shown");
}