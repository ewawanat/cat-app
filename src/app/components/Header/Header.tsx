'use client';

import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href='/'>Home</Link>
                <Link href='/favourites'>Favourites</Link>
            </nav>
        </header>
    );
};

export default Header;
