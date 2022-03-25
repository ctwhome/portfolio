// import { isLoggedIn } from '~/api/auth'
const isLoggedIn = true
export default function ({ redirect }) {
  if (!isLoggedIn.value) {
    console.error('Protected Route')
    return redirect('/')
  }
}
