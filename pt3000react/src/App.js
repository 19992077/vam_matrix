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
  display: flex;
  width: 50%;

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const VideoItem = () => {
  const componentRef = useRef()
  const { width, height } = useContainerDimensions(componentRef)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [videos, setVideos] = useState([])

  const onChangeHandler = event => {
    setSearchTerm(event.target.value)
    fetch("http://localhost:5000/search/youtube?search_term=" + searchTerm)
    .then(res => {
      res.json()
      .then(data => {
        console.log(data.videos)
        setVideos(data.videos)
      })
    })
  }

  const getVideoLink = (videoData) => {
    if (!videoData) return
    const youtubeEmbedUrl = "https://youtube.com/embed/" + videoData.id
    return youtubeEmbedUrl
  }

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(true)
    }
  }

  const menuStyle = {
    display: isMenuOpen ? "block" : "none"
  }

  return (
    <Item ref={componentRef}>
      <div style={{position: "absolute"}}>
        <button onClick={toggleMenu}>{isMenuOpen ? "X" : "+"}</button>

        <div style={menuStyle}>
          <input type="text" onChange={onChangeHandler} value={searchTerm} />
        </div>
      </div>

      {!videos ? "Loading..." : (
        <iframe 
          width={width}
          height={height}
          src={getVideoLink(videos[0])}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </Item>
  )

  // if (src && isEmbed) {
  //   return (
  //     <Item ref={componentRef}>
  //       <iframe 
  //         width={width}
  //         height={height}
  //         src={src.src}
  //         frameBorder="0"
  //         allow="autoplay; encrypted-media"
  //         allowFullScreen
  //       />
  //     </Item>
  //   )
  // }
}

const Search = (searchTerm) => {
  // const onChangeHandler = event => {
  //   setSearchTerm(event.target.value)
  //   fetch("http://localhost:5000/search/youtube?search_term=" + searchTerm + "?max_results=20", {
  //     method: "GET"
  //   })
  //   .then(res => {
  //     res.json()
  //       .then(data => {
  //         console.log(data.videos)
  //         setVideos(data.videos)
  //       })
  //   })
  // }

  const getSearchData = (searchTerm) => {
    fetch("http://localhost:5000/search/youtube?search_term=" + searchTerm + "?max_results=20")
      .then(res => res.json())
      .then(data => {
        console.log(data.videos)
      })
  }

  return (
    <div>
      <input type="text" value={searchTerm.searchTerm} placeholder="searchTerm" />
      <button onClick={getSearchData}>OK</button>
    </div>  
  )
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
        <VideoItem />
      </ItemSeparator>
    </AppContainer>
  )
}

export default App