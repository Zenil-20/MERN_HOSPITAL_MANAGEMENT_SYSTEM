import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaThreads } from "react-icons/fa6";

const Footer = () => {
  const hours = [
    {
      id: 1,
      day: "Monday",
      time: "9:00 AM - 11:00 PM",
    },
    {
      id: 2,
      day: "Tuesday",
      time: "12:00 PM - 12:00 AM",
    },
    {
      id: 3,
      day: "Wednesday",
      time: "10:00 AM - 10:00 PM",
    },
    {
      id: 4,
      day: "Thursday",
      time: "9:00 AM - 9:00 PM",
    },
    {
      id: 5,
      day: "Friday",
      time: "3:00 PM - 9:00 PM",
    },
    {
      id: 6,
      day: "Saturday",
      time: "9:00 AM - 3:00 PM",
    },
  ];

  return (
    <>
      <footer className="container">
        <hr />
        <div className="content">
          <div>
            <img src="/logo.png" alt="logo" className="logo-img" />
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/appointment">Appointment</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <ul>
              {hours.map((element) => (
                <li key={element.id}>
                  <span>{element.day}: </span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <div>
              <FaPhone />
              <span> 985705364</span>
            </div>
            <div className="email-container">
              <MdEmail />
              <span> zclab@gmail.com</span>
            </div>
            <div>
              <FaLocationArrow />
              <span> Gujarat, India</span>
            </div>
            <div>
              <iframe
                width="320"
                height="200"
                frameBorder="0"
                style={{ border: "none", overflow: "hidden" }}
                src="https://maps.google.com/maps?width=320&amp;height=200&amp;hl=en&amp;q=Falcon%20solution%20462-463%20The%20Galleria,%20near%20Sanjiv%20Kumar%20Auditorium,%20Pal%20Gam,%20Surat,%20Gujarat%20395009+(Zeecare%20Hospital)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                title="Zeecare Hospital Location"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div>
            <h4>Follow Us On</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=100088354993753&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} />
              </a>
              <a href="https://www.threads.net/@zenil_2012" target="_blank" rel="noopener noreferrer">
                <FaThreads size={30} />
              </a>
              <a href="https://www.linkedin.com/in/zenil-kapadia-664396271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
              <a href="https://www.instagram.com/zenil_2012?igsh=bHpidnhybzNpMjBu" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
