import React from 'react'
import styled, { keyframes } from 'styled-components'


const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
`

const fade = keyframes`
    0% { opacity: 1 }
    50% { opacity: .5 }
    100% { opacity: 1 }
`

const Component = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0;

    & div {
        box-sizing: content-box;
        position: absolute;
        width: 20px;
        height: 80px;
        top: 60px;
        animation: ${fade} 1s cubic-bezier(0.5,0,0.5,1) infinite;
    }

    & div:nth-child(1) {
        transform: translate(30px,0);
        background: #85f5f5;
        animation-delay: -0.6s;
    }

    & div:nth-child(2) {
        transform: translate(70px,0);
        background: #94ebb5;
        animation-delay: -0.4s;
    }

    & div:nth-child(3) {
        transform: translate(110px,0);
        background: #f9da88;
        animation-delay: -0.2s;
    }

    & div:nth-child(4) {
        transform: translate(150px,0);
        background: #ffb38c;
        animation-delay: -1s;
    }
`

export default function Loader() {
    return (
        <Container>
            <Component>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </Component>
        </Container>
    )
}