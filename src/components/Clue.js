function Clue(props) {
    if (props.clueVisible) {
        return (
            <div key='clue'>
                {props.clue}
            </div>
        );
    } else {
        return (
            <div key='clue' className='clue'>
                <ClueButton onButtonClick={props.onButtonClick} />
            </div>
        )
    }
}

function ClueButton(props) {
    function handleButtonClick(e) {
        props.onButtonClick(e.target.value);
    }

    return (
        <button onClick={handleButtonClick}>
            Click me for clue!
        </button>
    )
}

export { Clue };