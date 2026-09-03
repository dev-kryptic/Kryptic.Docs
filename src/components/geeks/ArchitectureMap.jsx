import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GeekChip, GeekDetail, GeekNode, GeekPanel, GeekToolbar } from './shared'

const NODES = {
  browser: {
    id: 'browser',
    tone: 'client',
    label: 'Browser vault',
    sub: 'Dashboard · WebCrypto',
    icon: '01',
    title: 'Management dashboard',
    body: (
      <>
        <p>
          The admin or member browser is a full crypto client. Enrollment, unlock,
          reveal, import, grant sealing, and org-key rotation all run in
          WebCrypto plus Argon2id WASM. The vault passphrase is typed here and
          never leaves the tab.
        </p>
        <p>
          On reveal the page fetches a secret envelope and the caller&apos;s
          sealed-box grant, opens both locally, and holds plaintext in memory
          for that cell only. Import encrypts each value before the PUT.
        </p>
      </>
    ),
    holds: ['Passphrase (memory)', 'Party private key', 'Org key', 'Revealed plaintext'],
    never: ['Nothing useful is uploaded in the clear'],
    link: 'TLS 1.3 to Management API',
  },
  daemon: {
    id: 'daemon',
    tone: 'client',
    label: 'Daemon',
    sub: 'Go engine · OS keychain',
    icon: '02',
    title: 'Local daemon',
    body: (
      <>
        <p>
          Device login generates a P-256 key pair. The private key lives in the
          OS credential store. An admin later seals the org key to the device
          public key. Until that grant exists, every secrets fetch is{' '}
          <code>access_denied</code>.
        </p>
        <p>
          The daemon talks TLS to the Daemon BFF, decrypts the bundle with the
          Go engine, caches plaintext in process memory for 5 minutes, and
          never writes values to disk.
        </p>
      </>
    ),
    holds: ['Device private key', 'Org key (after grant)', 'Plaintext cache ≤ 5 min'],
    never: ['Refresh token is in the OS store; access tokens stay in memory'],
    link: 'TLS 1.3 to Daemon BFF',
  },
  sdk: {
    id: 'sdk',
    tone: 'client',
    label: 'Language SDK',
    sub: 'No crypto · local socket',
    icon: '03',
    title: 'Language packages',
    body: (
      <>
        <p>
          Every SDK is a thin local client. It connects once at process start,
          asks for a project and environment, injects the returned pairs, and
          disconnects. There is no authentication logic and no AES/ECDH code
          in the package.
        </p>
        <p>
          Transport is a unix socket (
          <code>/tmp/kryptic-daemon.sock</code> or{' '}
          <code>$XDG_RUNTIME_DIR</code>) or the Windows named pipe{' '}
          <code>\\.\pipe\kryptic-daemon</code>. The kernel peer-cred check
          (or the pipe ACL) drops any other OS user.
        </p>
      </>
    ),
    holds: ['Plaintext in the process environment only'],
    never: ['Never talks to Kryptic over the network'],
    link: 'Local OS socket, NDJSON, one request per connection',
  },
  machine: {
    id: 'machine',
    tone: 'client',
    label: 'CI / operator',
    sub: 'Go engine · machine identity',
    icon: '04',
    title: 'CI runners and the Kubernetes operator',
    body: (
      <>
        <p>
          <code>kryptic ci export</code> and the operator run the same chain:
          client secret → Argon2id → unwrap the machine private key → open
          the sealed org key → AES-GCM each envelope with its row context.
        </p>
        <p>
          The Pipelines BFF and the Secrets API return ciphertext plus{' '}
          <code>wrappedOrgKey</code>. There is no plaintext export endpoint.
        </p>
      </>
    ),
    holds: ['Client secret (runner store)', 'Org key (process)', 'Printed or K8s Secret values'],
    never: ['The platform never sees the client secret in recoverable form'],
    link: 'TLS 1.3 to Pipelines BFF or Secrets API',
  },
  store: {
    id: 'store',
    tone: 'store',
    label: 'Blind store',
    sub: 'Four API hosts · no decrypt path',
    icon: 'SRV',
    title: 'What the server actually holds',
    body: (
      <>
        <p>
          Management API, Daemon BFF, Pipelines BFF, and Secrets API all store
          or serve the same wire objects: secret envelopes, sealed-box grants,
          public keys, wrapped private keys, and Argon2id hashes. None of
          those hosts has a function that opens a secret value.
        </p>
        <p>
          A separate server-side org data key wraps operational ciphertexts
          the platform itself must read (SSO IdP client secrets). It is not
          on the path that encrypts customer secret values.
        </p>
      </>
    ),
    holds: [
      'Envelopes and grants',
      'Public keys and wrapped private keys',
      'Secret names, structure, audit metadata',
    ],
    never: ['Org key, party private keys, passphrases, secret plaintext'],
    link: 'TLS 1.3 in; local socket never crosses this boundary',
  },
}

const CLIENTS = ['browser', 'daemon', 'sdk', 'machine']

export function ArchitectureMap() {
  const [active, setActive] = useState('store')
  const node = NODES[active]

  return (
    <GeekPanel>
      <GeekToolbar
        eyebrow="System map"
        title="Who talks to whom"
        hint="Click a node"
      />

      <div className="px-4 py-5 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CLIENTS.map((id) => (
            <GeekNode
              key={id}
              tone="client"
              active={active === id}
              onClick={() => setActive(id)}
              {...NODES[id]}
            />
          ))}
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-edge to-transparent" />
          <span className="font-mono text-2xs uppercase tracking-[0.18em] text-ink-faint">
            TLS 1.3 · ciphertext only
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-edge to-transparent" />
        </div>

        <GeekNode
          tone="store"
          active={active === 'store'}
          onClick={() => setActive('store')}
          {...NODES.store}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <GeekDetail title={node.title}>
            {node.body}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {node.holds.map((item) => (
                <GeekChip key={item} tone={node.tone === 'store' ? 'blue' : 'accent'}>
                  {item}
                </GeekChip>
              ))}
            </div>
            <p className="pt-1 text-xs text-ink-faint">{node.never}</p>
            <p className="font-mono text-2xs text-ink-faint">{node.link}</p>
          </GeekDetail>
        </motion.div>
      </AnimatePresence>
    </GeekPanel>
  )
}
