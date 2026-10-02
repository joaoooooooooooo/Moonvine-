import { useEffect, useState } from 'react';
import { accounts } from '../data/observatory-fixtures';
import { buildLenses } from '../utils/observatory-model';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';

function readRoute() {
  const url = new URL(window.location.hash.slice(1) || '/console', window.location.origin);
  const chat = url.pathname.match(/^\/chat\/([^/]+)\/([^/]+)$/);
  if (chat) return { path: url.pathname, accountId: decodeURIComponent(chat[1]), threadId: chat[2] === 'new' ? null : decodeURIComponent(chat[2]), lensId: 'intelligence:chat', period: 'current' };
  const match = url.pathname.match(/^\/(?:intelligence|console)\/client\/([^/]+)\/current$/);
  return { path: url.pathname, accountId: match?.[1] || null, lensId: url.searchParams.get('lens'), period: url.searchParams.get('period') || 'current' };
}

export function useObservatory() {
  const [route, setRoute] = useState(readRoute);
  const [profiles, setProfiles] = useState({});
  const { resolvedTheme, setTheme } = useThemePreference();
  const dark = resolvedTheme === 'dark';
  const setDark = (nextDark) => setTheme(nextDark ? 'dark' : 'light');

  useEffect(() => {
    const handleRoute = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  const account = accounts.find((item) => item.id === route.accountId);
  const currentAccount = account ? { ...account, ...profiles[account.id] } : null;
  const lenses = currentAccount ? buildLenses(currentAccount, route.period) : [];
  const lens = lenses.find((item) => item.sourceId === route.lensId);
  function saveProfile(values) {
    setProfiles((current) => ({ ...current, [account.id]: values }));
    window.location.hash = '/intelligence/client/' + account.id + '/current';
  }
  return { route, account: currentAccount, accounts: accounts.map((item) => ({ ...item, ...profiles[item.id] })), lenses, lens, dark, setDark, saveProfile };
}


