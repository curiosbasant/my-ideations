import { Dialog as TWDialog, Transition } from "@headlessui/react"
import React, { Fragment, useRef, useState } from "react"

function Dialog({ title, button, children }) {
  const initialFocusRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  function closeDialog() {
    setIsOpen(false)
  }

  return (
    <div className="">
      <div className="flex justify-center" onClick={() => setIsOpen(true)}>
        {button}
      </div>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95">
        <TWDialog
          as="div"
          initialFocus={initialFocusRef}
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeDialog}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <TWDialog.Overlay className="fixed inset-0 bg-slate-500/25 backdrop-blur-[2px]" />
            </Transition.Child>
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <div className="my-8 inline-block w-full max-w-lg transform space-y-3 overflow-hidden rounded-xl bg-slate-50 p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex">
                <TWDialog.Title as="h3" className=" text-lg font-medium leading-6">
                  {title}
                </TWDialog.Title>
                <button className="icon ml-auto" onClick={closeDialog}>
                  close
                </button>
              </div>
              {typeof children == "function"
                ? children({ initialFocusRef, isOpen, closeDialog })
                : children}
            </div>
          </div>
        </TWDialog>
      </Transition>
    </div>
  )
}

export default Dialog
