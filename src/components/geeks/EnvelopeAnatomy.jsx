import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { GeekChip, GeekDetail, GeekPanel, GeekToolbar } from './shared'

const FORMATS = {
  envelope: {
    id: 'envelope',
    label: 'Secret envelope',
    sample: 'v1.key_a1b2c3d4e5f6.r7xQ2mN9pL0a.4Kd9QmT8wF2yH1nC0bV6xR3sP5uA7eL',
    note: 'Illustrative. Real nonce and ciphertext are longer base64url with no padding.',
    parts: [
      {
        id: 'ver',
        token: 'v1',
        title: 'Format version',
        text: 'Layout or parameter changes bump this. Existing rows keep parsing under the version they were written with. Current secret envelopes are v1.',
      },
      {
        id: 'key',
        token: 'key_a1b2c3d4e5f6',
        title: 'Key id',
        text: '[a-zA-Z0-9_-], at most 64 characters. Names the org key that produced the ciphertext so rotation can leave history addressable until it is purged. The API never lets a caller supply the nonce, so nonce reuse by misuse is not a caller option.',
      },
      {
        id: 'nonce',
        token: 'r7xQ2mN9pL0a',
        title: 'Nonce',
        text: '12 random bytes from the OS CSPRNG, encoded base64url. Fresh for every encryption. AES-GCM forbids nonce reuse under the same key. There is no API to pass one in.',
      },
      {
        id: 'ct',
        token: '4Kd9QmT8wF2yH1nC0bV6xR3sP5uA7eL',
        title: 'Ciphertext || tag',
        text: 'AES-256-GCM output with the 16-byte authentication tag appended. Decrypt needs the org key and the associated data secret:<definitionId>:env:<environmentId>. Wrong key, flipped bit, or swapped row fails the tag.',
      },
    ],
  },
  sealed: {
    id: 'sealed',
    label: 'Sealed box',
    sample: 'sbx.v1.key_user_9f3a.BAz8pQ…SEC1.r7xQ2mN9pL0a.4Kd9QmT8wF2yH1nC0bV6xR3sP5uA7eL',
    note: 'The ephemeral public key is a 65-byte uncompressed SEC1 point (0x04 || X || Y).',
    parts: [
      {
        id: 'prefix',
        token: 'sbx',
        title: 'Kind',
        text: 'Distinguishes a sealed box from a secret envelope. Parsers reject a value that starts with v1 as a sealed box, and the other way around.',
      },
      {
        id: 'ver',
        token: 'v1',
        title: 'Format version',
        text: 'Same rule as envelopes: bump on a layout change, keep old boxes readable. HKDF info is bound to kryptic-sealed-box-v1, so a version bump also changes derivation.',
      },
      {
        id: 'recip',
        token: 'key_user_9f3a',
        title: 'Recipient key id',
        text: 'Which party public key this box was sealed to (member, device, machine, or recovery). The server uses it as a grant pointer. It is not secret.',
      },
      {
        id: 'eph',
        token: 'BAz8pQ…SEC1',
        title: 'Ephemeral public key',
        text: 'Fresh P-256 key per seal. ECDH against the recipient public key produces the shared secret. HKDF-SHA256 expands that to a 32-byte AES key and a 12-byte nonce. The nonce is derived, not random, so interop vectors can be byte-exact.',
      },
      {
        id: 'nonce',
        token: 'r7xQ2mN9pL0a',
        title: 'Derived nonce',
        text: '12 bytes taken from the HKDF output after the AES key. Unique because the ephemeral key is unique. Stored on the wire so the opener does not re-derive blindly from a truncated box.',
      },
      {
        id: 'ct',
        token: '4Kd9QmT8wF2yH1nC0bV6xR3sP5uA7eL',
        title: 'Sealed payload || tag',
        text: 'Usually the 32-byte org key. AES-256-GCM. Only the holder of the recipient private key can open it. The server stores the box and cannot.',
      },
    ],
  },
}

export function EnvelopeAnatomy() {
  const [format, setFormat] = useState('envelope')
  const [partId, setPartId] = useState('ver')
  const current = FORMATS[format]
  const part = current.parts.find((item) => item.id === partId) ?? current.parts[0]

  function selectFormat(next) {
    setFormat(next)
    setPartId(FORMATS[next].parts[0].id)
  }

  return (
    <GeekPanel>
      <GeekToolbar
        eyebrow="Wire format"
        title="Decode an envelope"
        hint="Click a segment"
      />

      <div className="flex gap-2 border-b border-edge-soft px-4 py-3 sm:px-5">
        {Object.values(FORMATS).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectFormat(item.id)}
            className={clsx(
              'rounded-pill px-3 py-1 font-mono text-xs transition',
              format === item.id
                ? 'bg-accent/15 text-accent-text ring-1 ring-accent/30'
                : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink-faint">
          {current.label}
        </p>
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-canvas/60 p-3 ring-1 ring-inset ring-edge">
          {current.parts.map((item, index) => (
            <span key={item.id} className="flex items-center gap-1">
              {index > 0 && (
                <span className="font-mono text-xs text-ink-faint" aria-hidden="true">
                  .
                </span>
              )}
              <button
                type="button"
                aria-pressed={part.id === item.id}
                onClick={() => setPartId(item.id)}
                className={clsx(
                  'rounded-md px-1.5 py-1 font-mono text-[11px] leading-5 transition sm:text-xs',
                  part.id === item.id
                    ? 'bg-accent text-accent-on'
                    : 'bg-surface text-ink hover:bg-surface-hover'
                )}
              >
                {item.token}
              </button>
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">{current.note}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${format}-${part.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <GeekDetail title={part.title}>
            <p>{part.text}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <GeekChip tone="mute">{part.token}</GeekChip>
              <GeekChip>{current.label}</GeekChip>
            </div>
          </GeekDetail>
        </motion.div>
      </AnimatePresence>
    </GeekPanel>
  )
}
