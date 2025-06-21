const apiKey = "cc03c1ac67924cd586593939251104";

async function getWeather() {
  const location = document.getElementById("locationInput").value;
  if (!location) {
    showResult("Please enter a location.");
    return;
  }
  fetchWeatherData(location);
}

async function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        fetchWeatherData(coords);
      },
      () => {
        showResult("Unable to access location.");
      }
    );
  } else {
    showResult("Geolocation is not supported by your browser.");
  }
}

async function fetchWeatherData(query) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=yes`
    );
    const data = await response.json();

    if (data.error) {
      showResult(`Error: ${data.error.message}`);
    } else {
      const location = data.location.name + ", " + data.location.country;
      const temp = data.current.temp_c;
      const condition = data.current.condition.text;
      const icon = data.current.condition.icon;
      const time = data.location.localtime;

      resultDiv.innerHTML = `
        <h2>${location}</h2>
        <p><strong>${temp}°C</strong> - ${condition}</p>
        <img src="https:${icon}" alt="${condition}" />
        <p>Local Time: ${time}</p>
      `;
    }
  } catch (error) {
    showResult("Error fetching data.");
    console.error(error);
  }
}

function showResult(message) {
  document.getElementById("result").innerHTML = `<p>${message}</p>`;
}
