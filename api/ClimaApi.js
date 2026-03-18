const API_KEY = "3a55090674fd9ed6c2a82081033fb2ba";

export async function obtenerClima() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Manizales,CO&appid=${API_KEY}&units=metric&lang=es`
    );
  
    return response.json();
}
