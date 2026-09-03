import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { GeekChip, GeekDetail, GeekPanel, GeekToolbar } from './shared'

const PATHS = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard reveal',
    where: 'Browser, after an explicit click',
    steps: [
      {
        title: 'Unlock the vault',
        detail:
          'The member types the vault passphrase. Argon2id WASM derives the wrap key. decryptEnvelope opens vaultpass_v1 and yields the P-256 private scalar. The passphrase is not the login password and is not sent to the server.',
        state: 'Private key in tab memory',
      },
      {
        title: 'Fetch ciphertext',
        detail:
          'Reveal is an explicit, audit-logged GET. The response is the secret envelope plus wrappedOrgKey sealed to this member. Values are not on the page by default. The matrix cells stay masked until this call.',
        state: 'Envelope + sealed box on the wire',
      },
      {
        title: 'Open the grant',
        detail:
          'unwrapOrgKey runs P-256 ECDH against the ephemeral public key in the box, HKDF-SHA256, then AES-GCM. Failure means the grant is missing, revoked, or sealed to a different key.',
        state: 'Org key in tab memory',
      },
      {
        title: 'Open the envelope',
        detail:
          'decryptSecretValue binds associated data secret:<definitionId>:env:<environmentId>. The tag must verify. The plaintext is shown in that cell and can be copied. Closing or locking the vault drops the keys.',
        state: 'Plaintext in the revealed cell',
      },
    ],
  },
  daemon: {
    id: 'daemon',
    label: 'Local app start',
    where: 'Daemon process, then the app over a local socket',
    steps: [
      {
        title: 'Device has a grant',
        detail:
          'Login generated the device key pair. An admin sealed the org key to it (device page or Approvals). Signed in without a grant cannot serve a single secret. orgKeyGranted on the status socket call is the signal.',
        state: 'Device private key in the OS store',
      },
      {
        title: 'SDK asks the daemon',
        detail:
          'At process start the language package writes one NDJSON line { v: 1, type: "secrets", projectId, environment } to the local socket and waits. No network, no token in the app.',
        state: 'Request stays on the machine',
      },
      {
        title: 'Daemon fetches the bundle',
        detail:
          'On a cache miss the daemon calls the Daemon BFF over TLS and receives envelopes plus wrappedOrgKey. Cache hits (same project/environment, younger than 5 minutes) skip the network. kryptic flush drops the cache.',
        state: 'Ciphertext from the BFF',
      },
      {
        title: 'Decrypt in the daemon',
        detail:
          'The Go engine opens the device grant, then each envelope with its row context. Plaintext is stored in the process map only. The socket reply is { ok: true, secrets: [{ key, value }, …] } to the same OS user.',
        state: 'Plaintext in daemon memory, then the app env',
      },
    ],
  },
  machine: {
    id: 'machine',
    label: 'CI / Kubernetes',
    where: 'Runner or operator process, never on the server',
    steps: [
      {
        title: 'Exchange the machine token',
        detail:
          'POST /v1/token (or the Pipelines BFF /api/token) with clientId and clientSecret. The server verifies the Argon2id hash and returns a short-lived bearer token. The secret itself is not stored recoverably.',
        state: 'Bearer token, 15 minutes',
      },
      {
        title: 'Load key material',
        detail:
          'GET /v1/keys/me returns the machine public key, wrapped private key, KDF salt, and parameter-set version. GET of the bundle returns orgKeyId, wrappedOrgKey, and the envelope list with definition and environment ids.',
        state: 'Wrapped key + envelopes',
      },
      {
        title: 'Unwrap the machine key, then the org key',
        detail:
          'Argon2id(clientSecret, salt) opens machinesecret_v1. That P-256 key opens the sealed box. A stale grant (rotation, revoke) fails here. Rotate the identity and re-grant.',
        state: 'Org key in the runner process',
      },
      {
        title: 'Decrypt every envelope',
        detail:
          'For each row, associated data is rebuilt from definitionId and environmentId. kryptic ci export prints dotenv, shell, or JSON. The operator writes a native Kubernetes Secret. The platform never sees those bytes.',
        state: 'Plaintext on the runner or in the cluster Secret',
      },
    ],
  },
}

export function DecryptPaths() {
  const [pathId, setPathId] = useState('dashboard')
  const [step, setStep] = useState(0)
  const path = PATHS[pathId]
  const current = path.steps[step]

  function selectPath(id) {
    setPathId(id)
    setStep(0)
  }

  return (
    <GeekPanel>
      <GeekToolbar
        eyebrow="Decrypt paths"
        title="When plaintext appears"
        hint="Pick a path, then a step"
      />

      <div className="flex flex-wrap gap-2 border-b border-edge-soft px-4 py-3 sm:px-5">
        {Object.values(PATHS).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectPath(item.id)}
            className={clsx(
              'rounded-pill px-3 py-1 font-mono text-xs transition',
              pathId === item.id
                ? 'bg-accent/15 text-accent-text ring-1 ring-accent/30'
                : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <ol className="grid gap-2 sm:grid-cols-4">
          {path.steps.map((item, index) => {
            const selected = step === index
            const done = index < step
            return (
              <li key={item.title}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setStep(index)}
                  className={clsx(
                    'flex h-full w-full flex-col rounded-lg border px-3 py-2.5 text-left transition',
                    selected
                      ? 'border-accent/45 bg-accent/10 shadow-glow'
                      : done
                        ? 'border-accent/20 bg-accent/5'
                        : 'border-edge bg-surface hover:border-edge-lift hover:bg-surface-hover'
                  )}
                >
                  <span className="font-mono text-2xs text-ink-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1 font-display text-sm font-semibold text-ink">
                    {item.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${pathId}-${step}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <GeekDetail title={current.title}>
            <p className="text-xs text-ink-faint">{path.where}</p>
            <p>{current.detail}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <GeekChip>Plaintext boundary</GeekChip>
              <GeekChip tone="amber">{current.state}</GeekChip>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="rounded-md px-2.5 py-1 font-mono text-2xs text-ink-muted ring-1 ring-inset ring-edge disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={step === path.steps.length - 1}
                onClick={() => setStep((value) => Math.min(path.steps.length - 1, value + 1))}
                className="rounded-md bg-accent/15 px-2.5 py-1 font-mono text-2xs text-accent-text ring-1 ring-inset ring-accent/30 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </GeekDetail>
        </motion.div>
      </AnimatePresence>
    </GeekPanel>
  )
}
