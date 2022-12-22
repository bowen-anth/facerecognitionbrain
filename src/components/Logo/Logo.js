import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt>
                <div style={{ height: '170px', width: '150px', backgroundColor: 'darkgreen' }}>
                    <img style={{paddingTop: '5px'}} src={brain} alt='logo' />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;