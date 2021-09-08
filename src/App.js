import React from "react";
import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [rate, setRates] = useState([]);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("BMD");
  const [value, setValue] = useState(0);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((res) => {
        let data = [];
        Object.keys(res.rates).forEach((item) => {
          data.push({ key: item, value: res.rates[item] });
        });
        setRates(data);
      });
  }, []);
  let valueRate = (to / from) * value;
  const handleExchangeClick = () => {
    let temp = from;
    setFrom(to);
    setTo(temp);
    let tempCurr = fromCurr;
    setFromCurr(toCurr);
    setToCurr(tempCurr);
  };
  const setFromData = (curr, value) => {
    setFrom(value);
    setFromCurr(curr);
  };
  const setToData = (curr, value) => {
    setTo(value);
    setToCurr(curr);
  };
  return (
    <div className="container">
      <div className="App">
        <div className="input-num">
          <div className="header">Amount</div>
          <input
            className="input-amount"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="curr-label">{fromCurr}</span>
        </div>
        <div>
          <div className="header">From</div>
          <Datalist
            data={rate}
            selectedCurr={fromCurr}
            setData={(curr, value) => {
              setFromData(curr, value);
            }}
          />
        </div>
        <div className="exchange" onClick={handleExchangeClick}>
          <div>{"--->"}</div>
          <div>{"<---"}</div>
        </div>
        <div>
          <div className="header">To</div>
          <Datalist
            data={rate}
            selectedCurr={toCurr}
            setData={(curr, value) => {
              setToData(curr, value);
            }}
          />
        </div>
      </div>
      <div className="output label">
        {value} {fromCurr} =
      </div>
      <div className="output">
        {valueRate && valueRate.toFixed(2)} {toCurr}{" "}
      </div>
      <div className="output label1">
        {1} {fromCurr} = {(to / from).toFixed(5)}
      </div>
      <div className="output label1">
        {1} {toCurr} = {(from / to).toFixed(5)}
      </div>
    </div>
  );
}

function Datalist(props) {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState(props.selectedCurr);
  const [obj, setObj] = useState("x");
  useEffect(() => {
    setSelected(props.selectedCurr);
  }, [props.selectedCurr]);
  const [list, setList] = useState([]);
  const handleClick = () => {
    setList(props.data);
    setIsActive(!isActive);
  };
  const selectCountry = (data) => {
    props.setData(data.id, data.value);
    setSelected(data.id);
    setObj("x");
    setIsActive(!isActive);
  };
  const handleChange = (e) => {
    setList(props.data);
    let updatedList = props.data.filter((item) =>
      item.key.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setList([...updatedList]);
    setSelected(e.target.value);
  };
  const handleIndicator = () => {
    setSelected("");
    if (obj === "x") {
      setObj("v");
      setList(props.data);
      setIsActive(true);
    } else {
      setObj("x");
      setIsActive(false);
    }
  };

  return (
    <div>
      <div className="input-container">
        <input value={selected} onClick={handleClick} onChange={handleChange} />
        <span className="indicator" onClick={handleIndicator}>
          {obj}
        </span>
      </div>
      <div
        id="countries"
        className="datalist"
        onClick={(e) => selectCountry(e.target.dataset)}
      >
        {isActive &&
          list.length > 0 &&
          list.map((item) => {
            return (
              <div
                key={item.key}
                className="row"
                data-value={item.value}
                data-id={item.key}
                style={{ background: "#fff" }}
              >
                {item.key}
              </div>
            );
          })}
      </div>
    </div>
  );
}
