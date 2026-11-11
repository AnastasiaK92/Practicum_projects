import { UserHeaderControls } from "./UserHeaderControls";

export default {
  title: 'Header/UserHeaderControls',
  component: UserHeaderControls,
}

export const Default = {
  args: {
    userName: 'Мария',
    avatarSrc: 'https://avatars.mds.yandex.net/i?id=0b51d8036427c1491e93df2c38ab5c05_l-4271045-images-thumbs&n=13',
    onNotificationsClick: () => console.log('notifications clicked'),
    onFavoritesClick: () => console.log('favorites clicked'),
  },
}
