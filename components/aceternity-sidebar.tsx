'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import {
  RiHomeLine,
  RiAddCircleLine,
  RiMessage2Line,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiInfoCardFill,
} from 'react-icons/ri';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <RiHomeLine className="h-5 w-5" />,
  },
  {
    title: 'Detail Monitoring',
    href: '/detail-monitoring',
    icon: <RiInfoCardFill className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <RiSettings4Line className="h-5 w-5" />,
  },
];

export function AceternitySidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative justify-between flex flex-col pb-20">
      <motion.div
        initial={{ width: '16rem' }}
        animate={{ width: isCollapsed ? '5rem' : '16rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className=" border-r bg-background relative flex-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border shadow-md bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <RiArrowRightSLine className="h-3 w-3" />
          ) : (
            <RiArrowLeftSLine className="h-3 w-3" />
          )}
        </Button>

        <ScrollArea className="h-full py-6 flex flex-col">
          <div className="px-3 py-2">
            <div className="mb-6 flex items-center px-4">
              {!isCollapsed && (
                <img
              src="/bss logo.png"
              alt="Logo"
              className="h-11 w-11"
            />
              )}
              {isCollapsed && <span className="text-lg font-semibold">G</span>}
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isCollapsed && 'justify-center px-2',
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </Link>
              ))}
            </div>
          </div>{' '}
          <div className="mt-auto px-3 py-2">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-muted-foreground',
                isCollapsed && 'justify-center px-2',
              )}
              onClick={handleLogout}
            >
              <RiLogoutBoxLine className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Log out</span>}
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
      {!isCollapsed ? (
        <div className="p-4">
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Signed in as:</p>
            <p className="text-xs opacity-80 truncate">{email}</p>
          </div>
        </div>
      ) : (
        <div className="p-4 mb-4 bg-muted rounded-full w-fit mx-auto">
          <p>{email[0].toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}
