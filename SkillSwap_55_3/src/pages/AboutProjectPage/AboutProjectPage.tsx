import { Footer } from '@/widgets/Footer'

import styles from './AboutProjectPage.module.css'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'

interface Developer {
  firstName: string
  lastName: string
  githubUrl: string
}


// Содержит данные участников команды для вывода на странице.
const DEVELOPERS: Developer[] = [
  {
    firstName: 'Дарья',
    lastName: 'Андреева',
    githubUrl: 'https://github.com/DariAndreeva',
  },
  {
    firstName: 'Олег',
    lastName: 'Болюх',
    githubUrl: 'https://github.com/Jonk25',
  },
  {
    firstName: 'Альберт',
    lastName: 'Валеев',
    githubUrl: 'https://github.com/albertthecreature',
  },
  {
    firstName: 'Аркадий',
    lastName: 'Гальченко',
    githubUrl: 'https://github.com/Arkadii233',
  },
  {
    firstName: 'Юлия',
    lastName: 'Дельцова',
    githubUrl: 'https://github.com/JulieDelts',
  },
  {
    firstName: 'Анастасия',
    lastName: 'Королева',
    githubUrl: 'https://github.com/AnastasiaK92',
  },
  {
    firstName: 'Михаил',
    lastName: 'Максименко',
    githubUrl: 'https://github.com/maksimenkomv',
  },
  {
    firstName: 'Егор',
    lastName: 'Смирнов',
    githubUrl: 'https://github.com/kurumi177',
  },
  {
    firstName: 'Алёна',
    lastName: 'Смирнова',
    githubUrl: 'https://github.com/wruqlwx',
  },
  {
    firstName: 'Алексей',
    lastName: 'Сурков',
    githubUrl: 'https://github.com/person5494',
  },
  {
    firstName: 'Андрей',
    lastName: 'Сухаревский',
    githubUrl: 'https://github.com/gwyn-riot',
  },
]

export const AboutProjectPage = () => {
  // Подготавливает Header для гостя или авторизованного пользователя.


  return (
    <div className={styles.page}>
      <HeaderContainer />

      <main className={styles.main}>
        <section className={styles.team} aria-labelledby="team-title">
          <h1 id="team-title" className={styles.title}>
            Над проектом работали
          </h1>

          <ul className={styles.list}>
            {DEVELOPERS.map((developer) => (
              <li className={styles.developer} key={`${developer.firstName}-${developer.lastName}`}>
                <span className={styles.name}>
                  {developer.firstName} {developer.lastName}
                </span>

                <a
                  className={styles.githubLink}
                  href={developer.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Посмотреть GitHub
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
