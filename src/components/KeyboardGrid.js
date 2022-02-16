function KeyboardGrid(props) {
    return (
        <div key='keyboardGrid' className='grid'>
            <KeyboardRows keyboard={props.keyboard} onKeyPress={props.onKeyPress} />
        </div>
    )
}

function KeyboardRows(props) {
    return props.keyboard.map((keyboardRow, index) => {
        return (
            <div key={index} className='row'>
                <KeyboardButtons keys={keyboardRow} onKeyPress={props.onKeyPress} />
            </div>
        )
    });
}

function KeyboardButtons(props) {
    function handleButtonClick(e) {
        props.onKeyPress(e.target.value);
    }

    return props.keys.map((key) =>
        <button key={key.letter} id={key.colour} value={key.letter} className='keyboardButton' onClick={handleButtonClick}>
            {key.letter}
        </button>
    )
}

export { KeyboardGrid };