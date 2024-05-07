import React, { useState, useEffect, useRef } from "react";
import './App.css';

const App = () => {
  const prevScrollTop = useRef(0);
  const [fastMove, setFastMove] = useState({
    x: 0, overflow: 'hidden', scale: 1.7
  })

  const [translate, setTranslate] = useState({
    box_1: {
      x: '70%',
      y: '0%',
      scale: 1,
      opacity: 1
    },
    box_2: {
      x: '-70%',
      y: '3%',
      scale: 2,
      opacity: 1
    },
    box_3: {
      x: 0,
      y: 0,
      scale: 1.2,
      opacity: 1
    },
    box_4: {
      x: '70%',
      y: '3%',
      scale: 2,
      opacity: 1
    },
    box_5: {
      x: '100%',
      y: 0,
      scale: 1,
      opacity: 0
    }
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const isScrollingDown = scrollTop > prevScrollTop.current;
    prevScrollTop.current = scrollTop;
    let fastBox = document.getElementsByClassName('box1')[0];
    let fastBoxPosition = fastBox.getBoundingClientRect().top;
    const maxScale = 1.7;
    const minScale = 1;

    // Calculate the scale proportionally based on the amount of scroll
    let scale = 1 + ((120 - fastBoxPosition) / 120) * 0.7; // Adjust the factor 0.7 to control the scaling rate

    // Ensure that the scale stays within the specified range
    scale = Math.max(minScale, Math.min(maxScale, scale));

    const fastBoxScrollDown = 120 > fastBoxPosition;
    if (fastBoxScrollDown) {
      // Decrease scale when scrolling down
      scale = Math.min(maxScale, scale - 0.2); // Adjust as needed
    } else {
      // Increase scale when scrolling up
      scale = Math.max(minScale, scale + 0.2); // Adjust as needed
    }

    if (fastBoxScrollDown) {
      setFastMove(prev => ({
        ...prev,
        overflow: 'auto',
        scale: scale
      }));
    }

    const transformations = {
      box_1: {
        scrollDown: { x: '107%', y: '0%', scale: 1, opacity: 1 },
        scrollUp: { x: '-70%', y: '0%', scale: 1, opacity: 0 }
      },
      box_2: {
        scrollDown: { x: '-107%', y: '0%', scale: 1 },
        scrollUp: { x: '-70%', y: '3%', scale: 2 }
      },
      box_3: {
        scrollDown: { x: 0, y: 0, scale: 1 },
        scrollUp: { x: 0, y: 0, scale: 1.2 }
      },
      box_4: {
        scrollDown: { x: '0%', y: '0%', scale: 1 },
        scrollUp: { x: '70%', y: '3%', scale: 2 }
      }
    };

    const newTransforms = {};

    Object.keys(transformations).forEach(boxKey => {
      const { x, y, scale, opacity } = transformations[boxKey][isScrollingDown ? 'scrollDown' : 'scrollUp'];
      newTransforms[boxKey] = { x, y, scale, opacity };
    });

    setTranslate(prev => ({
      ...prev,
      ...newTransforms
    }));
  };

  const handleLeft = () => {
    const currentX = parseInt(fastMove.x, 10);
    console.log(currentX + 100);
    if (currentX === 0) return;
    setFastMove(prev => ({
      ...prev,
      x: `${currentX + 100}`
    }));
  }

  const handleRight = () => {
    console.log(fastMove.x)
    if (parseInt(fastMove.x, 10) === -200) return
    setFastMove(prev => ({
      ...prev,
      x: `${prev.x - 100}`
    }));
  }

  return (
    <>
      <div className="title">
        <h1><span>The browser</span><br /><span>built to be yours</span></h1>
      </div>
      <div className="parent">
        <div className="container">
          <div className="box" style={{ transform: `translate(${translate.box_1.x}, ${translate.box_1.y}) scale(${translate.box_1.scale})`, opacity: translate.box_1.opacity }}>1</div>
          <div className="box" style={{ transform: `translate(${translate.box_2.x}, ${translate.box_2.y}) scale(${translate.box_2.scale})`, opacity: translate.box_2.opacity }}>2</div>
          <div className="box" style={{ transform: `translate(${translate.box_3.x}, ${translate.box_3.y}) scale(${translate.box_3.scale})`, opacity: translate.box_3.opacity }}>3</div>
          <div className="box" style={{ transform: `translate(${translate.box_4.x}, ${translate.box_4.y}) scale(${translate.box_4.scale})`, opacity: translate.box_4.opacity }}>4</div>
          {/* <div className="box" style={{ transform: `translate(${translate.box_5.x}, ${translate.box_5.y}) scale(${translate.box_3.scale})`, opacity: translate.box_3.opacity }}>5</div> */}
        </div>
      </div>
      <div style={{ height: '200px' }}></div>
      <div className="fast" style={{ position: "relative", overflowX: `${fastMove.overflow}` }}>
        <div className="box1" style={{ transform: `translate(${fastMove.x + 40}%, ${fastMove.x + 40}%) scale(${fastMove.scale})` }}>1</div>
        <div className="box1" style={{ position: "absolute", left: "100%", transform: `translateX(${fastMove.x}%)` }}>2</div>
        <div className="box1" style={{ position: "absolute", left: "160%", transform: `translateX(${fastMove.x}%)` }}>3</div>
      </div>

      <div style={{ padding: '50px 70px' }}>
        <button onClick={handleLeft}>&lt;</button>
        <button onClick={handleRight} style={{ marginLeft: '20px' }}>&gt;</button>
      </div>
      <div style={{ height: '200px' }}></div>
    </>
  );
};

export default App;
