import "../styles/Home.module.css";
import { useOverlay } from '../components';
import { CSSProperties, useState, useEffect } from 'react';
import { polusFeatures } from "../static/polus-features";
import { Divider, Dialog, DialogContent, DialogActions, Button } from "@material-ui/core";
import { MdArrowDropDown } from "react-icons/md";

export interface BaseFeature {
  type?: "rect" | "circ";
  id: number | string;
  x: number;
  y: number;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
  label?: string;
  labelStyle?: CSSProperties;
  width: number;
  height: number;
}

export type IFeature = BaseFeature;

const COLORS = [
  "red",
  "lime",
  "green",
  "blue",
  "cyan",
  "brown",
  "purple",
  "hotpink",
  "black",
  "white",
  "yellow",
  "orange"
];
export default function Home() {
  const [totalRounds, setTotalRounds] = useState([0]);
  const [currentRound, setCurrentRound] = useState(0);
  const [colors, setColors] = useState(COLORS);
  const [warningDialog, setWarningDialog] = useState(false);


  const reset = () => {
    setColors(COLORS);
    setCurrentRound(0);
    setTotalRounds([0]);
  };

  useEffect(() => {
    setTimeout(() => setWarningDialog(true), 1000);
  }, []);

  return (
    <>
      <Dialog open={warningDialog}>
        <DialogContent>Please let other players know you are using this tool, so it is fair for everyone!</DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningDialog(false)} variant="contained" color="secondary" size="small">Got It!</Button>
        </DialogActions>
      </Dialog>
      <div style={{ maxHeight: 1100, overflow: "hidden" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            {totalRounds.map(g => <button style={{ marginRight: 6, height: 40 }} key={g} onClick={() => setCurrentRound(g)}>Round {g + 1}</button>)}
            <button onClick={() => {
              setTotalRounds([...totalRounds, totalRounds[totalRounds.length - 1] + 1]);
              setCurrentRound(totalRounds.length);
            }} style={{ display: totalRounds.length > 10 ? "none" : "unset", height: 40, width: 40 }}>+</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", color: "red", fontSize: 26, fontWeight: "bold" }}>
            Among-Sus:<button onClick={reset} style={{ height: 40, border: "none", cursor: "pointer", color: "grey", fontSize: 26, backgroundColor: "unset", display: "flex", alignItems: "center" }} disabled> The Skeld <MdArrowDropDown /></button>
          </div>
          <button onClick={reset} style={{ width: "10%", height: 40 }}>New Game </button>
        </header>
        <Divider style={{ marginBottom: 20 }} />

        {totalRounds.slice().sort((_, b) => b === currentRound ? 1 : -1).map(g => <div key={g} style={{ visibility: g === currentRound ? "unset" : "hidden" }}>
          <Game currentRound={currentRound} colors={colors} setColors={setColors} />
          <footer>
            Created by Leo :) <a href="https://github.com/leogoesger">Github</a> / <a href="https://twitter.com/leog0esger">Twitter</a>. Contact me via Twitter😋
        </footer>
        </div>)}
      </div>
    </>
  );
}


enum StatusEnum {
  UNKNOWN = 1,
  SUS,
  SAFE,
  DEAD
}

const StatusEnumColor = ["", "grey", "red", "green", "black"];

interface IProps {
  currentRound: number;
  colors: string[];
  setColors: any;
}

const Game = ({ currentRound, colors, setColors }: IProps) => {
  const { component, setBrushColor, canvasUndo, canvasClear } =
    useOverlay({
      imgUrl: "/assests/polus.png",
      features: polusFeatures,
      showCanvas: true
    });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <section style={{ backgroundColor: "royalblue", width: "79%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ marginLeft: "5%" }}>Round {currentRound + 1}</h1>
          <div style={{ display: "flex" }}>
            <button onClick={canvasUndo} style={{ height: 40, width: 100 }}>Undo</button>
            <button onClick={canvasClear} style={{ height: 40, width: 100 }}>Clear Map</button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: 10 }}>
              <span style={{ color: "white" }}>Pick a color to mark the map</span>
              <div style={{ display: "flex" }}>
                {colors.map(c => <button key={c} onClick={() => setBrushColor(c)}
                  style={{
                    backgroundColor: c,
                    cursor: "pointer",
                    marginLeft: 4,
                    border: "none",
                    borderRadius: "50%", width: 30, height: 30
                  }} />)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          {component}
        </div>
      </section>

      <section style={{ width: "20%", display: "flex", flexWrap: "wrap" }}>
        {colors.map(c => <Android key={c} color={c} remove={() => setColors(colors.filter(_c => _c !== c))} />)}
      </section>
    </div>
  );
};

const Android = ({ color, remove }: { color: string, remove: () => void }) => {
  const [status, setStatus] = useState<StatusEnum>(1);

  return (
    <div style={{ width: "48%", position: "relative", margin: "0 auto", maxHeight: 160 }}>
      <img src={`/assests/${color}.png`} alt={color} style={{ width: "70%" }} />
      <button onClick={remove} style={{ position: "absolute", right: 0, top: 0, cursor: "pointer", }}>X</button>
      <button style={{
        minWidth: "60%",
        position: "absolute",
        bottom: "20%",
        right: 0,
        height: "24%",
        border: "none",
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
        backgroundColor: StatusEnumColor[status]
      }} onClick={() => { status !== 4 ? setStatus(status + 1) : setStatus(1); }}>{StatusEnum[status]}</button>
    </div>);
};