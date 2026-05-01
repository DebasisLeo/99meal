import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SectionTitle from '../../../Components/SectionTitle/SectionTitle';

const Category = () => {
    return (
        <section>
            <SectionTitle subHeading={"From 11am To 10pm"} heading={"Order Online"}></SectionTitle>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="mt-30 mb-40"
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                    1280: { slidesPerView: 4, spaceBetween: 20 },
                }}
            >
                <SwiperSlide>
                    <div className="relative">
                        <img src="/banners/slide3.jpg" alt="Dessert" className="w-full h-auto" />
                        <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl opacity-70 text-white font-bold uppercase drop-shadow-lg">
                            Dessert
                        </h3>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative">
                        <img src="/banners/slide1.jpg" alt="Salad" className="w-full h-auto" />
                        <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl opacity-70 text-white font-bold uppercase drop-shadow-lg">
                            Salad
                        </h3>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative">
                        <img src="/banners/slide2.jpg" alt="Pizza" className="w-full h-auto" />
                        <h3 className="absolute bottom-4 opacity-70 left-1/2 -translate-x-1/2 text-3xl text-white font-bold uppercase drop-shadow-lg">
                            Pizza
                        </h3>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative">
                        <img src="/banners/slide4.jpg" alt="Dessert" className="w-full h-auto" />
                        <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl opacity-70 text-white font-bold uppercase drop-shadow-lg">
                            Dessert
                        </h3>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative">
                        <img src="/banners/slide5.jpg" alt="Salad" className="w-full h-auto" />
                        <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl opacity-70 text-white font-bold uppercase drop-shadow-lg">
                            Salad
                        </h3>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default Category;
