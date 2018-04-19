
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
Calendar.shortWeekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
            element: 'i',
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
            element: 'i',
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

    Calendar.shortWeekdayNames.forEach(function(item){
        let wd = document.createElement('div');
        wd.classList.add('calendar-weekday');
        wd.innerText = item;
        weekdays.appendChild(wd);
    });

    this.calendarHTML.appendChild(weekdays);
    // let prevMonthHTML = document.createElement('i');
    // prevMonthHTML.innerText = '<';
    // prevMonthHTML.classList.add('calendar-header-prev-month');
    // prevMonthHTML.onclick = function(e) {
    //     self.prevMonth();
    // };

    // header.appendChild(prevMonthHTML);

    // ...

    this.carrier.appendChild(this.calendarHTML);
    this.prevMonth();
}

Calendar.prototype.render = function() {

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