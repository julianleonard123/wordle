function NewWordButton(props) {
  function handleButtonClick(e) {
    props.onButtonClick(e.target.value);
  }

  return (
    <div className='newWordButton'>
      <button onClick={handleButtonClick}>
        New word please!
      </button>
    </div>
  )
}

export { NewWordButton };