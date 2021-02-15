import { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import useContainerDimensions from "../utils/useContainerDimensions"

const Item = styled.div`
    display: flex;
    width: 50%;

    & video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

// TODOS: get next video
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
    
    const showNextVideo = () => {
        console.log(videos)
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
                    <div><button onClick={showNextVideo}>NEXT</button></div>
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
}

export default VideoItem