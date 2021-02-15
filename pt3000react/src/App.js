import { useEffect, useState, useRef } from "react"

import styled from "styled-components"

const useContainerDimensions = myRef => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};

const ItemSeparator = styled.div`
  display: flex;
  width: 100%;
  height: 50vh;
`

const Item = styled.div`
  width: 50%;

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const VideoItem = (src, isEmbed) => {
  const componentRef = useRef()
  const { width, height } = useContainerDimensions(componentRef)

  if (isEmbed) {
    return (
      <Item ref={componentRef}>
        <iframe 
          width={width}
          height={height}
          src={src.src}
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </Item>
    )
  } else {
    return (
      <Item>
        <video controls>
          <source src={src.src} type="video/mp4"></source>
        </video>
      </Item>
    )
  }
}

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

const App = () => {
  return (
    <AppContainer>
      <ItemSeparator>
        <VideoItem isEmbed={true} src="https://youtube.com/embed/KG3Y2B6BCwM" />
        <VideoItem isEmbed={true} src="https://youtube.com/embed/KG3Y2B6BCwM" />
      </ItemSeparator>
      <ItemSeparator>
        <VideoItem isEmbed={true} src="https://youtube.com/embed/KG3Y2B6BCwM" />
        <VideoItem isEmbed={true} src="https://youtube.com/embed/KG3Y2B6BCwM" />
      </ItemSeparator>
    </AppContainer>
  )
}

export default App