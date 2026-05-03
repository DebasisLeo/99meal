import React, { useEffect } from 'react';
import useMenu from '../../../hooks/useMenu';
import Cover from '../../Shared/Cover/Cover';
import MenuCategory from '../MenuCategory/MenuCategory';

import menuImg from '../../../assets/menu/menu-bg.jpg';
import soupImg from '../../../assets/menu/soup-bg.jpg';
import saladImg from '../../../assets/menu/salad-bg.jpg';
import pizzaImg from '../../../assets/menu/pizza-bg.jpg';
import dessertImg from '../../../assets/menu/dessert-bg.jpeg';

import SectionTitle from '../../../Components/SectionTitle/SectionTitle';
import { FaPizzaSlice, FaHamburger, FaIceCream, FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Menu = () => {
    useEffect(() => {
        document.title = "Rassporium | Menu";
    }, []);

    const [menu] = useMenu();

    // OLD
    const desserts = menu.filter(item => item.category === 'dessert');
    const soups = menu.filter(item => item.category === 'soups'); // FIXED
    const salad = menu.filter(item => item.category === 'salad');
    const pizza = menu.filter(item => item.category === 'pizza');
    const offered = menu.filter(item => item.category === 'offered');

    // NEW
    const appetizers = menu.filter(item => item.category === 'appetizers');
    const deepFried = menu.filter(item => item.category === 'deep_fried');
    const wings = menu.filter(item => item.category === 'wings');
    const biriyani = menu.filter(item => item.category === 'biriyani');
    const vatDal = menu.filter(item => item.category === 'vat_dal');
    const curryVuna = menu.filter(item => item.category === 'curry_vuna');
    const vatPackage = menu.filter(item => item.category === 'vat_package');

    return (
        <div>
            <Cover img={menuImg} title="Our Menu" />

            {/* OFFER */}
            <motion.div className="py-12 bg-gradient-to-r from-blue-500 to-green-400 text-white">
                <SectionTitle subHeading="Don't Miss" heading="Today's Offer" />
                <MenuCategory items={offered} />
            </motion.div>

            {/* OLD CATEGORIES */}
            <MenuCategory items={desserts} title="Desserts" img={dessertImg} icon={<FaIceCream />} />
            <MenuCategory items={pizza} title="Pizza" img={pizzaImg} icon={<FaPizzaSlice />} />
            <MenuCategory items={salad} title="Salads" img={saladImg} icon={<FaHamburger />} />
            <MenuCategory items={soups} title="Soups" img={soupImg} icon={<FaUtensils />} />

            {/* NEW CATEGORIES */}
            <MenuCategory items={appetizers} title="Appetizers" />
            <MenuCategory items={deepFried} title="Deep Fried" />
            <MenuCategory items={wings} title="Wings" />
            <MenuCategory items={biriyani} title="Biriyani" />
            <MenuCategory items={vatDal} title="Vat & Dal" />
            <MenuCategory items={curryVuna} title="Curry / Vuna" />
            <MenuCategory items={vatPackage} title="Vat Package" />
        </div>
    );
};

export default Menu;