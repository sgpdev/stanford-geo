import React from "react";
import namor from "namor";
import "./Utils.css";
// import stanford-sgp from "./../images/Stanford-sgp.png"

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    original_num: namor.generate({ words: 1, numbers: 0 }),
    analyte_code: namor.generate({ words: 1, numbers: 0 }),
    sample_id: Math.floor(Math.random() * 10000),
    analyte_det_id: Math.floor(Math.random() * 100),
    abundance: Math.floor(Math.random() * 1000),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33
        ? "complicated"
        : "single"
  };
};

export function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}

export const Logo = () => (
  <div
    style={{
      margin: "1rem auto",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <img
      src={require("./../images/Stanford-sgp.png")}
      style={{ width: `150px`, margin: ".5em auto .3em" }}
    />
  </div>
);

export const Tips = () => (
  <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
  </div>
);
