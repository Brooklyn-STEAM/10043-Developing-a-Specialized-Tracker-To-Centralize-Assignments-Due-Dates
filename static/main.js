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
    URLhashListener: true,
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
      // console.log('Day test: ', day)
      // window.location.hash = day[2];

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
  if (nameForm.length > 0) {
    document.getElementById("myForm").submit();
    console.log('Form submitted')
  };
}
class DecimalInput extends HTMLInputElement {
  constructor() {
    super();
    this.addEventListener('change', (e) => {
      const val = parseFloat(this.value),
        min = parseFloat(this.min),
        max = parseFloat(this.max),
        step = parseFloat(this.step);

      if (val % step !== 0) {
        this.value = Math.round(val / step) * step
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
  if (data.length === 0) {
    console.log('No data')
    const list = document.getElementById("p1");
    list.innerHTML = 'No data'
    return null;
  }
  else {
    //const date = data.split('-')
    //window.location.hash = day[0];
    var container = document.getElementById("p1")

    container.innerHTML = ''
    //add innerHTML
    console.log(data)
    console.log('Here ' + data.date)
    for (let datas of data) {
      // where card beginning should be

      if (datas.description == null) {
        datas.description = ''
      }

      var child = document.createElement('div')



      child.className = 'card edge mb-3'
      console.log(datas)
      child.innerHTML = `
          ${datas.name} Due at ${datas.date.split(' ')[0, 4]} ${datas.description}<br>
          <p class="card-text">${datas.description}</p>
          <p class="card-text">Time: ${datas.date}</p><br>

          <div class="container">
            <form id="commentForm">
              <textarea id="commentBox" placeholder="Add Your Comment" value=" "></textarea><br>
              <div class="btn">
                <input id="submit" class="text-center" type="submit" value="Comment">
              </div> 
            </form>
          </div>
          <div class="comments">
            <h5>Comments</h5>
            <div id="comment-box">
            </div>
          </div>

          <input type="button" class="btn btn-danger" id="${datas.id}" value="Remove" onclick="removeItem('${datas.id}')">
          
        `;
      container.appendChild(child)

      // document.getElementById("commentBox").addEventListener("keypress", e => {
      //   if (e.key === "Enter" && !e.shiftKey) {
      //     e.preventDefault();

      //     e.nameForm("commentForm").submit();
      //     console.log("form submitted")
          
      //   }
      // });
    }
  }
}



const removeItem = async (itemId) => {
  const itemToRemove = document.getElementById(itemId);
  console.log('removeItem function called: ', itemId)
  const response = await fetch(`/acc/delete_assignment/${itemId}`, {
    method: 'POST'
  })

}
const timelayout = (data) => {
  if (!data) { }
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
today = new Date().toISOString().split('T')[0]
console.log('Today toString data: ', today)
fetchTest(today);


// Commenting system

const field = document.querySelector('textarea');
const backUp = field.getAttribute('placeholder')
const btn = document.querySelector('.btn');
const clear = document.getElementById('clear')
const submit = document.querySelector('#submit')
// const comments = document.querySelector('#comment-box')
const comments = document.getElementById('comment-box');

// array to store the comments
const comments_arr = [];

// to generate html list based on comments array
const display_comments = () => {
  let list = '<ul>';
  comments_arr.forEach(comment => {
    list += `<li>${comment}</li>`;
  })
  list += '</ul>';
  comments.innerHTML = list;
}

clear.onclick = function (event) {
  event.preventDefault();
  // reset the array  
  comments_arr.length = 0;
  // re-genrate the comment html list
  display_comments();
}

submit.onclick = function (event) {
  event.preventDefault();
  const content = field.value;
  if (content.length > 0) { // if there is content
    // add the comment to the array
    comments_arr.push(content);
    // re-genrate the comment html list
    display_comments();
    // reset the textArea content 
    field.value = '';
  }
}