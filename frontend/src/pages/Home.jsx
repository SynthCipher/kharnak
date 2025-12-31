
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Modal from '../components/Modal';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';

// Import Custom CSS
import '../css/timeline.css';

const Home = () => {
  const [popup1Open, setPopup1Open] = useState(false);
  const [popup2Open, setPopup2Open] = useState(false);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
    category: ""
  });

  const [publications, setPublications] = useState([]);
  const { backendUrl, products, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const fetchPublications = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/publication/list');
      if (data.success) {
        setPublications(data.publications.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/contact/add', contact);
      if (data.success) {
        toast.success(data.message);
        setContact({ name: "", email: "", message: "", category: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Navigation Bar - Handled globally in App.jsx */}

      {/* HOME Video */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 md:px-0" id="Home">
        <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover z-0 opacity-60">
          <source src="/img/Timeline 1.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center flex flex-col items-center">
          <h1 className="text-[80px] md:text-[120px] lg:text-[160px] font-bold text-white mb-6 md:mb-10 leading-none">Kharnak</h1>
          <a href="#Kharnak" onClick={(e) => { e.preventDefault(); const element = document.getElementById('Kharnak'); const y = element.getBoundingClientRect().top + window.scrollY - 20; window.scrollTo({ top: y, behavior: 'smooth' }); }} className="group relative inline-flex items-center justify-center px-10 py-3 text-white text-lg md:text-2xl font-light tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 ease-out border border-white/30 rounded-full backdrop-blur-sm hover:backdrop-blur-md hover:bg-white/10 hover:border-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <span className="relative z-10 font-bold group-hover:text-white transition-colors">Explore</span>
            <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
          </a>
        </div>
      </div>

      {/* Skills / Black Castle */}
      <section className="py-20 max-w-7xl mx-auto px-6" id="Kharnak">
        {/* Intro Text */}
        <div className="text-center mb-16">
          <h3 className="text-gray-400 uppercase tracking-widest text-sm md:text-base font-bold mb-2">"BLACK CASTLE"</h3>
          <h1 className="text-6xl md:text-8xl text-[#1e1964] font-black mb-4">མཁར་ནག་</h1>
          <h3 className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-light">Refers to a ruined fort located on a high spur above one of the nomad’s encampments. </h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

          {/* Dhat Gonpa Box */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mr-5 border border-gray-200">
                <img className="w-10 h-10 object-contain" src="/img/historylogo (2).png" alt="" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1964]">དད་དགོན་པ་། <br />DHAT GONPA <br /></h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6"> The<span className="text-[#34A1CD] font-bold"> Kharnakpa</span> community is entirely Buddhist, following the ‘Drukpa Kargyu Lineage'. The only monastery in the Kharnak region, Ldad dgon pa, is affiliated with Hemis Monastery as a branch (Hemis dgon lag).
              <button className="text-[#34A1CD] font-bold hover:underline ml-2" onClick={() => setPopup1Open(true)}>Read More <i className="fa fa-arrow-right"></i></button>
            </p>

            <Modal isOpen={popup1Open} onClose={() => setPopup1Open(false)}>
              <h1>DHAT MONASTERY</h1>
              <h2>Kharnak Community and Religious Affiliation</h2>
              <p>The Kharnak-pa community is entirely Buddhist, following the ‘Brug pa bKa’ brgyud pa order. The only monastery in the Kharnak region, Ldad dgon pa, is affiliated with Hemis Monastery as a branch (Hemis dgon lag). The Kharnak community includes a significant number of celibate nuns and priests. The nuns live either with their families or in a hermitage known as mTshams khang, located at Yagang (4500m), while the priests, referred to as ‘lamas’, are mostly married and live the life of householders.
              </p>

              <div className="container-swiper mb-6">
                <Swiper navigation={true} modules={[Navigation, Pagination]} pagination={{ clickable: true }} className="mySwiper rounded-lg overflow-hidden h-[400px]">
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa1.jpg" alt="old kharnak gonpa" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa4.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa2.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa5.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa3.jpg" alt="old kharnak gonpa" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa7.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                </Swiper>
              </div>

              <h2>Role of the Lamas</h2>
              <p>The lamas in Kharnak are grong pa’i grwa pa (household priests), and while they do not slaughter animals, they engage in
                activities like tanning, moxibustion to treat weak horses, and even ploughing if they own arable land.
                Their traditional attire consists of the nomadic log pa gon chas—a long-sleeved, belted robe
                with fleece facing inside. Lamas in Kharnak, though technically belonging to Hemis Monastery,
                generally remain local and are trained by senior monks or nuns. They are not assigned to village
                temples to serve the laity as is the norm in other parts of Ladakh.</p>

              <h2>Dhad Gompa’s Founding</h2>
              <p>The exact date of the founding of Dhad Gompa remains unclear, but it is
                believed to have been established around the early 18th century, roughly the same time as
                Hemis Monastery. It was founded by a native lama from Kharnak on a site blessed by Rin
                chen bZang po (958-1055), a revered figure known as the “Great Translator.” Although no formal
                historical records are available,
                local tradition suggests that Dhad Gompa is over 350 years old</p>
              <p>In the early days, Dhad Gompa was supported by 16 households from the Kharnak region,
                with each family contributing in various ways based on their skills. Families with
                expertise in wall painting created religious murals depicting Buddhist figures,
                historical events, and cultural narratives. Those skilled in carpentry helped with
                the construction and maintenance of the monastery’s structures. This collaborative effort,
                where each family member contributed according to their abilities, ensured the Gompa’s upkeep
                and spiritual significance. The contributions of these 16 households were documented in a list
                known as Par-chud 16, held by Hemis Monastery. Each family also kept a copy of this document,
                traditionally stored in white cloth and passed down through generations.</p>
              <img src="/img/kharnak-gonpa.png" className="w-full rounded-lg my-4" alt="" />

              <p>
                Dhad Gompa holds a central place in the religious practices of the Kharnak Changpas.
                Two Changpas are selected to travel to the Gompa daily, year-round, to offer prayers to one
                of the most revered gods of the region. This daily commitment is vital for maintaining the
                religious traditions of the Kharnak people. During the winter, when most of the village
                migrates with livestock, the two lamas remain the only inhabitants of the Gompa,
                enduring the isolation of the harsh climate.
              </p>
              <img src="/img/kharnak-gonpa2.png" className="w-full rounded-lg my-4" alt="" />
              <br />
              <p>Dhad Gompa is currently administered by Hemis Monastery, which appoints two lamas to
                oversee the monastery. These lamas serve for a year, with the selection made through a
                lottery system from the Lama school at Hemis. While the Gompa is now part of Hemis'
                administrative structure, it continues to be a spiritual center for the Kharnak community,
                who maintain a strong religious connection to it.</p>
            </Modal>
          </div>

          {/* History Box */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mr-5 border border-gray-200">
                <img className="w-10 h-10 object-contain" src="/img/2logoHistory.png" alt="" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1964]">མཁར་ནག་ལོ་རྒྱུས་། <br /> HISTORY</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6"><span className="text-[#55527C] font-bold">Design Text </span>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur obcaecati incidunt pariatur in doloribus repellat hic nesciunt accusamus tempora. Facere.
              <button className="text-[#34A1CD] font-bold hover:underline ml-2" onClick={() => setPopup2Open(true)}>Read More <i className="fa fa-arrow-right"></i></button>
            </p>

            <Modal isOpen={popup2Open} onClose={() => setPopup2Open(false)}>
              <h1>HISTORY</h1>
              <p>
                <a style={{ fontSize: '16px', color: 'black', padding: '5px 2px', border: 'solid black' }} href="https://forms.gle/ZFF4kCYBNGtbLGnK6" target="_blank" className="review-link">
                  Upload Info</a>
                <br />
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati eaque repellat repudiandae neque illo consectetur nemo voluptate ut est ea aperiam quos fuga iusto in illum delectus totam, commodi cum molestias ullam et. Quos doloremque sapiente vero beatae quia! Beatae, natus! Atque et cupiditate eius minima, sit illo impedit quas?</p>

              <div className="container-swiper mb-6">
                <Swiper navigation={true} modules={[Navigation, Pagination]} pagination={{ clickable: true }} className="mySwiper rounded-lg overflow-hidden h-[400px]">
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa1.jpg" alt="old kharnak gonpa" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa4.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa2.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa5.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa3.jpg" alt="old kharnak gonpa" /></SwiperSlide>
                  <SwiperSlide><img className="w-full h-full object-cover" src="/img/kharnakGonpa7.jpg" alt="the mask of ka la bu kyong" /></SwiperSlide>
                </Swiper>
              </div>

              <p>hello world</p>
              <p>More content... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra urna ac felis tincidunt, ac malesuada sapien maximus. Donec quis erat ut ante luctus tincidunt. Aenean tristique metus sit amet ex elementum, vel scelerisque tortor interdum. Etiam aliquam quam a pharetra fermentum. Fusce tempus hendrerit suscipit. Vestibulum eget sollicitudin urna, sit amet tincidunt magna. Integer hendrerit, purus id fringilla condimentum, ante lacus cursus libero, in iaculis ipsum libero eu nulla. Fusce dapibus sapien non ante tristique, a pretium libero malesuada. Etiam venenatis varius sapien, id auctor orci ultricies nec. Sed volutpat at ante et maximus.</p>
            </Modal>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/3LNuy8YKbcM?si=Szo_toW4GKzNm9zE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/8f_0jlCiQwI?si=-4PQMu15flG0nTKh" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* timeline nomadism - LEGACY CSS RETAINED */}
      <section className="Timeline" id="Timeline">
        <div className="title">
          <h3 className="h3-Kharnak">Migration follows climate, geography, and lunar calendar</h3>
          <h1>Migration Route of the Kharnakpa</h1>
        </div>
        <div className="timeline">
          {/* Dhat - Spring */}
          <div className="ConTaiNer right-container">
            <img src="/img/yak.png" alt="Dhat (Spring)" className="timeline-img" />
            <div className="Text-Box">
              <h2>Dhat <small>(CAPITAL)</small></h2>
              <small>29 March – 22 June (Spring)</small>
              <p>Average Elevation: 4,250 m<br />Period of Stay: Approx. 2 and half months</p>
              <span className="right-container-arrow"></span>
            </div>
          </div>
          {/* Zara - Summer */}
          <div className="ConTaiNer left-container">
            <img src="/img/goat.png" alt="Zara" className="timeline-img" />
            <div className="Text-Box">
              <h2>Zara</h2>
              <small>22 June – 18 July (Summer)</small>
              <p>Average Elevation: 4,750 m<br />Period of Stay: Approx. 1 month</p>
              <span className="left-container-arrow"></span>
            </div>
          </div>
          {/* Pang-Chen - Summer */}
          <div className="ConTaiNer right-container">
            <img src="/img/sheep.png" alt="Pang-Chen" className="timeline-img" />
            <div className="Text-Box">
              <h2>Pang-Chen</h2>
              <small>18 July – 30 August (Summer)</small>
              <p>Average Elevation: 4,650 m<br />Period of Stay: Approx. 1 and half months</p>
              <span className="right-container-arrow"></span>
            </div>
          </div>
          {/* Ya-Gang - Autumn */}
          <div className="ConTaiNer left-container">
            <img src="/img/wolf.png" alt="Ya-Gang" className="timeline-img" />
            <div className="Text-Box">
              <h2>Ya-Gang</h2>
              <small>30 August – 14 November (Autumn)</small>
              <p>Average Elevation: 4,500 m<br />Period of Stay: Approx. 2 and half months</p>
              <span className="left-container-arrow"></span>
            </div>
          </div>
          {/* Dhat - Winter */}
          <div className="ConTaiNer right-container">
            <img src="/img/horse.png" alt="Dhat" className="timeline-img" />
            <div className="Text-Box">
              <h2>Dhat</h2>
              <small>14 November – 15 February (Winter)</small>
              <p>Average Elevation: 4,250 m<br />Period of Stay: Approx. 3 and half months</p>
              <span className="right-container-arrow"></span>
            </div>
          </div>
          {/* Tsamartse - Winter */}
          <div className="ConTaiNer left-container">
            <img src="/img/snowLeopard.png" alt="Tsamartse" className="timeline-img" />
            <div className="Text-Box">
              <h2>Tsamartse</h2>
              <small>15 February – 29 March (Winter)</small>
              <p>Average Elevation: 4,500 m<br />Period of Stay: Approx. 1 month</p>
              <span className="left-container-arrow"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Article and Publication */}
      <section className="py-20 bg-gray-50 relative overflow-hidden" id="Journal">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFF5F6] rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-12">
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">KHARNAK</h3>
            <div className="flex flex-col md:flex-row justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-[#1e1964] mb-2">Articles & <span className="text-[#EA4C89]">Publications</span></h1>
                <h4 className="text-gray-500 text-lg font-light italic">Kharnak’s Legacy Through Published Works . . .</h4>
              </div>
              <Link to="/archive" className="hidden md:block px-6 py-2 border-b-2 border-black font-bold hover:text-[#EA4C89] hover:border-[#EA4C89] transition-colors">VIEW ARCHIVE</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <div key={index} className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer h-80 bg-white">
                {pub.type === 'YouTube Video' && pub.url ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={getYouTubeEmbedUrl(pub.url)}
                    title={pub.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img src={pub.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={pub.title} />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-white translate-y-4 group-hover:translate-y-0 transform transition-transform">
                      <h4 className="italic text-lg mb-2 text-[#EA4C89] font-serif">{pub.type} <span className="text-xs text-white uppercase not-italic tracking-wider border px-1 ml-1 align-middle">{pub.type === 'YouTube Video' ? 'Video' : 'Article'}</span></h4>
                      <h3 className="font-bold text-xl leading-tight mb-6 line-clamp-2">{pub.title}</h3>
                      <div className="flex gap-4">
                        {pub.url && (
                          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#EA4C89] hover:border-[#EA4C89] transition-colors">
                            {pub.type === 'YouTube Video' ? 'Watch' : 'View'}
                          </a>
                        )}
                        {pub.fileUrl && (
                          <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#EA4C89] hover:border-[#EA4C89] transition-colors">
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {publications.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400 italic">No publications to show yet.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link to="/archive" className="inline-block px-8 py-3 bg-white border border-black text-black font-bold rounded hover:bg-black hover:text-white transition-all w-full text-center uppercase tracking-widest text-xs">VIEW ARCHIVE</Link>
          </div>
        </div>
      </section>

      {/* Community / Groups */}
      <section className="py-20 max-w-7xl mx-auto px-6" id="Groups">
        <div className="text-center mb-16">
          <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">United in Tradition and Progress</h3>
          <h1 className="text-4xl md:text-5xl font-black text-[#1e1964]">Our Groups</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center relative mt-12 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden absolute -top-12 bg-white">
              <img src="/img/junu2.png" className="w-full h-full object-cover" alt="" />
            </div>

            <div className="mt-12 w-full">
              <h4 className="text-xl font-bold text-black mb-1">Kharnak Junu Tsogspa</h4>
              <h5 className="text-[#1e1964] font-serif text-lg mb-4">མཁར་ནག་གཞོན་ནུ་ཕན་བདེ་ཚོགས་པ།།</h5>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">The youth group empowers local youth through programs focused on personal growth, leadership, education, cultural preservation, and community engagement.</p>
              <Link to="/groups/kharnak-junu-tsogspa" className="text-[#34A1CD] font-bold hover:underline">Read More <i className="fa fa-arrow-right"></i></Link>

              <p className="mt-4 font-bold text-gray-800 border-t pt-4 w-full">Jigmat Stanzin <br /> <span className="text-gray-500 font-normal text-xs uppercase">President</span></p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center relative mt-12 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden absolute -top-12 bg-white">
              <img src="/img/drukJabro.png" className="w-full h-full object-cover" alt="" />
            </div>

            <div className="mt-12 w-full">
              <h4 className="text-xl font-bold text-black mb-1">Druk Jabdro Tsogspa</h4>
              <h5 className="text-[#1e1964] font-serif text-lg mb-4">མཁར་ནག་གཞོན་ནུ་ཕན་བདེ་ཚོགས་པ།།</h5>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Based in <b>Kharnakling</b>, the group preserves Kharnak's culture, traditions, music, dance, and customs through events and activities for future generations.</p>

              <Link to="/groups/druk-jabdro-tsogspa" className="text-[#34A1CD] font-bold hover:underline">Read More <i className="fa fa-arrow-right"></i></Link>

              <p className="mt-4 font-bold text-gray-800 border-t pt-4 w-full">Skalzang Angmo <br /> <span className="text-gray-500 font-normal text-xs uppercase">President</span></p>
            </div>
          </div>


          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center relative mt-12 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden absolute -top-12 bg-white">
              <img src="/img/yargais.png" className="w-full h-full object-cover" alt="" />
            </div>

            <div className="mt-12 w-full">
              <h4 className="text-xl font-bold text-black mb-1">Kharnak Yargais Tsogspa</h4>
              <h5 className="text-[#1e1964] font-serif text-lg mb-4">མཁར་ནག་ཡར་རྒྱས་ཚོགས་པ།།</h5>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">The group works towards Kharnak’s development, focusing on education, infrastructure, and social welfare, while promoting unity for a prosperous future.</p>

              <Link to="/groups/kharnak-yargais-tsogspa" className="text-[#34A1CD] font-bold hover:underline">Read More <i className="fa fa-arrow-right"></i></Link>

              <p className="mt-4 font-bold text-gray-800 border-t pt-4 w-full">Sonam Rigzin <br /> <span className="text-gray-500 font-normal text-xs uppercase">President</span></p>
            </div>
          </div>

        </div>
      </section>

      {/* Shop Highlights Section */}
      <section className="py-20 bg-gray-50" id="Shop">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">AUTHENTIC NOMADIC TREASURES</h3>
            <h1 className="text-4xl md:text-5xl font-black text-[#1e1964] mb-8">From Our Shop</h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">Handcrafted by the artisans of Kharnak, bringing the spirit of the mountains to your home.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products && products.slice(0, 4).map((product) => (
              <div
                key={product._id}
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm border border-gray-100">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#1e1964] rounded-lg shadow-sm border border-white/50">
                      {product.category}
                    </span>
                  </div>

                  {/* Sold Out Badge */}
                  {product.quantity <= 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600/90 backdrop-blur-md text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex justify-between items-end px-1">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-medium text-[#1e1964] leading-tight mb-1 group-hover:text-yellow-600 transition-colors font-serif line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm font-light text-gray-500">₹{product.price}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
                      addToCart(product._id, size);
                    }}
                    disabled={product.quantity <= 0}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#1e1964] hover:bg-[#1e1964] hover:text-white hover:border-[#1e1964] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1e1964]"
                    title="Add to Cart"
                  >
                    <IoCartOutline size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop" className="inline-block px-10 py-3 border-2 border-[#1e1964] rounded-full text-[#1e1964] text-lg font-bold hover:bg-[#1e1964] hover:text-white transition-all duration-300">
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>



    </>
  );
};

export default Home;
