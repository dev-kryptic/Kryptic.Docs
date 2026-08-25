import { createContext, useContext } from 'react'
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { motion } from 'framer-motion'
import { create } from 'zustand'

import { Header } from '@/components/Header'
import { NavigationDocs } from '@/components/NavigationDocs'

/* Slide-in navigation drawer for narrow viewports.
 *
 * The drawer renders its own <Header> so the top bar stays put while the panel
 * animates in. That copy needs to know it is inside the drawer - otherwise it
 * would render a second toggle button and recurse - hence the context flag.
 */

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  )
}

const IsInsideMobileNavigationContext = createContext(false)

export function useIsInsideMobileNavigation() {
  return useContext(IsInsideMobileNavigationContext)
}

export const useMobileNavigationStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function MobileNavigation() {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let { isOpen, toggle, close } = useMobileNavigationStore()
  let ToggleIcon = isOpen ? CloseIcon : MenuIcon

  return (
    <IsInsideMobileNavigationContext.Provider value={true}>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-sm text-ink transition hover:bg-surface-hover"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <ToggleIcon className="h-4 w-4 stroke-current" />
      </button>

      {!isInsideMobileNavigation && (
        <Transition show={isOpen}>
          <Dialog onClose={close} className="fixed inset-0 z-50 lg:hidden">
            <TransitionChild
              enter="duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 top-14 bg-canvas/50 backdrop-blur-sm" />
            </TransitionChild>

            <DialogPanel>
              <TransitionChild
                enter="duration-300 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-200 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Header />
              </TransitionChild>

              <TransitionChild
                enter="duration-500 ease-in-out"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="duration-500 ease-in-out"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <motion.div
                  layoutScroll
                  className="fixed bottom-0 left-0 top-14 w-full overflow-y-auto bg-canvas/95 px-4 pb-4 pt-6 shadow-panel ring-1 ring-edge backdrop-blur-lg min-[416px]:max-w-sm sm:px-6 sm:pb-10"
                >
                  <NavigationDocs />
                </motion.div>
              </TransitionChild>
            </DialogPanel>
          </Dialog>
        </Transition>
      )}
    </IsInsideMobileNavigationContext.Provider>
  )
}
