const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  chooseddate = "";
  const monthShortNames = months.map((month) => month.substring(0, 3));
  const calendarContainer = $("#calendar-container");
  const yearDropdown = $("#yearDropdown");
  const monthDropdown = $("#monthDropdown");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  function updateMonthDropdownOptions(selectedYear) {
    const monthDropdown = $("#monthDropdown");
    monthDropdown.empty();

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      if (
        daysInMonth >= new Date().getDate() ||
        selectedYear > currentYear
      ) {
        const option = $("<option>").val(month).text(months[month]);
        monthDropdown.append(option);
      }
    }
    const defaultMonth =
      currentMonth < new Date(selectedYear, 0).getMonth()
        ? currentMonth
        : 0;
    monthDropdown.val(currentMonth);

  }

  function updateCalendar(year, month) {
    calendarContainer.owlCarousel("destroy");
    calendarContainer.empty();
    calendarContainer.owlCarousel({
      center: true,
      loop: false,
      nav: true,
      navText: [
        '<i class="fa-solid fa-chevron-left fa-fw"></i>',
        '<i class="fa-solid fa-chevron-right fa-fw"></i>',
      ],
      margin: 10,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 6,
        },
      },
      lazyLoad: true,
      startPosition: "URLHash",
      URLhashListener:true,
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      

        const dayCard = $(`<div data-hash="${day}">`)
          .addClass("day-card card rounded btn-cstm-red")
          .html(
            "<p class='fw-bold'>" +
              getDayOfWeek(year, month, day) +
              "</p>" +
              "<h3>" +
              day +
              "</h3>" +
              "<p>" +
              monthShortNames[month] +
              "</p>" 
        )
          .css("cursor", "pointer")
          .data("date", dateString);

        dayCard.on("click", function () {
            calendarContainer
              .find(".day-card")
              .removeClass("border-success selectedcard");
            const clickedDate = $(this).data("date");

            // const day = clickedDate.split('-')
             console.log('Day test: ', day)
             window.location.hash = day;
            
            console.log("Clicked on", clickedDate);
            chooseddate = clickedDate;
            fetchTest(chooseddate)
            $(this).addClass("border-success selectedcard");
        });
        calendarContainer.trigger("add.owl.carousel", [dayCard]);

    }
    window.location.hash = new Date().getDate();
    calendarContainer.trigger("refresh.owl.carousel");
  }
  yearDropdown.val(currentYear);
  updateMonthDropdownOptions(currentYear);
  updateCalendar(currentYear, currentMonth);

  yearDropdown.on("change", function () {
    const selectedYear = parseInt($(this).val(), 10);
    const selectedMonth = parseInt(monthDropdown.val(), 10);
    updateMonthDropdownOptions(selectedYear);
    updateCalendar(selectedYear, selectedMonth);
  });

  monthDropdown.on("change", function () {
    const selectedMonth = parseInt($(this).val(), 10);
    const selectedYear = parseInt(yearDropdown.val(), 10);
    updateCalendar(selectedYear, selectedMonth);
  });

  function getDayOfWeek(year, month, day) {
    const date = new Date(year, month, day);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  }
  function timeEarnings(y = 0, m = 0, h = 0, d = 0, w = 0, mo = 0) {
    var a = 1 * y;
    var b = 2 * m;
    var c = 3 * h;
    var d = 4 * d;
    var e = 5 * w;
    var f = 6 * mo;
    var total = (a + b + c + d + e + f);
    return total.toLocaleString();
  }
  
  function calcuLatte() {
  
  var Years = document.getElementById("se").value;
  var Minutes = document.getElementById("mi").value;
  var Hours = document.getElementById("ho").value;
  var Weeks = document.getElementById("da").value;
  var Days = document.getElementById("we").value;
  var Months = document.getElementById("mo").value;
  
  var newActivity = document.getElementById("activity").value;
  var idArray = [Years, Minutes, Hours, Weeks, Days, Months];
  
  var timeResult = timeEarnings(...idArray);
  var timeSentence = `While you were ${newActivity}, Jeff Bezos made $ ${timeResult}`;
  
    console.log(timeSentence);
  }
  function Popup() {
    const nameForm = document.getElementById("name").value;
    if(nameForm.length > 0){
    document.getElementById("myForm").submit();
    console.log('Form submitted')};
  }
  class DecimalInput extends HTMLInputElement {
    constructor() {
      super();
      this.addEventListener('change', (e) => {
        const val = parseFloat(this.value),
              min = parseFloat(this.min),
              max = parseFloat(this.max),
              step = parseFloat(this.step);
              
        if (val%step !== 0) {
          this.value = Math.round(val/step) * step
        }
        if (val > max) {
          this.value = max
        }
        if (val < min) {
          this.value = min
        }
      })
    }
  }
