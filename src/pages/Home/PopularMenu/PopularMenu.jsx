import React, { useEffect, useState } from 'react';
import SectionTitle from '../../../Components/SectionTitle/SectionTitle';
import MenuItem from '../../Shared/MenuItem/MenuItem';
import useMenu from '../../../hooks/useMenu';

const PopularMenu = () => {
    const [menu] = useMenu();

    const popular = menu.filter(item => item.category === 'popular');

    return (
        <section>
            <SectionTitle subHeading="Popular Items" heading="From Our Menu" />
            <div className="grid md:grid-cols-2 gap-9 mt-20 mb-20">
                {popular.map(item => (
                    <MenuItem key={item._id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default PopularMenu;
