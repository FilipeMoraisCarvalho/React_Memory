import {useEffect, useState} from 'react';
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import { GridItem } from './components/GridItem';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';
import {GridItemType} from "./types/GridItemType"
import * as C from "./App.styles";
import RestartIcon from "./svgs/restart.svg"


const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(()=>{
    const timer = setInterval(()=>{
      if(playing)setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(()=>{
    if(shownCount === 2){
      const oponed = gridItems.filter(item => item.shown === true);
      if(oponed.length === 2){
       
        if(oponed[0].item === oponed[1].item){
          const tmpGrid = [...gridItems];
          for(const i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].shown = false;
              tmpGrid[i].permanentShown = true;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
          setMoveCount(moveCount + 1);
        }else{
          setTimeout(()=>{
            const tmpGrid = [...gridItems];
            for(const i in tmpGrid){
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
            setMoveCount(moveCount + 1);
          }, 1000);
        }
      }
    }
  },[shownCount, gridItems, moveCount]);

  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }
  },[gridItems, moveCount]);

  const resetAndCreateGrid = () => {
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    const tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++){
      tmpGrid.push({
      item: null, shown: false, permanentShown: false
    });
    }

    for(let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }
    setGridItems(tmpGrid);
    setPlaying(true);
  }
  

  const handleItemClick = (index:number) => {
    if(playing && index !== null && shownCount < 2 ){
      const tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }
  }


  return(
    <C.Container>
        <C.Info>
        <C.LogoLink href='logo'>
          <img src='' width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label="Movimentos" value={moveCount.toString()}/>
        </C.InfoArea>

        <Button label= "Reiniciar" icon={RestartIcon} onClick= {resetAndCreateGrid}/>

      </C.Info>

      <C.GridArea>
        <C.Grid>
            {gridItems.map((item, index) => (
              <GridItem
                key={index}
                item={item}
                onClick={() => handleItemClick(index)}
              />
            ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}


export default App;