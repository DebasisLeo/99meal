import React from "react";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";

import featuredImg from "../../../assets/home/featured.jpg";
import "./Featured.css";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

const Featured = () => {
  return (
    <div className="featured-item bg-fixed text-white pt-8 my-20">
      <SectionTitle subHeading="Check it out" heading="Featured Item" />

      <div className="md:flex justify-center items-center bg-slate-500 bg-opacity-60 pb-20 pt-12 px-8 md:px-36">
        <motion.div
          className="md:w-1/2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={featuredImg} alt="Featured Item" className="rounded-lg shadow-lg" />
        </motion.div>

        <div className="md:ml-10 mt-6 md:mt-0 md:w-1/2">
          <motion.p
            className="text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Nov 20, 2025
          </motion.p>
          <motion.h3
            className="uppercase text-3xl font-bold mt-4"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            Panipuri
          </motion.h3>
          <motion.p
            className="mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Enjoy our delicious Panipuri with fresh ingredients, tangy tamarind water, and a perfect mix of flavors. A favorite snack loved by all!
          </motion.p>
          <motion.button
            className="btn btn-outline border-0 border-b-4 mt-4 flex items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <FaShoppingCart className="mr-2" size={20} />
            Order Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