const assignment = (data) => {
  if (data.length === 0){
    console.log('You have no Assignments')
    const list = document.getElementById("p1");
    list.innerHTML = 'You have no Assignments'
    return null;
  }
  else{
    //const date = data.split('-')
    //window.location.hash = day[0];
    var container = document.getElementById("p1")
    
    container.innerHTML = ''
    //add innerHTML
    console.log(data)
      console.log('Here ' + data.date )
      for(let datas of data){
        // where card beginning should be
        
        if (datas.description == null){
          datas.description = ''
        }
  
      var child = document.createElement('div')



      child.className = 'card edge mb-3'
      console.log(datas)
      child.innerHTML = `
          ${datas.name} <br> Due at  ${datas.date.split(' ')[0,4]} <br>${datas.description}<br>
          <input type="button" class="btn btn-danger" id="${datas.id}" value="Remove" onclick="removeItem('${datas.id}')">
          
        `;
      container.appendChild(child)
      }
  }
  }


  const removeItem = async (itemId) => {
    const itemToRemove = document.getElementById(itemId);
    console.log('removeItem function called: ',itemId)
    const response = await fetch(`/acc/delete_assignment/${itemId}`, {
      method: 'POST'
    })

}
  const timelayout = (data) => {
    if (!data){}
  };
  
  customElements.define('decimal-input', DecimalInput, { extends: 'input' })
  const fetchTest = async (chooseddate) => {
    try {
      const response = await fetch(`/dateSub/${chooseddate}`); 
      const data = await response.json();
      assignment(data)
      console.log("Fetched data: ", data); // Debugging to check structure
  
      if (!Array.isArray(data)) {
        console.log('Found data!')
        return;
      }
  
      return data; // Return fetched data
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return null;
    }
  };
  // const today =  new Date().toLocaleTimeString.toISOString().split('T')
  // const options = {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   weekday: 'long',
  // };

    timedif =  new Date().getTimezoneOffset()
    today = new Date().toISOString().split('T')[0]
    timed = new Date().toISOString().split('T')[1]
    year = today.split('-')[0]
    month = today.split('-')[1]
    day = today.split('-')[2]
    hour = timed.split(':')[0]
    // console.log('Today toString data: ',today)
    // console.log('This is the year', year)
    // console.log('This is the month', month)
    // console.log('This is the day', day)
    // console.log('This is the time', timed)
    // console.log('This is the hour', hour)
    
    // console.log("This is today's time", today)
    // console.log('This is the time difference of utc and the time zone', timedif)
    let dayshow = 0

  
  if (timedif < 0){
    console.log('negitve ', timedif)
  }
  else if (timedif > 0){
    // console.log('postive ', timedif)
    let timedifdiv = timedif / 60
    // console.log("This is today's hour dif", timedifdiv)
    let timedifdivsub = 1 - timedifdiv 
    // console.log("This is today's hour", hour)
    console.log("This is today's hour difference sub", timedifdivsub)
      if (timedifdivsub < 0){
        let daysub = day - 1
        let hoursub = 24 + timedifdivsub
        console.log('If ran')
        console.log('Daysub: ',daysub)
        console.log('Hoursub: ',hoursub)
        dayshow = daysub
        const list = document.getElementById("day");
        list.innerHTML = dayshow
      }
      else{

      }
      
      console.log("this is dayshow", dayshow)
        const list = document.getElementById("day");
        list.innerHTML = 'You have no Assignments'
       
    }
  else{
    console.log('is 0 ', timedif)
  }
fetchTest(today);