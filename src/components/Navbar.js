import styled from "styled-components"

const Root = styled.div`
    display: flex;
`

const Link = styled.a`
`

const Navbar = () => {
    return (
        <Root>
            <Link>GridViewer</Link>
        </Root>
    )
}

export default Navbar