function LetterGrid(props) {
    return (
        <div key='letterGrid' className='grid'>
            <LetterRows letterGrid={props.letterGrid} />
        </div>
    );

}

function LetterRows(props) {
    return props.letterGrid.map((letterRow, index) => {
        return (
            <div key={index} className='row'>
                <Letters letters={letterRow} />
            </div>
        )
    });
}

function Letters(props) {
    return props.letters.map((letter) =>
        <div key={letter.key} id={letter.colour} className='letter'>
            {letter.letter}
        </div>
    )
}

export { LetterGrid };