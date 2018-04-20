
function Calendar(id) {
    

    this.carrier = document.getElementById(id);
    this.observingDate = new Date(Date.now());
    this.observingDate.setHours(0, 0, 0, 0);
    this.selectedDate = new Date(this.observingDate.getTime());
    this.coreYear = this.observingDate.getFullYear();
    this.GMT = this.observingDate.getTimezoneOffset();
    if (!this.carrier)
        throw HTMLUnknownElement;
 
    this.init();

}

Calendar.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
Calendar.mothShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                           'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
Calendar.shortWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

    this.calendarHTML = document.createElement('div');
    this.calendarHTML.classList.add('calendar');
    

    let header = document.createElement('div');
    header.classList.add('calendar-header');
    this.calendarHTML.appendChild(header);

    [
        {
            element: 'button',
            onclick: (e) => { self.prevMonth(); self.render(); },
            class: 'calendar-header-prev-month',
            innerText: '<'
        },
        {
            element: 'div',
            onclick: (e) => { self.selectMonth(); },
            class: 'calendar-current-month',
            innerText: `${Calendar.monthNames[month]}`
        },
        {
            element: 'div',
            onclick: (e) => { self.selectYear(); },
            class: 'calendar-current-year',
            innerText: `${year}`
        },
        {
            element: 'button',
            onclick: (e) => { self.nextMonth(); self.render(); },
            class: 'calendar-header-next-month',
            innerText: '>'
        }
    ].forEach(function(item){
       let headerElem = document.createElement(item['element']);
       headerElem.innerText = item['innerText'];
       headerElem.classList.add(item['class']);
       headerElem.onclick = item['onclick'];    
       header.appendChild(headerElem);
    });
    
    let monthSelector = document.createElement('div');
    monthSelector.classList.add('calendar-month-selector');
    this.calendarHTML.appendChild(monthSelector);
    let row = undefined;
    Calendar.mothShortNames.forEach(function (month, index) {
        if (!(index % 3)) {
            row = document.createElement('div');
            row.classList.add('calendar-month-selector-row');
            monthSelector.appendChild(row);
        }
        
        let monthDiv = document.createElement('div');
        monthDiv.classList.add('calendar-month-selector-month');
        monthDiv.innerText = month;
        monthDiv.onclick = function () {
            self.observingDate.setMonth(index);
            self.render();
        };
        if (index == self.observingDate.getMonth())
            monthDiv.classList.add('calendar-month-selector-month-selected')
        row.appendChild(monthDiv);
    });

    self.yearSelectorHTML = document.createElement('div');
    self.yearSelectorHTML.classList.add('calendar-year-selector');
    [
        {innerText: '<', onclick: () => { self.prevYearGroup(); },
         class: 'calendar-year-group-picker', elem: 'button'},
        {innerText: undefined, onclick: undefined, 
         class: 'calendar-year-selector-rows', elem: 'div'},
        {innerText: '>', onclick: () => { self.nextYearGroup(); },
         class: 'calendar-year-group-picker', elem: 'button'}
    ].forEach(function (item) {
        let e = document.createElement(item.elem);
        e.classList.add(item.class);
        e.innerText = item.innerText;
        e.onclick = item.onclick;
        self.yearSelectorHTML.appendChild(e);
    })
    self.calendarHTML.appendChild(self.yearSelectorHTML);

    let weekdays = document.createElement('div');
    weekdays.classList.add('calendar-weekdays');

    Calendar.shortWeekdayNames.forEach(function(item, index){
        let wd = document.createElement('div');
        wd.classList.add('calendar-weekday');
        if (index == 0 || index == 6)
            wd.classList.add('calendar-weekday-weekend');
        wd.innerText = item;
        weekdays.appendChild(wd);
    });
    
    this.calendarHTML.appendChild(weekdays);
    let calendarRows = document.createElement('div');
    calendarRows.classList.add('calendar-rows');
    this.calendarHTML.appendChild(calendarRows);

    this.carrier.appendChild(this.calendarHTML);
    self.render();
}

