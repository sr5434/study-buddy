import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown({ setDifficulty, difficulty }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-gray-50 bg-gradient-to-r from-purple-500 to-pink-500">
          {difficulty}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-200" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1px">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={async (e) => {e.preventDefault();await setDifficulty("Easy")}}
                  className={classNames(
                    difficulty === "Easy" ? 'bg-gray-300 dark:bg-gray-600' : active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm w-56 rounded-t-md'
                  )}
                >
                  Easy
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={async (e) => {e.preventDefault();await setDifficulty("Medium")}}
                  className={classNames(
                    difficulty === "Medium" ? 'bg-gray-300 dark:bg-gray-600' : active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm w-56'
                  )}
                >
                  Medium
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={async (e) => {e.preventDefault();await setDifficulty("Hard")}}
                  className={classNames(
                    difficulty === "Hard" ? 'bg-gray-300 dark:bg-gray-600' : active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm w-56 rounded-b-md'
                  )}
                >
                  Hard
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}