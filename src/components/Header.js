import React from 'react';

export const Header = ({ handleSave, handleReset}) => {

    // reset button to remove the saved changes from localstorage (cleanup)
    return (
        <>
            <div className='header'>
                <button className='reset-button button' onClick={handleReset}>Reset</button>
                <button className='save-button button' onClick={handleSave}>Save changes</button>
            </div>
        </>
    )
}
