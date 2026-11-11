import { useAppSelector } from '@/store/hooks'
import { HeaderProps } from './Header'
import { selectCurrentUser } from '@/store/slices/usersSlice'
import Header from './Header'

type HeaderContainerProps = Omit<HeaderProps, 'isAuthenticated' | 'user'>

export const HeaderContainer = (props: HeaderContainerProps) => {
  const session = useAppSelector((state) => state.auth.session)
  const currentUser = useAppSelector(selectCurrentUser)

  if (!session || !currentUser) {
    return <Header {...props} isAuthenticated={false} />
  }

  return (
    <Header
      {...props}
      isAuthenticated
      user={{
        userName: currentUser.name,
        avatarSrc: currentUser?.avatarUrl ?? '',
      }}
    />
  )
}
