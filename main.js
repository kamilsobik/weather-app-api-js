const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const getLocation = document.querySelector(".location");
const cities = document.querySelectorAll(".city");
const hourlyForecast = document.querySelector(".hourly-forecast");
const hourlySummary = document.querySelector(".hourly-summary");
const dailyForecast = document.querySelector(".daily-forecast");
const dailySummary = document.querySelector(".daily-summary");
const airUsEpaBadge = document.querySelector(".air-us-epa-badge");
const airGbDefraBadge = document.querySelector(".air-gb-defra-badge");

const fieldMap = {
  cloud: document.querySelector(".cloud"),
  humidity: document.querySelector(".humidity"),
  wind: document.querySelector(".wind"),
  windGust: document.querySelector(".wind-gust"),
  pressure: document.querySelector(".pressure"),
  visibility: document.querySelector(".visibility"),
  precipitation: document.querySelector(".precipitation"),
  dewPoint: document.querySelector(".dew-point"),
  windChill: document.querySelector(".wind-chill"),
  heatIndex: document.querySelector(".heat-index"),
  uv: document.querySelector(".uv"),
  windDirection: document.querySelector(".wind-direction"),
  feelsLike: document.querySelector(".temperature-feel"),
  tempRange: document.querySelector(".temp-range"),
  coordinates: document.querySelector(".coordinates"),
  lastUpdated: document.querySelector(".last-updated"),
  maxTemp: document.querySelector(".max-temp"),
  minTemp: document.querySelector(".min-temp"),
  avgTemp: document.querySelector(".avg-temp"),
  maxWind: document.querySelector(".max-wind"),
  totalRain: document.querySelector(".total-rain"),
  totalSnow: document.querySelector(".total-snow"),
  chanceRain: document.querySelector(".chance-rain"),
  chanceSnow: document.querySelector(".chance-snow"),
  avgHumidity: document.querySelector(".avg-humidity"),
  avgVisibility: document.querySelector(".avg-visibility"),
  dayUv: document.querySelector(".day-uv"),
  dayCondition: document.querySelector(".day-condition"),
  sunrise: document.querySelector(".sunrise"),
  sunset: document.querySelector(".sunset"),
  moonrise: document.querySelector(".moonrise"),
  moonset: document.querySelector(".moonset"),
  moonPhase: document.querySelector(".moon-phase"),
  moonIllumination: document.querySelector(".moon-illumination"),
  airUsEpa: document.querySelector(".air-us-epa"),
  airGbDefra: document.querySelector(".air-gb-defra"),
  airPm25: document.querySelector(".air-pm25"),
  airPm10: document.querySelector(".air-pm10"),
  airCo: document.querySelector(".air-co"),
  airO3: document.querySelector(".air-o3"),
  airNo2: document.querySelector(".air-no2"),
  airSo2: document.querySelector(".air-so2"),
};

let cityFromGeolocation = "";
let cityInput = "";

function setField(key, value) {
  if (fieldMap[key]) {
    fieldMap[key].textContent = value;
  }
}

function formatTemperature(value) {
  return `${Math.round(value)}°C`;
}

function formatDecimal(value, digits = 1) {
  return Number(value).toFixed(digits);
}

function formatLocalDate(localtime) {
  const [datePart] = localtime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date),
    longDate: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date),
  };
}

function formatHourLabel(hourEntry) {
  const date = new Date(hourEntry.time.replace(" ", "T"));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
  }).format(date);
}

