import React, { useState, useEffect, useRef } from 'react';
import { State } from "../variables"
import './Game.css';

const generateApples = () => {
    const apples = [];
    for (let row = 0; row < 10; row++) {
        const currentRow = [];
        for (let col = 0; col < 17; col++) {
            currentRow.push([Math.floor(Math.random() * 9) + 1, 0]);
        }
        apples.push(currentRow);
    }
    return apples;
};

function useWindowSize() {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

const Game = ({ changeState, setTotalScore, setHighScore, high_score }) => {
    const [apples, setApples] = useState(generateApples());

    const [timeLeft, setTimeLeft] = useState(10);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [score, setScore] = useState(0);
    const [dragOverlay, setDragOverlay] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const mainScreenRef = useRef(null);
    const size = useWindowSize();

    useEffect(() => {
        if (timeLeft == 0) {
            setTotalScore(score)
            if (score > high_score) {
                setHighScore(score)
            }
            changeState(State.MAIN)
        }
        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleMouseDown = (e) => {
        const rect = mainScreenRef.current.getBoundingClientRect();
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setDragEnd({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e) => {
        if (dragStart) {
            const rect = mainScreenRef.current.getBoundingClientRect();
            setDragEnd({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 17; col++) {
                if (apples[row][col][1] === 1) {
                    apples[row][col][1] = 0
                }
            }
        }
        setApples(apples)
    };

    const handleMouseUp = () => {
        setDragStart(null);
        setDragEnd(null);
        setDragOverlay({ left: 0, top: 0, width: 0, height: 0 });
        let sum = 0;
        let count = 0;
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 17; col++) {
                if (apples[row][col][1] === 1) {
                    sum += apples[row][col][0]
                    count++
                }
            }
        }
        if (sum == 10) {
            setScore((now) => now + count)
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 17; col++) {
                    if (apples[row][col][1] === 1) {
                        apples[row][col][1] = 2
                    }
                }
            }
        } else {
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 17; col++) {
                    if (apples[row][col][1] === 1) {
                        apples[row][col][1] = 0
                    }
                }
            }
        }

        setApples(apples)
        // Add logic to process selected apples
    };

    useEffect(() => {
        const handleMouseUpWindow = () => {
            if (dragStart) { // Only run the logic if a drag had started within your component
                handleMouseUp(); // Call your existing handleMouseUp function
            }
        };

        // Attach the mouseup event to the window
        window.addEventListener('mouseup', handleMouseUpWindow);

        // Cleanup the event listener when the component unmounts or the dependencies change
        return () => {
            window.removeEventListener('mouseup', handleMouseUpWindow);
        };
    }, [dragStart]); // Depend on dragStart to ensure the cleanup and setup of listeners happens correctly

    const renderDragOverlay = () => {
        if (!dragStart || !dragEnd) return null;
        let left = Math.min(dragStart.x, dragEnd.x);
        let top = Math.min(dragStart.y, dragEnd.y);
        const width = Math.abs(dragStart.x - dragEnd.x);
        const height = Math.abs(dragStart.y - dragEnd.y);
        let len = 35
        const col = Math.floor(left / len + 1 / 2);
        const row = Math.floor(top / len - 1 / 2);

        for (let i = 0; i < Math.min(17 - col, (left + width) / len - col); i++) {
            for (let j = 0; j < Math.min(10 - row, (top + height) / len - row - 1); j++) {
                if (apples[row + j][col + i][1] != 2) {
                    apples[row + j][col + i][1] = 1;
                }
            }
        }
        setApples(apples)

        left += size.width / 2 - 290;
        top += 80;
        setDragOverlay({ left, width, top, height })
    }

    useEffect(() => {
        renderDragOverlay();
    }, [dragStart, dragEnd])

    return (
        <div className="main">
            <div className='mainScreen'>
                <div className="game-container" ref={mainScreenRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}>
                    <div className="drag-overlay" style={{ left: dragOverlay.left, top: dragOverlay.top, width: dragOverlay.width, height: dragOverlay.height }} />
                    <div className="score-container"> score : {score}</div>
                    {apples.map((row, rowIndex) => (
                        <div key={rowIndex} className="apple_row">
                            {row.map((apple, colIndex) => (
                                <div key={colIndex} className={`apple ${apple[1] === 1 ? 'special' : ''} ${apple[1] === 2 ? 'gone' : ''}`}>
                                    {apple[0]}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="time-bar-container">
                        <div className="time-bar" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
