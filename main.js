const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const temperatureFeelOutput = document.querySelector(".temperature-feel");
const pressureOutput = document.querySelector(".pressure");
const visibilityOutput = document.querySelector(".visibility");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const getLocation = document.querySelector(".location");
const cities = document.querySelectorAll(".city");
let cityFromGeolocation = "";

let cityInput = "";

cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    app.style.opacity = "0";
  });
});

getCurrentGeolocation();

getLocation.addEventListener("click", function () {
  getCurrentGeolocation();

  return;
});

async function getCurrentGeolocation() {
  if (navigator.geolocation) {
    await window.navigator.geolocation.getCurrentPosition((locations) => {
      const { latitude, longitude } = locations.coords;
      console.log(latitude, longitude);
      (error) => {
        alert(error.message);
      };
      fetchCityName(latitude, longitude);
    });
  }
}

async function fetchCityName(latitude, longitude) {
  await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if ((data.address.city = undefined)) {
        toNormalForm(data.address.city);
      } else {
        toNormalForm(data.address.village);
      }
      console.log(data);
      console.log("cityfromgeolocation", cityFromGeolocation);
      cityInput = cityFromGeolocation;
      fetchWeatherData();
    });
}

function toNormalForm(string) {
  return (cityFromGeolocation = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l"));
}

form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type in a city name");
  } else {
    cityInput = toNormalFormSearch(search.value);
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
  }
  e.preventDefault();
});

function toNormalFormSearch(string) {
  return (cityFromGeolocation = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l"));
}

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

function fetchWeatherData() {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=e0c1a083d9094ababd0211848210510&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      temp.innerHTML = data.current.temp_c + "&#176;";
      conditionOutput.innerHTML = data.current.condition.text;
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const d = parseInt(date.substr(5, 2));
      const m = parseInt(date.substr(8, 2));
      const time = date.substr(11);
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${m}, ${d} ${y}`;
      timeOutput.innerHTML = time;
      nameOutput.innerHTML = data.location.name;
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      icon.src = "./icons/" + iconId;
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";
      visibilityOutput.innerHTML = data.current.vis_km + "km";
      pressureOutput.innerHTML = data.current.pressure_mb + "hPa";
      let timeOfDay = "day";
      const code = data.current.condition.code;
      if (!data.current.is_day) {
        timeOfDay = "night";
      }
      if (code == 1000) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
          btn.style.background = "#325c80";
        }
      } else {
        app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
        if (timeOfDay == "night") {
          btn.style.background = "#1b1b1b";
        }
      }
      app.style.opacity = "1";
    })
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}

app.style.opacity = "1";
