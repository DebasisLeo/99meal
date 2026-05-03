import { useEffect, useState } from 'react';
import orderCoverImg from '../../../assets/shop/order.jpg';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import OrderTab from '../OrderTab/OrderTab';
import useMenu from '../../../hooks/useMenu';
import Cover from '../../Shared/Cover/Cover';

const Order = () => {
    useEffect(() => {
        document.title = "Rassporium | Order";
    }, []);

    const [menu] = useMenu();
    const [tabIndex, setTabIndex] = useState(0);

    // OLD
    const salads = menu.filter(item => item.category === 'salad');
    const pizza = menu.filter(item => item.category === 'pizza');
    const soups = menu.filter(item => item.category === 'soups');
    const desserts = menu.filter(item => item.category === 'dessert');
    const drinks = menu.filter(item => item.category === 'drinks');

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
            <Cover img={orderCoverImg} title="Order Food" />

            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList>
                    {/* OLD */}
                    <Tab>Salad</Tab>
                    <Tab>Pizza</Tab>
                    <Tab>Soup</Tab>
                    <Tab>Dessert</Tab>
                    <Tab>Drinks</Tab>

                    {/* NEW */}
                    <Tab>Appetizers</Tab>
                    <Tab>Deep Fried</Tab>
                    <Tab>Wings</Tab>
                    <Tab>Biriyani</Tab>
                    <Tab>Vat & Dal</Tab>
                    <Tab>Curry Vuna</Tab>
                    <Tab>Vat Package</Tab>
                </TabList>

                {/* OLD */}
                <TabPanel><OrderTab items={salads} /></TabPanel>
                <TabPanel><OrderTab items={pizza} /></TabPanel>
                <TabPanel><OrderTab items={soups} /></TabPanel>
                <TabPanel><OrderTab items={desserts} /></TabPanel>
                <TabPanel><OrderTab items={drinks} /></TabPanel>

                {/* NEW */}
                <TabPanel><OrderTab items={appetizers} /></TabPanel>
                <TabPanel><OrderTab items={deepFried} /></TabPanel>
                <TabPanel><OrderTab items={wings} /></TabPanel>
                <TabPanel><OrderTab items={biriyani} /></TabPanel>
                <TabPanel><OrderTab items={vatDal} /></TabPanel>
                <TabPanel><OrderTab items={curryVuna} /></TabPanel>
                <TabPanel><OrderTab items={vatPackage} /></TabPanel>
            </Tabs>
        </div>
    );
};

export default Order;