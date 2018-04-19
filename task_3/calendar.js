
function Calendar(id) {
    

    this.carrier = document.getElementById(id);
    this.observingDate = new Date(Date.now());
    this.selectedDate = this.selectedDate;
    this.selectedCell = null;
    this.cells = [];

    if (!this.carrier)
        throw HTMLUnknownElement;

    this.init();

}

Calendar.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
Calendar.mothShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                           'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
Calendar.shortWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

Calendar.prototype.init = function() {
    let self = this;
    let year  = this.observingDate.getFullYear();
    let month = this.observingDate.getMonth();

    while (this.carrier.firstChild) { 
        this.carrier.removeChild(this.carrier.firstChild);
    }

    this.calendarHTML = document.createElement('div');
    this.calendarHTML.classList.add('calendar');
    

    let header = document.createElement('div');
    header.classList.add('calendar-header');
    this.calendarHTML.appendChild(header);

    let headerElems = [
        {
            element: 'button',
            onclick: (e) => { self.prevMonth(); },
            class: 'calendar-header-prev-month',
            innerText: '<'
        },
        {
            element: 'div',
            onclick: undefined,
            class: 'calendar-header-next-month',
            innerText: `${Calendar.monthNames[month]}`
        },
        {
            element: 'div',
            onclick: undefined,
            class: 'calendar-header-next-month',
            innerText: `${year}`
        },
        {
            element: 'button',
            onclick: (e) => { self.nextMonth(); },
            class: 'calendar-header-next-month',
            innerText: '>'
        }
    ];

    headerElems.forEach(function(item){
       let headerElem = document.createElement(item['element']);
       headerElem.innerText = item['innerText'];
       headerElem.classList.add(item['class']);
       headerElem.onclick = item['onclick'];    
       header.appendChild(headerElem);
    });


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

    this.carrier.appendChild(this.calendarHTML);
    self.render();
}

Calendar.prototype.render = function() {
    let self = this;
    // self.calendarHTML.removeChild(self.calendarHTML.lastChild);

    let startDate = self.observingDate;
    startDate.setDate(1);
    startDate= new Date(startDate.getTime() - 86400000 * startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(self.observingDate.getFullYear(), self.observingDate.getMonth() + 1, 0);
    endDate = new Date(endDate.getTime() + 86400000 * (6 - endDate.getDay()));
    
    let calendarRows = document.createElement('div');
    calendarRows.classList.add('calendar-rows');
    self.calendarHTML.appendChild(calendarRows);
    
    let row = undefined;

    while (startDate <= endDate) {
        if (!startDate.getDay()) {
            row = document.createElement('div');
            row.classList.add('calendar-row');
            calendarRows.appendChild(row);
        }
        let cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.innerText = startDate.getDate();
        row.appendChild(cell);
        startDate = new Date(startDate.getTime() + 86400000)
    }
}

Calendar.prototype.nextMonth = function () {
    
}

Calendar.prototype.prevMonth = function () {
    console.log(this.observingDate);
}

Calendar.prototype.selectYear = function () {

}

Calendar.prototype.selectMonth = function () {

}