function formatDayLabel(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function toNormalForm(string) {
  return string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
}

function getButtonColor(code, isDay) {
  if (code === 1000) {
    return isDay ? "#e5ba92" : "#181e27";
  }

  if (
    code === 1003 ||
    code === 1006 ||
    code === 1009 ||
    code === 1030 ||
    code === 1069 ||
    code === 1087 ||
    code === 1135 ||
    code === 1273 ||
    code === 1276 ||
    code === 1279 ||
    code === 1282
  ) {
    return isDay ? "#fa6d1b" : "#181e27";
  }

  if (
    code === 1063 ||
    code === 1072 ||
    code === 1150 ||
    code === 1153 ||
    code === 1180 ||
    code === 1183 ||
    code === 1186 ||
    code === 1189 ||
    code === 1192 ||
    code === 1195 ||
    code === 1204 ||
    code === 1207 ||
    code === 1240 ||
    code === 1243 ||
    code === 1246 ||
    code === 1249 ||
    code === 1252
  ) {
    return isDay ? "#647d75" : "#325c80";
  }

  return isDay ? "#4d72aa" : "#1b1b1b";
}

function applyWeatherTheme(code, isDay) {
  const timeOfDay = isDay ? "day" : "night";

  if (code === 1000) {
    app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
  } else if (
    code === 1003 ||
    code === 1006 ||
    code === 1009 ||
    code === 1030 ||
    code === 1069 ||
    code === 1087 ||
    code === 1135 ||
    code === 1273 ||
    code === 1276 ||
    code === 1279 ||
    code === 1282
  ) {
    app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
  } else if (
    code === 1063 ||
    code === 1072 ||
    code === 1150 ||
    code === 1153 ||
    code === 1180 ||
    code === 1183 ||
    code === 1186 ||
    code === 1189 ||
    code === 1192 ||
    code === 1195 ||
    code === 1204 ||
    code === 1207 ||
    code === 1240 ||
    code === 1243 ||
    code === 1246 ||
    code === 1249 ||
    code === 1252
  ) {
    app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
  } else {
    app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
  }

  btn.style.background = getButtonColor(code, isDay);
}

function getEpaStatus(index) {
  if (index <= 1) {
    return "Good";
  }

  if (index === 2) {
    return "Moderate";
  }

  if (index === 3) {
    return "Sensitive groups";
  }

  if (index === 4) {
    return "Unhealthy";
  }

  if (index === 5) {
    return "Very unhealthy";
  }

  return "Hazardous";
}

function getDefraStatus(index) {
  if (index <= 3) {
    return "Low";
  }

  if (index <= 6) {
    return "Moderate";
  }

  if (index <= 9) {
    return "High";
  }

  return "Very high";
}

function getEpaBadgeClass(index) {
  if (index <= 1) {
    return "aq-good";
  }

  if (index === 2) {
    return "aq-moderate";
  }

  if (index === 3 || index === 4) {
    return "aq-poor";
  }

  return "aq-severe";
}

function getDefraBadgeClass(index) {
  if (index <= 3) {
    return "aq-good";
  }

  if (index <= 6) {
    return "aq-moderate";
  }

  if (index <= 9) {
    return "aq-poor";
  }

  return "aq-severe";
}

function setBadge(element, text, className) {
  element.className = `aq-chip ${className}`;
  element.textContent = text;
}

function renderHourlyForecast(forecastDays, locationLocalTime) {
  const currentTime = new Date(locationLocalTime.replace(" ", "T"));
  const currentTimeEpoch = currentTime.getTime();

  const allHours = forecastDays.flatMap((forecastDay) => forecastDay.hour);
  const upcomingHours = allHours.filter((hour) => {
    const hourTime = new Date(hour.time.replace(" ", "T")).getTime();
    return hourTime >= currentTimeEpoch;
  });

  const displayedHours = upcomingHours.slice(0, 24);

  hourlyForecast.innerHTML = displayedHours
    .map(
      (hour) => `
        <article class="hour-card">
          <div class="hour-card-top">
            <span>${formatHourLabel(hour)}</span>
            <span>${hour.condition.text}</span>
          </div>
          <div class="hour-temp-row">
            <img src="./icons/${hour.condition.icon.substr(
              "//cdn.weatherapi.com/weather/64x64/".length
            )}" alt="${hour.condition.text}" width="38" height="38" />
            <strong>${formatTemperature(hour.temp_c)}</strong>
          </div>
          <div class="hour-card-details">
            <span>Rain ${hour.chance_of_rain}%</span>
            <span>Wind ${Math.round(hour.wind_kph)} km/h</span>
            <span>Humidity ${hour.humidity}%</span>
          </div>
        </article>
      `
    )
    .join("");

  hourlySummary.textContent =
    displayedHours.length > 0
      ? `Showing the next ${displayedHours.length} hours`
      : "No hourly data available";
}

function renderDailyForecast(days) {
  const upcomingDays = days.slice(1);

  dailyForecast.innerHTML = upcomingDays
    .map(
      (forecastDay) => `
        <article class="day-card">
          <div class="day-card-top">
            <div>
              <span class="label">Day</span>
              <strong>${formatDayLabel(forecastDay.date)}</strong>
            </div>
            <img
              src="./icons/${forecastDay.day.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/".length
              )}"
              alt="${forecastDay.day.condition.text}"
              width="42"
              height="42"
            />
          </div>
          <p class="day-condition-text">${forecastDay.day.condition.text}</p>
          <div class="day-card-grid">
            <span>${formatTemperature(forecastDay.day.mintemp_c)} / ${formatTemperature(
              forecastDay.day.maxtemp_c
            )}</span>
            <span>Rain ${forecastDay.day.daily_chance_of_rain}%</span>
            <span>Wind ${Math.round(forecastDay.day.maxwind_kph)} km/h</span>
            <span>Precip ${formatDecimal(
              forecastDay.day.totalprecip_mm,
              1
            )} mm</span>
          </div>
        </article>
      `
    )
    .join("");

  dailySummary.textContent =
    upcomingDays.length > 0
      ? `API currently returns ${upcomingDays.length} more day${
          upcomingDays.length > 1 ? "s" : ""
        }`
      : "No additional days available from the API";
}

function renderWeatherData(data) {
  const { location, current, forecast, alerts } = data;
  const forecastDay = forecast.forecastday[0];
  const { day, astro } = forecastDay;
  const { weekday, longDate } = formatLocalDate(location.localtime);

  temp.innerHTML = `${Math.round(current.temp_c)}&#176;`;
  conditionOutput.textContent = current.condition.text;
  timeOutput.textContent = location.localtime.split(" ")[1];
  dateOutput.textContent = `${weekday}, ${longDate}`;
  nameOutput.textContent = `${location.name}, ${location.country}`;
  icon.src =
    "./icons/" +
    current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
  icon.alt = current.condition.text;

  setField("cloud", `${current.cloud}%`);
  setField("humidity", `${current.humidity}%`);
  setField("wind", `${Math.round(current.wind_kph)} km/h`);
  setField("windGust", `${Math.round(current.gust_kph)} km/h`);
  setField("pressure", `${Math.round(current.pressure_mb)} hPa`);
  setField("visibility", `${formatDecimal(current.vis_km)} km`);
  setField("precipitation", `${formatDecimal(current.precip_mm, 2)} mm`);
  setField("dewPoint", `${formatDecimal(current.dewpoint_c)}°C`);
  setField("windChill", `${formatDecimal(current.windchill_c)}°C`);
  setField("heatIndex", `${formatDecimal(current.heatindex_c)}°C`);
  setField("uv", `${formatDecimal(current.uv)}`);
  setField("windDirection", `${current.wind_dir} (${current.wind_degree}°)`);
  setField("feelsLike", formatTemperature(current.feelslike_c));
  setField(
    "tempRange",
    `${formatTemperature(day.mintemp_c)} / ${formatTemperature(day.maxtemp_c)}`
  );
  setField(
    "coordinates",
    `${formatDecimal(location.lat, 2)}, ${formatDecimal(location.lon, 2)}`
  );
  setField("lastUpdated", current.last_updated.split(" ")[1]);

  setField("maxTemp", formatTemperature(day.maxtemp_c));
  setField("minTemp", formatTemperature(day.mintemp_c));
  setField("avgTemp", formatTemperature(day.avgtemp_c));
  setField("maxWind", `${Math.round(day.maxwind_kph)} km/h`);
  setField("totalRain", `${formatDecimal(day.totalprecip_mm, 2)} mm`);
  setField("totalSnow", `${formatDecimal(day.totalsnow_cm, 1)} cm`);
  setField("chanceRain", `${day.daily_chance_of_rain}%`);
  setField("chanceSnow", `${day.daily_chance_of_snow}%`);
  setField("avgHumidity", `${day.avghumidity}%`);
  setField("avgVisibility", `${formatDecimal(day.avgvis_km)} km`);
  setField("dayUv", `${formatDecimal(day.uv)}`);
  setField("dayCondition", day.condition.text);

  setField("sunrise", astro.sunrise);
  setField("sunset", astro.sunset);
  setField("moonrise", astro.moonrise);
  setField("moonset", astro.moonset);
  setField("moonPhase", astro.moon_phase);
  setField("moonIllumination", `${astro.moon_illumination}%`);

  setField(
    "airUsEpa",
    `${current.air_quality["us-epa-index"]} - ${getEpaStatus(
      current.air_quality["us-epa-index"]
    )}`
  );
  setField(
    "airGbDefra",
    `${current.air_quality["gb-defra-index"]}/10 - ${getDefraStatus(
      current.air_quality["gb-defra-index"]
    )}`
  );
  setField("airPm25", `${formatDecimal(current.air_quality.pm2_5, 2)} ug/m3`);
  setField("airPm10", `${formatDecimal(current.air_quality.pm10, 2)} ug/m3`);
  setField("airCo", `${formatDecimal(current.air_quality.co, 2)} ug/m3`);
  setField("airO3", `${formatDecimal(current.air_quality.o3, 2)} ug/m3`);
  setField("airNo2", `${formatDecimal(current.air_quality.no2, 2)} ug/m3`);
  setField("airSo2", `${formatDecimal(current.air_quality.so2, 2)} ug/m3`);
  setBadge(
    airUsEpaBadge,
    getEpaStatus(current.air_quality["us-epa-index"]),
    getEpaBadgeClass(current.air_quality["us-epa-index"])
  );
  setBadge(
    airGbDefraBadge,
    getDefraStatus(current.air_quality["gb-defra-index"]),
    getDefraBadgeClass(current.air_quality["gb-defra-index"])
  );

  renderHourlyForecast(forecast.forecastday, location.localtime);
  renderDailyForecast(forecast.forecastday);
  applyWeatherTheme(current.condition.code, Boolean(current.is_day));

  if (alerts && alerts.alert && alerts.alert.length > 0) {
    hourlySummary.textContent = `${hourlySummary.textContent} • ${alerts.alert.length} weather alert${
      alerts.alert.length > 1 ? "s" : ""
    } reported`;
  }
}

async function fetchWeatherData() {
  if (!cityInput) {
    return;
  }

  app.style.opacity = "0";

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=e0c1a083d9094ababd0211848210510&q=${encodeURIComponent(
        cityInput
      )}&days=7&aqi=yes&alerts=yes`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    renderWeatherData(data);
  } catch (error) {
    alert(error.message || "City not found, please try again");
  } finally {
    app.style.opacity = "1";
  }
}

async function fetchCityName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    const geolocationCity =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality;

    if (!geolocationCity) {
      throw new Error("No city found for your location.");
    }

    cityFromGeolocation = toNormalForm(geolocationCity);
    cityInput = cityFromGeolocation;
    fetchWeatherData();
  } catch (error) {
    alert("Unable to get your location name right now.");
  }
}

function getCurrentGeolocation() {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      fetchCityName(coords.latitude, coords.longitude);
    },
    (error) => {
      alert(error.message);
    }
  );
}

cities.forEach((city) => {
  city.addEventListener("click", (event) => {
    cityInput = toNormalForm(event.target.textContent);
    fetchWeatherData();
  });
});

getCurrentGeolocation();

getLocation.addEventListener("click", () => {
  getCurrentGeolocation();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (search.value.trim().length === 0) {
    alert("Please type in a city name");
    return;
  }

  cityInput = toNormalForm(search.value.trim());
  search.value = "";
  fetchWeatherData();
});

app.style.opacity = "1";
