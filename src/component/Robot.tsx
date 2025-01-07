import { Box, Button, Container, TextField } from "@mui/material";
import { useRef, useState } from "react";
import "./Robot.css";

function RobotPage() {
  const commandRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<number[][]>([]);
  const [newGrid, setNewGrid] = useState<number[][]>([]);

  const checkInput = () => {
    const commands = commandRef.current?.value || "";
    if (commands !== "") {
      CalculateClick(commands);
    } else {
      setCurrent([]);
      setNewGrid([]);
    }
  };

  const CalculateClick = (commands: string) => {
    let turn = 0; //หัว Robot
    const path: number[][] = [[0, 0]]; //เก็บการเดินตั้งแต่ต้นจนจบ
    const currentPosition: number[][] = [[0, 0]]; //เก็บตำแหน่งปัจจุบัน
    const turnPattern: [number, number][] = [[0, 1],[-1, 0],[0, -1],[1, 0],]; //การเดินตามแนวแกน X,Y
    const walkingLine: [number, number][] = [[-1, 0],[0, -1],[1, 0],[0, 1],]; //การเดินตามทิศทาง

    for (const com of commands) {
      const position = path[path.length - 1];
      const position_cur = currentPosition[currentPosition.length - 1];

      if (com === "L" || com === "l") {
        turn = (turn + 1) % 4;
      } else if (com === "R" || com === "r") {
        turn = (turn - 1 + 4) % 4;
      } else if (com === "W" || com === "w") {
        path.push([position[0] + walkingLine[turn][0], position[1] + walkingLine[turn][1]]);
        currentPosition.push([position_cur[0] + turnPattern[turn][0], position_cur[1] + turnPattern[turn][1]]); 
      }else{continue;}
    }

    // console.log(currentPosition);
    setCurrent(currentPosition);

    const box = calculateBox(path);
    const centerIndex = Math.floor(box / 2);

    const grid = Array.from({ length: box }, () => Array(box).fill(0));
    path.forEach(([x, y], index) => {
      const gridX = x + centerIndex;
      const gridY = y + centerIndex;
      if (index === path.length - 1) {
        grid[gridX][gridY] = 3;
      } else {
        grid[gridX][gridY] = 1;
      }
    });
    grid[centerIndex][centerIndex] = 2;

    // console.log(grid);
    setNewGrid(grid);
  };

  const calculateBox = (distance: number[][]) => Math.max(...distance.flat().map(Math.abs)) * 2 + 1;

  const CalculateBoxSize = () => {
    const size = newGrid.length;
    if (size > 10) {
      const calculatedSize = 35 - (size - 5);
      return `${calculatedSize < 15 ? 15 : calculatedSize}px`;
    } else {
      return "40px";
    }
  };

  return (
    <Container>
      <Box className="container-center">
        <Box className="container-input">
          <Box className="Box-input">
            <span>Robot Walk</span>
            <Box className="box-command">
              <span>&nbsp;คำสั่ง Robot Walk</span>
            </Box>
            <Box sx={{ width: 450 }}>
              <TextField
                className="TextField-input"
                fullWidth
                id="fullWidth"
                inputRef={commandRef}
              />
            </Box>
            <Box className="box-button">
              <Button
                  sx={{bgcolor: "#97B3C7",
                  color: "black",
                  mt: 4, width: 125,
                  height: 50,
                  borderRadius: "15px",
                  "&:hover": { bgcolor: "#6C93B0" },
                }}
                onClick={checkInput}
              >
                <span className="prompt-extralight">คำนวณ</span>
              </Button>
            </Box>
          </Box>
          <hr className="responsive-hr" />
        </Box>
        <Box className="box-grid">
          {current.length <= 0 ? null : (
            <Box sx={{ mb: 2 }}>
              <span>ตำแหน่งปัจจุบัน ( {current[current.length - 1][0]} , {current[current.length - 1][1]} )</span>
            </Box>
          )}
          <Box>
            {newGrid.map((row, rowIndex) => (
              <Box key={rowIndex} style={{ display: "flex" }}>
                {row.map((cell, cellIndex) => {
                  return (
                    <Box
                      key={cellIndex}
                      style={{
                        width: CalculateBoxSize(),
                        height: CalculateBoxSize(),
                        border: "1px solid lightgray",
                        backgroundColor: cell === 1 ? "#C4C4C4" : cell === 2 ? "#8AAF73" : cell === 3 ? "#CB8A8A" : "white",}}
                    ></Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default RobotPage;
