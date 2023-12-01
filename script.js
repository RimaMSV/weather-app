const wrapperEl = document.querySelector('.wrapper');
const searchEl = document.querySelector('.search-box button');
const currentTempInfo = document.querySelector('.current-temp-info');
const weatherMoreInfoEl = document.querySelector('.weather-more-info');
const weekDaysSectionEl = document.querySelector('.week-days-section');
const weekDaysInfoEl = document.querySelector('.week-days-info');
const errorMsgEl = document.querySelector('.not-found');

const apiKey = `ea70cf29c6b6294b6dfd0074ac0a9770`;

async function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const requestCityWeather = new Request(url);
  const response = await fetch(requestCityWeather);
  const data = await response.json();
  console.log(data);

  return data;
}

function parseCurrentWeather(data) {
  let currentTemp = Math.round(data.main.temp);
  let currentWeatherCondition = data.weather[0].main;
  let currentweatherConditionCode = data.weather[0].icon;
  weatherCondition = currentWeatherCondition.toLowerCase();
  let weatherDescription = data.weather[0].description;
  let feelsLike = Math.round(data.main.feels_like);
  let humidity = data.main.humidity;
  let tempMax = Math.round(data.main.temp_max);
  let tempMin = Math.round(data.main.temp_min);
  let windSpeed = Math.round(data.wind.speed);

  const fog = ['mist', 'smoke', 'dust', 'fog', 'haze', 'sand', 'ash', 'squall', 'tornado']

  if (fog.includes(currentWeatherCondition)) {
    currentWeatherCondition = 'haze';
  }

  if (currentWeatherCondition === 'Clear' && currentweatherConditionCode.includes('n')) {
    currentWeatherCondition = currentWeatherCondition + '-n'
  } else {
    currentWeatherCondition;
  }

  currentTempInfo.innerHTML = `<p class="temperature flex">${currentTemp}<span>&deg;</span></p>
                              <img class="current-weather-img" src="./icons/${currentWeatherCondition}.png">
                              <p class="description">${weatherDescription}</p>
                              <p class="feels-like info">Feels Like <span> ${feelsLike}</span>&deg;</span></p>`;

  weatherMoreInfoEl.innerHTML = `<div class="group-info humidity">
                                  <img class="label" src="./icons/humidity.png" alt="humidity icon">
                                  <div class="info"><span>${humidity}</span>%</div>
                                </div>
                                <div class="group-info">
                                  <img class="label" src="./icons/thermometer.png" alt="thermometer icon">
                                  <div class="info"><span class="max-temp temp-text">${tempMax}&deg;</span> / <span class="min-temp temp-text">${tempMin}&deg;</span>
                                  </div>
                                </div>
                                <div class="group-info">
                                  <img class="label" src="./icons/wind-speed.png" alt="wind speed icon">
                                  <div class="info"><span>${windSpeed}</span>m/s</div>
                                </div>
                                </div>`
}

async function getWeeklyWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  const weeklyweatherRequest = new Request(url);
  const response = await fetch(weeklyweatherRequest);
  const data = await response.json();

  return data;
}

function parseWeeklyWeather(data) {
  console.log(data);
  const uniqueDayNum = [];
  let dayText = '';
  let today = new Date().getUTCDay();
  let dayInfo = ""
  data.list.map((item) => {
    let dayNum = new Date(item.dt_txt).getUTCDay();
    if (!uniqueDayNum.includes(dayNum) && dayNum !== today) {
      uniqueDayNum.push(dayNum);

      switch (dayNum) {
        case 0:
          dayText = "Sunday";
          break;
        case 1:
          dayText = 'Monday';
          break;
        case 2:
          dayText = 'Tuesday';
          break;
        case 3:
          dayText = 'Wednsday';
          break;
        case 4:
          dayText = 'Thursday';
          break;
        case 5:
          dayText = 'Friday';
          break;
        case 6:
          dayText = 'Saturday';
          break;
      }
      // console.log(dayText);//Test
      // dayTextArr.push(dayText);
      // console.log(dayTextArr);//Test
      let tempMax = Math.round(item.main.temp_max);
      let tempMin = Math.round(item.main.temp_min);
      let currentWeatherCondition = item.weather[0].main;
      let currentweatherConditionCode = item.weather[0].icon;

      const fog = ['mist', 'smoke', 'dust', 'fog', 'haze', 'sand', 'ash', 'squall', 'tornado']

      if (fog.includes(currentWeatherCondition)) {
        currentWeatherCondition = 'haze';
      }

      if (currentWeatherCondition === 'Clear' && currentweatherConditionCode.includes('n')) {

        currentWeatherCondition = currentWeatherCondition + '-n'
      } else {
        currentWeatherCondition;
      }
      weekDaysInfoEl.innerHTML += `<li class="week-days">
      <p class="day">${dayText}</p>
      <div class="group-day-info">
        <img class="label" src="./icons/${currentWeatherCondition}.png"/>
        <div class="week-info"><span class="max-temp temp-text">${tempMax}&deg; </span> / <span class="min-temp temp-text">${tempMin}&deg; </span>
        </div>
      </div>
    </li>`
    }
  })

}

async function checkWeather() {
  const city = document.querySelector('.search-box input').value;
  let currentWeather = await getCurrentWeather(city);
  let weeklyWeather = await getWeeklyWeather(city);

  parseCurrentWeather(currentWeather);
  parseWeeklyWeather(weeklyWeather);

}




searchEl.addEventListener('click', () => {
  checkWeather();
  // checkWeeklyWeatherCondotion();
})