Calendar.prototype.render = function() {
    let self = this;
    self.calendarHTML.removeChild(self.calendarHTML.lastChild);
    [{ name: 'month', getValue: () => Calendar.monthNames[this.observingDate.getMonth()] },
     { name: 'year', getValue: () => self.observingDate.getFullYear() }]
        .forEach(function (item) {
            let css = `calendar-${item.name}-selector-${item.name}`
            let e = self.calendarHTML.getElementsByClassName(css + '-selected')[0];
            if (typeof e != 'undefined') e.classList.toggle(css + '-selected');
            self.calendarHTML
                .getElementsByClassName(`calendar-current-${item.name}`)[0]
                .innerText = item.getValue();
        });
    self.calendarHTML.
            getElementsByClassName('calendar-month-selector-month')
            [self.observingDate.getMonth()].
            classList.toggle('calendar-month-selector-month-selected');
    
    let years = self.yearSelectorHTML.getElementsByClassName('calendar-year-selector-year');
    for (let i = 0; i < years.length; i++)
        if (parseInt(years[i].innerText) == self.observingDate.getFullYear()) {
            years[i].classList.toggle('calendar-year-selector-year-selected');
            break;
        }

    let startDate = new Date(self.observingDate.getTime());
    startDate.setDate(1);
    console.log(startDate.getDate() - startDate.getDay());
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(self.observingDate.getFullYear(), self.observingDate.getMonth() + 1, 0);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    let calendarRows = document.createElement('div');
    calendarRows.classList.add('calendar-rows');
    self.calendarHTML.appendChild(calendarRows);
    
    let row = undefined;
    let selectedDateTime = self.selectedDate.getTime();
    let observingMonth = this.observingDate.getMonth();
    while (startDate <= endDate) {
        let startDateTime = startDate.getTime();
        let startDateMonth = startDate.getMonth();
        if (!startDate.getDay()) {
            row = document.createElement('div');
            row.classList.add('calendar-row');
            calendarRows.appendChild(row);
        }
        let cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        if (startDateTime == selectedDateTime)
            cell.classList.add('calendar-cell-selected');
        if (Calendar.isWeekendOrHoliday(startDate))
            cell.classList.add('calendar-cell-weekend-or-holiday');
        if (!(startDateMonth == 0 && observingMonth == 11) && startDateMonth < observingMonth ||
                (startDateMonth == 11 && observingMonth == 0))
            cell.classList.add('calendar-cell-prev-month')
        else if (startDateMonth > observingMonth || (startDateMonth == 0 && observingMonth == 11))
            cell.classList.add('calendar-cell-next-month')

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
    this.calendarHTML
        .getElementsByClassName('calendar-current-month')[0]
        .innerText = Calendar.monthNames[this.observingDate.getMonth()];
    this.calendarHTML
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
    let yearRows = this.yearSelectorHTML
        .getElementsByClassName('calendar-year-selector-rows')[0]; 
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
        let yearHTML = document.createElement('div');
        yearHTML.classList.add('calendar-year-selector-year');
        yearHTML.innerText = i;
        yearHTML.onclick = function () {
            self.observingDate.setFullYear(i);
            self.render();
        }
        if (i == year)
            yearHTML.classList.toggle('calendar-year-selector-year-selected');
        row.appendChild(yearHTML);
    }

}

Calendar.prototype.prevYearGroup = function () {
    console.log('asdasdasd');
    this.yearGroup(this.coreYear - 9); 
}

Calendar.prototype.nextYearGroup = function () {
    this.yearGroup(this.coreYear + 9);
}

Calendar.prototype.selectYear = function () {
    this.yearGroup(this.observingDate.getFullYear());
    this.yearSelectorHTML.classList.toggle('calendar-year-selector-shown');
}

Calendar.prototype.selectMonth = function () {
    let monthSelector = this.calendarHTML.getElementsByClassName("calendar-month-selector")[0];
    monthSelector
    .classList.toggle("calendar-month-selector-shown");
}