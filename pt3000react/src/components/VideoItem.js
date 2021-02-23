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

const VideoItem = () => {
    const componentRef = useRef()
    const { width, height } = useContainerDimensions(componentRef)
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [videos, setVideos] = useState([])
    const [videoChange, setVideoChange] = useState(false)

    // TODO: make fake dropdown with css and state tricks
    const [platform, setPlatform] = useState("youtube")
    
    const onChangeHandler = event => {
        setSearchTerm(event.target.value)
        if (platform == "youtube") {
            fetch("http://localhost:5000/search/youtube?search_term=" + searchTerm)
            .then(res => {
                res.json()
                .then(data => {
                    console.log(data.videos)
                    setVideos(data.videos)
                })
            })
        }
    }

    useEffect(() => {
        if (videoChange) {
            if (videos[0]) {
                setVideoChange(false)
            }
        }
    })
    
    const getVideoLink = (videoData) => {
        if (!videoData) return
        const youtubeEmbedUrl = "https://youtube.com/embed/" + videoData.id
        return youtubeEmbedUrl
    }
    
    const showNextVideo = () => {
        console.log(videos)
        setVideoChange(true)
        videos.splice(0, 1)
    }

    const saveVideo = (videoData) => {
        if (!videoData) return
        console.log(videoData)
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
                    {videos[0] ? (
                        <div>
                            <button onClick={showNextVideo}>NEXT</button>
                            {/* <button onClick={saveVideo(videos[0])}>SAVE</button> */}
                        </div>
                    ) : null}
                </div>
            </div>
        
        {videoChange ? (
            <div>Loading...</div>
        ) : (
            <iframe
                width={width}
                height={height}
                src={getVideoLink(videos[0])}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
            />
        )}
        </Item>
    )
}

export default VideoItem