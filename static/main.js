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

  function isTodayOrFuture(year, month, day) {
    const today = new Date();
    const dateToCheck = new Date(year, month, day);
    return dateToCheck >= today;
  }
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
    monthDropdown.val(defaultMonth);
  }

  function updateCalendar(year, month) {
    calendarContainer.owlCarousel("destroy");
    calendarContainer.empty();
    calendarContainer.owlCarousel({
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
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      
      if (
        isTodayOrFuture(year, month, day) ||
        (year === currentYear &&
          month === currentMonth &&
          day === currentDay)
      ) {
        const dayCard = $("<div>")
          .addClass("day-card card rounded")
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
            console.log("Clicked on", clickedDate);
            chooseddate = clickedDate;
            $(this).addClass("border-success selectedcard");
        });
        calendarContainer.trigger("add.owl.carousel", [dayCard]);
      }
    }
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
var seconds = document.getElementById("se").value;
var Minutes = document.getElementById("mi").value;
var Hours = document.getElementById("ho").value;
var Weeks = document.getElementById("we").value;
var Days = document.getElementById("da").value;
var Months = document.getElementById("mo").value;

var newActivity = document.getElementById("activity").value;
var idArray = [seconds, Minutes, Hours, Weeks, Days, Months];

function bezosEarnings(s = 0, m = 0, h = 0, d = 0, w = 0, mo = 0) {
  var a = 1 * s;
  var b = 60 * m;
  var c = 3600 * h;
  var d = 86400 * d;
  var e = 604800 * w;
  var f = 2419300 * mo;
  var total = (a + b + c + d + e + f) * 2489;
  return total.toLocaleString();
}
var bezosResult = bezosEarnings(...idArray);
var returnSentence = `While you were ${newActivity}, Jeff Bezos made $ ${bezosResult}`;

function calcuLatte() {
  console.log(returnSentence);
}