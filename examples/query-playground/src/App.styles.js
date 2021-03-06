import css from 'styled-jsx/css'

export default css`
    .container {
        position: absolute;
        top: 48px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: stretch;
        font-size: 1rem;
    }

    .inner {
        display: flex;
        flex-direction: row;
        align-items: stretch;

        width: 100%;
        height: 100%;
    }
`
