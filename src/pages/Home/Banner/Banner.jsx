import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';



const Banner = () => {
    return (
        <div className='mb-40'>
            <AwesomeSlider animation="cubeAnimation">
                <div data-src="../../../../public/banners/04.jpg" />
                <div data-src="../../../../public/banners/02.jpg" />
                <div data-src="../../../../public/banners/05.png" />
                <div data-src="../../../../public/banners/01.jpg" />
                <div data-src="../../../../public/banners/03.png" />
                <div data-src="../../../../public/banners/06.png" />
                
            </AwesomeSlider>
        </div>
    );
};

export default Banner;