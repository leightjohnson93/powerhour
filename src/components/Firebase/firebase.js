import app from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: 'https://power-hour-e95a1.firebaseio.com',
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.db = app.database()
  }

  getUnixTime = () => new Date().getTime()

  createGame = (gameId) =>
    (this.id = this.db.ref('games').push({ gameId, createTime: this.getUnixTime() }).key)

  startGame = (frequency, duration) => {
    const startTime = this.getUnixTime()
    this.db.ref(`games/${this.id}`).update({ frequency, duration, startTime })
    return startTime
  }

  getGame = (gameId) =>
    this.db
      .ref('games')
      .orderByChild('gameId')
      .equalTo(gameId)
      .once('value')
      .then((snapshot) => {
        const game = snapshot.val()
        if (game) {
          const id = Object.keys(game)[0]
          this.id = id
          return game[id]
        }
      })
}

export default Firebase
