import { useMemo, useState } from 'react'
import clsx from 'clsx'

const ROLES = [
  { id: 'owner', label: 'Owner' },
  { id: 'admin', label: 'Admin' },
  { id: 'developer', label: 'Developer' },
  { id: 'viewer', label: 'Viewer' },
]

const ADMIN_STOCK = [
  'projects.view_all',
  'notifications.org_wide',
  'members.admin',
  'invitations.admin',
  'groups.admin',
  'projects.admin',
  'environments.admin',
  'access.admin',
  'machines.admin',
  'daemons.admin',
  'secrets.admin',
  'orgsecrets.admin',
  'access_requests.admin',
  'change_requests.admin',
  'audit.admin',
  'scanning.admin',
  'reminders.admin',
  'encryption.admin',
  'roles.admin',
]

const DEVELOPER_STOCK = [
  'secrets.write',
  'secrets.delete',
  'secrets.restore',
  'orgsecrets.catalog_read',
  'scanning.scan',
  'scanning.read',
  'scanning.update_findings',
  'reminders.update',
  'reminders.delete',
]

const CATEGORIES = [
  {
    id: 'scope',
    label: 'Scope',
    actions: [
      { name: 'projects.view_all', label: 'See every project' },
      { name: 'notifications.org_wide', label: 'Org-wide notifications' },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    actions: [
      { name: 'organization.admin', label: 'Organization admin', admin: true },
      { name: 'organization.update', label: 'Update organization' },
      { name: 'organization.delete', label: 'Delete organization' },
      { name: 'organization.rotate_data_key', label: 'Rotate data key' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    actions: [
      { name: 'billing.admin', label: 'Billing admin', admin: true },
      { name: 'billing.read', label: 'Read billing' },
      { name: 'billing.manage', label: 'Manage billing' },
    ],
  },
  {
    id: 'billing_info',
    label: 'Billing details',
    actions: [
      { name: 'billing_info.admin', label: 'Billing details admin', admin: true },
      { name: 'billing_info.read', label: 'Read billing details' },
      { name: 'billing_info.update', label: 'Update billing details' },
    ],
  },
  {
    id: 'invoices',
    label: 'Invoices',
    actions: [
      { name: 'invoices.admin', label: 'Invoices admin', admin: true },
      { name: 'invoices.read', label: 'Read invoices' },
    ],
  },
  {
    id: 'idp',
    label: 'Identity providers',
    actions: [
      { name: 'idp.admin', label: 'IdP admin', admin: true },
      { name: 'idp.read', label: 'Read IdP' },
      { name: 'idp.manage', label: 'Manage IdP' },
    ],
  },
  {
    id: 'directory_sync',
    label: 'Directory sync',
    actions: [
      { name: 'directory_sync.admin', label: 'Directory sync admin', admin: true },
      { name: 'directory_sync.read', label: 'Read directory sync' },
      { name: 'directory_sync.manage', label: 'Manage directory sync' },
      { name: 'directory_sync.import', label: 'Import directory' },
    ],
  },
  {
    id: 'enterprise_idp',
    label: 'Enterprise SSO',
    actions: [
      { name: 'enterprise_idp.admin', label: 'Enterprise SSO admin', admin: true },
      { name: 'enterprise_idp.read', label: 'Read Enterprise SSO' },
      { name: 'enterprise_idp.manage', label: 'Manage Enterprise SSO' },
    ],
  },
  {
    id: 'members',
    label: 'Members',
    actions: [
      { name: 'members.admin', label: 'Members admin', admin: true },
      { name: 'members.invite', label: 'Invite members' },
      { name: 'members.change_role', label: 'Change role' },
      { name: 'members.deactivate', label: 'Deactivate' },
      { name: 'members.reactivate', label: 'Reactivate' },
      { name: 'members.revoke_sessions', label: 'Revoke sessions' },
    ],
  },
  {
    id: 'invitations',
    label: 'Invitations',
    actions: [
      { name: 'invitations.admin', label: 'Invitations admin', admin: true },
      { name: 'invitations.read', label: 'Read invitations' },
      { name: 'invitations.resend', label: 'Resend' },
      { name: 'invitations.cancel', label: 'Cancel' },
    ],
  },
  {
    id: 'groups',
    label: 'Groups',
    actions: [
      { name: 'groups.admin', label: 'Groups admin', admin: true },
      { name: 'groups.read', label: 'Read groups' },
      { name: 'groups.create', label: 'Create' },
      { name: 'groups.update', label: 'Update' },
      { name: 'groups.delete', label: 'Delete' },
      { name: 'groups.manage_members', label: 'Manage members' },
      { name: 'groups.read_grants', label: 'Read grants' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    actions: [
      { name: 'projects.admin', label: 'Projects admin', admin: true },
      { name: 'projects.create', label: 'Create' },
      { name: 'projects.update', label: 'Update' },
      { name: 'projects.delete', label: 'Delete' },
    ],
  },
  {
    id: 'environments',
    label: 'Environments',
    actions: [
      { name: 'environments.admin', label: 'Environments admin', admin: true },
      { name: 'environments.create', label: 'Create' },
      { name: 'environments.update', label: 'Update' },
      { name: 'environments.reorder', label: 'Reorder' },
      { name: 'environments.set_default', label: 'Set default' },
      { name: 'environments.delete', label: 'Delete' },
    ],
  },
  {
    id: 'access',
    label: 'Project access',
    actions: [
      { name: 'access.admin', label: 'Access admin', admin: true },
      { name: 'access.read', label: 'Read grants' },
      { name: 'access.grant', label: 'Grant' },
      { name: 'access.revoke', label: 'Revoke' },
      { name: 'access.preview', label: 'Preview' },
    ],
  },
  {
    id: 'machines',
    label: 'Machine identities',
    actions: [
      { name: 'machines.admin', label: 'Machines admin', admin: true },
      { name: 'machines.read', label: 'Read' },
      { name: 'machines.create', label: 'Create' },
      { name: 'machines.rotate', label: 'Rotate' },
      { name: 'machines.deactivate', label: 'Deactivate' },
    ],
  },
  {
    id: 'daemons',
    label: 'Daemons',
    actions: [
      { name: 'daemons.admin', label: 'Daemons admin', admin: true },
      { name: 'daemons.read', label: 'Read' },
      { name: 'daemons.revoke', label: 'Revoke' },
    ],
  },
  {
    id: 'secrets',
    label: 'Secrets',
    actions: [
      { name: 'secrets.admin', label: 'Secrets admin', admin: true },
      { name: 'secrets.write', label: 'Write' },
      { name: 'secrets.delete', label: 'Delete' },
      { name: 'secrets.restore', label: 'Restore' },
      { name: 'secrets.export', label: 'Export' },
    ],
  },
  {
    id: 'orgsecrets',
    label: 'Org shared secrets',
    actions: [
      { name: 'orgsecrets.admin', label: 'Org shared secrets admin', admin: true },
      { name: 'orgsecrets.catalog_read', label: 'Read catalog metadata' },
      { name: 'orgsecrets.read', label: 'Read catalog' },
      { name: 'orgsecrets.reveal', label: 'Reveal' },
      { name: 'orgsecrets.environments.manage', label: 'Manage environments' },
      { name: 'orgsecrets.definitions.manage', label: 'Manage definitions' },
      { name: 'orgsecrets.reminders.manage', label: 'Manage reminders' },
    ],
  },
  {
    id: 'access_requests',
    label: 'Access requests',
    actions: [
      { name: 'access_requests.admin', label: 'Access requests admin', admin: true },
      { name: 'access_requests.read_pending', label: 'Read pending' },
      { name: 'access_requests.decide', label: 'Decide' },
    ],
  },
  {
    id: 'change_requests',
    label: 'Change requests',
    actions: [
      { name: 'change_requests.admin', label: 'Change requests admin', admin: true },
      { name: 'change_requests.read_pending', label: 'Read pending' },
      { name: 'change_requests.decide', label: 'Decide' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit',
    actions: [
      { name: 'audit.admin', label: 'Audit admin', admin: true },
      { name: 'audit.read', label: 'Read' },
      { name: 'audit.export', label: 'Export' },
    ],
  },
  {
    id: 'scanning',
    label: 'Secret scanning',
    actions: [
      { name: 'scanning.admin', label: 'Scanning admin', admin: true },
      { name: 'scanning.scan', label: 'Scan' },
      { name: 'scanning.read', label: 'Read findings' },
      { name: 'scanning.update_findings', label: 'Update findings' },
    ],
  },
  {
    id: 'reminders',
    label: 'Reminders',
    actions: [
      { name: 'reminders.admin', label: 'Reminders admin', admin: true },
      { name: 'reminders.update', label: 'Update' },
      { name: 'reminders.delete', label: 'Delete' },
      { name: 'reminders.read_upcoming', label: 'Read upcoming' },
    ],
  },
  {
    id: 'encryption',
    label: 'Encryption',
    actions: [
      { name: 'encryption.admin', label: 'Encryption admin', admin: true },
      { name: 'encryption.initialize', label: 'Initialize' },
      { name: 'encryption.grants.read', label: 'Read grants' },
      { name: 'encryption.grants.manage', label: 'Manage grants' },
      { name: 'encryption.recovery.read', label: 'Read recovery' },
      { name: 'encryption.recover', label: 'Recover' },
      { name: 'encryption.rotate', label: 'Rotate' },
    ],
  },
  {
    id: 'roles',
    label: 'Roles',
    actions: [
      { name: 'roles.admin', label: 'Roles admin', admin: true },
      { name: 'roles.read', label: 'Read' },
      { name: 'roles.create', label: 'Create' },
      { name: 'roles.update', label: 'Update' },
      { name: 'roles.delete', label: 'Delete' },
    ],
  },
]

function categoryOf(name) {
  if (name === 'projects.view_all' || name === 'notifications.org_wide') return 'scope'
  return name.split('.')[0]
}

function roleHas(roleId, name) {
  if (roleId === 'owner') return true
  if (roleId === 'viewer') return false
  const bag = roleId === 'admin' ? ADMIN_STOCK : DEVELOPER_STOCK
  if (bag.includes(name)) return true
  if (name === 'projects.view_all' || name === 'notifications.org_wide') return false
  return bag.includes(`${categoryOf(name)}.admin`)
}

function Check({ on, implied }) {
  if (!on) {
    return <span className="text-ink-muted/40">·</span>
  }
  return (
    <span
      className={clsx('font-semibold', implied ? 'text-accent-text/70' : 'text-accent-text')}
      title={implied ? 'Covered by the category admin privilege' : 'In the stock bag'}
    >
      ✓
    </span>
  )
}

export function RolesMap() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(() => new Set(CATEGORIES.map((category) => category.id)))
  const [focusRole, setFocusRole] = useState(null)
  const [highlight, setHighlight] = useState(null)
  const [mobileRole, setMobileRole] = useState('owner')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return CATEGORIES
    return CATEGORIES
      .map((category) => ({
        ...category,
        actions: category.actions.filter((action) =>
          `${action.name} ${action.label} ${category.label}`.toLowerCase().includes(needle)
        ),
      }))
      .filter((category) => category.actions.length > 0)
  }, [query])

  const toggleCategory = (id) => {
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => setOpen(new Set(CATEGORIES.map((category) => category.id)))
  const collapseAll = () => setOpen(new Set())

  const onAdminClick = (action) => {
    if (!action.admin) return
    setHighlight((current) => (current === action.name ? null : action.name))
    setOpen((current) => new Set([...current, categoryOf(action.name)]))
  }

  const highlightedCategory = highlight ? categoryOf(highlight) : null

  return (
    <div className="not-prose my-6">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter permissions"
          className="w-full rounded-lg bg-surface-raised px-3 py-2 text-sm text-ink shadow-[inset_0_0_0_1px_var(--border)] outline-none placeholder:text-ink-muted focus:shadow-[inset_0_0_0_1px_var(--accent-border)] sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg px-2.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.04em] text-ink-muted ring-1 ring-inset ring-edge hover:bg-surface-raised hover:text-ink" onClick={expandAll}>
            Expand all
          </button>
          <button type="button" className="rounded-lg px-2.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.04em] text-ink-muted ring-1 ring-inset ring-edge hover:bg-surface-raised hover:text-ink" onClick={collapseAll}>
            Collapse all
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 md:hidden">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setMobileRole(role.id)}
            className={clsx(
              'rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset',
              mobileRole === role.id
                ? 'bg-accent/10 text-accent-text ring-accent/30'
                : 'text-ink-muted ring-edge hover:text-ink'
            )}
          >
            {role.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-inset ring-edge md:overflow-visible">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-surface-raised text-2xs font-semibold uppercase tracking-[0.04em] text-ink-muted">
            <tr>
              <th className="px-4 py-2.5">Permission</th>
              {ROLES.map((role) => (
                <th
                  key={role.id}
                  className={clsx(
                    'hidden w-[5.5rem] cursor-pointer px-2 py-2.5 text-center md:table-cell',
                    focusRole && focusRole !== role.id && 'opacity-35',
                    focusRole === role.id && 'text-accent-text'
                  )}
                  onClick={() => setFocusRole((current) => (current === role.id ? null : role.id))}
                >
                  {role.label}
                </th>
              ))}
              <th className="w-16 px-2 py-2.5 text-center md:hidden">{ROLES.find((role) => role.id === mobileRole)?.label}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge-soft text-ink-muted">
            {filtered.map((category) => {
              const expanded = open.has(category.id)
              const count = category.actions.filter((action) => roleHas(mobileRole, action.name)).length
              return (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  expanded={expanded}
                  onToggle={() => toggleCategory(category.id)}
                  focusRole={focusRole}
                  mobileRole={mobileRole}
                  highlight={highlight}
                  highlightedCategory={highlightedCategory}
                  onAdminClick={onAdminClick}
                  mobileCount={count}
                />
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        A filled cell is in the stock bag. A lighter check is covered by that category&apos;s <code className="rounded-sm bg-surface-raised px-1.5 py-0.5 font-mono text-2xs text-ink shadow-[inset_0_0_0_1px_var(--border)]">*.admin</code>.
        Click a category admin row to highlight every action it covers. Click a role header to focus that bag.
      </p>
    </div>
  )
}

function CategoryBlock({
  category,
  expanded,
  onToggle,
  focusRole,
  mobileRole,
  highlight,
  highlightedCategory,
  onAdminClick,
  mobileCount,
}) {
  return (
    <>
      <tr className="bg-surface-raised/60">
        <td className="px-4 py-2.5">
          <button type="button" onClick={onToggle} className="flex items-center gap-2 font-semibold text-ink">
            <span className="inline-block w-3 text-ink-muted">{expanded ? '▾' : '▸'}</span>
            {category.label}
          </button>
        </td>
        {ROLES.map((role) => (
          <td
            key={role.id}
            className={clsx(
              'hidden px-2 py-2.5 text-center text-2xs md:table-cell',
              focusRole && focusRole !== role.id && 'opacity-35'
            )}
          >
            {category.actions.some((action) => roleHas(role.id, action.name)) ? (
              <span className="text-accent-text">✓</span>
            ) : (
              <span className="text-ink-muted/40">·</span>
            )}
          </td>
        ))}
        <td className="px-2 py-2.5 text-center text-2xs md:hidden">
          {mobileCount > 0 ? <span className="text-accent-text">{mobileCount}</span> : <span className="text-ink-muted/40">·</span>}
        </td>
      </tr>
      {expanded &&
        category.actions.map((action) => {
          const lit = highlight === action.name || (highlightedCategory === category.id && highlight)
          const exact = (roleId) => {
            if (roleId === 'owner') return true
            if (roleId === 'viewer') return false
            const bag = roleId === 'admin' ? ADMIN_STOCK : DEVELOPER_STOCK
            return bag.includes(action.name)
          }
          return (
            <tr
              key={action.name}
              className={clsx(lit && 'bg-accent/10')}
            >
              <td className="px-4 py-2 pl-10">
                <button
                  type="button"
                  disabled={!action.admin}
                  onClick={() => onAdminClick(action)}
                  className={clsx('text-left', action.admin && 'cursor-pointer hover:text-ink')}
                >
                  <div className="font-medium text-ink">{action.label}</div>
                  <code className="rounded-sm bg-surface-raised px-1.5 py-0.5 font-mono text-2xs text-ink shadow-[inset_0_0_0_1px_var(--border)]">
                    {action.name}
                  </code>
                </button>
              </td>
              {ROLES.map((role) => (
                <td
                  key={role.id}
                  className={clsx(
                    'hidden px-2 py-2 text-center md:table-cell',
                    focusRole && focusRole !== role.id && 'opacity-35'
                  )}
                >
                  <Check on={roleHas(role.id, action.name)} implied={roleHas(role.id, action.name) && !exact(role.id)} />
                </td>
              ))}
              <td className="px-2 py-2 text-center md:hidden">
                <Check on={roleHas(mobileRole, action.name)} implied={roleHas(mobileRole, action.name) && !exact(mobileRole)} />
              </td>
            </tr>
          )
        })}
    </>
  )
}
