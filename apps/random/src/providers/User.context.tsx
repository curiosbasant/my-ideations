import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'

import { auth } from '~/utils/firebase.client'

interface IUser {
  id: string
}

const Context = createContext<IUser | null>(null)

export function Provider(props: PropsWithChildren) {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setUser(
          user && {
            id: user.uid,
          },
        )
      }),
    [],
  )
  return <Context.Provider value={user}>{props.children}</Context.Provider>
}

export const use = () => useContext(Context)
