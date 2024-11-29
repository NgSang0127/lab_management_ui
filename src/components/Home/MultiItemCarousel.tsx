import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselItem from "./CarouselItem.tsx";
import Slider from "react-slick";
import {topEvents} from "./topEvent.ts";
import './Slick.css';

const MultiItemCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true
    };

    return (
        <div className="">
            <Slider {...settings}>
                {topEvents.map((item, index) => (
                    <CarouselItem key={index} image={item.image} />
                ))}
            </Slider>
        </div>
    );
};

export default MultiItemCarousel;



