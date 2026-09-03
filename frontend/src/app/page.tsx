import Link from "next/link";
import { destinations, properties } from "../data/mockData";
import SearchBar from "../components/SearchBar";

export default function Home() {
    return (
        <main className="home-page page-enter">

            {/* HERO */}
            <section className="home-hero">
                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="container home-hero-inner">

                    <div className="hero-content">
                        <div className="hero-badge">
                            ✦ YOUR JOURNEY STARTS HERE
                        </div>

                        <h1>
                            FIND YOUR
                            <br />
                            <span>PERFECT STAY.</span>
                        </h1>

                        <p className="hero-subtitle">
                            Discover beautiful places, unforgettable stays
                            and destinations worth exploring.
                        </p>

                        <div className="hero-stats">
                            <div>
                                <strong>120+</strong>
                                <span>Unique stays</span>
                            </div>

                            <div>
                                <strong>3</strong>
                                <span>Popular cities</span>
                            </div>

                            <div>
                                <strong>4.8</strong>
                                <span>Guest rating</span>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="home-search-wrapper">

                        <SearchBar />
                    </div>

                </div>

                <div className="hero-scroll">
                    <span>SCROLL TO EXPLORE</span>
                    <div className="scroll-line"></div>
                </div>
            </section>


            {/* DESTINATIONS */}
            <section className="home-destinations">
                <div className="container">

                    <div className="home-section-heading">
                        <div>
                           <span className="home-eyebrow">
                               DISCOVER
                           </span>
                                
                            <h2>
                                EXPLORE
                                <br />
                                <span>EUROPE.</span>
                            </h2>
                        </div>

                        <p>
                            From romantic streets to sunny coastlines,
                            discover destinations made for your next adventure.
                        </p>
                    </div>


                    <div className="home-destination-grid">

                        {destinations.map((destination, index) => (
                            <Link
                                href={`/destinations/${destination.id}`}
                                className={`home-destination-card destination-card-${index + 1}`}
                                key={destination.id}
                            >
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                />

                                <div className="destination-overlay"></div>

                                <div className="destination-number">
                                    0{index + 1}
                                </div>

                                <div className="destination-arrow">
                                    ↗
                                </div>

                                <div className="destination-info">
                                    <span>{destination.country}</span>
                                    <h3>{destination.name}</h3>
                                </div>
                            </Link>
                        ))}

                    </div>

                </div>
            </section>


            {/* FEATURED STAYS */}
            <section className="home-stays">
                <div className="container">

                    <div className="home-section-heading stays-heading">
                        <div>
                            <span className="home-eyebrow">
                                HANDPICKED STAYS
                            </span>

                            <h2>
                                STAY SOMEWHERE
                                <br />
                                <span>SPECIAL.</span>
                            </h2>
                        </div>

                        <Link
                            href="/stays"
                            className="home-outline-button"
                        >
                            View all stays ↗
                        </Link>
                    </div>


                    <div className="home-property-grid">

                        {properties.slice(0, 6).map((property) => (
                            <Link
                                href={`/stays/${property.id}`}
                                className="home-property-card"
                                key={property.id}
                            >
                                <div className="home-property-image">
                                    <img
                                        src={property.image}
                                        alt={property.name}
                                    />

                                    <div className="property-image-overlay"></div>

                                    <div className="property-rating-badge">
                                        ★ {property.rating}
                                    </div>

                                    <div className="property-view">
                                        VIEW STAY ↗
                                    </div>
                                </div>

                                <div className="home-property-content">

                                    <div>
                                        <span className="property-location">
                                            📍 {property.address}
                                        </span>

                                        <h3>
                                            {property.name}
                                        </h3>
                                    </div>

                                    <div className="home-property-price">
                                        <strong>
                                            €{property.pricePerNight}
                                        </strong>

                                        <span>
                                            / night
                                        </span>
                                    </div>

                                </div>
                            </Link>
                        ))}

                    </div>

                </div>
            </section>


            {/* CTA */}
            <section className="home-cta">
                <div className="home-cta-shape home-cta-shape-one"></div>
                <div className="home-cta-shape home-cta-shape-two"></div>

                <div className="container home-cta-inner">

                    <div className="home-cta-title">
                        <span className="home-eyebrow">
                            YOUR NEXT ADVENTURE
                        </span>

                        <h2>
                            READY TO
                            <br />
                            <span>GET AWAY?</span>
                        </h2>
                    </div>
                    

                    <div className="home-cta-stats">
                        <div>
                            <strong>9</strong>
                            <span>STAYS</span>
                        </div>

                        <div>
                            <strong>3</strong>
                            <span>DESTINATIONS</span>
                        </div>

                        <div>
                            <strong>4.8</strong>
                            <span>GUEST RATING</span>
                        </div>
                    </div>

                    <Link
                        href="/stays"
                        className="home-cta-button"
                    >
                        EXPLORE ALL STAYS
                        <span>↗</span>
                    </Link>

                </div>
            </section>

        </main>
    );
}