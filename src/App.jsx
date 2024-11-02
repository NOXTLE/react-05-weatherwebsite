import React, { useEffect, useState } from "react";
import "./App.css";
import { ArrowDown, DropletsIcon, Eye, Wind } from "lucide-react";
import axios from "axios";
import { LoadingPage } from "./LoadingPage";

export const App = () => {
  const [clicked, click] = useState(true);
  const [location, setLocation] = useState("London");
  const [text, setText] = useState("");
  const date = new Date();
  var lst = "";
  const arr = [
    { day: "today", temp: "20°", desc: "Mist" },
    { day: "today", temp: "20°", desc: "Mist" },
    { day: "today", temp: "20°", desc: "Mist" },
    { day: "today", temp: "20°", desc: "Mist" },
    { day: "today", temp: "20°", desc: "Mist" },
    { day: "today", temp: "20°", desc: "Mist" },
  ];
  const ad = [
    { time: "1pm", temp: "20°", desc: "Mist" },
    { time: "today", temp: "20°", desc: "Mist" },
    { time: "today", temp: "20°", desc: "Mist" },
    { time: "today", temp: "20°", desc: "Mist" },
    { time: "today", temp: "20°", desc: "Mist" },
    { time: "today", temp: "20°", desc: "Mist" },
  ];

  const [current, getcurrent] = useState([]);
  const [forecast, getforecast] = useState();
  const [curdate, setDate] = useState();
  const [hasError, setError] = useState(false);
  useEffect(() => {
    getcurrent([]);
    getforecast();
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=625ff3139579f58c89ce906c679356a8`
      )
      .then((data) => getforecast(data.data))
      .catch((e) => {
        setError(true);
      });
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=625ff3139579f58c89ce906c679356a8`
      )
      .then((data) => {
        getcurrent(data.data);
        console.log(data.data.main.temp);

        const date = new Date(current.dt * 1000);

        console.log(current.weather[0]);
      })
      .catch((e) => {
        setError(true);
      });
  }, [location]);

  return forecast ? (
    <div id="main">
      <div id="left">
        <div id="top">
          <div id="location">
            {clicked ? (
              <p
                onClick={() => {
                  click((prev) => !prev);
                }}
              >
                {location}
              </p>
            ) : (
              <input
                placeholder="Enter Location"
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    setLocation(text);

                    click((prev) => !prev);
                  }
                }}
              ></input>
            )}
          </div>
          <div id="date">
            {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}
          </div>
          <div></div>
        </div>
        <div id="mid">
          <div id="temp">
            <div id="data">
              {current.main?.temp
                ? `${(current.main.temp - 273.15).toFixed(2)}°C`
                : "loading...."}
            </div>
            <div id="desc">
              {current.main?.temp ? `${current.weather[0].description}` : ""}
            </div>
          </div>
        </div>
        <div id="daily">
          {forecast
            ? forecast.list.map((e) => {
                if (lst != e.dt_txt.slice(8, 10)) {
                  lst = e.dt_txt.slice(8, 10);
                  console.log(e);
                  return (
                    <div id="card">
                      <div id="day">{e.dt_txt.slice(0, 11)}</div>
                      <div id="daytemp">
                        {(e.main.temp_max - 273.15).toFixed(2)}°
                      </div>
                      <div id="daydesc">{e.weather[0].main}</div>
                    </div>
                  );
                }
              })
            : ""}
        </div>
        {window.innerWidth < 800 ? (
          <div id="scroll">
            <ArrowDown></ArrowDown>
            <p>Scroll for more</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div id="right">
        <div id="wish">
          {date.getHours() < 12 ? <p>Good morning</p> : <p>Good Afternoon</p>}
        </div>
        <div id="time">{new Date(current.dt * 1000).toLocaleTimeString()}</div>
        <div id="smallcard">
          <div id="topcard">
            <div id="curtemp">
              {current.main?.temp
                ? `${(current.main.temp - 273.15).toFixed(2)}°C`
                : "loading...."}
              °
            </div>
            <div id="info">
              <div id="speed">
                <Wind></Wind>{" "}
                <div>{current.main?.temp ? `${current.wind.speed}` : ""}</div>
              </div>
              <div id="rain">
                <Eye></Eye>
                <div> {current.main?.temp ? `${current.visibility}` : ""}</div>
              </div>
            </div>
          </div>
          <div id="feels">
            feels Like
            {current.main?.temp
              ? ` ${(current.main.feels_like - 273.15).toFixed(2)}°C`
              : ""}
            °
          </div>
          <div id="cloud">
            {current.main?.temp ? `${current.weather[0].main}` : ""}
          </div>
        </div>
        <div id="hf">Hourly Forecast</div>
        <div id="cardcont">
          {forecast
            ? forecast.list.slice(0, 6).map((e, i) => {
                console.log(e.weather);
                console.log();
                return (
                  <div id="hc">
                    <div>{(e.main.temp - 273.15).toFixed(2)}°C</div>{" "}
                    <div>{e.weather[0].main}</div>
                    <div>
                      {e.dt_txt.slice(10, 16)}
                      {e.dt_txt.slice(10, 13) < 12 ? " AM" : "PM"}
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  ) : (
    <LoadingPage></LoadingPage>
  );
};
