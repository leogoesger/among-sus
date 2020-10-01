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
        <DialogContent>
          Please let other players know you are using this tool, so it is FAIR for everyone!
          <h4 style={{ marginBottom: 0 }}>Tips:</h4>
          <ul style={{ margin: 0 }}>
            <li>Click on an Android to mark on the map with Pencil</li>
            <li>Some Android might not be in the game, you can see which one isn't by going to the COLOR customization IN THE GAME.</li>
            <li>Click on DEAD will shuffle the android to the bottom</li>
          </ul>
          <h4 style={{ marginBottom: 0 }}>Needed:</h4>
          <ul style={{ margin: 0 }}>
            <li>This base map isn't great! If you have a better one, find my info below.</li>
            <li>Annotation for all the tasks</li>
            <li>Other maps</li>
          </ul>
        </DialogContent>
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



interface IProps {
  currentRound: number;
  colors: string[];
  setColors: any;
}

const Game = ({ currentRound, colors, setColors }: IProps) => {
  const { component, setBrushColor, canvasUndo, canvasClear, clickFeature, removeClickFeature } =
    useOverlay({
      imgUrl: "/assests/skeld.png",
      features: polusFeatures,
      showCanvas: true
    });

  return (
    <>
      <Dialog open={!!clickFeature} onClick={removeClickFeature}>
        <DialogContent>
          {clickFeature && JSON.stringify(clickFeature)}
        </DialogContent>
      </Dialog>
      <div style={{ display: "flex", justifyContent: "space-between", maxHeight: 1000 }}>
        <section style={{ backgroundColor: "royalblue", width: "79%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ marginLeft: "5%" }}>Round {currentRound + 1}</h1>
            <div style={{ display: "flex", marginRight: 10 }}>
              <button onClick={canvasUndo} style={{ height: 40, width: 100 }}>Undo</button>
              <button onClick={canvasClear} style={{ height: 40, width: 100 }}>Clear Map</button>
            </div>
          </div>

          <div style={{ width: "100%" }}>
            {component}
          </div>
        </section>

        <section style={{ width: "20%", display: "flex", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "lightgray" }}>


          </div>
          {colors.map(c => <Android key={c} color={c}
            setBrushColor={() => setBrushColor(c)}
            remove={() => setColors(colors.filter(_c => _c !== c))}
            markDead={() => setColors(colors.slice(0).sort((_, b) => b === c ? -1 : 1))} />)}
        </section>
      </div>
    </>
  );
};

interface IAndroidProps {
  color: string; remove: () => void; markDead: () => void; setBrushColor: () => void;
}

const Android = ({ color, remove, markDead, setBrushColor }: IAndroidProps) => {
  const [isSus, setIsSus] = useState<boolean>(false);
  const [isDead, setIsDead] = useState<boolean>(false);

  return (
    <div style={{ width: "48%", position: "relative", margin: "0 auto", maxHeight: 160 }}>
      <img src={`/assests/${color}.png`} alt={color} style={{ width: "70%", height: "100%", cursor: "pointer" }} onClick={setBrushColor} />
      <button onClick={remove} style={{ position: "absolute", right: 0, top: 0, cursor: "pointer", }}>X</button>
      <button style={{
        minWidth: "60%",
        position: "absolute",
        bottom: "26%",
        right: 0,
        maxHeight: 100,
        height: "24%",
        border: "none",
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
        backgroundColor: isSus ? "red" : "grey"
      }} onClick={() => setIsSus(!isSus)}>SUS</button>
      <button style={{
        minWidth: "60%",
        position: "absolute",
        bottom: "0%",
        right: 0,
        maxHeight: 100,
        height: "24%",
        border: "none",
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
        backgroundColor: isDead ? "black" : "grey"
      }} onClick={() => {
        setIsDead(!isDead);
        markDead();
      }}>DEAD</button>
    </div>);
};