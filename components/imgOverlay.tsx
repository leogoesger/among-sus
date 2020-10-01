import "../styles/Home.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { IFeature } from '../pages';
import CanvasDraw from "react-canvas-draw";


interface IProps {
    imgUrl: string;
    features: IFeature[];
    showCanvas?: boolean;
}
export const useOverlay = ({ imgUrl, features, showCanvas }: IProps) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<any>(null);
    const [imgInfo, setImgInfo] = useState<DOMRect>();
    const [xScale, setXScale] = useState(1);
    const [yScale, setYScale] = useState(1);
    const [mousePixelPosition, setMousePixelPos] = useState({ x: 0, y: 0 });
    const [hoverFeature, setHoverFeature] = useState<IFeature | undefined>();
    const [clickFeature, setClickFeature] = useState<IFeature | undefined>();
    const [brushColor, setBrushColor] = useState("#0a0302");

    const init = () => {
        if (imgRef.current) {
            const _imgInfo = imgRef.current?.getBoundingClientRect();
            const _xScale = _imgInfo.width / imgRef.current.naturalWidth;
            const _yScale = _imgInfo.height / imgRef.current.naturalHeight;
            setImgInfo(_imgInfo);
            setXScale(_xScale);
            setYScale(_yScale);

            imgRef.current?.addEventListener("mousemove", (e) => setMousePixelPos({ x: e.offsetX / _xScale, y: e.offsetY / _yScale }));
        }
    };
    useEffect(() => {
        init();
        window.addEventListener('resize', init);
        return () => {
            imgRef.current?.removeEventListener("mousemove", () => null);
        };
    }, [imgRef.current]);

    const component = (
        <div style={{ position: "relative" }}>
            <img ref={imgRef} src={imgUrl} alt="" style={{ width: "100%" }} />
            {showCanvas && <CanvasDraw
                brushColor={brushColor}
                hideGrid
                lazyRadius={0}
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "unset",
                }}
            />}
            {features.map((f, idx) => {
                return <Fragment key={idx}>
                    {f.label && hoverFeature?.id === f.id &&
                        <div style={{
                            position: "absolute",
                            zIndex: 101,
                            left: f.type !== "circ" ? xScale * f.x - 10 : xScale * (f.x - f.width / 2) - 10,
                            top: f.type !== "circ" ? yScale * f.y - 24 : yScale * (f.y - f.height / 2) - 24,
                            borderRadius: "10px", backgroundColor: "white", fontFamily: "sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", padding: "3px 10px",
                            ...f.labelStyle
                        }}>{f.label}</div>}
                    <div
                        onMouseEnter={() => setHoverFeature(f)}
                        onMouseLeave={() => setHoverFeature(undefined)}
                        onClick={() => {
                            setHoverFeature(undefined);
                            setClickFeature(f);
                        }}
                        style={
                            f.type !== "circ" ?
                                {
                                    position: "absolute",
                                    width: f.width * xScale,
                                    height: f.height * yScale,
                                    left: xScale * f.x,
                                    top: yScale * f.y,
                                    zIndex: 100,
                                    ...f.style,
                                    ...hoverFeature?.id === f.id && f.hoverStyle
                                } : {
                                    position: "absolute",
                                    borderRadius: "50%",
                                    width: f.width * xScale,
                                    height: f.height * yScale,
                                    zIndex: 100,
                                    left: xScale * (f.x - f.width / 2),
                                    top: yScale * (f.y - f.height / 2),
                                    ...f.style,
                                    ...hoverFeature?.id === f.id && f.hoverStyle
                                }}
                    /></Fragment>;
            })}
        </div>);

    return {
        component,
        imgInfo,
        mousePixelPosition,
        clickFeature,
        hoverFeature,
        setBrushColor,
        canvasUndo: canvasRef?.current?.undo,
        canvasClear: canvasRef?.current?.clear,
        removeClickFeature: () => setClickFeature(undefined)
    };
};
