interface CarouselItemProps {
    image: string;
}

const CarouselItem = ({ image }: CarouselItemProps) => {
    return (
        <div className='flex justify-center items-center w-full'>
            <img
                className='w-full h-[400px] object-cover object-center'
                src={image}
                alt=""
            />
        </div>
    );
};

export default CarouselItem;


