import { useEffect, useState } from 'react';
import { accounts } from '../data/observatory-fixtures';
import { buildLenses } from '../utils/observatory-model';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';

function readRoute() {
  const url = new URL(window.location.hash.slice(1) || '/console', window.location.origin);
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
  const chat = path.match(/^\/chat\/([^/]+)\/([^/]+)$/);
  if (path === '/console' && url.searchParams.get('chat')) return { path, accountId: url.searchParams.get('account'), threadId: url.searchParams.get('chat'), lensId: 'intelligence:chat', period: 'current' };
  if (chat) return { path, accountId: decodeURIComponent(chat[1]), threadId: chat[2] === 'new' ? null : decodeURIComponent(chat[2]), prompt: url.searchParams.get('prompt') || '', autoSend: url.searchParams.get('send') === '1', lensId: 'intelligence:chat', period: 'current' };
  const person = path.match(/^\/console\/people\/([^/]+)$/);
  if (person) return { path, personId: decodeURIComponent(person[1]), lensId: null, period: 'current' };
  const match = path.match(/^\/(?:intelligence|console)\/client\/([^/]+)\/current$/);
  return { path, accountId: match?.[1] || (path === '/console/reports' ? url.searchParams.get('account') : null), lensId: url.searchParams.get('lens'), period: url.searchParams.get('period') || 'current' };
}

export function useObservatory() {
  const [route, setRoute] = useState(readRoute);
  const [profiles, setProfiles] = useState({});
  const [setupActions, setSetupActions] = useState({});
  const [addedPeople, setAddedPeople] = useState([]);
  const [recipients, setRecipients] = useState({});
  const [personProfiles, setPersonProfiles] = useState({});
  function recordSetupAction(step, workspaceId, complete = true) {
    setSetupActions((current) => ({ ...current, [workspaceId]: { ...current[workspaceId], [step]: complete } }));
  }
  const [selectedAccountId, setSelectedAccountId] = useState(() => window.localStorage.getItem('observatory-workspace') || 'canopy');
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

  useEffect(() => {
    if (route.accountId && accounts.some((item) => item.id === route.accountId)) {
      setSelectedAccountId(route.accountId);
      window.localStorage.setItem('observatory-workspace', route.accountId);
    }
  }, [route.accountId]);

  const selectedAccount = accounts.find((item) => item.id === selectedAccountId) ?? accounts[0];
  const account = accounts.find((item) => item.id === route.accountId)
    ?? (route.path === '/console/reports' ? selectedAccount : null);
  const currentAccount = account ? { ...account, ...profiles[account.id] } : null;
  const lenses = currentAccount ? buildLenses(currentAccount, route.period) : [];
  const lens = lenses.find((item) => item.sourceId === route.lensId);
  function saveProfile(values) {
    setProfiles((current) => ({ ...current, [account.id]: { ...current[account.id], ...values } }));
    recordSetupAction('account', account.id);
    window.location.hash = '/intelligence/client/' + account.id + '/current';
  }
  function saveWorkspaceProfile(workspaceId, values) {
    setProfiles((current) => ({ ...current, [workspaceId]: { ...current[workspaceId], ...values } }));
    if (values.firstPartyConnections) recordSetupAction('sources', workspaceId, Object.values(values.firstPartyConnections).some(Boolean));
    if (values.socialAccounts) recordSetupAction('sources', workspaceId, values.socialAccounts.length > 0);
    if (values.competitors) recordSetupAction('competitors', workspaceId, values.competitors.length > 0);
    if (values.prompts) recordSetupAction('prompts', workspaceId, values.prompts.length > 0);
  }
  function selectWorkspace(workspaceId) {
    setSelectedAccountId(workspaceId);
    window.localStorage.setItem('observatory-workspace', workspaceId);
  }
  return { route, account: currentAccount, selectedAccountId, accounts: accounts.map((item) => ({ ...item, ...profiles[item.id] })), lenses, lens, dark, setDark, saveProfile, saveWorkspaceProfile, selectWorkspace, recordSetupAction, setupActions, addedPeople, setAddedPeople, recipients, setRecipients, personProfiles, setPersonProfiles };
}


