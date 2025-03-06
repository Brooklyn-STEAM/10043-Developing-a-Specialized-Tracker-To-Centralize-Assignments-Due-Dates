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