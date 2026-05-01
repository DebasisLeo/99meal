import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import '@smastrom/react-rating/style.css'

import { Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { Rating } from "@smastrom/react-rating";

const Testimonial = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/reviews') // backend API URL
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <section className="my-20">
            <SectionTitle subHeading="What Our Client Say" heading="Testimonials" />

            <Swiper
                navigation={true} modules={[Navigation]} className="mySwiper"
            >
                {reviews.map(review => (
                    <SwiperSlide key={review.id}>
                        <div className="flex flex-col items-center px-4 py-8 md:mx-8">
                            <Rating style={{ maxWidth: 180 }} value={review.rating} readOnly />
                            <p className="py-4 text-center">{review.details}</p>
                            <h3 className="text-2xl text-orange-400 mt-2">{review.name}</h3>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonial;
