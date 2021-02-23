import styled from "styled-components"
import VideoItem from "./components/VideoItem"

const AppContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  flex-direction: column;
`

const ItemSeparator = styled.div`
    display: flex;
    width: 100%;
    height: 50vh;
`

const App = () => {
  return (
    <AppContainer>
      <ItemSeparator>
        <VideoItem />
        <VideoItem />
      </ItemSeparator>
      <ItemSeparator>
        <VideoItem />
        <VideoItem />
      </ItemSeparator>
    </AppContainer>
  )
}

export default App