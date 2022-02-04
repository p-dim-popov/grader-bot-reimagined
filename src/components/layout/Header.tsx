import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

import { useAppSelector } from '@/redux';
import { getIsLoggedIn } from '@/redux/selectors';

const ListItemLink: React.FC<{
  label: string;
  href: string;
  description?: string;
}> = ({ label, href, description }) => (
  <li>
    <UnstyledLink
      href={href}
      className='hover:text-gray-600'
      title={description}
    >
      {label}
    </UnstyledLink>
  </li>
);

const LinkList: React.FC<{
  list: { visible: boolean; link: React.ReactNode }[];
}> = ({ list }) => (
  <ul className='flex items-center justify-between space-x-2'>
    {list
      .filter((x) => x.visible)
      .reduce(
        (prevVal, curVal) => (
          <>
            {prevVal}
            {prevVal && <span>|</span>}
            {curVal.link}
          </>
        ),
        null as React.ReactNode
      )}
  </ul>
);

export default function Header() {
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const mostRecentProblem = useAppSelector((x) => x.common.mostRecentProblem);

  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Home
        </UnstyledLink>
        <nav>
          <LinkList
            list={[
              {
                visible: true,
                link: (
                  <div className='invisible flex flex-row space-x-2 md:visible'>
                    <div className='font-bold'>
                      Most recently solved problem:
                    </div>
                    <ListItemLink
                      label={mostRecentProblem.displayName}
                      href={`/${mostRecentProblem.language}/${mostRecentProblem.solutionType}/problems`}
                      description={mostRecentProblem.description}
                    />
                  </div>
                ),
              },
              {
                visible: !isLoggedIn,
                link: <ListItemLink label='Register' href='/auth/register' />,
              },
              {
                visible: !isLoggedIn,
                link: <ListItemLink label='Login' href='/auth/login' />,
              },
              {
                visible: isLoggedIn,
                link: <ListItemLink label='Logout' href='/auth/logout' />,
              },
            ]}
          />
        </nav>
      </div>
    </header>
  );
}
