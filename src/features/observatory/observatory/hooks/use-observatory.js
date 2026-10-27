import { useEffect, useState } from 'react';
import { accounts } from '../data/observatory-fixtures';
import { buildLenses } from '../utils/observatory-model';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';

function readRoute() {
  const outer = new URL(window.location.hash.slice(1) || '/console', window.location.origin);
  const mapMode = outer.pathname === '/console/map';
  return { ...readAppRoute(mapMode ? outer.searchParams.get('page') || '/console' : outer.pathname + outer.search), mapMode };
}

function readAppRoute(hash) {
  const url = new URL(hash, window.location.origin);
  const pathname = url.pathname === '/console/data-sources/organization' ? '/console/data-sources/domains' : url.pathname;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const chat = path.match(/^\/chat\/([^/]+)\/([^/]+)$/);
  if (path === '/console' && url.searchParams.get('chat')) return { path, accountId: url.searchParams.get('account'), threadId: url.searchParams.get('chat'), prompt: url.searchParams.get('prompt') || '', autoSend: url.searchParams.get('send') === '1', lensId: 'intelligence:chat', period: 'current' };
  if (chat) {
    const prompt = url.searchParams.get('prompt') || '';
    const threadId = chat[2] === 'new' ? (prompt ? crypto.randomUUID() : null) : decodeURIComponent(chat[2]);
    const params = new URLSearchParams({ account: decodeURIComponent(chat[1]) });
    if (threadId) params.set('chat', threadId);
    if (prompt) { params.set('prompt', prompt); params.set('send', '1'); }
    window.history.replaceState(null, '', '#/console?' + params);
    return { path: '/console', accountId: decodeURIComponent(chat[1]), threadId, prompt, autoSend: Boolean(prompt), lensId: threadId ? 'intelligence:chat' : null, period: 'current' };
  }
  const person = path.match(/^\/console\/people\/([^/]+)$/);
  if (person) return { path, personId: decodeURIComponent(person[1]), lensId: null, period: 'current' };
  const match = path.match(/^\/(?:intelligence|console)\/client\/([^/]+)\/current$/);
  return { path, accountId: match?.[1] || (path === '/console/reports' ? url.searchParams.get('account') : null), lensId: url.searchParams.get('lens'), period: url.searchParams.get('period') || 'current' };
}

export function useObservatory() {
  const [route, setRoute] = useState(readRoute);
  const [previousPage, setPreviousPage] = useState('/console');
  const [visitedPaidTabs, setVisitedPaidTabs] = useState({});
  useEffect(() => {
    const workspace = accounts.find((item) => item.id === route.accountId);
    if (workspace?.scenario !== 'free' || !route.path.startsWith('/intelligence/') || !route.lensId) return;
    setVisitedPaidTabs((current) => current[workspace.id]?.includes(route.lensId) ? current : {
      ...current, [workspace.id]: [...(current[workspace.id] ?? []), route.lensId],
    });
  }, [route.accountId, route.path, route.lensId]);
  const [profiles, setProfiles] = useState({});
  const [setupActions, setSetupActions] = useState(() => Object.fromEntries(accounts.map((item) => [item.id, item.hasSampleData ? { workspaces: true, domain: true, account: true, sources: true, reports: true, competitors: true, prompts: true } : {}])));
  const [addedPeople, setAddedPeople] = useState([]);
  const [recipients, setRecipients] = useState({});
  const [personProfiles, setPersonProfiles] = useState({});
  function recordSetupAction(step, workspaceId, complete = true) {
    setSetupActions((current) => ({ ...current, [workspaceId]: { ...current[workspaceId], [step]: complete } }));
  }
  const [selectedAccountId, setSelectedAccountId] = useState(() => window.localStorage.getItem(readRoute().mapMode ? 'observatory-map-workspace' : 'observatory-workspace') || 'northstar');
  const { resolvedTheme, setTheme } = useThemePreference();
  const dark = resolvedTheme === 'dark';
  const setDark = (nextDark) => setTheme(nextDark ? 'dark' : 'light');

  useEffect(() => {
    const handleRoute = (event) => {
      const oldHash = new URL(event.oldURL).hash.slice(1) || '/console';
      // Keep a safe return destination when history crosses another locked preview.
      const oldUrl = new URL(oldHash, window.location.origin);
      if (!oldUrl.pathname.startsWith('/intelligence/client/meridian/') || !oldUrl.searchParams.get('lens')) setPreviousPage(oldHash);
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    if (route.accountId && accounts.some((item) => item.id === route.accountId)) {
      setSelectedAccountId(route.accountId);
      window.localStorage.setItem(route.mapMode ? 'observatory-map-workspace' : 'observatory-workspace', route.accountId);
    }
  }, [route.accountId, route.mapMode]);

  const selectedAccount = accounts.find((item) => item.id === selectedAccountId) ?? accounts[0];
  const account = accounts.find((item) => item.id === route.accountId)
    ?? (route.path === '/console/reports' ? selectedAccount : null);
  const currentAccount = account ? { ...account, ...profiles[account.id] } : null;
  const lenses = currentAccount ? buildLenses(currentAccount, route.period) : [];
  const lens = lenses.find((item) => item.sourceId === route.lensId);
  function saveProfile(values) {
    setProfiles((current) => ({ ...current, [account.id]: { ...current[account.id], ...values } }));
    recordSetupAction('domain', account.id);
    window.location.hash = '/intelligence/client/' + account.id + '/current';
  }
  function saveWorkspaceProfile(workspaceId, values) {
    setProfiles((current) => ({ ...current, [workspaceId]: { ...current[workspaceId], ...values } }));
    if (['domain', 'name', 'imageSrc', 'nicknames', 'description'].some((key) => key in values)) recordSetupAction('domain', workspaceId);
    if (values.firstPartyConnections) recordSetupAction('sources', workspaceId, Object.values(values.firstPartyConnections).some(Boolean));
    if (values.socialAccounts) recordSetupAction('sources', workspaceId, values.socialAccounts.length > 0);
    if (values.competitors) recordSetupAction('competitors', workspaceId, values.competitors.length > 0);
    if (values.prompts) recordSetupAction('prompts', workspaceId, values.prompts.length > 0);
  }
  function selectWorkspace(workspaceId) {
    recordSetupAction('workspaces', workspaceId);
    setSelectedAccountId(workspaceId);
    window.localStorage.setItem(route.mapMode ? 'observatory-map-workspace' : 'observatory-workspace', workspaceId);
  }
  return { route, previousPage, visitedPaidTabs, account: currentAccount, selectedAccountId, accounts: accounts.map((item) => ({ ...item, ...profiles[item.id] })), lenses, lens, dark, setDark, saveProfile, saveWorkspaceProfile, selectWorkspace, recordSetupAction, setupActions, addedPeople, setAddedPeople, recipients, setRecipients, personProfiles, setPersonProfiles };
}


