import Link from "next/link";

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">StayWay</span>
                </Link>

                <nav className="nav">
                    <Link href="/">Home</Link>
                    <Link href="/destinations">Destinations</Link>
                    <Link href="/stays">Stays</Link>
                    <Link href="/bookings">My Bookings</Link>
                </nav>
            </div>
        </header>
    );
}