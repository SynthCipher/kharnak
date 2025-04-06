import React from "react";
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";

const About = () => {
  return (
    <div>
      <div className="border-t border-gray-300 pt-8 text-center text-2xl">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col lg:gap-16 md:gap-8 gap-16 md:flex-row">
        <img
          src={assets.about_img}
          className="w-full flex  md:max-w-[450px] object-contain self-start"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-1/2">
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Forever is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </p>
        </div>
      </div>
      <div className="py-4 text-xl">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="mb-20 flex flex-col text-sm md:flex-row">
        <div className="flex flex-col gap-5 border lg:py-10 lg:px-16 md:py-8 md:px-10 border-gray-300 px-10 py-8 sm:py-10 ">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards
          </p>
        </div>
        {/* <div className="flex flex-col gap-5 border border-gray-300 px-10 py-8 sm:py-20 md:px-16"> */}
        <div className="flex flex-col gap-5 border lg:py-10 lg:px-16 md:py-8 md:px-10 border-gray-300 px-10 py-8 sm:py-10 ">

          <b>Convenience</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier
          </p>{" "}
        </div>
        {/* <div className="flex flex-col gap-5 border border-gray-300 px-10 py-8 sm:py-20 md:px-16"> */}
        <div className="flex flex-col gap-5 border lg:py-10 lg:px-16 md:py-8 md:px-10 border-gray-300 px-10 py-8 sm:py-10 ">

          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  );
};

export default About;
