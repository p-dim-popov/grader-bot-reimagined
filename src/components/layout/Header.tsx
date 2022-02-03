import * as React from 'react';

import Hideable from '@/components/Hideable';
import UnstyledLink from '@/components/links/UnstyledLink';

import { useAppSelector } from '@/redux';
import { getIsLoggedIn } from '@/redux/selectors';

const loggedOutLinks = [
  { href: '/auth/login', label: 'Login' },
  { href: '/auth/register', label: 'Register' },
];

const loggedInLinks = [{ href: '/auth/logout', label: 'Logout' }];

const fromLinksObjectsToComponents = ({
  href,
  label,
}: typeof loggedInLinks[number]) => (
  <li key={`${href}${label}`}>
    <UnstyledLink href={href} className='hover:text-gray-600'>
      {label}
    </UnstyledLink>
  </li>
);

export default function Header() {
  const isLoggedIn = useAppSelector(getIsLoggedIn);

  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Home
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <Hideable isVisible={!isLoggedIn}>
              {loggedOutLinks.map(fromLinksObjectsToComponents)}
            </Hideable>
            <Hideable isVisible={isLoggedIn}>
              {loggedInLinks.map(fromLinksObjectsToComponents)}
            </Hideable>
          </ul>
        </nav>
      </div>
    </header>
  );
}
